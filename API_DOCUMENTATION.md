# SCIC/EJP-13 Backend REST API Documentation (`API_DOCUMENTATION.md`)

## 📌 Overview & Base URL
- **Base URL**: `http://localhost:5000/api`
- **Protocol**: HTTP / RESTful JSON
- **Authentication**: JWT Bearer Token (`Authorization: Bearer <token>`)

---

## 📐 Standard API Response Envelope

All API endpoints return predictable, structured JSON objects:

### Success Response (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "message": "Resource operating successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### Error Response (`400`, `401`, `403`, `404`, `500`)
```json
{
  "success": false,
  "message": "Error description or validation failure message"
}
```

---

## 🔐 1. Authentication Module (`/api/auth`)

### 1.1 User Registration
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "user@scic.com",
  "password": "user123"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully!",
  "data": {
    "user": {
      "id": "uuid-v4-string",
      "name": "John Doe",
      "email": "user@scic.com",
      "role": "USER",
      "createdAt": "2026-08-13T08:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
}
```

### 1.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "user@scic.com",
  "password": "user123"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "user": {
      "id": "uuid-v4-string",
      "name": "John Doe",
      "email": "user@scic.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1Ni..."
  }
}
```

### 1.3 Get Current Profile
- **Endpoint**: `GET /api/auth/me`
- **Access**: Protected (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "User profile retrieved successfully!",
  "data": {
    "id": "uuid-v4-string",
    "name": "John Doe",
    "email": "user@scic.com",
    "role": "USER"
  }
}
```

---

## 👥 2. User Module (`/api/users`)

### 2.1 Get All Users
- **Endpoint**: `GET /api/users?page=1&limit=10`
- **Access**: Admin Only (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Users retrieved successfully!",
  "data": [
    {
      "id": "uuid-string",
      "name": "John Doe",
      "email": "user@scic.com",
      "role": "USER",
      "createdAt": "2026-08-13T08:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 }
}
```

### 2.2 Soft Delete User
- **Endpoint**: `DELETE /api/users/:id`
- **Access**: Admin Only (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "User deleted successfully (soft delete)"
}
```

---

## 📂 3. Category Module (`/api/categories`)

### 3.1 Create Category
- **Endpoint**: `POST /api/categories`
- **Access**: Admin Only (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "Audio Gear",
  "description": "Headphones and speakers"
}
```

### 3.2 Get All Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Categories retrieved successfully!",
  "data": [
    {
      "id": "uuid-string",
      "name": "Audio Gear",
      "slug": "audio-gear",
      "description": "Headphones and speakers"
    }
  ]
}
```

---

## 📦 4. Product Module (`/api/products`)

### 4.1 Create Product
- **Endpoint**: `POST /api/products`
- **Access**: Admin Only (`Bearer <token>`)
- **Request Body**:
```json
{
  "name": "Pro Wireless Headphones",
  "description": "Noise cancelling headphones",
  "price": 199.99,
  "stock": 50,
  "status": "AVAILABLE",
  "categoryId": "category-uuid"
}
```

### 4.2 Get Products (Search, Filter, Paginate)
- **Endpoint**: `GET /api/products?search=Headphones&categoryId=uuid&page=1&limit=8`
- **Access**: Public
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Products retrieved successfully!",
  "data": [
    {
      "id": "product-uuid",
      "name": "Pro Wireless Headphones",
      "price": 199.99,
      "stock": 50,
      "status": "AVAILABLE",
      "category": { "name": "Audio Gear" },
      "averageRating": 4.8,
      "reviewCount": 12
    }
  ]
}
```

### 4.3 Soft Delete Product
- **Endpoint**: `DELETE /api/products/:id`
- **Access**: Admin Only (`Bearer <token>`)

---

## ⭐ 5. Review Module (`/api/reviews`)

### 5.1 Create Product Review
- **Endpoint**: `POST /api/reviews`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "productId": "product-uuid",
  "rating": 5,
  "comment": "Amazing sound quality!"
}
```

---

## 🛒 6. Order Module (`/api/orders`)

### 6.1 Create Order
- **Endpoint**: `POST /api/orders`
- **Access**: Protected (`Bearer <token>`)
- **Request Body**:
```json
{
  "items": [
    { "productId": "product-uuid-1", "quantity": 2 },
    { "productId": "product-uuid-2", "quantity": 1 }
  ]
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Order created successfully!",
  "data": {
    "id": "order-uuid",
    "totalAmount": 499.97,
    "status": "PENDING",
    "orderItems": [...]
  }
}
```

### 6.2 Update Order Status
- **Endpoint**: `PATCH /api/orders/:id/status`
- **Access**: Admin Only (`Bearer <token>`)
- **Request Body**:
```json
{
  "status": "DELIVERED"
}
```
