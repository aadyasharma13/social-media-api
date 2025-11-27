# 🚀 Terminal Commands Guide

## Step-by-Step Setup & Run Commands

---

## 1️⃣ Check Prerequisites

```bash
# Check Node.js version (should be v14+)
node --version

# Check npm version
npm --version

# Check if Docker is installed (optional, for MongoDB)
docker --version

# Check if MongoDB is installed locally (optional)
mongod --version
```

---

## 2️⃣ Install Dependencies

```bash
# Navigate to project directory (if not already there)
cd /Users/aadyasharma/Downloads/typescript-node-express-realworld-example-app-master

# Install all npm packages
npm install
```

---

## 3️⃣ Set Up Environment Variables

```bash
# Create .env file
cat > .env << 'EOF'
# Application
APP_ENV=dev
APP_PORT=3000

# Security (CHANGE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
SESSION_SECRET=your-session-secret-change-me-in-production

# Database - Local/Docker MongoDB
DB_HOST=localhost
DB_PORT=27017
DB_NAME=social_media_api
DB_USER=
DB_USER_PWD=

# Logging
LOG_DIRECTORY=logs
EOF

# Or create manually
nano .env
# (Then paste the content above)
```

---

## 4️⃣ Start MongoDB

### Option A: Using Docker (Recommended)

```bash
# Start MongoDB with Docker Compose
docker-compose up -d

# Check if MongoDB is running
docker ps | grep mongodb

# View MongoDB logs
docker-compose logs mongodb

# Stop MongoDB (when done)
docker-compose down
```

### Option B: Local MongoDB

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or run MongoDB manually
mongod --dbpath ./conduit --port 27017
```

### Verify MongoDB Connection

```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017/social_media_api

# Or using mongo client (older versions)
mongo mongodb://localhost:27017/social_media_api
```

---

## 5️⃣ Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build

# Or manually
npx tsc
```

**Expected Output:**
- Creates `build/` directory with compiled JavaScript files
- No errors should appear

---

## 6️⃣ Run the Server

### Option A: Development Mode (with auto-reload)

```bash
# Start in development mode (watches for changes)
npm start
```

### Option B: Production Mode

```bash
# Build first
npm run build

# Then run
npm run serve

# Or directly
node build/server.js
```

### Option C: Manual Build & Run

```bash
# Build TypeScript
npx tsc

# Run server
node build/server.js
```

**Expected Output:**
```
server running on port : 3000
Mongoose connection done
```

---

## 7️⃣ Test the API

### Quick Health Check

```bash
# Test if server is running (should return empty posts)
curl http://localhost:3000/api/posts

# Expected response:
# {"success":true,"data":{"posts":[],"pagination":{...}}}
```

### Full API Test Flow

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"user":{"username":"testuser","email":"test@test.com","password":"password123"}}'

# Save the token from the response (look for "token" field)

# 2. Login (alternative to registration)
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@test.com","password":"password123"}}'

# 3. Get current user (replace YOUR_TOKEN with actual token)
curl http://localhost:3000/api/user \
  -H "Authorization: Token YOUR_TOKEN"

# 4. Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"post":{"content":"Hello World! This is my first post!"}}'

# 5. Get all posts
curl http://localhost:3000/api/posts

# 6. Get feed (posts from users you follow)
curl http://localhost:3000/api/feed \
  -H "Authorization: Token YOUR_TOKEN"

# 7. Get notifications
curl http://localhost:3000/api/notifications \
  -H "Authorization: Token YOUR_TOKEN"
```

---

## 8️⃣ Run Automated Tests

### Run Smoke Tests

```bash
# Run TypeScript smoke tests
npm test
```

### Run Postman/Newman Tests

```bash
# Make sure server is running first
# In another terminal, start the server:
node build/server.js &

# Run the test suite
npx newman run tests/api-tests.postman.json --delay-request 300

# Or with environment file
npx newman run tests/api-tests.postman.json \
  -e tests/local.postman_environment.json \
  --delay-request 300
