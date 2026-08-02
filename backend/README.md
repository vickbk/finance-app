# Personal Finance API

The backend service for the Personal Finance App, built as a lightweight, high-performance RESTful API using Go and the Fiber web framework.

---

## Architecture Overview

The backend is structured using a **Domain-Driven Modular Layout** inside `internal/`. Each business domain operates as an isolated package implementing a strict **Handler-Service-Repository** pattern to decouple HTTP request parsing, business logic, and database persistence.

```text
backend/
├── server/             # Application entrypoint (main.go)
├── internal/               # Domain-isolated business logic (Private packages)
│   ├── auth/               # User registration, login, JWT token issuance
│   ├── transactions/       # Paginated queries, category filtering, search, sorting
│   ├── budgets/            # Budget allocation CRUD & monthly spending calculations
│   ├── pots/               # Savings pots & atomic database balance transfers
│   └── bills/              # Recurring bill status math & due-soon logic
├── infra/                  # Cross-cutting infrastructure & technical concerns
│   ├── database/           # Neon PostgreSQL connection pool & GORM migration runner
│   └── middleware/         # Auth JWT verification, CORS policy, request logger
├── shared/                 # Reusable utility primitives & response wrappers
│   ├── config/             # Environment variable parsing & runtime validation
│   ├── errors/             # Custom domain error types & Fiber error handlers
│   ├── response/           # Standardized JSON response envelopes
│   └── testutil/           # GORM dry-run database helpers & Fiber test utilities
├── .air.toml               # Air configuration for local hot-reloading
├── .env.example            # Backend environment configuration template
├── go.mod                  # Go module definition
└── go.sum                  # Dependency checksums

```

---

## Tech Stack

| Layer                 | Technology       | Purpose                                            |
| --------------------- | ---------------- | -------------------------------------------------- |
| **Language**          | Go 1.22+         | Compiled, low-latency execution                    |
| **HTTP Framework**    | Fiber (`v2`)     | Express-inspired, zero-memory-allocation router    |
| **ORM / Data Access** | GORM             | Type-safe PostgreSQL queries and schema migrations |
| **Database**          | Neon DB          | Serverless, autoscaling PostgreSQL                 |
| **Live Reloading**    | Air              | Hot-reloading CLI during local development         |
| **Deployment Target** | Google Cloud Run | Serverless container hosting                       |

---

## Domain Architecture Pattern

Every package within `internal/` adheres to a 4-file structure:

```text
internal/<domain>/
├── handler.go      # Fiber HTTP handlers (Parse query/body params, output JSON envelopes)
├── service.go      # Pure domain business logic (Calculations, date math, transactions)
├── repository.go   # Database persistence interface (GORM SQL execution & filters)
└── models.go       # Domain entity structs, DB schemas, & request/response DTOs

```

### Layer Responsibilities

1. **`handler.go`**: Validates incoming payload syntax, extracts URL/query parameters, calls the service layer, and maps responses into standardized JSON envelopes.
2. **`service.go`**: Implements business rules (e.g., verifying pot withdrawal limits, computing monthly due dates). Has zero knowledge of HTTP or Fiber contexts.
3. **`repository.go`**: Executes SQL operations via GORM (`Where`, `Order`, `Limit`, `Offset`, `Transaction`).
4. **`models.go`**: Houses GORM database structs with tags and validation constraints.

---

## Environment Configuration

Copy `.env.example` to create your local `.env` file:

```bash
cp .env.example .env

```

### Environment Parameters

```ini
# Server Configuration
PORT=8080
ENV=development # development | staging | production

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgres://user:password@ep-cool-name.us-east-2.aws.neon.tech/neondb?sslmode=require

# Authentication & Security
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ALLOWED_ORIGINS=http://localhost:3000,[https://your-app.vercel.app](https://your-app.vercel.app)

# Logging & Monitoring
LOG_LEVEL=debug # debug | info | warn | error

```

---

## Local Development & Commands

### Prerequisites

- Go 1.22+ installed locally
- [Air](https://github.com/air-verse/air) installed for hot-reloading: `go install github.com/air-verse/air@latest`

### Running the Server

#### Option A: Via Monorepo Root Task Runner (Recommended)

```bash
# From the root of finance-app/
task dev:backend

```

#### Option B: Standalone with Air (Inside `backend/`)

```bash
# Run with live-reloading
air

```

#### Option C: Standard Go Run

```bash
go run cmd/server/main.go

```

### Testing & Linting

```bash
# Run unit and integration tests
go test -v ./...

# Run test coverage report
go test -coverprofile=coverage.out ./... && go tool cover -html=coverage.out

# Run linter
golangci-lint run

```

---

## Database Migrations & Seeding

- **Auto-Migrations:** GORM automatically runs schema migrations on application startup via `infra/database/migrate.go`.

---

## Production Deployment (Google Cloud Run)

The backend is built using a multi-stage `Dockerfile.backend` located at the root of the monorepo:

1. **Build Stage:** Compiles the Go binary using `golang:1.22-alpine`.
2. **Runtime Stage:** Copies only the static binary into a minimal `scratch` or `alpine` image for sub-second container startup times on Cloud Run.
