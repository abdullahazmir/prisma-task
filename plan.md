# SCIC/EJP-13 Full-Stack Architecture & Implementation Plan (`plan.md`)

## 📌 Executive Summary
This document provides a comprehensive end-to-end blueprint for building a production-ready, scalable full-stack application. It features an **Express.js + TypeScript + Prisma ORM + PostgreSQL** backend paired with a high-performance **Next.js (App Router) + HeroUI + TypeScript** frontend designed for real-time CRUD operations, authentication, and a modern, responsive user experience.

---

## 🏗️ System Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND LAYER                                   │
│  - Next.js (App Router) + React 19 + TypeScript                             │
│  - UI Component Library: HeroUI (@heroui/react) + Tailwind CSS              │
│  - Animations & Icons: Framer Motion + Lucide React                         │
│  - Reactive State Management: AuthContext, CartContext, HeroUI Toast        │
│  - API Client: Centralized Axios Wrapper + Bearer Auth Interceptor          │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ HTTP / REST APIs (JSON)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND LAYER                                   │
│  - Express.js HTTP Server + TypeScript + Node.js                            │
│  - Security: JWT Auth, bcrypt password hashing, CORS, Helmet               │
│  - Modular Architecture: Routes -> Controllers -> Services -> Prisma ORM    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Prisma Client (SQL Query Builder)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                   │
│  - PostgreSQL (Supabase / NeonDB / Local PostgreSQL)                        │
│  - Prisma Schema: 6 Models, 3 Enums, Indexes, Soft Delete, Timestamps       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Directory Architecture

```
e:\Projects\prisma-task\
│
├── server/                              # Express.js REST API Backend
│   ├── prisma/
│   │   ├── schema.prisma                # Prisma Relational Schema & Enums
│   │   └── seed.ts                      # Initial Database Seeding Script
│   │
│   ├── src/
│   │   ├── app.ts                       # Express App Instance & Middlewares
│   │   ├── server.ts                    # HTTP Listener & Port Server Start
│   │   ├── lib/                         # Prisma Client Singleton
│   │   ├── utils/                       # Response formatters, AppError, JWT & bcrypt helpers
│   │   ├── middlewares/                 # authGuard, roleGuard, globalErrorHandler, notFoundHandler
│   │   ├── routes/                      # Modular Routers (/api/auth, /api/users, etc.)
│   │   ├── controllers/                 # Request & Response Handlers
│   │   └── services/                    # Business Logic & Database Invocation
│   │
│   ├── .env                             # Backend Environment Variables
│   ├── package.json
│   └── tsconfig.json
│
├── client/                              # Next.js App Router + HeroUI Frontend
│   ├── src/
│   │   ├── app/                         # Next.js App Router Pages & Layouts
│   │   │   ├── layout.tsx               # Root Layout with HeroUIProvider & Providers
│   │   │   ├── page.tsx                 # Landing / Hero Showcase Page
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx       # User Authentication Page
│   │   │   │   └── register/page.tsx    # User Registration Page
│   │   │   ├── (public)/
│   │   │   │   ├── products/page.tsx    # Catalog Page with HeroUI Filters & Pagination
│   │   │   │   └── products/[id]/page.tsx # Product Detail & Review Submission Page
│   │   │   ├── (user)/
│   │   │   │   ├── cart/page.tsx        # Cart & Checkout Page
│   │   │   │   └── orders/page.tsx      # User Order History Page
│   │   │   └── admin/
│   │   │       └── page.tsx             # HeroUI Tabbed Admin Dashboard
│   │   │
│   │   ├── components/                  # HeroUI Component Wrappers & UI Layouts
│   │   │   ├── Navbar.tsx               # HeroUI Navbar with User & Cart Dropdown
│   │   │   ├── Footer.tsx               # Application Footer
│   │   │   ├── ProductCard.tsx          # HeroUI Card for Products
│   │   │   ├── ReviewModal.tsx          # HeroUI Modal for Ratings
│   │   │   └── Admin/                   # Management Tables & Modals
│   │   │
│   │   ├── context/                     # Shared React Context Stores
│   │   │   ├── AuthContext.tsx          # Authentication & Session Token Store
│   │   │   └── CartContext.tsx          # Cart Items & Local Storage Synced Store
│   │   │
│   │   ├── providers/                   # Context & HeroUI Provider Wrappers
│   │   │   └── HeroUIProvider.tsx       # `@heroui/react` Provider Configuration
│   │   │
│   │   ├── services/                    # API Axios Client & Service Services
│   │   │   └── api.ts                   # Axios Instance with Request Interceptors
│   │   │
│   │   └── types/                       # Shared TypeScript Interfaces
│   │
│   ├── tailwind.config.ts               # HeroUI + Tailwind CSS Configuration
│   ├── package.json
│   └── tsconfig.json
│
├── plan.md
└── task.md
```

