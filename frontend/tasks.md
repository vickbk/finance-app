# Frontend Task Roadmap

## Tasklist definition

### Phase 1: Framework Bootstrap & Core Configuration

- [x] **Next.js & TypeScript Project Initialization**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Scaffold the Next.js App Router core application inside `frontend/` with strict TypeScript settings.
  - **Steps**:
    - [x] Initialize Next.js App Router with TypeScript enabled
    - [x] Configure `tsconfig.json` with strict type-checking and path aliases (`@/*`)

- [ ] **Styling Engine & Design System Configuration**
  - **Status**: 🚀 Doing
  - **Target**: 2026-08-02
  - **Description**: Setup Tailwind CSS, custom design tokens, color variables, and global font configurations.
  - **Steps**:
    - [x] Install and configure Tailwind CSS and PostCSS plugins
    - [ ] Define global design tokens (colors, typography, spacing) matching design specs
    - [ ] Configure `app/globals.css` and font loading strategies (`next/font`)

- [x] **Code Quality & Linter Tooling**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Setup code formatting rules, linter presets, and git execution standards.
  - **Steps**:
    - [x] Configure `.eslint.config.mjs` with Next.js and TypeScript rulesets
    - [x] Configure `.prettierrc` for consistent formatting
    - [x] Define `.gitignore` for Next.js build artifacts and environment files

- [x] **Isolated Environment System Setup**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Define the environment contract and variables interface for local and production builds.
  - **Steps**:
    - [x] Create `frontend/.env.local.example` template with API target URLs and public keys
    - [x] Create type-safe environment configuration schema parser (`infra/config`)

### Phase 2: Architecture Layout & Module Scaffolding

- [x] **Feature-Driven Domain Layout Setup**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Scaffold the modular `features/` directory to ensure high domain isolation across application boundaries.
  - **Steps**:
    - [x] Scaffold `features/auth/` (components, actions, types, utils)
    - [x] Scaffold `features/overview/` (components, actions, types, utils)
    - [x] Scaffold `features/transactions/` (components, actions, types, utils)
    - [x] Scaffold `features/budgets/` (components, actions, types, utils)
    - [x] Scaffold `features/pots/` (components, actions, types, utils)
    - [x] Scaffold `features/recurring-bills/` (components, actions, types, utils)
    - [x] Scaffold `features/chatbot/` (components, actions, types, utils)

- [x] **Infrastructure Layer Scaffolding**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Setup central API communication modules and server session/cookie management hooks.
  - **Steps**:
    - [x] Scaffold `infra/api/` HTTP fetch wrapper with header/auth propagation
    - [x] Scaffold `infra/auth/` cookie extraction and token parsing helpers for SSR

- [x] **Shared Component & Utility Shell Scaffolding**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Establish reusable UI component primitives, formatting tools, and baseline design tokens.
  - **Steps**:
    - [x] Scaffold `shared/utils/` for currency/date formatters and class merge helpers

- [ ] **App Router Shells & Streaming Fallbacks**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-07
  - **Description**: Setup top-level route segments, global error boundaries, and streaming loading states.
  - **Steps**:
    - [ ] Scaffold root layout (`app/layout.tsx`) and route route segment folders
    - [ ] Scaffold global streaming fallback boundary (`app/loading.tsx`)
    - [ ] Scaffold root error boundary handler (`app/error.tsx` and `app/not-found.tsx`)

### Phase 3: Testing Infrastructure Setup (`tests/`)

- [ ] **Unit & Component Testing Engine (Vitest)**
  - **Status**: ⏳ Doing
  - **Target**: 2026-08-02
  - **Description**: Scaffold the `tests/` directory and configure Vitest and React Testing Library for fast component unit tests.
  - **Steps**:
    - [x] Install Vitest, `@testing-library/react`, and `@testing-library/happy-dom`
    - [x] Create `vitest.config.ts` with Next.js path alias resolution
    - [x] Initialize `tests/vitest/` directory structure and setup test environment mocks

- [x] **End-to-End Testing Engine (Playwright)**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Configure Playwright for automated browser testing across viewport breakpoints.
  - **Steps**:
    - [x] Install and initialize Playwright framework
    - [x] Create `playwright.config.ts` configured for desktop, tablet, and mobile testing
    - [x] Initialize `tests/playwright/e2e/` directory structure with base smoke-test setup

- [ ] **Test Utilities & API Mocking Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-09
  - **Description**: Configure test wrapper providers and mock handlers for API isolation.
  - **Steps**:
    - [ ] Create custom render function wrapping design providers in `tests/utils/`
    - [ ] Configure API network mocking harness for isolated component testing

### Phase 4: Build & Deployment Preparedness

- [ ] **Vercel & Production Build Setup**
  - **Status**: ⏳ Todo
  - **Target**: 2026-08-10
  - **Description**: Validate production compilation and deployment configuration for Vercel.
  - **Steps**:
    - [ ] Configure `next.config.mjs` for security headers and build optimizations
    - [ ] Execute trial production build (`pnpm build`) to verify bundle compilation
