# Social Media API

A comprehensive, production-ready Social Media REST API built with TypeScript, Node.js, Express.js, and MongoDB. This API provides complete functionality for a social media platform including user management, posts, comments, likes, follows, notifications, and more.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Features
- **User Management**: Registration, login, profile management with extended profile fields
- **Posts**: Create, read, update, delete posts with content and image URLs
- **Comments**: Comment on posts with automatic comment count management
- **Likes**: Like/unlike posts with automatic like count management
- **Follow System**: Follow/unfollow users with followers and following lists
- **Feed**: Personalized feed showing posts from followed users
- **Notifications**: Real-time notifications for follows, likes, and comments
- **Pagination**: Consistent pagination across all list endpoints
- **Role-Based Access Control**: Admin and user roles with protected routes

### Technical Features
- TypeScript for type safety
- RESTful API design
- JWT-based authentication
- Password hashing with bcrypt
- Input validation middleware
- Centralized error handling
- Standardized API responses
- MongoDB with Mongoose ODM
- Automatic data consistency (counters, relationships)
- Clean architecture (Controllers, Services, Models)

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken, express-jwt)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet, CORS
- **Logging**: Winston

### Development Tools
- TypeScript Compiler
- Nodemon (auto-reload)
- Concurrently (run multiple processes)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** (comes with Node.js)
- **MongoDB** (v4.4 or higher) - Choose one:
  - **Docker** and **Docker Compose** (Recommended) - [Download](https://www.docker.com/)
  - **MongoDB Community Edition** - [Download](https://www.mongodb.com/try/download/community)
  - **MongoDB Atlas** (Cloud) - [Sign up](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation

### Step 1: Clone the Repository

   ```bash
   git clone <your-repo-url>
   cd typescript-node-express-realworld-example-app-master
   ```

### Step 2: Install Dependencies

   ```bash
   npm install
   ```

### Step 3: Set Up MongoDB

#### Option A: Using Docker (Recommended)

Start MongoDB using Docker Compose:

   ```bash
   docker-compose up -d
   ```

This will:
- Start MongoDB 7.0 on `localhost:27017`
- Create a persistent data volume
- Run without authentication (for local development)

To stop MongoDB:
```bash
docker-compose down
```

To remove all data:
```bash
docker-compose down -v
```

#### Option B: Local MongoDB Installation

1. Install MongoDB Community Edition ([Instructions](https://docs.mongodb.com/manual/installation/))
2. Start MongoDB:
   ```bash
   mongod --dbpath /path/to/your/data/directory
   ```
   Or if installed as a service:
   ```bash
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod           # Linux
   ```

#### Option C: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update your `.env` file with Atlas credentials (see Configuration section)

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Or manually create `.env` with the following content:

```env
# Application Environment
APP_ENV=dev
APP_PORT=3000

# JWT & Session Secrets (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your_jwt_secret_key_change_this_in_production
SESSION_SECRET=your_session_secret_key_change_this_in_production

# Database Configuration
# For local development with Docker (no authentication):
DB_HOST=localhost
DB_PORT=27017
DB_NAME=social_media_api
DB_USER=
DB_USER_PWD=

# For production or MongoDB Atlas (with authentication):
# DB_HOST=your_mongodb_host
# DB_PORT=27017
# DB_NAME=social_media_api
# DB_USER=your_username
# DB_USER_PWD=your_password

# Logging
LOG_DIRECTORY=logs
```

**Important**: Change `JWT_SECRET` and `SESSION_SECRET` to secure random strings in production!

## 🏃 Running the Project

### Development Mode (with auto-reload)

```bash
npm run start
```

This command will:
1. Build TypeScript files
2. Start the server with auto-reload on file changes
3. Watch for TypeScript changes and recompile

### Production Mode

```bash
npm run build
npm run serve
```

### Available Scripts

- `npm run start` - Build, watch, and serve (development)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build-ts` - Compile TypeScript only
- `npm run serve` - Run the compiled server
- `npm run watch` - Watch TypeScript and Node.js files
- `npm run watch-ts` - Watch and compile TypeScript files
- `npm run watch-node` - Watch and restart Node.js server

### Verify Installation

Once the server is running, you should see:

```
server running on port : 3000
Mongoose connection done
```

Test the API:

```bash
curl http://localhost:3000/api/posts
```

Expected response:
```json
{
  "success": true,
  "data": {
    "posts": [],
    "total": 0,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

## 📚 API Documentation

All API endpoints are prefixed with `/api`. The API uses JSON for request and response bodies.

### Base URL

```
http://localhost:3000/api
```

### Authentication

Most endpoints require authentication using JWT tokens. Include the token in the `Authorization` header:

```
Authorization: Token YOUR_JWT_TOKEN
```

### Response Format

All responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... }
}
```

### Endpoints

#### User Endpoints

##### Register User
```http
POST /api/users
Content-Type: application/json

{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "john@example.com",
      "username": "johndoe",
      "token": "jwt_token_here",
      "bio": "",
      "image": "",
      "avatarUrl": null,
      "location": null,
      "website": null,
      "dob": null,
      "role": "user"
    }
  },
  "message": "User registered successfully"
}
```

##### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "user": {
    "email": "john@example.com",
    "password": "password123"
  }
}
```

**Response:** Same format as registration with user data and token.

##### Get Current User
```http
GET /api/user
Authorization: Token YOUR_TOKEN
```

**Response:** Current user profile with token.

##### Update Current User
```http
PUT /api/user
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "user": {
    "email": "newemail@example.com",
    "username": "newusername",
    "password": "newpassword",
    "bio": "Updated bio",
    "image": "https://example.com/avatar.jpg"
  }
}
```

##### Update User Profile
```http
PATCH /api/users/profile
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "user": {
    "bio": "My bio",
    "avatarUrl": "https://example.com/avatar.jpg",
    "location": "New York, USA",
    "website": "https://example.com",
    "dob": "1990-01-01"
  }
}
```

##### Follow User
```http
POST /api/users/:userId/follow
Authorization: Token YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "following": true
  },
  "message": "Successfully followed user"
}
```

##### Unfollow User
```http
DELETE /api/users/:userId/unfollow
Authorization: Token YOUR_TOKEN
```

##### Get User Followers
```http
GET /api/users/:userId/followers?limit=20&offset=0
Authorization: Token YOUR_TOKEN (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "followers": [...],
    "total": 10,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

##### Get User Following
```http
GET /api/users/:userId/following?limit=20&offset=0
Authorization: Token YOUR_TOKEN (optional)
```

##### Get All Users (Admin Only)
```http
GET /api/users?limit=20&offset=0
Authorization: Token ADMIN_TOKEN
```

##### Delete User (Admin Only)
```http
DELETE /api/users/:userId
Authorization: Token ADMIN_TOKEN
```

#### Post Endpoints

##### Get All Posts
```http
GET /api/posts?limit=20&offset=0&author=USERNAME
Authorization: Token YOUR_TOKEN (optional)
```

**Query Parameters:**
- `limit` (optional): Number of posts per page (default: 20, max: 100)
- `offset` (optional): Number of posts to skip (default: 0)
- `author` (optional): Filter by author username

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "post_id",
        "content": "Post content",
        "imageUrl": "https://example.com/image.jpg",
        "likesCount": 5,
        "commentsCount": 3,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "author": {
          "username": "johndoe",
          "bio": "Bio",
          "image": "avatar.jpg",
          "following": false
        }
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

##### Get Single Post
```http
GET /api/posts/:postId
Authorization: Token YOUR_TOKEN (optional)
```

##### Create Post
```http
POST /api/posts
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "post": {
    "content": "My first post!",
    "imageUrl": "https://example.com/image.jpg"
  }
}
```

**Validation:**
- `content`: Required, string, max 5000 characters
- `imageUrl`: Optional, string (URL format)

##### Update Post
```http
PUT /api/posts/:postId
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "post": {
    "content": "Updated content",
    "imageUrl": "https://example.com/new-image.jpg"
  }
}
```

**Note:** Only the post author can update their post.

##### Delete Post
```http
DELETE /api/posts/:postId
Authorization: Token YOUR_TOKEN
```

**Note:** Only the post author or admin can delete a post.

##### Like Post
```http
POST /api/posts/:postId/like
Authorization: Token YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 6
  },
  "message": "Post liked successfully"
}
```

##### Unlike Post
```http
DELETE /api/posts/:postId/unlike
Authorization: Token YOUR_TOKEN
```

#### Comment Endpoints

##### Get Post Comments
```http
GET /api/posts/:postId/comments?limit=20&offset=0
Authorization: Token YOUR_TOKEN (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "comment_id",
        "content": "Great post!",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "username": "johndoe",
          "bio": "Bio",
          "image": "avatar.jpg",
          "following": false
        }
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

