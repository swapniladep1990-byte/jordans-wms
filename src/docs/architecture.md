# Jordans Warehouse Management System

# Architecture Documentation

Version 1.0

---

# Architecture Philosophy

Jordans WMS follows a layered architecture.

Each layer has one responsibility.

```
UI

↓

Hooks

↓

Services

↓

Supabase

↓

PostgreSQL
```

Business rules belong in PostgreSQL.

The frontend is responsible only for presentation and user interaction.

---

# Folder Structure

```
src/

├── app/
│
├── components/
│
├── hooks/
│
├── lib/
│
│   ├── services/
│   ├── supabase/
│   └── utils/
│
├── types/
│
├── constants/
│
└── styles/
```

---

# Responsibilities

## app/

Contains pages only.

Responsibilities

- Layout
- Routing
- Page Composition

Pages should not contain business logic.

---

## components/

Reusable UI.

Examples

- ProductTable
- ProductForm
- DashboardCard
- SearchBox
- QRCodeCard

One component = One responsibility.

---

## hooks/

Contains all React Query hooks.

Hooks communicate with Services.

Hooks never communicate directly with Supabase.

---

## services/

Business layer.

Services communicate with Supabase.

Services contain CRUD operations.

No UI code.

---

## supabase/

Supabase client configuration.

Authentication.

Database connection.

---

## types/

TypeScript interfaces.

Every database table has one corresponding type file.

Examples

- product.ts
- transaction.ts

---

## constants/

Application constants.

Examples

- Categories
- Suppliers
- Units
- Colors

---

# UI Rules

Dark Theme

Responsive

Mobile First

Reusable Components

Tailwind CSS

No inline styles.

---

# Component Rules

Every component should follow

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

# Service Rules

Every service should follow

```
Imports

↓

Types

↓

Constants

↓

CRUD Functions

↓

Export
```

---

# Hook Rules

Every hook should follow

```
Query Keys

↓

Queries

↓

Mutations

↓

Invalidate Cache
```

---

# Database Rules

Frontend never updates stock directly.

Frontend never generates SKU.

Frontend never contains inventory calculations.

All inventory logic belongs in PostgreSQL.

---

# Current Modules

Completed

- Products

In Progress

- Inventory

Upcoming

- Goods Receipt
- Stock Out
- Dashboard
- Reports
- QR Scanner

---

# Version 1 Scope

One Warehouse

Fixed Categories

Fixed Suppliers

Automatic SKU

Inventory Transactions

QR Ready

PWA

---

# Future Scope

Multiple Warehouses

Purchase Orders

Customers

Vendors

Role Based Access

Advanced Reports

Offline Sync