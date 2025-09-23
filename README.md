## Quick Setup

### Prerequisites
- Java 21
- Node.js
- Maven

### Run the Application
```bash
./run.sh
```

### Manual Setup
1. **Backend**: `cd backend && mvn spring-boot:run`
2. **Frontend**: `cd frontend/cinema-e-booking-site && npm install && npm start`

## Technology Stack

### Frontend
- React
- CSS
- JavaScript

### Backend & Database
- Spring Boot 3.5.6 (Java 21)
- Spring Web (REST API)
- Spring Data JPA (database)
- SQLite (database)

## Database

### Configuration
- **Database**: SQLite
- **Location**: `db/data/app.db`
- **Schema**: Auto-managed by Hibernate