##### Create Comment
```http
POST /api/posts/:postId/comments
Authorization: Token YOUR_TOKEN
Content-Type: application/json

{
  "comment": {
    "content": "This is a great post!"
  }
}
```

**Validation:**
- `content`: Required, string, max 1000 characters

**Response:** Comment object with user information.

##### Delete Comment
```http
DELETE /api/comments/:commentId
Authorization: Token YOUR_TOKEN
```

**Note:** Only the comment author or admin can delete a comment.

#### Feed Endpoints

##### Get Feed
```http
GET /api/feed?limit=20&offset=0
Authorization: Token YOUR_TOKEN
```

**Description:** Returns posts from users that the current user follows, sorted by `createdAt` DESC.

**Response:** Same format as Get All Posts.

#### Notification Endpoints

##### Get Notifications
```http
GET /api/notifications?limit=20&offset=0&unreadOnly=true
Authorization: Token YOUR_TOKEN
```

**Query Parameters:**
- `limit` (optional): Number of notifications per page (default: 20)
- `offset` (optional): Number of notifications to skip (default: 0)
- `unreadOnly` (optional): Filter only unread notifications (default: false)

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notification_id",
        "type": "follow",
        "sender": {
          "username": "johndoe",
          "bio": "Bio",
          "image": "avatar.jpg"
        },
        "post": null,
        "isRead": false,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

