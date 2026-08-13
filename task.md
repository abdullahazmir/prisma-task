# SCIC/EJP-13 Full-Stack Execution Task List (`task.md`)

## 📋 Overview
This task list tracks the complete implementation of a production-ready, full-stack application featuring:
- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL, JWT Auth, bcrypt, CORS, dotenv.
- **Frontend**: Next.js (App Router), HeroUI (`@heroui/react`), TypeScript, Tailwind CSS, Framer Motion, Axios / Fetch API client.

---

## 🚩 Phase 1: Workspace & Project Initialization
- [x] **1.1 Directory Structure Setup**
  - [x] Initialize root workspace directory (`e:\Projects\prisma-task`)
  - [x] Setup `server/` directory for Express backend
  - [x] Setup `client/` directory for Next.js + HeroUI frontend
- [x] **1.2 Backend Initialization (`server/`)**
  - [x] Initialize Node.js project (`server/package.json`)
  - [x] Configure `server/tsconfig.json` (strict TypeScript execution)
  - [x] Install production dependencies: `express`, `cors`, `dotenv`, `bcrypt`, `jsonwebtoken`, `@prisma/client`, `zod`
  - [x] Install dev dependencies: `typescript`, `ts-node-dev`, `@types/express`, `@types/cors`, `@types/bcrypt`, `@types/jsonwebtoken`, `@types/node`, `prisma`
  - [x] Create `server/.env` and `server/.env.example` (`PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`)
  - [x] Setup folder architecture: `src/app.ts`, `src/server.ts`, `src/routes/`, `src/controllers/`, `src/services/`, `src/middlewares/`, `src/lib/`, `src/utils/`
- [x] **1.3 Frontend Initialization (`client/`)**
  - [x] Create Next.js project structure with App Router and TypeScript
  - [x] Install HeroUI & dependencies: `@heroui/react`, `framer-motion`, `lucide-react`, `axios`
  - [x] Configure HeroUI plugin & dark theme in `client/tailwind.config.ts`
  - [x] Setup HeroUI Provider (`client/src/providers/HeroUIProvider.tsx`) inside root `layout.tsx`

---

## 🗄️ Phase 2: Database Schema & Prisma Configuration
- [x] **2.1 Initialize Prisma (`server/prisma`)**
  - [x] Run `npx prisma init` in `server/`
  - [x] Set datasource provider to `postgresql` in `server/prisma/schema.prisma`
- [x] **2.2 Design Data Models & Enums**
  - [x] **Enums**:
    - [x] `UserRole`: `ADMIN`, `USER`
    - [x] `OrderStatus`: `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`
    - [x] `ProductStatus`: `AVAILABLE`, `OUT_OF_STOCK`, `DISCONTINUED`
  - [x] **Model 1: User (`users` table with `@@map("users")`)**
    - `id` (UUID), `name`, `email` (unique), `password`, `role` (Enum), `isDeleted` (Boolean), `createdAt`, `updatedAt`
  - [x] **Model 2: Category (`categories` table with `@@map("categories")`)**
    - `id`, `name`, `slug` (unique), `description`, `isDeleted`, `createdAt`, `updatedAt`
  - [x] **Model 3: Product (`products` table with `@@map("products")`)**
    - `id`, `name`, `description`, `price` (Float), `stock` (Int), `status` (Enum), `categoryId`, `isDeleted`, `createdAt`, `updatedAt`
    - Indexes: `@@index([categoryId])`, `@@index([name])`
  - [x] **Model 4: Review (`reviews` table with `@@map("reviews")`)**
    - `id`, `rating` (Int), `comment`, `userId`, `productId`, `isDeleted`, `createdAt`, `updatedAt`
    - Indexes: `@@index([userId])`, `@@index([productId])`
  - [x] **Model 5: Order (`orders` table with `@@map("orders")`)**
    - `id`, `userId`, `totalAmount`, `status` (Enum), `isDeleted`, `createdAt`, `updatedAt`
  - [x] **Model 6: OrderItem (`order_items` table with `@@map("order_items")`)**
    - `id`, `orderId`, `productId`, `quantity`, `price`, `createdAt`, `updatedAt`
- [x] **2.3 Migrations & Seed Setup**
  - [x] Configure schema and models
  - [x] Build seed script (`server/prisma/seed.ts`) for admin user, categories, products, and reviews

---

## 🔐 Phase 3: Backend Core Architecture & Security Layer
- [x] **3.1 Response & Error Handling Utilities**
  - [x] Implement `sendResponse<T>` helper (`{ success, message, data, meta }`)
  - [x] Implement Custom `AppError` class
  - [x] Implement `globalErrorHandler.ts` middleware
  - [x] Implement `notFoundHandler.ts` middleware
- [x] **3.2 Security & Authentication Middlewares**
  - [x] Password hashing & comparison utilities (`bcrypt`)
  - [x] JWT sign & verification utilities (`jsonwebtoken`)
  - [x] `authGuard.ts` middleware (JWT validation & user context binding)
  - [x] `roleGuard.ts` middleware (Role-Based Access Control)

---