```

---

## 9️⃣ Useful Development Commands

### Watch Mode (Auto-rebuild on changes)

```bash
# Watch TypeScript files and auto-compile
npm run watch-ts

# In another terminal, watch and restart server
npm run watch-node
```

### Check for TypeScript Errors

```bash
# Compile and show errors
npx tsc --noEmit
```

### Check Running Processes

```bash
# Check if server is running on port 3000
lsof -i :3000

# Kill process on port 3000 (if needed)
lsof -ti:3000 | xargs kill -9
```

### Check MongoDB Status

```bash
# Check if MongoDB is running
lsof -i :27017

# Or using Docker
docker ps | grep mongodb
```

---

## 🔟 Troubleshooting Commands

### If Port 3000 is Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
export APP_PORT=3001
node build/server.js
```

### If MongoDB Connection Fails

```bash
# Check if MongoDB is running
lsof -i :27017

# Restart MongoDB (Docker)
docker-compose restart mongodb

# Or restart local MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod            # Linux
```

### Clear Build and Rebuild

```bash
# Remove build directory
rm -rf build

# Rebuild
npm run build
```

### Check Logs

```bash
# View application logs (if using winston)
cat logs/*.log

# View Docker MongoDB logs
docker-compose logs mongodb

# View server console output
# (Check the terminal where you ran `node build/server.js`)
```

---

## 📋 Complete Setup Script (Copy & Paste)

```bash
#!/bin/bash

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "📝 Creating .env file..."
  cat > .env << 'EOF'
APP_ENV=dev
APP_PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-me-in-production
SESSION_SECRET=your-session-secret-change-me-in-production
DB_HOST=localhost
DB_PORT=27017
DB_NAME=social_media_api
DB_USER=
DB_USER_PWD=
LOG_DIRECTORY=logs
EOF
fi

# 3. Start MongoDB with Docker
echo "🐳 Starting MongoDB with Docker..."
docker-compose up -d

# 4. Wait for MongoDB to be ready
echo "⏳ Waiting for MongoDB to start..."
sleep 5

# 5. Build the project
echo "🔨 Building TypeScript..."
npm run build

# 6. Start the server
echo "🚀 Starting server..."
echo "Server will be available at http://localhost:3000"
npm run serve
```

**To use the script:**
```bash
# Make it executable
chmod +x setup.sh

# Run it
./setup.sh
```

---

## 🎯 Quick Start (Minimal Commands)

```bash
# 1. Install
npm install

# 2. Start MongoDB
docker-compose up -d

# 3. Build & Run
npm run build && npm run serve
```

---

## 📝 Common Workflow

```bash
# Terminal 1: Start MongoDB
docker-compose up -d

# Terminal 2: Start Server (development)
npm start

# Terminal 3: Run Tests
npm test

# Terminal 4: Test API
curl http://localhost:3000/api/posts
```

---

## 🛑 Stop Everything

```bash
# Stop the server (Ctrl+C in the terminal running it)

# Stop MongoDB (Docker)
docker-compose down

# Or stop local MongoDB
brew services stop mongodb-community  # macOS
sudo systemctl stop mongod             # Linux
```

---

## ✅ Verification Checklist

Run these commands to verify everything is working:

```bash
# 1. Check Node.js
node --version  # Should show v14 or higher

# 2. Check MongoDB
docker ps | grep mongodb  # Should show running container
# OR
lsof -i :27017  # Should show MongoDB process

# 3. Check Server
curl http://localhost:3000/api/posts  # Should return JSON

# 4. Check Build
ls -la build/  # Should show compiled JavaScript files
```

---

## 🎉 Success Indicators

✅ **Server Running:**
- Console shows: `server running on port : 3000`
- Console shows: `Mongoose connection done`
- `curl http://localhost:3000/api/posts` returns JSON

✅ **MongoDB Running:**
- `docker ps` shows mongodb container
- No connection errors in server console

✅ **Build Successful:**
- `build/` directory exists
- `build/server.js` file exists
- No TypeScript compilation errors