**Notification Types:**
- `follow`: Someone followed you
- `like`: Someone liked your post
- `comment`: Someone commented on your post

##### Mark Notification as Read
```http
PATCH /api/notifications/:id/read
Authorization: Token YOUR_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notification": { ... },
    "isRead": true
  },
  "message": "Notification marked as read"
}
```

#### Profile Endpoints

##### Get Profile
```http
GET /api/profiles/:username
Authorization: Token YOUR_TOKEN (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "username": "johndoe",
      "bio": "Bio",
      "image": "avatar.jpg",
      "avatarUrl": "https://example.com/avatar.jpg",
      "location": "New York",
      "website": "https://example.com",
      "dob": "1990-01-01T00:00:00.000Z",
      "following": false
    }
  }
}
```

##### Follow Profile (by username)
```http
POST /api/profiles/:username/follow
Authorization: Token YOUR_TOKEN
```

##### Unfollow Profile (by username)
```http
DELETE /api/profiles/:username/follow
Authorization: Token YOUR_TOKEN
```

## 🗄 Database Models

### User Model

```typescript
{
  email: string (required, unique)
  username: string (required, unique)
  hash: string (password hash)
  bio: string
  image: string
  avatarUrl: string
  location: string
  website: string
  dob: Date
  role: 'user' | 'admin' (default: 'user')
  following: User[] (virtual)
  createdAt: Date
  updatedAt: Date
}
```

**Methods:**
- `setPassword(password: string): Promise<void>` - Hash and set password
- `validPassword(password: string): Promise<boolean>` - Verify password
- `toAuthJSON()` - Return user data with token
- `toProfileJSONFor(user)` - Return profile data for another user
- `isFollowing(userId)` - Check if following a user

### Post Model

```typescript
{
  content: string (required)
  imageUrl: string | null
  author: ObjectId (ref: User, required)
  likesCount: number (default: 0)
  commentsCount: number (default: 0)
  comments: ObjectId[] (ref: Comment)
  createdAt: Date
  updatedAt: Date
}
```

**Methods:**
- `toJSONFor(user)` - Return post data with author info

### Comment Model

```typescript
{
  post: ObjectId (ref: Post, required)
  user: ObjectId (ref: User, required)
  content: string (required)
  createdAt: Date
}
```

**Hooks:**
- Automatically increments `post.commentsCount` on save
- Automatically decrements `post.commentsCount` on delete

**Methods:**
- `toJSONFor(user)` - Return comment data with user info

### Like Model

```typescript
{
  user: ObjectId (ref: User, required)
  post: ObjectId (ref: Post, required)
  createdAt: Date
}
```

**Indexes:**
- Unique compound index on `(user, post)` - Prevents duplicate likes

### Follow Model

```typescript
{
  follower: ObjectId (ref: User, required)
  following: ObjectId (ref: User, required)
  createdAt: Date
}
```