---

## 🗄️ Database Design & Prisma Schema (Backend)

### 1. Enums
- **`UserRole`**: `ADMIN`, `USER`
- **`OrderStatus`**: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- **`ProductStatus`**: `AVAILABLE`, `OUT_OF_STOCK`, `DISCONTINUED`

### 2. Entity Models & Relationships
- **`User` (`users`)**: Primary account record storing name, email (unique), hashed password, and role.
- **`Category` (`categories`)**: Product classification hierarchy with unique slug and description.
- **`Product` (`products`)**: Inventory item with price, stock level, status enum, and category foreign key.
- **`Review` (`reviews`)**: User rating (1 to 5) and comments associated with products.
- **`Order` (`orders`)**: Order header tracking total amount, customer reference, and status.
- **`OrderItem` (`order_items`)**: Line items linking specific products, quantities, and prices to an order.

### 3. Database Standards
- **Primary Keys**: UUID strings (`@default(uuid())`).
- **Timestamps**: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`.
- **Soft Delete**: `isDeleted Boolean @default(false)` across all operational models (`User`, `Category`, `Product`, `Review`, `Order`).
- **Table Mapping**: Explicit `@@map("table_name")` definitions.
- **Indexing**: `@@index([categoryId])`, `@@index([userId])`, `@@index([productId])`, `@@index([name])`.

---

## 🔌 Backend REST API Specification

### Standard API Response Format
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Route Table
| Module | Method | Endpoint | Access | Summary |
|---|---|---|---|---|
| Auth | `POST` | `/api/auth/register` | Public | Create new user account |
| Auth | `POST` | `/api/auth/login` | Public | Authenticate user & return JWT |
| Auth | `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile |
| Users | `GET` | `/api/users` | Admin | Get all users (paginated) |
| Users | `GET` | `/api/users/:id` | Authenticated | Get user profile by ID |
| Users | `PATCH` | `/api/users/:id` | Authenticated | Update user details |
| Users | `DELETE` | `/api/users/:id` | Admin | Soft delete user |
| Categories | `POST` | `/api/categories` | Admin | Create new category |
| Categories | `GET` | `/api/categories` | Public | Get all active categories |
| Categories | `GET` | `/api/categories/:id` | Public | Get category details |
| Categories | `PATCH` | `/api/categories/:id` | Admin | Update category details |
| Categories | `DELETE` | `/api/categories/:id` | Admin | Soft delete category |
| Products | `POST` | `/api/products` | Admin | Create product |
| Products | `GET` | `/api/products` | Public | Search, filter by category/status, pagination |
| Products | `GET` | `/api/products/:id` | Public | Get product details with reviews |
| Products | `PATCH` | `/api/products/:id` | Admin | Update product |
| Products | `DELETE` | `/api/products/:id` | Admin | Soft delete product |
| Reviews | `POST` | `/api/reviews` | Authenticated | Add product rating & review |
| Reviews | `GET` | `/api/reviews` | Public | Get reviews (optional `productId` filter) |
| Reviews | `GET` | `/api/reviews/:id` | Public | Get review by ID |
| Reviews | `PATCH` | `/api/reviews/:id` | Owner / Admin | Update review content |
| Reviews | `DELETE` | `/api/reviews/:id` | Owner / Admin | Soft delete review |
| Orders | `POST` | `/api/orders` | Authenticated | Place order with items |
| Orders | `GET` | `/api/orders` | Authenticated | Get customer orders / all orders (Admin) |
| Orders | `GET` | `/api/orders/:id` | Authenticated | Get order detail with order items |
| Orders | `PATCH` | `/api/orders/:id/status` | Admin | Update order status |
| Orders | `DELETE` | `/api/orders/:id` | Admin | Soft delete order |

