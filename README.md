# Personal Finance App (Full-Stack Monorepo)

A high-performance, domain-driven personal finance application built as a full-stack solution. Features dynamic budget management, transaction filtering, savings pots with atomic balance transfers, recurring bill tracking, and secure multi-tenant authentication.

---

## Architecture Overview

This project is structured as a **hybrid monorepo** with a clean separation between the Next.js frontend and Go backend, orchestrated via `go-task`.

```text
finance-app/
├── frontend/             # Next.js App Router (SSR, Tailwind CSS, TypeScript)
│   ├── app/              # Top-level routes, layouts, and SSR shells
│   ├── features/         # Domain-isolated feature modules
│   ├── infra/            # API wrapper & server token-forwarding
│   ├── shared/           # Design system UI primitives & utilities
│   ├── tests/            # Vitest unit tests & Playwright E2E suites
│   └── .env.example      # Client & Next.js environment template
│
├── backend/              # Go Fiber REST API
│   ├── cmd/server/       # Main entrypoint
│   ├── internal/         # Domain-isolated packages (auth, transactions, budgets, pots, bills)
│   ├── infra/            # Database (GORM), CORS, & Auth middleware
│   ├── shared/           # Common HTTP wrappers & custom domain errors
│   └── .env.example      # Database & JWT server environment template
│
├── Dockerfile.backend    # Multi-stage container build for Google Cloud Run
├── Taskfile.yml          # Root CLI task orchestration (go-task)
└── README.md

```

---

## Tech Stack

| Layer           | Technology                                     | Hosting / Infrastructure |
| --------------- | ---------------------------------------------- | ------------------------ |
| **Frontend**    | Next.js (App Router), TypeScript, Tailwind CSS | Vercel                   |
| **Backend**     | Go (1.22+), Fiber, GORM                        | Google Cloud Run         |
| **Database**    | PostgreSQL (Serverless)                        | Neon DB                  |
| **Testing**     | Vitest (Unit/Integration), Playwright (E2E)    | CI Pipeline              |
| **Task Runner** | Task (`go-task`), Air (Go Live Reload)         | Local CLI                |

---

## Key Features

- **Overview Dashboard:** At-a-glance financial summary, dynamic budget allocations, recent transactions, and upcoming bills.
- **Transactions Management:** Paginated data table (10 items/page), full-text vendor search, category filters, and multi-field sorting.
- **Budgets & Spending:** Budget CRUD operations with current-month spending calculations relative to system time.
- **Pots (Savings Goals):** Deposit and withdraw funds with atomic database balance synchronization.
- **Recurring Bills:** Vendor deduplication, status tracking (paid/unpaid), and "due soon" date math.
- **Auth & Multi-Tenancy:** Email/Password & Google OAuth authentication with strictly isolated database row-level user data.

---

## Prerequisites

Ensure you have the following installed locally:

- [Node.js](https://nodejs.org/) (v20+) & [pnpm](https://pnpm.io/)
- [Go](https://go.dev/) (v1.22+)
- [Task (`go-task`)](https://taskfile.dev/)
- [Air](https://github.com/air-verse/air) _(for Go hot-reloading)_: `go install github.com/air-verse/air@latest`

---

## Local Setup & Development

### 1. Environment Configuration

The frontend and backend use isolated, service-specific environment configurations.

```bash
# Copy frontend environment template
cp frontend/.env.example frontend/.env.local

# Copy backend environment template
cp backend/.env.example backend/.env

```

- **Frontend (`frontend/.env.local`):** Configure Next.js server URL and public auth variables.
- **Backend (`backend/.env`):** Configure your Neon PostgreSQL connection string (`DATABASE_URL`) and JWT secret.

### 2. Run the Development Environment

Start both the Next.js dev server and Go Fiber backend concurrently with a single command:

```bash
task dev

```

---

## Common Task Commands

All monorepo workflows are managed via `Taskfile.yml`:

| Command             | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `task dev`          | Runs Next.js (`:3000`) and Go Fiber with Air (`:8080`) concurrently |
| `task dev:frontend` | Runs Next.js frontend only                                          |
| `task dev:backend`  | Runs Go backend with Air hot-reloading only                         |
| `task build`        | Builds both Next.js and Go production binaries                      |
| `task test`         | Runs frontend (Vitest) and backend Go test suites                   |
| `task lint`         | Executes linters (`ESLint` + `golangci-lint`)                       |

---

## Deployment Architecture

- **Frontend:** Automatically deployed to **Vercel** on git push to main.
- **Backend:** Packaged via `Dockerfile.backend` into a minimal container and deployed to **Google Cloud Run**.
- **Database:** Hosted on **Neon DB** with connection pooling enabled.
