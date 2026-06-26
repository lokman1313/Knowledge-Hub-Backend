# 📚 Knowledge Hub Backend API

![Node.js](https://img.shields.io/badge/Node.js-Backend-green?logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-Framework-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)
![Stripe](https://img.shields.io/badge/Stripe-Payment-635BFF?logo=stripe)

## 🌐 Live API

**Backend API:** https://knowledge-hub-backend-pi.vercel.app

**Frontend:** https://knowledge-hub-navy.vercel.app

---

# 📖 Overview

Knowledge Hub Backend is a RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. It powers the Knowledge Hub Online Book Delivery Management System by handling authentication, authorization, book management, payment processing, delivery management, reviews, and admin operations.

The backend follows secure development practices using JWT authentication, environment variables, protected routes, and MongoDB Atlas.

---

# 🚀 Features

## 🔐 Authentication

- JWT Authentication
- HTTP Only Cookie Authentication
- Protected Routes
- Role Based Authorization
- Better Auth Integration

---

## 👤 User APIs

- User Registration
- User Login
- Get User Profile
- Update User Information
- Role Verification

---

## 📚 Book Management

- Add New Book
- Update Book
- Delete Book
- Get All Books
- Get Single Book
- Featured Books
- Publish / Unpublish Books
- Pending Approval Books

---

## 🚚 Delivery Management

- Request Book Delivery
- Delivery History
- Update Delivery Status
- Pending Deliveries
- Delivered Books

---

## ⭐ Review System

- Add Review
- Update Review
- Delete Review
- Get Book Reviews
- Verified Review Validation

---

## 💳 Stripe Payment

- Create Checkout Session
- Store Transaction
- Payment Verification
- Delivery Fee Processing

---

## 👨‍💼 Admin APIs

- Manage Users
- Change User Role
- Delete Users
- Approve Books
- Delete Books
- Platform Analytics
- Transaction Management

---

# 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT
- Better Auth
- Stripe
- Cookie Parser
- Dotenv
- CORS
- Multer
- ImgBB API

---

# 📂 Folder Structure

```
backend
│
├── middleware
├── routes
├── utils
├── config
├── vercel.json
├── index.js
└── package.json
```

---

# 🔑 Environment Variables

Create a `.env` file and add the following:

```env
PORT=5000

MONGODB_URI=your_mongodb_uri

JWT_SECRET=your_jwt_secret

BETTER_AUTH_SECRET=your_better_auth_secret

STRIPE_SECRET_KEY=your_stripe_secret_key

IMGBB_API_KEY=your_imgbb_api_key

CLIENT_URL=http://localhost:3000
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/knowledge-hub-backend.git
```

Move into the project

```bash
cd knowledge-hub-backend
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Production

```bash
npm start
```

---

# 📡 API Modules

- Authentication
- Users
- Books
- Categories
- Payments
- Deliveries
- Reviews
- Dashboard Statistics
- Transactions
- Admin

---

# 🔒 Security Features

- JWT Authentication
- Role Based Authorization
- Protected API Routes
- Secure Environment Variables
- MongoDB Atlas Security
- CORS Configuration
- HTTP Only Cookies
- Input Validation

---

# 📦 Main Dependencies

```json
express
mongodb
jsonwebtoken
cookie-parser
cors
dotenv
stripe
bcrypt
multer
better-auth
```

---

# 📈 Future Improvements

- Rate Limiting
- API Documentation (Swagger)
- Email Notifications
- Redis Caching
- Request Logging
- Unit Testing
- API Versioning

---

# 👨‍💻 Developer

**Lokman Hossen**

---

# 🔗 Related Links

**Frontend Repository**
> https://github.com/yourusername/knowledge-hub-client

**Backend Repository**
> https://github.com/yourusername/knowledge-hub-backend

**Live Frontend**
> https://knowledge-hub-navy.vercel.app

**Live Backend**
> https://knowledge-hub-backend-pi.vercel.app

---

## ⭐ If you found this project helpful, consider giving it a Star!
