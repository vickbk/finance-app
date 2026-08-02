# Feature Modules

This directory houses the core business domains of the application using a **Feature-Driven / Vertical Slice Architecture**.

The primary objective of this structure is to maintain **high domain isolation** and minimize cross-feature coupling. Each feature package acts as an independent module containing its own UI components, data structures, state logic, and utilities.

---

## Domain Architecture Principles

1. **Self-Containment:** Everything required to render and operate a domain feature lives inside its respective feature folder.
2. **Strict Coupling Rules:** Features must never directly import internal files from other features.
3. **Layer Separation:**
   - `app/` manages route orchestration, page composition, and URL parameter reading.
   - `features/` manages domain-specific business logic, domain components, and domain types.
   - `shared/` manages generic, domain-agnostic UI primitives (`Button`, `Modal`, `Table`) and helpers.

---

## Directory Overview

```text
features/
├── auth/               # User authentication UI, signin/signup forms, session guards
├── overview/           # Financial summary dashboard, aggregated balance cards
├── transactions/       # Transaction tables, pagination, search/filter/sort integration
├── budgets/            # Budget allocation cards, pie chart breakdowns, spending limits
├── pots/               # Savings pots management, deposit/withdraw modal workflows
└── recurring-bills/    # Vendor-deduplicated bill list, payment status, due-soon logic

```

---

## Standard Feature Module Anatomy

Every feature module follows a standard internal structure:

```text
features/<feature-name>/
├── components/         # Feature-specific components (e.g., AddMoneyModal.tsx)
├── api/                # Data-fetching wrappers, server action callers scoped to this domain
├── types/              # TypeScript interfaces, DTOs, and state contracts for this domain
├── utils/              # Pure functions & domain-specific math (e.g., calculateSpentPercentage)
└── index.ts            # Public API barrel file (exports ONLY allowed public interfaces)

```

### Module Breakdown

| Directory / File | Purpose                                                     | Rule                                                        |
| ---------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `components/`    | Domain-specific UI elements.                                | Should consume `shared/components/ui` primitives.           |
| `api/`           | Server Actions or client fetchers targeting feature routes. | Must delegate raw HTTP calls to `infra/api`.                |
| `types/`         | Domain models, API payload contracts, UI state shapes.      | Exported via `index.ts` if needed by `app/`.                |
| `utils/`         | Deterministic domain math, formatters, or assertions.       | Must be pure and side-effect free.                          |
| `index.ts`       | The public entrypoint (barrel file) for the feature.        | **Only** expose components/types intended for route shells. |

---

## Import Boundaries & Dependency Rules

To preserve domain isolation, strictly adhere to the following import boundary rules:

### 1. Feature-to-Feature Imports (BANNED)

❌ **Forbidden:** Directly importing internal components from another feature.

```ts
// INSIDE features/transactions/components/TransactionRow.tsx
import { BudgetBadge } from "@/features/budgets/components/BudgetBadge"; // ❌ VIOLATION
```

✅ **Allowed:** If two features share a concept (e.g., Category Badge), move that visual element into `shared/components/` or orchestrate them at the `app/` route level.

### 2. Feature-to-Shared Imports (ALLOWED)

Features are encouraged to compose their UI using reusable design system components:

```ts
// INSIDE features/pots/components/PotCard.tsx
import { Button } from "@/shared/components/ui/button"; // ✅ Clean import
import { formatCurrency } from "@/shared/utils/currency"; // ✅ Clean import
```

### 3. App-to-Feature Imports (PUBLIC API ONLY)

Next.js route segments in `app/` should only import from a feature's top-level index or explicit public components:

```ts
// INSIDE app/(dashboard)/transactions/page.tsx
import { TransactionsTable, TransactionFilters } from "@/features/transactions"; // ✅ Clean public API import
```

---

## Guidelines for Adding a New Feature

When introducing a new domain feature (e.g., `analytics`):

1. Create `features/analytics/` with the standard folders (`components/`, `api/`, `types/`, `utils/`).
2. Implement components using `shared/` primitives.
3. Export the top-level composition views in `features/analytics/index.ts`.
4. Import the feature into the target route inside `app/(dashboard)/analytics/page.tsx`.
