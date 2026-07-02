# Jordans Warehouse Management System (Jordans WMS)

## Project Information

**Project Name:** Jordans Warehouse Management System

**Version:** 0.3.0

**Status:** Active Development

**Development Method:** Sprint Based

**Last Updated:** 02 July 2026

---

# Current Sprint

## Sprint 3

### Inventory Module

Status

🟡 In Progress

---

# Completed Modules

## Project Foundation ✅

- Next.js Setup
- TypeScript
- Tailwind CSS
- Supabase Integration
- Project Folder Structure
- Documentation Structure

Status

✅ Complete

---

## Products Module ✅

Completed

- Product Types
- Product Service
- Product Hooks
- Product Table
- Product Form
- Products Page

Status

🔒 Locked

---

## Database Layer ✅

Completed

### SKU Generation

- PostgreSQL Sequence
- BEFORE INSERT Trigger
- Automatic SKU Generation

Format

JL-000001

JL-000002

JL-000003

Status

🔒 Locked

---

## Inventory Engine ✅

Completed

- Transaction Types
- apply_stock_transaction() PostgreSQL RPC
- Atomic Inventory Updates
- Row Locking
- Negative Stock Prevention

Status

🔒 Locked

---

# Current Architecture

```
UI Components

↓

Hooks

↓

Services

↓

Supabase

↓

PostgreSQL

↓

Database Business Rules
```

---

# Business Decisions

## Warehouse

Version 1 supports only ONE warehouse.

Warehouse selection is disabled.

Future versions may support multiple warehouses.

---

## SKU

Automatically generated.

Users never enter SKU.

Generated using PostgreSQL Trigger.

---

## Categories

Fixed values.

No CRUD.

- Commercial Downlights
- Industrial Fixtures
- Track Systems
- Office Panels
- Outdoor & Facade
- Architectural Profiles

---

## Suppliers

Fixed values.

No CRUD.

- Jordans Lighting
- Philips
- Havells
- Crompton
- Wipro

---

## Units

Fixed values.

- Nos
- Box
- Meter
- Kg
- Roll
- Set

---

# Coding Standards

- No patch code.
- Generate complete files only.
- Approved files are frozen.
- Business logic belongs in PostgreSQL whenever possible.
- UI must never update stock directly.
- UI must never generate SKU.
- Strong TypeScript typing.
- No any.

---

# Folder Status

## src/types

✅ Complete

---

## src/lib/services

🟡 Inventory Module In Progress

Products Complete

---

## src/hooks

Products Complete

Inventory Pending

---

## src/components/products

✅ Complete

---

## src/components/inventory

⬜ Not Started

---

# Next Task

Implement Inventory Transaction Service

File

src/lib/services/transactions.service.ts

---

# Upcoming Roadmap

- Inventory Transaction Service
- Inventory Hooks
- Goods Receipt
- Stock Out
- Transaction History
- Dashboard Widgets
- QR Code Scanner
- Reports
- Authentication
- PWA Deployment

---

# Notes

Never update products.current_stock directly.

All inventory movement must go through:

apply_stock_transaction()

This rule is mandatory.