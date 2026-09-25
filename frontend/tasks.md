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

- [x] **Styling Engine & Design System Configuration**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Setup Tailwind CSS, custom design tokens, color variables, and global font configurations.
  - **Steps**:
    - [x] Install and configure Tailwind CSS and PostCSS plugins
    - [x] Define global design tokens (colors, typography, spacing) matching design specs
    - [x] Configure `app/globals.css` and font loading strategies (`next/font`)

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

- [x] **App Router Shells & Streaming Fallbacks**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Setup top-level route segments, global error boundaries, and streaming loading states.
  - **Steps**:
    - [x] Scaffold root layout (`app/layout.tsx`) and route route segment folders
    - [x] Scaffold global streaming fallback boundary (`app/loading.tsx`)
    - [x] Scaffold root error boundary handler (`app/error.tsx` and `app/not-found.tsx`)

### Phase 3: Testing Infrastructure Setup (`tests/`)

- [x] **Unit & Component Testing Engine (Vitest)**
  - **Status**: ✅ Done
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

- [x] **Test Utilities & API Mocking Setup**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Configure test wrapper providers and mock handlers for API isolation.
  - **Steps**:
    - [x] Create custom render function wrapping design providers in `tests/vitest/`
    - [x] Configure API network mocking harness for isolated component testing

### Phase 4: Build & Deployment Preparedness

- [x] **Vercel & Production Build Setup**
  - **Status**: ✅ Done
  - **Target**: 2026-08-02
  - **Description**: Validate production compilation and deployment configuration for Vercel.
  - **Steps**:
    - [x] Configure `next.config.mjs` for security headers and build optimizations
    - [x] Execute trial production build (`pnpm build`) to verify bundle compilation

## Raw UI Implementation

- [ ] **Authentication UI & Routing**
- **Status**: 🔄 In Progress
- **Target**: 2026-09-15
- **Description**: Build accessible views and routing structure for user authentication including Signup, Login, and Google OAuth flows.
- **Steps**:
- [ ] Implement Signup HTML view and form layout
- [ ] Implement Login HTML view and form layout
- [ ] Implement "Continue with Google" OAuth button & callback state view
- [ ] Wire routes for `/login`, `/signup`, and `/auth/callback`

- [ ] **Transactions Domain UI & Routing**
- **Status**: ⏳ Todo
- **Target**: 2026-09-22
- **Description**: Build complete HTML views, table layout, search/filter controls, and route definitions for transaction management.
- **Steps**:
- [ ] Build Transactions list table structure with pagination UI
- [ ] Build transaction filter, search, and sort form controls
- [ ] Implement Add/Edit Transaction modal dialog views
- [ ] Wire route definitions for `/transactions`

- [ ] **Budgets Domain UI & Routing**
- **Status**: ⏳ Todo
- **Target**: 2026-09-29
- **Description**: Build category spending cards, progress summaries, and route definitions for budget tracking.
- **Steps**:
- [ ] Implement Budget category card grid & spending breakdown views
- [ ] Build Create/Edit/Delete Budget modal dialog views
- [ ] Wire route definitions for `/budgets`

- [ ] **Savings Pots Domain UI & Routing**
- **Status**: ⏳ Todo
- **Target**: 2026-10-06
- **Description**: Build card grid layouts, progress indicators, and route definitions for savings pots.
- **Steps**:
- [ ] Build Savings Pots card grid layout
- [ ] Implement Add Money / Withdraw Money modal form views
- [ ] Build Create/Edit Pot modal views
- [ ] Wire route definitions for `/pots`

- [ ] **Recurring Bills Domain UI & Routing**
- **Status**: ⏳ Todo
- **Target**: 2026-10-13
- **Description**: Build total summary stat cards, bills list layout, and route definitions for recurring bills.
- **Steps**:
- [ ] Build Recurring Bills summary card & list table views
- [ ] Implement bill search, filter, and sorting UI controls
- [ ] Wire route definitions for `/recurring-bills`

- [ ] **Overview Dashboard & Application Shell**
- **Status**: ⏳ Todo
- **Target**: 2026-10-20
- **Description**: Assemble the global layout shell, navigation bar/sidebar, and consolidated dashboard summary.
- **Steps**:
- [ ] Implement shared application shell (sidebar, top bar, mobile navigation)
- [ ] Assemble Overview summary page referencing widgets from all domains
- [ ] Wire root `/` dashboard route and active state navigation links
