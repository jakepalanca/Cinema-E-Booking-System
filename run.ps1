$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path "db\data" | Out-Null

$backend = Start-Process `
  -FilePath "mvn" `
  -ArgumentList @("-q", "spring-boot:run") `
  -WorkingDirectory "backend" `
  -NoNewWindow `
  -PassThru

Write-Host "Backend started (PID $($backend.Id))."

Push-Location "frontend\cinema-e-booking-site"
try {
  & npm ci
  if ($LASTEXITCODE -ne 0) {
    Write-Host "npm ci failed (exit $LASTEXITCODE). Falling back to 'npm install'..."
    & npm install
    if ($LASTEXITCODE -ne 0) {
      throw "npm install failed (exit $LASTEXITCODE)."
    }
  }

  & npm start
}
finally {
  Pop-Location | Out-Null
  if ($backend -and -not $backend.HasExited) {
    try {
      Write-Host "Stopping backend (PID $($backend.Id))..."
      Stop-Process -Id $backend.Id -Force
    } catch {
    }
  }
}
