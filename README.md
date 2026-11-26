# ServeEase — Home Service Booking Platform

ServeEase is a full-stack, role-based home service booking web application built with **Spring Boot 3 (Java 21)**, **MySQL**, and **React (Vite + Bootstrap 5)**. It provides dedicated portals for **Admins**, **Customers**, and **Service Providers** with JWT authentication and automated scheduling rules.

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.5, Spring Security (JWT), Spring Data JPA, Hibernate, Maven |
| **Database** | MySQL 8 (`serveease_db`, 7 relational tables) |
| **Frontend** | React 19, Vite, React Router, Axios, Bootstrap 5 |

## Core Features & Roles

- **Admin Portal:** Platform KPIs and revenue reports, CRUD & status toggling for customers and service providers, service catalog management, provider-to-service assignments, and global booking monitoring.
- **Customer Portal:** Service discovery with category filters, interactive booking with live slot availability, booking history with cancellation, and profile management.
- **Service Provider Portal:** Availability toggle, assigned services view, and booking lifecycle management (`PENDING` → `CONFIRMED` → `IN_PROGRESS` → `COMPLETED` / `CANCELLED`).
- **Authentication & Security:** BCrypt password hashing, stateless JWT authentication, password reset token workflow, and strict role-based endpoint protection.

## Enforced Business Rules

1. **Weekly Holiday:** Sunday bookings are automatically rejected.
2. **No Past Dates or Slots:** Past calendar dates and already-started time slots on the current day are blocked on both frontend and backend.
3. **Explicit Provider Assignment:** Customers can only book providers explicitly assigned to that service.
4. **No Double-Booking:** A provider cannot hold two active bookings for the same date and time slot.
5. **No Duplicate Customer Bookings:** Customers cannot book the same service twice in the same date and time slot.
6. **Role Isolation:** Strict API and route separation across `ADMIN`, `CUSTOMER`, and `PROVIDER`.

## Database Schema (7 Tables)

`users` · `customer_profiles` · `provider_profiles` · `services` · `provider_services` · `bookings` · `password_reset_tokens`

## Key REST API Endpoints

| Access | Endpoints |
| :--- | :--- |
| **Public** | `GET /api/public/health`, `GET /api/public/services`, `GET /api/public/time-slots` |
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| **Profile** | `GET /api/profile`, `PUT /api/profile` |
| **Admin** | `/api/admin/customers`, `/api/admin/providers`, `/api/admin/services`, `/api/admin/services/assign`, `/api/admin/bookings`, `/api/admin/reports` |
| **Customer** | `GET /api/customer/stats`, `GET /api/customer/services`, `GET/POST /api/customer/bookings`, `PATCH /api/customer/bookings/{id}/cancel` |
| **Provider** | `GET /api/provider/stats`, `GET /api/provider/services`, `GET /api/provider/bookings`, `PATCH /api/provider/bookings/{id}/status`, `PATCH /api/provider/availability` |

## Seeded Demo Accounts

On first startup, `DataSeeder` populates sample users, services, and provider assignments:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@serveease.com` | `Admin@123` |
| **Customer** | `customer@serveease.com` | `Customer@123` |
| **Provider 1** | `ravi.provider@serveease.com` | `Provider@123` |
| **Provider 2** | `anita.provider@serveease.com` | `Provider@123` |

## Local Setup & Run Instructions

### Prerequisites
- Java 21+ & Maven 3.9+
- Node.js 18+ & npm
- MySQL 8+

### 1. Backend Setup
1. Create a file `backend/src/main/resources/application-local.properties`:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
2. Start the backend server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   The API runs on `http://localhost:8080` and automatically creates `serveease_db` and its tables.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.