**Indexes:**
- Unique compound index on `(follower, following)` - Prevents duplicate follows

**Validation:**
- Prevents users from following themselves

### Notification Model

```typescript
{
  user: ObjectId (ref: User, required) - Who receives the notification
  type: 'follow' | 'like' | 'comment' (required)
  sender: ObjectId (ref: User, required) - Who triggered it
  post: ObjectId (ref: Post, nullable) - Related post (null for follow)
  isRead: boolean (default: false)
  createdAt: Date
}
```

**Indexes:**
- Compound index on `(user, isRead, createdAt)` - For efficient queries
- Index on `(user, createdAt)` - For sorting

## 🔐 Authentication

### JWT Authentication

The API uses JSON Web Tokens (JWT) for authentication. Tokens are obtained through registration or login and must be included in subsequent requests.

### Token Format

Include the token in the `Authorization` header:

```
Authorization: Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authentication Middleware

- `authentication.required` - Requires valid token, returns 401 if missing/invalid
- `authentication.optional` - Validates token if present, but doesn't require it

### Password Security

- Passwords are hashed using **bcrypt** with 10 salt rounds
- Passwords are never stored in plain text
- Password validation: minimum 6 characters

### Role-Based Access Control

The API supports two roles:

- **user** (default): Standard user with normal permissions
- **admin**: Can delete any user/post, view all users

**Admin Middleware:**
- `requireAdmin` - Requires user to have `role: 'admin'`, returns 403 if not admin

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": "Field-specific error message"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

### Error Types

- **Validation Errors**: Invalid input data (422)
- **Authentication Errors**: Missing or invalid token (401)
- **Authorization Errors**: Insufficient permissions (403)
- **Not Found Errors**: Resource doesn't exist (404)
- **Server Errors**: Internal server errors (500)

### Centralized Error Handling

All errors are handled by middleware in `src/utilities/error-handling.ts`, ensuring consistent error responses across the API.

## 📁 Project Structure

```
typescript-node-express-realworld-example-app-master/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   ├── controllers/              # Request handlers
│   │   ├── user.controller.ts
│   │   ├── post.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── feed.controller.ts
│   │   ├── notification.controller.ts
│   │   └── profile.controller.ts
│   ├── database/
│   │   ├── index.ts              # Database connection
│   │   └── models/               # Mongoose models
│   │       ├── user.model.ts
│   │       ├── post.model.ts
│   │       ├── comment.model.ts
│   │       ├── like.model.ts
│   │       ├── follow.model.ts
│   │       └── notification.model.ts
│   ├── interfaces/               # TypeScript interfaces
│   │   ├── user-interface.ts
│   │   ├── post-interface.ts
│   │   ├── comment-interface.ts
│   │   ├── like-interface.ts
│   │   ├── follow-interface.ts
│   │   └── notification-interface.ts
│   ├── routes/                  # Route definitions
│   │   ├── index.ts             # Main router
│   │   ├── users-routes.ts
│   │   ├── posts-routes.ts
│   │   ├── comments-routes.ts
│   │   ├── feed-routes.ts
│   │   ├── notifications-routes.ts
│   │   └── profiles-routes.ts
│   ├── services/                # Business logic
│   │   ├── user.service.ts
│   │   └── notification.service.ts
│   ├── utilities/               # Utilities and helpers
│   │   ├── authentication.ts    # JWT authentication
│   │   ├── authorization.ts     # Role-based authorization
│   │   ├── error-handling.ts    # Error handling middleware
│   │   ├── logger.ts            # Winston logger
│   │   ├── pagination.ts        # Pagination utility
│   │   ├── passport.ts          # Passport configuration
│   │   ├── response.ts          # Standardized responses
│   │   ├── secrets.ts           # Environment variables
│   │   └── validation.ts        # Input validation
│   └── types-override/          # TypeScript type overrides
│       └── express-augmented.d.ts
├── build/                       # Compiled JavaScript (generated)
├── logs/                        # Application logs (generated)
├── tests/                       # Test files
│   ├── api-tests.postman.json
│   └── env-api-tests.postman.json
├── docker-compose.yml           # Docker Compose configuration
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tslint.json                  # TypeScript linting rules
└── README.md                    # This file
```

### Architecture

The project follows a **layered architecture**:

1. **Routes Layer** (`routes/`): Define API endpoints and apply middleware
2. **Controllers Layer** (`controllers/`): Handle HTTP requests and responses
3. **Services Layer** (`services/`): Business logic and complex operations
4. **Models Layer** (`database/models/`): Database schemas and data access
5. **Utilities Layer** (`utilities/`): Reusable utilities and helpers

## 🧪 Testing

### Manual Testing with cURL

#### 1. Register a User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"username":"testuser","email":"test@example.com","password":"password123"}}'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@example.com","password":"password123"}}'
```

