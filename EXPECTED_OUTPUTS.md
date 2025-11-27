# Expected Outputs Guide

## 🚀 Server Startup

### Expected Console Output:
```
server running on port : 3000
Mongoose connection done
```

### If MongoDB is not running, you'll see:
```
Mongoose connection error
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```

---

## 📡 API Response Examples

### 1. Register User
**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"username":"testuser","email":"test@test.com","password":"password123"}}'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "test@test.com",
      "username": "testuser",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "bio": "",
      "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
      "role": "user"
    }
  },
  "message": "User registered successfully"
}
```

---

### 2. Login
**Request:**
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@test.com","password":"password123"}}'
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "email": "test@test.com",
      "username": "testuser",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "bio": "",
      "image": "https://static.productionready.io/images/smiley-cyrus.jpg",
      "role": "user"
    }
  },
  "message": "Login successful"
}
```

---

### 3. Get All Posts
**Request:**
```bash
curl http://localhost:3000/api/posts
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [],
    "pagination": {
      "total": 0,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

### 4. Create Post
**Request:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"post":{"content":"Hello World!","imageUrl":null}}'
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "post": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "content": "Hello World!",
      "imageUrl": null,
      "author": {
        "id": "...",
        "username": "testuser",
        "bio": "",
        "image": "https://static.productionready.io/images/smiley-cyrus.jpg"
      },
      "likesCount": 0,
      "commentsCount": 0,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  },
  "message": "Post created successfully"
}
```

---

### 5. Get Feed
**Request:**
```bash
curl http://localhost:3000/api/feed \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "...",
        "content": "Hello World!",
        "imageUrl": null,
        "author": {
          "username": "followeduser",
          "bio": "...",
          "image": "..."
        },
        "likesCount": 5,
        "commentsCount": 2,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

### 6. Get Notifications
**Request:**
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "...",
        "type": "like",
        "sender": {
          "id": "...",
          "username": "otheruser",
          "avatarUrl": "...",
          "bio": "..."
        },
        "post": {
          "id": "...",
          "content": "Hello World!",
          "imageUrl": null
        },
        "isRead": false,
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "limit": 20,
      "offset": 0,
      "hasMore": false
    }
  }
}
```

---

## ❌ Error Response Examples

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is invalid",
    "password": "Password must be at least 6 characters"
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized: Invalid token"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Forbidden: Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Post not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## 🧪 Test Output

### Running Newman Tests
```bash
npx newman run tests/api-tests.postman.json --delay-request 300
```

### Expected Output:
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

---

## 🔍 Quick Verification Checklist

### ✅ Server is Running
- Console shows: `server running on port : 3000`
- Console shows: `Mongoose connection done`

### ✅ API is Working
```bash
# Should return empty posts array
curl http://localhost:3000/api/posts

# Expected:
# {"success":true,"data":{"posts":[],"pagination":{...}}}
```

### ✅ Database is Connected
- No MongoDB connection errors in console
- Can create and retrieve data

### ✅ Authentication Works
- Can register a user
- Can login and get a token
- Token works for protected routes

---

## 🐛 Common Issues & Expected Outputs

### Issue: MongoDB Not Running
**Output:**
```
Mongoose connection error
MongooseError: connect ECONNREFUSED 127.0.0.1:27017
```
**Fix:** Start MongoDB or Docker Compose

### Issue: Port Already in Use
**Output:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Fix:** Kill process on port 3000 or change APP_PORT

### Issue: Invalid JWT Token
**Output:**
```json
{
  "success": false,
  "message": "Unauthorized: Invalid token"
}
```
**Fix:** Login again to get a new token

### Issue: Missing Required Fields
**Output:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email can't be blank",
    "password": "Password must be at least 6 characters"
  }
}
```
**Fix:** Provide all required fields in request body

