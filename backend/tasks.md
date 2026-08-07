## Tasklist definition

### Phase 1: Framework Bootstrap & Core Environment Setup

- [x] **Go Module & Fiber Server Initialization**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Initialize the Go backend module, scaffold the entrypoint, and configure the Fiber HTTP app instance.
  - **Steps**:
    - [x] Initialize Go module (`go mod init github.com/vickbk/finance-app/backend`)
    - [x] Scaffold entrypoint inside `app.go`
    - [x] Configure Fiber instance with panic recovery, request ID, and logger middleware
    - [x] Implement graceful shutdown handling for SIGINT/SIGTERM signals

- [x] **Isolated Environment & Configuration System**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Establish isolated environment management with strict runtime schema validation.
  - **Steps**:
    - [x] Create `backend/.env.example` template with Neon DB credentials, JWT secrets, and server ports
    - [x] Implement environment config loader in `shared/config/` using `dotenv`
    - [x] Implement startup validation to prevent server initialization on missing environment variables

- [x] **Developer Tooling & Hot-Reloading**
  - **Status**: ✅ Done
  - **Target**: 2026-08-04
  - **Description**: Configure Air for live-reloading during local development and set up Go linter rules.
  - **Steps**:
    - [x] Create `.air.toml` configuration file tuned for Fiber server hot-reloading
    - [x] Configure `.golangci.yml` for static analysis and code quality checks

### Phase 2: Database Layer & Persistence Engine (Neon DB + GORM)

- [x] **Neon PostgreSQL Connection Pool & GORM Setup**
  - **Status**: ✅ Done
  - **Target**: 2026-08-06
  - **Description**: Configure GORM connection pooling connected to external Neon serverless PostgreSQL.
  - **Steps**:
    - [x] Implement GORM connection pool loader in `infra/db/connect.go`
    - [x] Configure SSL/TLS parameters and connection lifecycle limits for Neon serverless pooling
    - [x] Implement database ping and health check verification routines

### Phase 3: Middleware & Core Response Utilities

- [ ] **CORS & Security Middleware Configuration**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-07
  - **Description**: Set up HTTP security headers, origin controls, and authentication middleware.
  - **Steps**:
    - [ ] Implement `infra/middleware/cors.go` with explicit origin rules for Vercel/Localhost
    - [ ] Implement `infra/middleware/auth.go` for JWT parsing and user context injection

- [ ] **Shared HTTP Envelopes & Error Handling**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-07
  - **Description**: Standardize API response formats and custom domain error handlers across all endpoints.
  - **Steps**:
    - [x] Implement standard JSON response envelopes (`success`, `data`, `meta`, `error`) in `shared/response/`
    - [ ] Create centralized Fiber error handler catching custom application domain errors in `shared/errors/`

### Phase 4: Domain Architecture & Package Scaffolding (`internal/`)

- [x] **Internal Feature Package Scaffolding**
  - **Status**: ✅ Done
  - **Target**: 2026-08-03
  - **Description**: Establish modular package boundaries inside `internal/` using the handler-service-repository pattern.
  - **Steps**:
    - [x] Scaffold `internal/auth/` (`handler.go`, `service.go`, `repository.go`, `models.go`)
    - [x] Scaffold `internal/transactions/` (`handler.go`, `service.go`, `repository.go`, `models.go`)
    - [x] Scaffold `internal/budgets/` (`handler.go`, `service.go`, `repository.go`, `models.go`)
    - [x] Scaffold `internal/pots/` (`handler.go`, `service.go`, `repository.go`, `models.go`)
    - [x] Scaffold `internal/bills/` (`handler.go`, `service.go`, `repository.go`, `models.go`)

### Phase 5: Testing Harness Infrastructure

- [ ] **Unit & HTTP Integration Test Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-10
  - **Description**: Establish unit testing utilities and Fiber `app.Test()` HTTP integration test helpers.
  - **Steps**:
    - [ ] Create GORM mock / dry-run database test helpers in `shared/testutil/`
    - [ ] Implement Fiber request execution helpers for API route integration testing
    - [ ] Add base sanity test verifying `/healthz` and server boot lifecycle

### Phase 6: Cloud Run Containerization & Health Checks

- [ ] **Production Containerization & Health Probes**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-11
  - **Description**: Package Go backend using a multi-stage Dockerfile and implement readiness/liveness probes for Google Cloud Run.
  - **Steps**:
    - [ ] Create multi-stage `Dockerfile.backend` (Go alpine build stage -> minimal scratch/distroless runtime)
    - [ ] Implement `/healthz` (liveness) and `/ready` (readiness) HTTP endpoints checking database connectivity
    - [ ] Test container build locally and verify sub-second startup execution
