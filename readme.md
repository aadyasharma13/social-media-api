<div align="center">

# 🚀 Social Media API

### A Production-Ready RESTful API for Social Networking

[![Node.js](https://img.shields.io/badge/Node.js-v14+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<p align="center">
  <strong>A fully-featured social media backend with real-time notifications, JWT authentication, and comprehensive API coverage.</strong>
</p>

[Getting Started](#-quick-start) •
[API Docs](#-api-documentation) •
[Architecture](#-architecture-deep-dive) •
[Testing](#-testing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Deep Dive](#-architecture-deep-dive)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication & Security](#-authentication--security)
- [Real-time Notifications](#-real-time-notifications)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🌟 Overview

This Social Media API is a **production-ready backend** that powers a complete social networking platform. Built with modern technologies and best practices, it handles everything from user authentication to real-time push notifications.

### What Can You Build With This?

- 📱 **Mobile Apps** (iOS/Android) with React Native, Flutter, or native development
- 🌐 **Web Applications** with React, Vue, Angular, or any frontend framework
- 🖥️ **Desktop Apps** with Electron
- 🤖 **Chatbots and Integrations** via the REST API

### Key Metrics

| Metric | Value |
|--------|-------|
| **API Endpoints** | 17 RESTful endpoints |
| **Test Coverage** | 49 automated assertions (100% pass rate) |
| **Avg Response Time** | ~130ms |
| **Database Models** | 6 interconnected schemas |

---

## ✨ Features

### 👤 User Management
| Feature | Description |
|---------|-------------|
| **Registration** | Create accounts with email, username, password |
| **Authentication** | JWT-based login with secure token management |
| **Profile Management** | Update bio, avatar, location, website, date of birth |
| **Role-Based Access** | User and Admin roles with protected routes |

### 📝 Posts & Content
| Feature | Description |
|---------|-------------|
| **CRUD Operations** | Create, read, update, delete posts |
| **Image Support** | Attach image URLs to posts |
| **Author Attribution** | Posts linked to user profiles |
| **Pagination** | Efficient loading with limit/offset |

### 💬 Social Interactions
| Feature | Description |
|---------|-------------|
| **Comments** | Comment on any post with automatic count tracking |
| **Likes** | Like/unlike posts with real-time count updates |
| **Follow System** | Follow/unfollow users to build your network |
| **Feed** | Personalized timeline of posts from followed users |

### 🔔 Notifications
| Feature | Description |
|---------|-------------|
| **Real-time Push** | Instant notifications via Socket.IO |
| **Notification Types** | Follows, likes, and comments |
| **Read Status** | Mark notifications as read |
| **Persistence** | All notifications stored in database |

### 🛡️ Security
| Feature | Description |
|---------|-------------|
| **Password Hashing** | bcrypt with 10 salt rounds |
| **JWT Tokens** | Secure, signed authentication tokens |
| **Helmet.js** | HTTP security headers |
| **CORS** | Configurable cross-origin resource sharing |
| **Input Validation** | express-validator on all inputs |

---

## 🛠 Tech Stack

### Core Technologies

```
┌─────────────────────────────────────────────────────────────────┐
│                        SOCIAL MEDIA API                         │
├─────────────────────────────────────────────────────────────────┤
│  Runtime        │  Node.js (v14+)                               │
│  Language       │  TypeScript 5.4                               │
│  Framework      │  Express.js 4.18                              │
│  Database       │  MongoDB with Mongoose 5.9 ODM                │
│  Real-time      │  Socket.IO 4.8                                │
│  Auth           │  JWT (jsonwebtoken + express-jwt)             │
└─────────────────────────────────────────────────────────────────┘
```

### Complete Dependency List

#### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 4.18.3 | Web framework |
| `mongoose` | 5.9.23 | MongoDB ODM |
| `socket.io` | 4.8.1 | Real-time communication |
| `jsonwebtoken` | 8.5.1 | JWT generation/verification |
| `express-jwt` | 6.1.1 | JWT middleware |
| `bcrypt` | 6.0.0 | Password hashing |
| `express-validator` | 7.3.0 | Input validation |
| `helmet` | 3.23.3 | Security headers |
| `cors` | 2.8.5 | CORS handling |
| `winston` | 3.3.3 | Logging |
| `dotenv` | 16.4.5 | Environment variables |
| `passport` | 0.4.1 | Authentication strategies |

#### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | 5.4.2 | TypeScript compiler |
| `ts-node` | 10.9.2 | TypeScript execution |
| `nodemon` | 2.0.4 | Auto-reload on changes |
| `newman` | 3.8.2 | Postman CLI runner |
| `supertest` | 6.3.4 | HTTP testing |

---

## 🏗 Architecture Deep Dive

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                │
│         (React, Vue, Angular, Mobile Apps, Postman, etc.)                │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │         HTTP / WebSocket      │
                    └───────────────┬───────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                           EXPRESS.JS SERVER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Helmet    │  │    CORS     │  │Body Parser  │  │  Logging    │     │
│  │  (Security) │  │  (Headers)  │  │   (JSON)    │  │  (Winston)  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                            ROUTING LAYER                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  /users  │ │  /posts  │ │  /feed   │ │/profiles │ │/notific- │       │
│  │          │ │          │ │          │ │          │ │  ations  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                          MIDDLEWARE LAYER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │  Authentication │  │   Validation    │  │  Authorization  │          │
│  │  (JWT Verify)   │  │(express-valid.) │  │ (Role Check)    │          │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘          │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                         CONTROLLER LAYER                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐            │
│  │   User     │ │   Post     │ │  Comment   │ │Notification│            │
│  │ Controller │ │ Controller │ │ Controller │ │ Controller │            │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘            │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                          SERVICE LAYER                                   │
│  ┌────────────────────────┐  ┌────────────────────────┐                 │
│  │    User Service        │  │  Notification Service  │                 │
│  │  (Business Logic)      │  │   (Event Handling)     │                 │
│  └────────────────────────┘  └────────────────────────┘                 │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                           MODEL LAYER                                    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│  │  User  │ │  Post  │ │Comment │ │  Like  │ │ Follow │ │Notific.│     │
│  │ Model  │ │ Model  │ │ Model  │ │ Model  │ │ Model  │ │ Model  │     │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘     │
└───────────────────────────────────┬──────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼──────────────────────────────────────┐
│                           MONGODB DATABASE                               │
│                     (MongoDB Atlas / Local Instance)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

### Request Flow Example

Here's how a typical authenticated request flows through the system:

```
1. Client sends POST /api/posts with JWT token
                    │
                    ▼
2. Express receives request
   ├── Helmet adds security headers
   ├── CORS validates origin
   └── Body-parser extracts JSON
                    │
                    ▼
3. Router matches /api/posts → posts-routes.ts
                    │
                    ▼
4. Middleware chain executes:
   ├── authentication.required → Validates JWT
   ├── validation.createPost → Validates body
   └── Attaches req.payload with user ID
                    │
                    ▼
5. PostController.createPost() handles request
   ├── Extracts data from req.body
   ├── Creates Post document
   └── Returns success response
                    │
                    ▼
6. Response sent: { success: true, data: { post: {...} } }
```

### Design Patterns Used

| Pattern | Implementation |
|---------|----------------|
| **MVC** | Models, Controllers, Routes separation |
| **Repository** | Mongoose models abstract database access |
| **Middleware** | Express middleware chain for cross-cutting concerns |
| **Decorator** | Custom `@BroadcastNotification` for real-time events |
| **Factory** | Response utility functions (`sendSuccess`, `sendError`) |
| **Singleton** | Database connection, Socket.IO instance |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js** v14 or higher ([Download](https://nodejs.org/))
- ✅ **npm** (comes with Node.js)
- ✅ **MongoDB** - Choose one:
  - 🐳 Docker (recommended) - [Download Docker](https://www.docker.com/)
  - 🌐 MongoDB Atlas (cloud) - [Free tier](https://www.mongodb.com/cloud/atlas)
  - 💻 Local MongoDB - [Installation guide](https://docs.mongodb.com/manual/installation/)

### Installation Steps

#### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/aadyasharma13/social-media-api.git
cd social-media-api

# Install dependencies
npm install
```

#### Step 2: Configure Environment

```bash
# Create environment file
cp .env.example .env

# Or create manually with these required values:
cat > .env << 'EOF'
# Application
APP_ENV=dev
APP_PORT=3000

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-me
SESSION_SECRET=your-session-secret-change-me

# Database - Option A: Local/Docker MongoDB
DB_HOST=localhost
DB_PORT=27017
DB_NAME=social_media_api
DB_USER=
DB_USER_PWD=

# Database - Option B: MongoDB Atlas (uncomment and fill)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Logging
LOG_DIRECTORY=logs
EOF
```

#### Step 3: Start MongoDB

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Using MongoDB Atlas**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `MONGODB_URI` in `.env`

**Option C: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Step 4: Build & Run

```bash
# Compile TypeScript
npx tsc

# Start the server
node build/server.js
```

#### Step 5: Verify Installation

```bash
# Test the API
curl http://localhost:3000/api/posts

# Expected response:
# {"success":true,"data":{"posts":[],"pagination":{"total":0,"limit":20,"offset":0,"hasMore":false}}}
```

🎉 **Congratulations! Your API is running!**

---

## ⚙️ Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|:--------:|
| `APP_ENV` | Environment (`dev`, `prod`, `test`) | `dev` | No |
| `APP_PORT` | Server port | `3000` | No |
| `JWT_SECRET` | Secret key for JWT signing | - | ⚠️ **Yes** |
| `SESSION_SECRET` | Secret for session encryption | - | ⚠️ **Yes** |
| `DB_HOST` | MongoDB host | `localhost` | No |
| `DB_PORT` | MongoDB port | `27017` | No |
| `DB_NAME` | Database name | `social_media_api` | No |
| `DB_USER` | MongoDB username | - | For auth |
| `DB_USER_PWD` | MongoDB password | - | For auth |
| `MONGODB_URI` | Full MongoDB URI (overrides above) | - | No |
| `LOG_DIRECTORY` | Directory for log files | `logs` | No |

### Security Configuration

⚠️ **Important for Production:**

```bash
# Generate secure secrets
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use the output for JWT_SECRET and SESSION_SECRET
```

---

## 🏃 Running the Project

### Development Mode

```bash
# Option 1: Using npm scripts (requires concurrently)
npm run start

# Option 2: Manual build and run
npx tsc && node build/server.js

# Option 3: With auto-reload (recommended for development)
npx tsc && npx nodemon build/server.js
```

### Production Mode

```bash
# Build for production
npm run build

# Start server
npm run serve

# Or with PM2 for process management
pm2 start build/server.js --name "social-api"
```

### Available NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm start` | `npm run build && npm run watch` | Full development mode |
| `npm run build` | `tsc` | Compile TypeScript |
| `npm run serve` | `node build/server.js` | Run compiled server |
| `npm test` | `ts-node ./tests/smoke.test.ts` | Run smoke tests |
| `npm run build-ts` | `tsc` | TypeScript compilation only |

### Server Startup Output

When the server starts successfully, you'll see:

```
server running on port : 3000
Mongoose connection done
```

---

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Header

Most endpoints require authentication. Include the JWT token:

```
Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** The format is `Token <jwt>`, not `Bearer <jwt>`

### Response Format

All API responses follow this consistent structure:

**✅ Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**❌ Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": { "field": "Specific error" }
}
```

---

### 🔐 Authentication Endpoints

#### Register New User
```http
POST /api/users
```

**Request Body:**
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "john@example.com",
      "username": "johndoe",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "bio": "",
      "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
      "role": "user"
    }
  },
  "message": "User registered successfully"
}
```

---

#### Login
```http
POST /api/users/login
```

**Request Body:**
```json
{
  "user": {
    "email": "john@example.com",
    "password": "securePassword123"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "john@example.com",
      "username": "johndoe",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "bio": "Software developer",
      "image": "https://example.com/avatar.jpg"
    }
  }
}
```

---

#### Get Current User
```http
GET /api/user
Authorization: Token <jwt>
```

---

#### Update Current User
```http
PUT /api/user
Authorization: Token <jwt>
```

**Request Body (all fields optional):**
```json
{
  "user": {
    "email": "newemail@example.com",
    "username": "newusername",
    "password": "newPassword123",
    "bio": "Updated bio text",
    "image": "https://example.com/new-avatar.jpg"
  }
}
```

---

### 📝 Post Endpoints

#### Create Post
```http
POST /api/posts
Authorization: Token <jwt>
```

**Request Body:**
```json
{
  "post": {
    "content": "My first post! Hello world 🌍",
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "post": {
      "_id": "507f1f77bcf86cd799439011",
      "content": "My first post! Hello world 🌍",
      "imageUrl": "https://example.com/image.jpg",
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "author": {
        "username": "johndoe",
        "bio": "Software developer",
        "image": "https://example.com/avatar.jpg",
        "following": false
      }
    }
  }
}
```

---

#### Get All Posts
```http
GET /api/posts?limit=20&offset=0&author=johndoe
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 20 | Posts per page (max 100) |
| `offset` | number | 0 | Number of posts to skip |
| `author` | string | - | Filter by username |

---

#### Get Single Post
```http
GET /api/posts/:postId
```

---

#### Update Post
```http
PUT /api/posts/:postId
Authorization: Token <jwt>
```

> Only the post author can update their post.

---

#### Delete Post
```http
DELETE /api/posts/:postId
Authorization: Token <jwt>
```

> Only the post author or an admin can delete a post.

---

#### Like Post
```http
POST /api/posts/:postId/like
Authorization: Token <jwt>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 42
  },
  "message": "Post liked successfully"
}
```

---

#### Unlike Post
```http
DELETE /api/posts/:postId/unlike
Authorization: Token <jwt>
```

---

### 💬 Comment Endpoints

#### Create Comment
```http
POST /api/posts/:postId/comments
Authorization: Token <jwt>
```

**Request Body:**
```json
{
  "comment": {
    "content": "Great post! Thanks for sharing."
  }
}
```

---

#### Get Comments for Post
```http
GET /api/posts/:postId/comments?limit=20&offset=0
```

---

#### Delete Comment
```http
DELETE /api/comments/:commentId
Authorization: Token <jwt>
```

> Only the comment author or an admin can delete a comment.

---

### 📰 Feed Endpoint

#### Get Personalized Feed
```http
GET /api/feed?limit=20&offset=0
Authorization: Token <jwt>
```

Returns posts from users you follow, sorted by newest first.

---

### 👤 Profile Endpoints

#### Get User Profile
```http
GET /api/profiles/:username
Authorization: Token <jwt> (optional)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "johndoe",
      "bio": "Software developer from NYC",
      "image": "https://example.com/avatar.jpg",
      "following": false
    }
  }
}
```

---

### 🔔 Notification Endpoints

#### Get Notifications
```http
GET /api/notifications?limit=20&offset=0&unreadOnly=false
Authorization: Token <jwt>
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | number | 20 | Notifications per page |
| `offset` | number | 0 | Skip count |
| `unreadOnly` | boolean | false | Filter unread only |

---

#### Mark Notification as Read
```http
PATCH /api/notifications/:id/read
Authorization: Token <jwt>
```

---

### 📊 Complete API Reference Table

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/users` | ❌ | Register new user |
| `POST` | `/users/login` | ❌ | Login |
| `GET` | `/user` | ✅ | Get current user |
| `PUT` | `/user` | ✅ | Update current user |
| `GET` | `/posts` | ❌ | List all posts |
| `POST` | `/posts` | ✅ | Create post |
| `GET` | `/posts/:id` | ❌ | Get single post |
| `PUT` | `/posts/:id` | ✅ | Update post |
| `DELETE` | `/posts/:id` | ✅ | Delete post |
| `POST` | `/posts/:id/like` | ✅ | Like post |
| `DELETE` | `/posts/:id/unlike` | ✅ | Unlike post |
| `GET` | `/posts/:id/comments` | ❌ | Get comments |
| `POST` | `/posts/:id/comments` | ✅ | Add comment |
| `DELETE` | `/comments/:id` | ✅ | Delete comment |
| `GET` | `/feed` | ✅ | Get personalized feed |
| `GET` | `/profiles/:username` | ❌ | Get user profile |
| `GET` | `/notifications` | ✅ | Get notifications |
| `PATCH` | `/notifications/:id/read` | ✅ | Mark as read |

---

## 🗄 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    USER     │       │    POST     │       │   COMMENT   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ _id         │◄──────│ author      │   ┌──►│ _id         │
│ email       │       │ _id         │◄──┼───│ post        │
│ username    │       │ content     │   │   │ user        │──────┐
│ hash        │       │ imageUrl    │   │   │ content     │      │
│ bio         │       │ likesCount  │   │   │ createdAt   │      │
│ image       │       │ commentsCount   │   └─────────────┘      │
│ role        │       │ comments[]  │───┘                        │
│ createdAt   │       │ createdAt   │                            │
└─────────────┘       └─────────────┘                            │
       │                    │                                    │
       │                    │                                    │
       ▼                    ▼                                    │
┌─────────────┐       ┌─────────────┐                            │
│   FOLLOW    │       │    LIKE     │                            │
├─────────────┤       ├─────────────┤                            │
│ _id         │       │ _id         │                            │
│ follower    │───────│ user        │◄───────────────────────────┘
│ following   │       │ post        │
│ createdAt   │       │ createdAt   │
└─────────────┘       └─────────────┘

┌─────────────────┐
│  NOTIFICATION   │
├─────────────────┤
│ _id             │
│ user (receiver) │
│ sender          │
│ type            │
│ post (optional) │
│ isRead          │
│ createdAt       │
└─────────────────┘
```

### Model Schemas

#### User Schema
```typescript
{
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  hash: { type: String },  // Hashed password
  bio: { type: String, default: '' },
  image: { type: String },
  avatarUrl: { type: String },
  location: { type: String },
  website: { type: String },
  dob: { type: Date },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

#### Post Schema
```typescript
{
  content: { type: String, required: true, maxLength: 5000 },
  imageUrl: { type: String, default: null },
  author: { type: ObjectId, ref: 'User', required: true },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  comments: [{ type: ObjectId, ref: 'Comment' }],
  createdAt: { type: Date },
  updatedAt: { type: Date }
}
```

#### Comment Schema
```typescript
{
  post: { type: ObjectId, ref: 'Post', required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxLength: 1000 },
  createdAt: { type: Date }
}
// Hooks: Auto-increment/decrement post.commentsCount
```

#### Like Schema
```typescript
{
  user: { type: ObjectId, ref: 'User', required: true },
  post: { type: ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date }
}
// Index: Unique compound (user, post) - prevents duplicate likes
```

#### Follow Schema
```typescript
{
  follower: { type: ObjectId, ref: 'User', required: true },
  following: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date }
}
// Index: Unique compound (follower, following)
// Validation: Cannot follow yourself
```

#### Notification Schema
```typescript
{
  user: { type: ObjectId, ref: 'User', required: true },     // Recipient
  type: { type: String, enum: ['follow', 'like', 'comment'], required: true },
  sender: { type: ObjectId, ref: 'User', required: true },   // Who triggered
  post: { type: ObjectId, ref: 'Post' },  // Null for follow notifications
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date }
}
// Index: (user, isRead, createdAt) for efficient queries
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

```
┌──────────┐     1. POST /users/login      ┌──────────┐
│  Client  │ ────────────────────────────► │  Server  │
│          │     { email, password }       │          │
│          │                               │          │
│          │     2. Validate credentials   │          │
│          │     3. Generate JWT           │          │
│          │                               │          │
│          │ ◄──────────────────────────── │          │
│          │     { user: { token: "..." }} │          │
│          │                               │          │
│          │     4. Include token in       │          │
│          │     Authorization header      │          │
│          │                               │          │
│          │ ────────────────────────────► │          │
│          │     Authorization: Token xxx  │          │
│          │                               │          │
│          │     5. Verify JWT             │          │
│          │     6. Process request        │          │
└──────────┘                               └──────────┘
```

### Password Security

- **Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Storage:** Only hashed passwords stored (never plaintext)

```javascript
// Password hashing (internal)
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);

// Password verification (internal)
const isValid = await bcrypt.compare(password, user.hash);
```

### Security Headers (Helmet.js)

| Header | Protection |
|--------|------------|
| `X-Content-Type-Options` | Prevents MIME sniffing |
| `X-Frame-Options` | Prevents clickjacking |
| `X-XSS-Protection` | XSS filter |
| `Strict-Transport-Security` | Enforces HTTPS |
| `Content-Security-Policy` | Controls resource loading |

---

## 🔔 Real-time Notifications

### Socket.IO Integration

The API includes real-time push notifications via Socket.IO. When users perform actions (follow, like, comment), notifications are instantly pushed to the recipient.

### Connecting to Socket.IO

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'Token YOUR_JWT_TOKEN'
  }
});

// Connection successful
socket.on('connection:success', (data) => {
  console.log('Connected to real-time notifications');
});

// Receive notifications
socket.on('notification:new', (payload) => {
  console.log('New notification:', payload);
  // { event: 'notification:new', data: { id, type, sender, post, isRead, createdAt } }
});
```

### Notification Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection:success` | Server → Client | Socket authenticated and ready |
| `notification:new` | Server → Client | New notification received |

### Notification Types

| Type | Triggered When | Includes Post |
|------|----------------|:-------------:|
| `follow` | Someone follows you | ❌ |
| `like` | Someone likes your post | ✅ |
| `comment` | Someone comments on your post | ✅ |

---

## 🧪 Testing

### Automated Test Suite

The project includes a comprehensive Postman/Newman test suite with **49 automated assertions**.

#### Run All Tests

```bash
# Ensure server is running first
node build/server.js &

# Run the test suite
npx newman run tests/api-tests.postman.json --delay-request 300
```

#### Expected Output

```
Social Media API Tests

❏ Auth
  ✓ Register User (201)
  ✓ Login User (200)
  ✓ Get Current User (200)
  ✓ Update Current User (200)

❏ Posts
  ✓ Create Post (201)
  ✓ Get All Posts (200)
  ✓ Get Single Post (200)
  ✓ Update Post (200)
  ✓ Like Post (200)
  ✓ Unlike Post (200)

❏ Comments
  ✓ Create Comment (201)
  ✓ Get Comments (200)
  ✓ Delete Comment (200)

❏ Feed
  ✓ Get Feed (200)

❏ Profiles
  ✓ Get Profile (200)

❏ Notifications
  ✓ Get Notifications (200)

❏ Cleanup
  ✓ Delete Post (200)

┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│              assertions │       49 │        0 │
└─────────────────────────┴──────────┴──────────┘
```

### Manual Testing with cURL

```bash
# 1. Register
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"username":"testuser","email":"test@test.com","password":"password123"}}'

# 2. Login (save the token from response)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@test.com","password":"password123"}}'

# 3. Create Post (use token from step 2)
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"post":{"content":"Hello World!"}}'

# 4. Get All Posts
curl http://localhost:3000/api/posts

# 5. Get Feed
curl http://localhost:3000/api/feed \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### Smoke Tests

```bash
# Run TypeScript smoke tests
npm test
```

---

## 📁 Project Structure

```
social-media-api/
├── 📁 src/                          # Source code
│   ├── 📄 app.ts                    # Express app configuration
│   ├── 📄 server.ts                 # Entry point & Socket.IO setup
│   │
│   ├── 📁 controllers/              # Request handlers
│   │   ├── user.controller.ts       # User CRUD, auth, follow
│   │   ├── post.controller.ts       # Post CRUD, like/unlike
│   │   ├── comment.controller.ts    # Comment CRUD
│   │   ├── feed.controller.ts       # Personalized feed
│   │   ├── notification.controller.ts
│   │   └── profile.controller.ts    # Public profiles
│   │
│   ├── 📁 routes/                   # API route definitions
│   │   ├── index.ts                 # Main router (combines all)
│   │   ├── users-routes.ts          # /api/users/*
│   │   ├── posts-routes.ts          # /api/posts/*
│   │   ├── comments-routes.ts       # /api/comments/*
│   │   ├── feed-routes.ts           # /api/feed
│   │   ├── profiles-routes.ts       # /api/profiles/*
│   │   └── notifications-routes.ts  # /api/notifications/*
│   │
│   ├── 📁 database/
│   │   ├── index.ts                 # MongoDB connection
│   │   └── 📁 models/               # Mongoose schemas
│   │       ├── user.model.ts
│   │       ├── post.model.ts
│   │       ├── comment.model.ts
│   │       ├── like.model.ts
│   │       ├── follow.model.ts
│   │       └── notification.model.ts
│   │
│   ├── 📁 services/                 # Business logic layer
│   │   ├── user.service.ts
│   │   └── notification.service.ts
│   │
│   ├── 📁 interfaces/               # TypeScript interfaces
│   │   ├── user-interface.ts
│   │   ├── post-interface.ts
│   │   └── ...
│   │
│   ├── 📁 decorators/               # Custom decorators
│   │   └── realtime.decorator.ts    # @BroadcastNotification
│   │
│   ├── 📁 utilities/                # Helper functions
│   │   ├── authentication.ts        # JWT middleware
│   │   ├── authorization.ts         # Role checking
│   │   ├── error-handling.ts        # Error middleware
│   │   ├── response.ts              # sendSuccess/sendError
│   │   ├── validation.ts            # Input validation
│   │   ├── pagination.ts            # Pagination helper
│   │   ├── logger.ts                # Winston logger
│   │   ├── realtime.ts              # Socket.IO helpers
│   │   └── secrets.ts               # Env var loading
│   │
│   └── 📁 types-override/           # TypeScript augmentations
│       └── express-augmented.d.ts
│
├── 📁 build/                        # Compiled JavaScript (generated)
├── 📁 logs/                         # Application logs (generated)
├── 📁 tests/                        # Test files
│   ├── api-tests.postman.json       # Postman collection
│   ├── local.postman_environment.json
│   └── smoke.test.ts                # Smoke tests
│
├── 📄 .env                          # Environment variables
├── 📄 .env.example                  # Env template
├── 📄 docker-compose.yml            # Docker MongoDB setup
├── 📄 package.json                  # Dependencies & scripts
├── 📄 tsconfig.json                 # TypeScript config
├── 📄 tslint.json                   # Linting rules
└── 📄 README.md                     # This file
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ Server won't start

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB not running:**
```bash
# Check if MongoDB is running
pgrep -f mongod

# Start with Docker
docker-compose up -d

# Or start local MongoDB
brew services start mongodb-community  # macOS
```

---

#### ❌ MongoDB connection error

**ECONNREFUSED:**
```bash
# Verify MongoDB is listening
lsof -i :27017

# Check your .env file
cat .env | grep DB_
```

**Authentication failed:**
- Verify `DB_USER` and `DB_USER_PWD` in `.env`
- For local dev, leave these empty

---

#### ❌ TypeScript compilation errors

```bash
# Check for errors
npx tsc --noEmit

# Clean rebuild
rm -rf build/
npx tsc
```

---

#### ❌ API returns 401 Unauthorized

1. Check token is included: `Authorization: Token YOUR_TOKEN`
2. Token might be expired - login again
3. Verify token format (it's `Token`, not `Bearer`)

---

#### ❌ API returns 403 Forbidden

- User doesn't have required role (admin endpoints)
- User doesn't own the resource (edit/delete)

---

#### ❌ API returns 422 Validation Error

- Check request body format matches documentation
- Ensure required fields are present
- Check field length/format constraints

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use meaningful variable/function names
- ✅ Add comments for complex logic
- ✅ Maintain consistent formatting
- ✅ Write clear commit messages

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👥 Authors

- **Aadya Sharma** - [GitHub](https://github.com/aadyasharma13)

---

## 🙏 Acknowledgments

- [RealWorld](https://github.com/gothinkster/realworld) for API specification inspiration
- Express.js community
- MongoDB and Mongoose teams
- All open-source contributors

---

<div align="center">

**⭐ Star this repo if you find it useful! ⭐**

Made with ❤️ and TypeScript

</div>