---

## 🎨 Next.js + HeroUI Frontend Design & Components

### 1. Component Suite Integrations (`@heroui/react`)
- **`Navbar` & `Dropdown`**: Interactive top header with user avatar, role indicator, cart badge, and theme options.
- **`Card` & `Skeleton`**: Sleek, modern cards for products with smooth loading states during server query fetching.
- **`Modal` & `Form`**: Smooth animated modals for login/registration, review submissions, and admin create/edit dialogs.
- **`Table` & `Chip`**: Data table layouts in admin dashboard and user order history with status chips (`PENDING`, `SHIPPED`, `DELIVERED`).
- **`Select`, `Input`, & `Pagination`**: Rich filtering controls on the catalog page with instant reactive updates.
- **`Tabs`**: Admin control panel separating Product Management, Category Management, Order Processing, and User Control.

### 2. State & Token Persistence
- **Axios Interceptor**: Automatically reads JWT token from `localStorage` and attaches `Authorization: Bearer <token>`.
- **`AuthContext`**: Manages current user session, login status, user role checks, and logout cleanup.
- **`CartContext`**: Synchronizes cart items, quantity modifiers, and subtotal calculation with local storage and Checkout API.

---

## 🚀 Execution Roadmap & Completion Status

### Phase 1: Workspace & Setup (COMPLETED ✅)
- [x] Initialize `server/` (Express + TypeScript + Prisma) and `client/` (Next.js + HeroUI + Tailwind CSS).
- [x] Configure TypeScript `tsconfig.json`, `package.json`, environment variables, and folder structures.

### Phase 2: Backend Database & APIs (COMPLETED ✅)
- [x] Configure PostgreSQL database & 6 Prisma models (`User`, `Category`, `Product`, `Review`, `Order`, `OrderItem`) with 3 Enums.
- [x] Implement JWT Auth, `bcrypt` password hashing, custom `AppError`, and global error handling middlewares.
- [x] Implement REST API endpoints for Auth, Users, Categories, Products, Reviews, and Orders.
- [x] Build automated database seed script (`prisma/seed.ts`).

### Phase 3: Next.js + HeroUI Frontend Build (COMPLETED ✅)
- [x] Configure HeroUI provider & global dark theme glassmorphism design system.
- [x] Build layout components (`Navbar`, `Footer`, `AuthContext`, `CartContext`).
- [x] Build Auth pages (`/login`, `/register`).
- [x] Build Product Catalog & Detail pages with live search, category select, pagination, and review modals.
- [x] Build Cart & Order Checkout pages.
- [x] Build Admin Dashboard page with HeroUI `Tabs`, `Table`, and CRUD `Modal` dialogs.

### Phase 4: Verification & Delivery (COMPLETED ✅)
- [x] Test backend API compilation (`tsc --noEmit` in `server/`) - Passed (0 errors).
- [x] Test frontend compilation (`tsc --noEmit` in `client/`) - Passed (0 errors).
- [x] Verify complete end-to-end flow from registration to order placement and admin management.
- [x] Produce complete [API_DOCUMENTATION.md](file:///e:/Projects/prisma-task/API_DOCUMENTATION.md) and [README.md](file:///e:/Projects/prisma-task/README.md).