## 🚀 Phase 4: Express REST API Modules (`server/`)
- [x] **4.1 Auth Module (`/api/auth`)**
  - [x] `POST /api/auth/register` - User registration
  - [x] `POST /api/auth/login` - User authentication & JWT issuance
  - [x] `GET /api/auth/me` - Fetch profile of logged-in user
- [x] **4.2 User Module (`/api/users`)**
  - [x] `GET /api/users` - Get all users (Admin only, paginated)
  - [x] `GET /api/users/:id` - Get user profile by ID
  - [x] `PATCH /api/users/:id` - Update user details
  - [x] `DELETE /api/users/:id` - Soft delete user (`isDeleted: true`)
- [x] **4.3 Category Module (`/api/categories`)**
  - [x] `POST /api/categories` - Create new category (Admin)
  - [x] `GET /api/categories` - Get all categories
  - [x] `GET /api/categories/:id` - Get category by ID
  - [x] `PATCH /api/categories/:id` - Update category (Admin)
  - [x] `DELETE /api/categories/:id` - Soft delete category (Admin)
- [x] **4.4 Product Module (`/api/products`)**
  - [x] `POST /api/products` - Create product (Admin)
  - [x] `GET /api/products` - Get products (Search, category/status filter, pagination, sorting)
  - [x] `GET /api/products/:id` - Get product details with reviews & category
  - [x] `PATCH /api/products/:id` - Update product details (Admin)
  - [x] `DELETE /api/products/:id` - Soft delete product (Admin)
- [x] **4.5 Review Module (`/api/reviews`)**
  - [x] `POST /api/reviews` - Add review for product (Authenticated user)
  - [x] `GET /api/reviews` - Get all reviews
  - [x] `GET /api/reviews/:id` - Get review by ID
  - [x] `PATCH /api/reviews/:id` - Update review (Owner/Admin)
  - [x] `DELETE /api/reviews/:id` - Soft delete review (Owner/Admin)
- [x] **4.6 Order Module (`/api/orders`)**
  - [x] `POST /api/orders` - Create order with order items (Authenticated user)
  - [x] `GET /api/orders` - Get customer orders / all orders (Admin)
  - [x] `GET /api/orders/:id` - Get order details with items
  - [x] `PATCH /api/orders/:id/status` - Update order status (Admin)
  - [x] `DELETE /api/orders/:id` - Soft delete order (Admin)

---

## 🎨 Phase 5: Next.js + HeroUI Frontend Development (`client/`)
- [x] **5.1 Layout & Navigation Components**
  - [x] HeroUI `Navbar` (`client/src/components/Navbar.tsx`) with Brand Logo, Navigation Links, Cart Badge (`Badge`), User Avatar Dropdown (`Dropdown`), and Theme Switcher
  - [x] Footer & Notification Toast system (`client/src/components/Footer.tsx`)
- [x] **5.2 API Services & State Providers**
  - [x] Centralized API Client (`client/src/services/api.ts`) with automatic Authorization token interceptor
  - [x] `AuthContext` (`client/src/context/AuthContext.tsx`) for session, user roles, login, and logout state
  - [x] `CartContext` (`client/src/context/CartContext.tsx`) for cart state synchronized with local storage
- [x] **5.3 Authentication Pages**
  - [x] Login Page (`app/(auth)/login/page.tsx`): Built with HeroUI `Card`, `Input`, `Button`, and form validation
  - [x] Register Page (`app/(auth)/register/page.tsx`): Account creation form with HeroUI components
- [x] **5.4 Product Catalog & Detail Pages**
  - [x] Catalog Page (`app/(public)/products/page.tsx`): Built with HeroUI `Card`, `Skeleton` loading states, `Input` (search), `Select` (category filter), `Chip` (status badges), and `Pagination`
  - [x] Product Detail Page (`app/(public)/products/[id]/page.tsx`): HeroUI `Card`, price display, stock status, reviews list, and HeroUI `Modal` for posting reviews
- [x] **5.5 Shopping Cart & Checkout**
  - [x] Cart Page (`app/(user)/cart/page.tsx`): HeroUI `Table`, item quantity adjusters, subtotal summary, and Checkout Modal submitting to `POST /api/orders`
- [x] **5.6 User Dashboard & Order Tracking**
  - [x] User Orders Page (`app/(user)/orders/page.tsx`): HeroUI `Table`, `Chip` status badges (`PENDING`, `DELIVERED`, etc.), and order items breakdown modal
- [x] **5.7 Admin Dashboard**
  - [x] Admin Page (`app/admin/page.tsx`): HeroUI `Tabs` for managing Categories, Products, Orders, and Users with real-time HeroUI `Modal` forms for Create & Edit actions

---

## 🧪 Phase 6: Verification, Seeding & Documentation
- [x] **6.1 Seeding & Compile Checks**
  - [x] Build seed script in backend (`server/prisma/seed.ts`)
  - [x] Check backend compilation (`server/tsconfig.json`)
- [x] **6.2 Final Deliverables**
  - [x] Complete API Documentation ([API_DOCUMENTATION.md](file:///e:/Projects/prisma-task/API_DOCUMENTATION.md))
  - [x] Comprehensive Project Setup Guide ([README.md](file:///e:/Projects/prisma-task/README.md))
