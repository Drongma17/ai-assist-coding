# Express REST API with JWT Authentication and SQLite

A complete REST API built with Express.js featuring JWT authentication, SQLite database, password hashing with bcryptjs, and protected routes.

## Features

- ✅ User registration and login
- ✅ JWT access tokens and refresh tokens
- ✅ Password hashing with bcryptjs
- ✅ Protected routes with authentication middleware
- ✅ SQLite database for user persistence
- ✅ Error handling and validation
- ✅ CORS support
- ✅ Refresh token management
- ✅ User profile management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**

```bash
cp .env.example .env
```

3. **Update `.env` with your configuration** (optional for development):

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
```

## Running the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes

#### Register User

**POST** `/api/auth/register`

Request body:

```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

Response (201):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login User

**POST** `/api/auth/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Access Token

**POST** `/api/auth/refresh`

Request body:

```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response (200):

```json
{
  "accessToken": "eyJhbGc..."
}
```

### Protected User Routes (Require Authentication)

#### Get User Profile

**GET** `/api/auth/profile`

Headers:

```
Authorization: Bearer <accessToken>
```

Response (200):

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "john_doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Update User Profile

**PUT** `/api/auth/profile`

Headers:

```
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

Response (200):

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "newemail@example.com",
    "username": "new_username",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

#### Get All Users (Admin)

**GET** `/api/auth/users`

Headers:

```
Authorization: Bearer <accessToken>
```

Response (200):

```json
{
  "count": 2,
  "users": [
    {
      "id": 1,
      "email": "user1@example.com",
      "username": "john_doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "email": "user2@example.com",
      "username": "jane_doe",
      "created_at": "2024-01-15T10:35:00Z"
    }
  ]
}
```

#### Logout

**POST** `/api/auth/logout`

Headers:

```
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response (200):

```json
{
  "message": "Logout successful"
}
```

### Protected Data Routes

#### Get Protected Data

**GET** `/api/protected/data`

Headers:

```
Authorization: Bearer <accessToken>
```

Response (200):

```json
{
  "message": "This is protected data",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "data": {
    "id": 1,
    "name": "Sample Data",
    "description": "Only authenticated users can access this"
  }
}
```

#### Get User Info

**GET** `/api/protected/user-info`

Headers:

```
Authorization: Bearer <accessToken>
```

Response (200):

```json
{
  "message": "Your information",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  }
}
```

#### Perform Action

**POST** `/api/protected/action`

Headers:

```
Authorization: Bearer <accessToken>
```

Request body:

```json
{
  "action": "create_post"
}
```

Response (200):

```json
{
  "message": "Action performed successfully",
  "performedBy": "john_doe",
  "action": "create_post"
}
```

### Health Check

#### Server Health

**GET** `/api/health`

Response (200):

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)
```

## Project Structure

```
.
├── config/
│   └── database.js          # SQLite database configuration
├── controllers/
│   └── userController.js    # User business logic
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── users.js             # User authentication routes
│   └── protected.js         # Protected data routes
├── data/                    # SQLite database directory
├── server.js                # Express server entry point
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/protected/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## Error Handling

The API includes comprehensive error handling with the following error responses:

### 400 Bad Request

Missing required fields or validation errors

### 401 Unauthorized

Missing or invalid access token, token expired, invalid credentials

### 403 Forbidden

Invalid refresh token

### 404 Not Found

Resource not found

### 409 Conflict

Email or username already in use

### 500 Internal Server Error

Server-side errors

## Security Notes

⚠️ **Important for Production:**

1. Change the `JWT_SECRET` and `JWT_REFRESH_SECRET` in your `.env` file to strong random strings
2. Use HTTPS in production
3. Implement rate limiting to prevent brute force attacks
4. Add input sanitization and validation
5. Use environment-specific error messages (don't expose sensitive details)
6. Implement CORS properly with allowed origins
7. Add logging and monitoring
8. Regularly update dependencies

## Token Details

- **Access Token**: Valid for 15 minutes, used for authenticated requests
- **Refresh Token**: Valid for 7 days, used to obtain new access tokens
- **Token Format**: JWT (JSON Web Token)

## Dependencies

- **express**: Web framework
- **sqlite3**: SQLite database driver
- **jsonwebtoken**: JWT creation and verification
- **bcryptjs**: Password hashing
- **dotenv**: Environment variable management
- **cors**: CORS middleware
- **body-parser**: Request body parsing

## License

ISC

## Author

Your Name

## Support

For issues, questions, or contributions, please contact the project maintainer.
