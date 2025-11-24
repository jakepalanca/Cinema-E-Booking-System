#Requires -Version 5.1
# start.ps1

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$BACKEND_DIR   = "backend"
$FRONTEND_DIR  = "frontend/cinema-e-booking-site"
$DB_FILE       = Join-Path $BACKEND_DIR "cinema.db"
$BACKEND_PORT  = 8080
$FRONTEND_PORT = 3000

function Kill-Port {
    param([int]$Port)

    Write-Host "Checking for processes on port $Port..."

    $pids = @()

    try {
        $pids = (Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue |
                 Select-Object -ExpandProperty OwningProcess) | Sort-Object -Unique
    } catch {
        $lines = netstat -ano | Select-String -Pattern "LISTENING.*:$Port\s"
        foreach ($l in $lines) {
            $m = [regex]::Match($l.ToString(), "\s(\d+)$")
            if ($m.Success) { $pids += [int]$m.Groups[1].Value }
        }
        $pids = $pids | Sort-Object -Unique
    }

    if (@($pids).Count -gt 0) {
        Write-Host "Killing process(es) on port ${Port}: $($pids -join ', ')"
        foreach ($procId in $pids) {
            try { Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue } catch {}
            try { taskkill /PID $procId /F | Out-Null } catch {}
        }
    } else {
        Write-Host "No process is listening on $Port (ok)."
    }
}

function Wait-ForBackend {
    param([int]$Port, [int]$TimeoutSec = 120)

    $url = "http://localhost:$Port/health"
    Write-Host -NoNewline "Waiting for backend on $url"
    $deadline = (Get-Date).AddSeconds($TimeoutSec)

    while ((Get-Date) -lt $deadline) {
        try {
            $resp = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 300) {
                Write-Host ""
                Write-Host "Backend is up."
                return $true
            }
        } catch {
        }
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
    }

    Write-Host ""
    Write-Warning "Timed out waiting for backend."
    return $false
}

Kill-Port -Port $BACKEND_PORT
Kill-Port -Port $FRONTEND_PORT

if (Test-Path -LiteralPath $DB_FILE) {
    Write-Host "Deleting $DB_FILE..."
    Remove-Item -LiteralPath $DB_FILE -Force
} else {
    Write-Host "No DB file at $DB_FILE (ok)."
}

Write-Host "Starting backend…"
$backendLogFile = Join-Path $BACKEND_DIR "backend.log"
$backendErrorLogFile = Join-Path $BACKEND_DIR "backend-error.log"
Push-Location $BACKEND_DIR
try {
    # Start backend with output redirected to log files
    $backProc = Start-Process -FilePath ".\mvnw.cmd" -ArgumentList "spring-boot:run" -PassThru -NoNewWindow -RedirectStandardOutput $backendLogFile -RedirectStandardError $backendErrorLogFile
    Write-Host "Backend process started (PID: $($backProc.Id))"
    Write-Host "Backend logs will be written to: $backendLogFile"
    
    # Wait a moment to see if process crashes immediately
    Start-Sleep -Seconds 3
    if ($backProc.HasExited) {
        $exitCode = $backProc.ExitCode
        Write-Error "Backend process exited immediately with code $exitCode"
        if (Test-Path $backendLogFile) {
            Write-Host "Last 20 lines of backend log:"
            Get-Content $backendLogFile -Tail 20 | ForEach-Object { Write-Host $_ }
        }
        if (Test-Path $backendErrorLogFile) {
            Write-Host "Last 20 lines of backend error log:"
            Get-Content $backendErrorLogFile -Tail 20 | ForEach-Object { Write-Host $_ }
        }
        throw "Backend failed to start. Check $backendLogFile and $backendErrorLogFile for details."
    }
} finally {
    Pop-Location
}

$cleanup = {
    if ($null -ne $backProc) {
        try {
            if (-not $backProc.HasExited) {
                Write-Host "Stopping backend (pid $($backProc.Id))…"
                $backProc.Kill()
            }
        } catch {}
    }
}

$null = Register-EngineEvent PowerShell.Exiting -Action $cleanup

if (-not (Wait-ForBackend -Port $BACKEND_PORT -TimeoutSec 120)) {
    Write-Error "Backend did not become healthy in time."
    if ($null -ne $backProc -and $backProc.HasExited) {
        Write-Host "Backend process has exited. Exit code: $($backProc.ExitCode)"
    }
    if (Test-Path $backendLogFile) {
        Write-Host "Last 30 lines of backend log:"
        Get-Content $backendLogFile -Tail 30 | ForEach-Object { Write-Host $_ }
    }
    if (Test-Path $backendErrorLogFile) {
        Write-Host "Last 30 lines of backend error log:"
        Get-Content $backendErrorLogFile -Tail 30 | ForEach-Object { Write-Host $_ }
    }
    throw "Backend did not become healthy in time. Check $backendLogFile and $backendErrorLogFile for details."
}

Write-Host "Calling /initialize-db…"
try {
    Invoke-WebRequest -Uri "http://localhost:$BACKEND_PORT/initialize-db" -Method GET -UseBasicParsing -TimeoutSec 15 | Out-Null
} catch {
    Write-Warning "/initialize-db failed: $($_.Exception.Message)"
}

Write-Host "Starting frontend…"
Push-Location $FRONTEND_DIR
try {
    $ci = Start-Process -FilePath "npm.cmd" -ArgumentList "ci" -Wait -PassThru
    if ($ci.ExitCode -ne 0) {
        Write-Warning "npm ci failed (exit $($ci.ExitCode)); falling back to npm install…"
        $inst = Start-Process -FilePath "npm.cmd" -ArgumentList "install" -Wait -PassThru
        if ($inst.ExitCode -ne 0) {
            throw "npm install failed with exit $($inst.ExitCode)."
        }
    }
    & npm.cmd start
} finally {
    Pop-Location
    & $cleanup
}
