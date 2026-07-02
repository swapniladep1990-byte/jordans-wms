# Changelog

All notable changes to Jordans Warehouse Management System (Jordans WMS) will be documented in this file.

This project follows a simple chronological changelog.

---

# [0.3.0] - 2026-07-02

## Added

### Project Foundation

- Next.js 15 setup
- TypeScript configuration
- Tailwind CSS
- Supabase integration
- Documentation structure

### Products Module

- Product domain types
- Product service layer
- Product React Query hooks
- Product table
- Product form
- Products page
- Product search

### Database

- Automatic SKU generation
- PostgreSQL sequence
- BEFORE INSERT trigger
- SKU format JL-000001

### Inventory Engine

- Transaction domain types
- apply_stock_transaction() PostgreSQL RPC
- Atomic stock updates
- Negative stock validation
- Row locking

### Documentation

- CLAUDE_CONTEXT.md
- PROJECT_STATUS.md
- database.md
- architecture.md
- coding-standards.md
- roadmap.md

---

## Changed

- SKU generation moved from application layer to PostgreSQL.
- Inventory updates centralized through apply_stock_transaction().
- One warehouse architecture adopted for Version 1.

---

## Fixed

- Eliminated potential duplicate SKU race conditions.
- Prevented negative inventory.
- Standardized project architecture.