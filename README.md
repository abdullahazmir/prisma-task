# SCIC/EJP-13 Full-Stack E-Commerce Platform

A production-ready full-stack REST application built with **Express.js, TypeScript, Prisma ORM, and PostgreSQL** for the backend, and **Next.js (App Router), HeroUI (`@heroui/react`), TypeScript, and Tailwind CSS** for the frontend.

---

## 🛠️ Stack & Architecture

### Backend (`server/`)
- **Core**: Express.js & TypeScript
- **Database ORM**: Prisma ORM with PostgreSQL database
- **Security**: JWT authentication & `bcrypt` password hashing
- **Features**: Layered architecture (Routes, Controllers, Services), Soft Delete (`isDeleted`), Timestamps, Table Mapping (`@@map`), Global Error Handling, database seed script.

### Frontend (`client/`)
- **Core**: Next.js 14 (App Router) & TypeScript
- **UI Framework**: HeroUI (`@heroui/react`) & Tailwind CSS
- **Icons & Motion**: Lucide React & Framer Motion
- **State Management**: `AuthContext` (token persistence) & `CartContext` (local storage sync)

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (Local, Supabase, or NeonDB)

### 2. Backend Setup (`server/`)
```bash
# Navigate into backend
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and set your DATABASE_URL and JWT_SECRET
cp .env.example .env

# Run Prisma Database Migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# Seed initial database records (Admin, User, Categories, Products)
npx ts-node prisma/seed.ts

# Start Express server in development mode
npm run dev
```
Backend will start listening on `http://localhost:5000`.

---

### 3. Frontend Setup (`client/`)
```bash
# Navigate into frontend
cd client

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Frontend application will be accessible at `http://localhost:3000`.

---

## 🔑 Default Credentials (Populated by Seed Script)

| Account | Email | Password | Role |
|---|---|---|---|
| **Admin** | `admin@scic.com` | `admin123` | `ADMIN` |
| **User** | `user@scic.com` | `user123` | `USER` |

---

## 📖 API Documentation
For comprehensive details on endpoints, request schemas, authorization headers, and sample responses, see [API_DOCUMENTATION.md](file:///e:/Projects/prisma-task/API_DOCUMENTATION.md).
