# Jordans Warehouse Management System (Jordans WMS)

## Project Overview

Jordans WMS is a modern Warehouse Management System being developed for Jordans Lighting India Pvt. Ltd.

The primary goal is to replace Excel-based inventory management with a fast, reliable, and scalable web application.

The application is built using modern web technologies and follows production-quality software engineering practices.

---

# Technology Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- TanStack Query
- React Hook Form
- Zod

---

# Development Rules

Always follow these rules.

## Code Generation

- Generate complete files only.
- Never generate patch code.
- Never generate partial snippets unless requested.
- Do not modify approved files.
- Follow existing project architecture.

---

# Architecture

Application Flow

UI Components

↓

Hooks

↓

Services

↓

Supabase

↓

PostgreSQL

Business rules belong in PostgreSQL whenever possible.

---

# Database Rules

SKU generation is handled by PostgreSQL.

Inventory updates are handled through PostgreSQL RPC.

The frontend must never generate SKUs.

The frontend must never update current_stock directly.

---

# Coding Standards

- TypeScript only.
- No any.
- Strong typing.
- Reusable components.
- One responsibility per file.
- One responsibility per component.
- Keep business logic out of JSX.

---

# UI Standards

Dark Theme

Responsive

Tailwind CSS

Mobile First

Reusable Components

---

# Project Rules

Products Module is considered complete.

Approved files are frozen.

Never redesign architecture unless explicitly requested.

Never invent database schema.

Always ask if schema is missing.

---

# Current Version

Version

0.3.0

Current Sprint

Inventory Module

Next Feature

Goods Receipt

---

# Development Workflow

ChatGPT

Architecture

↓

Claude

Implementation

↓

ChatGPT

Code Review

↓

Git Commit

---

# Project Goal

Deliver a production-ready Warehouse Management System for Jordans Lighting that can be deployed in daily warehouse operations.