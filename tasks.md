## Tasklist definition

### Phase 1: Workspace Initialization & Environment Foundation

- [x] **Repository & Directory Initialization**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Initialize the mono-repository structure and configure workspace isolation rules.
  - **Steps**:
    - [x] Initialize git repository and set up root `.gitignore`
    - [x] Create root folder directories for `frontend` and `backend`
    - [x] Configure workspace tool scripts for root execution

- [ ] **Decoupled Environment System Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-05
  - **Description**: Establish isolated, service-specific environment management systems for frontend and backend.
  - **Steps**:
    - [ ] Create `frontend/.env.example` (API base URLs, auth provider keys, public client vars)
    - [ ] Create `backend/.env.example` (Neon DB connection strings, server port, JWT secrets)
    - [ ] Establish local development environment guidelines (`frontend/.env.local` vs `backend/.env`)

### Phase 2: External Database & Local Orchestration

- [ ] **Neon PostgreSQL Provisioning & Configuration**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-06
  - **Description**: Provision and configure external serverless PostgreSQL (Neon) for development and production environments.
  - **Steps**:
    - [ ] Provision Neon PostgreSQL project instance
    - [ ] Obtain direct connection string and pooled connection string
    - [ ] Configure SSL/TLS parameters required for Go GORM driver connection

- [ ] **Local Backend Containerization**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-07
  - **Description**: Configure Docker Compose orchestration for running backend services locally connected to Neon DB.
  - **Steps**:
    - [ ] Create `docker-compose.yml` scoped strictly to local Go backend execution
    - [ ] Bind `backend/.env` file directly to the local backend container context
    - [ ] Verify local backend container network connectivity to external Neon DB instance

### Phase 3: Cloud Infrastructure & Deployment Configuration

- [ ] **Google Cloud Run Deployment Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-09
  - **Description**: Configure production containerization for the Go Fiber backend on Google Cloud Run using Neon DB.
  - **Steps**:
    - [ ] Create multi-stage `Dockerfile.backend` for minimal runtime footprint
    - [ ] Configure Google Cloud Run deployment pipeline and secret bindings for Neon DB credentials

- [ ] **Frontend Vercel Deployment Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-10
  - **Description**: Configure Vercel project deployment for the Next.js frontend application with isolated env management.
  - **Steps**:
    - [ ] Link `frontend/` directory to Vercel deployment pipeline
    - [ ] Configure Vercel environment variables mirroring `frontend/.env.example`
    - [ ] Define CORS policies and allowed origins between Vercel and Google Cloud Run

### Phase 4: Integration Verification

- [ ] **End-to-End Environment Validation**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-12
  - **Description**: Verify cross-environment network connectivity, serverless DB connection pooling, and SSR pipelines.
  - **Steps**:
    - [ ] Test local backend communication with Neon PostgreSQL
    - [ ] Verify Cloud Run production connection and SSL pooling with Neon DB
    - [ ] Test Next.js SSR requests forwarded from Vercel to Go Cloud Run backend
