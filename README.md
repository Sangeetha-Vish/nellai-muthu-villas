# Nellai Muthu Vilas

Nellai Muthu Vilas is a full-stack traditional sweets ordering platform designed with separate applications for customers and administrators.

Customers can browse products, select branches, authenticate, and place orders. Administrators use a separate application to manage products, branches, orders, feedback, and reports.

The system follows a **three-application architecture** with a centralized backend and database:

```text
Customer Application ──┐
                       │
                       ▼
                    REST API
                       │
Admin Application ─────┤
                       │
                       ▼
                Express Backend
                       │
                       ▼
                    Prisma
                       │
                       ▼
                  PostgreSQL
```

## Architecture

The system is divided into three main applications.

### 1. Client — Customer Application

The `client` is the customer-facing Next.js application.

It is responsible for:

* Product browsing
* Branch selection
* Customer authentication
* Cart and order workflows
* Displaying order information
* Customer-facing UI

The client does **not** communicate directly with PostgreSQL. It communicates with the backend through REST APIs.

### 2. Admin — Administration Application

The `admin` is a separate Next.js application used by administrators.

It is responsible for:

* Admin authentication
* Product management
* Branch management
* Order management
* Feedback management
* Reports and dashboard information

The admin application also communicates with the same centralized backend instead of accessing the database directly.

### 3. Server — Backend Application

The `server` is a Node.js + Express application that acts as the central backend.

It is responsible for:

* Exposing REST APIs
* Authentication
* Authorization
* Request validation
* Business logic
* Order processing
* Database operations
* Communication with PostgreSQL through Prisma

This makes the server the **single backend source of truth** for both customer and admin applications.

---

## Backend Architecture

The backend follows a layered architecture:

```text
                HTTP Request
                     │
                     ▼
                   Route
                     │
                     ▼
                 Middleware
                     │
                     ▼
                 Controller
                     │
                     ▼
                  Service
                     │
                     ▼
                   Prisma
                     │
                     ▼
                PostgreSQL
```

Each layer has a specific responsibility.

### Route

Defines the API endpoint and HTTP method.

For example:

```text
POST /api/orders
GET  /api/products
PATCH /api/admin/orders/:id
```

### Middleware

Runs before the controller and performs request-level checks such as authentication and authorization.

### Controller

Handles the HTTP layer.

It receives the request, passes the required information to the service layer, and sends the appropriate response back to the client.

### Service

Contains the application's business logic.

For example, when creating an order, the service handles the required checks and determines what database operations need to be performed.

### Prisma

Prisma acts as the database access layer between the backend and PostgreSQL.

### PostgreSQL

PostgreSQL is the persistent relational database where application data is stored.

---

# Complete Request Flow

A typical request travels through the system like this:

```text
User Action
    ↓
Next.js Client / Admin
    ↓
HTTP REST Request
    ↓
Express Route
    ↓
Authentication / Authorization Middleware
    ↓
Controller
    ↓
Service
    ↓
Prisma
    ↓
PostgreSQL
    ↓
Service
    ↓
Controller
    ↓
JSON Response
    ↓
Client / Admin UI
```

## Example: Customer Places an Order

Suppose a customer clicks **"Place Order"**.

```text
Customer
   ↓
Client
   ↓
POST /api/orders
   ↓
Express Route
   ↓
Authentication Middleware
   ↓
Order Controller
   ↓
Order Service
   ↓
Prisma
   ↓
PostgreSQL
   ↓
Order Created
   ↓
JSON Response
   ↓
Client Updates UI
```

The flow works as follows:

1. The customer submits the order from the Next.js client.
2. The client sends a `POST /api/orders` request to the Express server.
3. Authentication middleware verifies the customer's authenticated session/token.
4. The request reaches the order controller.
5. The controller passes the required data to the order service.
6. The service applies the order-related business rules and performs the required database operations.
7. Prisma communicates with PostgreSQL to create the order and its related data.
8. The result is returned from the service to the controller.
9. The controller sends a JSON response to the client.
10. The client updates the UI based on the response.

This keeps the frontend responsible for **presentation and user interaction**, while the backend remains responsible for **business rules and data management**.

---

# Authentication and Authorization

Authentication is handled by the backend.

The basic flow is:

```text
Login Request
     ↓
Express Server
     ↓
Credentials Verification
     ↓
JWT-backed Session
     ↓
Protected API Request
     ↓
Authentication Middleware
     ↓
User Identity
     ↓
Authorization Check
     ↓
Controller → Service → Prisma
```

The backend uses `bcrypt` for password verification and supports JWT-backed session cookies as well as bearer-token authentication.

For admin operations, authorization is performed on the backend. Role and branch-level restrictions are checked before protected admin operations are allowed.

---

# Database Architecture

The database layer is centralized inside the server:

```text
server/
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.js
```

The database flow is:

```text
Express Server
      ↓
Prisma ORM
      ↓
PostgreSQL
```

`server/prisma/` is the **single source of truth** for the database schema and migrations.

The client and admin applications do not import Prisma or database connection code. They access application data only through the backend APIs.

---

# Why This Architecture?

The main reason for separating the applications is **separation of responsibility**.

```text
Client
  → Customer experience

Admin
  → Administration

Server
  → API + authentication + business logic

Prisma
  → Database access

PostgreSQL
  → Data storage
```

This prevents database logic and business rules from being duplicated across the customer and admin applications.

Both applications use the same backend, so rules such as authentication, authorization, order processing, and database operations are handled centrally.

---

# Project Structure

```text
nellamuthuvilas/
│
├── client/                       # Customer application
│   ├── src/
│   └── public/
│
├── admin/                        # Admin application
│   ├── src/
│   └── public/
│
├── server/                       # Backend application
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.js
│   │
│   └── scripts/
│
├── package.json
└── README.md
```

## Technology Stack

| Layer                | Technology       |
| -------------------- | ---------------- |
| Customer Application | Next.js, React   |
| Admin Application    | Next.js, React   |
| Backend              | Node.js, Express |
| API                  | REST             |
| Authentication       | JWT, bcrypt      |
| ORM                  | Prisma           |
| Database             | PostgreSQL       |
| Styling              | Tailwind CSS     |

## Interview Summary

> **Nellai Muthu Vilas uses a three-application architecture consisting of a customer-facing Next.js application, an admin-facing Next.js application, and a centralized Express backend. Both frontends communicate with the backend through REST APIs. On the backend, I separated routes, middleware, controllers, and services based on responsibility. The service layer handles the business logic, while Prisma handles database access to PostgreSQL. This keeps the database and business logic centralized in the backend and prevents the client and admin applications from directly accessing the database.**