Save the token from the response.

#### 3. Create a Post
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post":{"content":"My first post!","imageUrl":null}}'
```

#### 4. Get All Posts
```bash
curl http://localhost:3000/api/posts
```

#### 5. Like a Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/like \
  -H "Authorization: Token YOUR_TOKEN"
```

#### 6. Comment on a Post
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/comments \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":{"content":"Great post!"}}'
```

#### 7. Get Feed
```bash
curl http://localhost:3000/api/feed \
  -H "Authorization: Token YOUR_TOKEN"
```

#### 8. Get Notifications
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Token YOUR_TOKEN"
```

### Testing with Postman

1. Import the collection from `tests/api-tests.postman.json`
2. Set the base URL to `http://localhost:3000/api`
3. For authenticated requests, add header:
   - Key: `Authorization`
   - Value: `Token YOUR_TOKEN_HERE`

### Testing with Insomnia

1. Create a new request collection
2. Set base URL: `http://localhost:3000/api`
3. Add `Authorization` header with `Token YOUR_TOKEN` for authenticated endpoints

## 🔧 Configuration

### Environment Variables

All configuration is done through environment variables in the `.env` file:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `APP_ENV` | Application environment | `dev` | No |
| `APP_PORT` | Server port | `3000` | No |
| `JWT_SECRET` | Secret for JWT signing | `secret` | **Yes** (change in production) |
| `SESSION_SECRET` | Secret for sessions | `secret` | **Yes** (change in production) |
| `DB_HOST` | MongoDB host | `localhost` | No |
| `DB_PORT` | MongoDB port | `27017` | No |
| `DB_NAME` | Database name | `social_media_api` | No |
| `DB_USER` | MongoDB username | `` | No (required for authenticated DB) |
| `DB_USER_PWD` | MongoDB password | `` | No (required for authenticated DB) |
| `LOG_DIRECTORY` | Log file directory | `logs` | No |

### MongoDB Connection

The application supports both authenticated and non-authenticated MongoDB connections:

- **Local Development**: Leave `DB_USER` and `DB_USER_PWD` empty
- **Production/Atlas**: Provide username and password

The connection string is built automatically based on whether credentials are provided.

## 🚨 Troubleshooting

### Server won't start

1. **Port 3000 already in use:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

2. **MongoDB connection error:**
   - Ensure MongoDB is running: `pgrep -f mongod`
   - Check MongoDB port: `lsof -i :27017`
   - Verify `.env` file has correct database settings

### MongoDB Connection Issues

1. **ECONNREFUSED error:**
   - Start MongoDB: `mongod` or `docker-compose up -d`
   - Check if MongoDB is listening: `lsof -i :27017`

2. **Authentication failed:**
   - Verify `DB_USER` and `DB_USER_PWD` in `.env`
   - For local development, leave these empty

### Build Errors

1. **TypeScript compilation errors:**
   - Run `npm run build-ts` to see detailed errors
   - Ensure all dependencies are installed: `npm install`

2. **Module not found:**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### API Errors

1. **401 Unauthorized:**
   - Check if token is included in `Authorization` header
   - Verify token is valid (try logging in again)

2. **403 Forbidden:**
   - Check if user has required role (admin endpoints)
   - Verify user owns the resource (for update/delete)

3. **422 Validation Error:**
   - Check request body format
   - Verify all required fields are provided
   - Check field validation rules

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent code formatting
- Write clear commit messages

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Original RealWorld Example: [Josh Black](https://github.com/skopekreep)
- Social Media API Transformation: [Your Name]

## 🙏 Acknowledgments

- [RealWorld](https://github.com/gothinkster/realworld) for the API specification
- Express.js community
- MongoDB and Mongoose teams
- All open-source contributors

## 📞 Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check existing issues and discussions
- Review the API documentation above

---

**Happy Coding! 🚀**
