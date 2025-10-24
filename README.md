## Quick Setup

### Prerequisites
- Java 21
- Node.js
- Maven

### Run the Application
```bash
./run.sh # For MacOS
```
or 
```powershell
./run.ps1 # For Windows
```


### Manual Setup
1. **Backend**: `cd backend && mvn spring-boot:run`
2. **Frontend**: `cd frontend/cinema-e-booking-site && npm install && npm start`


> Make sure port 8080 and 3000 are free.

```bash
lsof -ti:8080 | xargs kill -9
```

```bash
lsof -ti:3000 | xargs kill -9
```

## Technology Stack

### Frontend
- React
- CSS
- JavaScript

### Backend & Database
- Spring Boot 3.5.6 (Java 21)
- Spring Web (REST API)
- Spring Data JPA (database)
- Jasypt (encryption/decryption)
- Spring Security (JWT Token)

## Database

### Configuration
- **Database**: SQLite
- **Location**: `backend/cinema.db`
- **Schema**: Auto-managed by Hibernate