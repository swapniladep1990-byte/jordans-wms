# Jordans Warehouse Management System

# Coding Standards

Version 1.0

---

# Philosophy

Code should be:

- Simple
- Readable
- Reusable
- Strongly Typed
- Production Ready

Prefer clarity over cleverness.

---

# General Rules

## Generate complete files only.

Never generate patch code.

Never generate partial implementations unless explicitly requested.

---

Approved files are frozen.

Do not modify approved files unless requested.

---

Never invent database schema.

Always use the documented schema.

---

Never invent API responses.

---

Never use `any`.

Always use proper TypeScript types.

---

# File Structure

Every TypeScript file should follow this order.

```
Imports

↓

Types

↓

Constants

↓

Helper Functions

↓

Main Functions

↓

Exports
```

---

Every React Component should follow.

```
Imports

↓

Types

↓

Hooks

↓

Handlers

↓

JSX

↓

Export
```

---

Every Service should follow.

```
Imports

↓

Types

↓

Constants

↓

CRUD

↓

Export
```

---

Every Hook should follow.

```
Query Keys

↓

Queries

↓

Mutations

↓

Cache Invalidation
```

---

# UI Rules

Use Tailwind CSS.

Dark Theme by default.

Responsive design.

Mobile First.

Reusable Components.

No inline styles.

---

# Forms

Use:

React Hook Form

+

Zod

Validation belongs inside the schema.

Never inside JSX.

---

# React Rules

Components should have one responsibility.

Keep components small.

Extract reusable pieces.

Never call Supabase directly from components.

---

# Hooks

Hooks communicate with Services.

Hooks never communicate directly with Supabase.

---

# Services

Services communicate with Supabase.

No UI code.

No JSX.

No React imports.

---

# Database Rules

SKU generation belongs in PostgreSQL.

Inventory updates belong in PostgreSQL.

Business rules belong in PostgreSQL whenever possible.

Frontend never updates current_stock directly.

Frontend never generates SKU.

---

# Error Handling

Every Service must throw meaningful errors.

Never swallow errors.

Never return silent failures.

---

# Naming

Components

PascalCase

Example

ProductTable

---

Hooks

camelCase beginning with use

Example

useProducts

---

Services

camelCase

Example

createProduct

updateProduct

deleteProduct

---

Types

PascalCase

Example

Product

StockTransaction

---

# Comments

Use comments to explain WHY.

Do not comment obvious code.

Good

```ts
// Lock the row to prevent concurrent stock updates.
```

Bad

```ts
// Add one to count.
count++;
```

---

# Business Rules

Products

- SKU generated automatically.
- Current Stock never edited manually.

Inventory

- Quantity always positive.
- Transaction Type decides stock direction.
- Stock can never become negative.

---

# Performance

Avoid unnecessary renders.

Avoid duplicate queries.

Prefer reusable hooks.

Keep database queries efficient.

---

# Git Workflow

Every completed feature should end with:

```
git add .

git commit -m "feat(module): short description"
```

Example

```
git commit -m "feat(products): complete products module"
```

---

# Documentation

Whenever architecture changes:

Update

- PROJECT_STATUS.md
- database.md
- architecture.md

Documentation is part of the codebase.

Never leave documentation outdated.