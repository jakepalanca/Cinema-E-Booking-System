#!/usr/bin/env bash
set -euo pipefail

BACKEND_DIR="backend"
FRONTEND_DIR="frontend/cinema-e-booking-site"
DB_FILE="$BACKEND_DIR/cinema.db"
BACKEND_PORT=8080
FRONTEND_PORT=3000

kill_port() {
  local port="$1"
  if PIDS=$(lsof -ti tcp:"$port" 2>/dev/null || true); then
    if [ -n "${PIDS:-}" ]; then
      echo "Killing process(es) on port $port: $PIDS"
      kill -9 $PIDS || true
    fi
  fi
}

wait_for_backend() {
  local url="http://localhost:${BACKEND_PORT}/health"
  echo -n "Waiting for backend on ${url}"
  for i in {1..120}; do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo -e "\nBackend is up."
      return 0
    fi
    echo -n "."
    sleep 1
  done
  echo -e "\nTimed out waiting for backend."
  return 1
}

# clean ports
kill_port "$BACKEND_PORT"
kill_port "$FRONTEND_PORT"

# delete DB before backend starts
if [ -f "${DB_FILE}" ]; then
  echo "Deleting ${DB_FILE}…"
  rm -f -- "${DB_FILE}"
else
  echo "No DB file at ${DB_FILE} (ok)."
fi

# start backend
echo "Starting backend…"
pushd "$BACKEND_DIR" >/dev/null
  mvn -q spring-boot:run &
  BACK_PID=$!
popd >/dev/null

trap 'if kill -0 "${BACK_PID}" 2>/dev/null; then echo "Stopping backend (pid ${BACK_PID})…"; kill "${BACK_PID}"; fi' EXIT

# wait until backend is healthy
wait_for_backend

# seed data (no clear-db; fresh file already)
echo "Calling /initialize-db…"
curl -fsS "http://localhost:${BACKEND_PORT}/initialize-db" >/dev/null || echo "Warning: /initialize-db failed"

# start frontend
echo "Starting frontend…"
pushd "$FRONTEND_DIR" >/dev/null
  npm ci || npm install
  npm start
popd >/dev/null