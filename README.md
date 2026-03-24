# EV Charging Simulator
[![Backend CI](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/backend.yml/badge.svg)]()
[![Frontend CI](https://github.com/StephanieJohansson/ev_charging_PRO/actions/workflows/frontend.yml/badge.svg)]()

This project is part of my vocational higher education program (YH MU24).  
It is a web-based application that simulates electric vehicle charging stations and basic queue handling.

The goal of the project is to explore backend logic, authentication, and system design within a mobility-related domain.

---

## Tech Stack

**Backend**
- Java 21
- Spring Boot
- Spring Security
- JPA / Hibernate
- Maven

**Frontend**
- React
- JavaScript, HTML, CSS

**CI/CD**
- GitHub Actions (build and test on push)

---

## Running the Project

### Backend


```bash
./mvnw spring-boot:run
```
### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Testing
The backend includes: 
- Unit tests (service and controller)
- A Spring Boot context test

Tests are configured to run with an in-memory H2 database in CI


To run tests locally:
```bash
./mvnw clean verify
```

## CI/CD
GitHub Actions is used to automatically:
- Build backend
- Run tests
- Build frontend
The pipeline is triggered on push to main and develop.



## API examples (Postman)

POST login as admin(/auth/login):

```json
{
  "email": "admin@mail.com",
  "password": "admin123"
}
```


POST register a new user(auth/register):

```json
{
  "name": "Jane Doe"
  "email": "Jane@email.com",
  "password": "yourPassword"
}
```

POST a car logged in as a user (/vehicles):

```json
{
  "brand": "Tesla",
  "model": "Model 3",
  "plateNumber": "ABC123",
  "batterySizeKWh": 60
}
```

### Future improvements:
- User profile page
- Improved formatting of estimated queue and charging time
- More accurate estimation of waiting time
