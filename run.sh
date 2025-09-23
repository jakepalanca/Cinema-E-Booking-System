set -e
mkdir -p db/data
( cd backend && mvn -q spring-boot:run ) &
BACK_PID=$!
cd frontend/cinema-e-booking-site
npm ci || npm install
npm start
kill $BACK_PID 2>/dev/null || true
