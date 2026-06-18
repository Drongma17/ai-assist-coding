# API Documentation

Complete API reference with examples and response codes.

## Base URL

```
http://localhost:3000/api
```

## Authentication

The API uses JWT (JSON Web Token) authentication. To access protected endpoints, include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses are in JSON format with the following structure:

### Success Response

```json
{
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Authentication Endpoints

### 1. Register User

Register a new user account.

**Endpoint:** `POST /auth/register`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing fields or validation error
- `409 Conflict`: Email or username already exists

---

### 2. Login

Log in with email and password.

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "john_doe"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**

- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid email or password

---

### 3. Refresh Token

Get a new access token using a refresh token.

**Endpoint:** `POST /auth/refresh`

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- `400 Bad Request`: Missing refresh token
- `403 Forbidden`: Invalid refresh token

---

## User Endpoints

### 4. Get User Profile

Get the authenticated user's profile information.

**Endpoint:** `GET /auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "john_doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

### 5. Update User Profile

Update the authenticated user's profile.

**Endpoint:** `PUT /auth/profile`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "new_username",
  "email": "newemail@example.com"
}
```

**Success Response (200):**

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

**Error Responses:**

- `400 Bad Request`: No fields to update
- `401 Unauthorized`: Missing or invalid token

---

### 6. Get All Users

Get a list of all registered users (Admin endpoint).

**Endpoint:** `GET /auth/users`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

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

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token

---

### 7. Logout

Log out and invalidate the refresh token.

**Endpoint:** `POST /auth/logout`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**

```json
{
  "message": "Logout successful"
}
```

**Error Responses:**

- `401 Unauthorized`: Missing or invalid token

---

## Protected Data Endpoints

### 8. Get Protected Data

Access protected data (example endpoint).

**Endpoint:** `GET /protected/data`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

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

**Error Responses:**

- `401 Unauthorized`: Missing token
- `403 Forbidden`: Invalid token

---

### 9. Get User Info

Get authenticated user's information.

**Endpoint:** `GET /protected/user-info`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Success Response (200):**

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

**Error Responses:**

- `401 Unauthorized`: Missing token
- `403 Forbidden`: Invalid token

---

### 10. Perform Action

Perform an action on behalf of the user.

**Endpoint:** `POST /protected/action`

**Headers:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "action": "create_post"
}
```

**Success Response (200):**

```json
{
  "message": "Action performed successfully",
  "performedBy": "john_doe",
  "action": "create_post"
}
```

**Error Responses:**

- `401 Unauthorized`: Missing token
- `403 Forbidden`: Invalid token

---

## System Endpoints

### 11. Health Check

Check if the server is running.

**Endpoint:** `GET /health`

**Success Response (200):**

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## HTTP Status Codes

| Code | Meaning      | Description                             |
| ---- | ------------ | --------------------------------------- |
| 200  | OK           | Request successful                      |
| 201  | Created      | Resource created successfully           |
| 400  | Bad Request  | Invalid request parameters              |
| 401  | Unauthorized | Missing or invalid authentication       |
| 403  | Forbidden    | Authenticated but not authorized        |
| 404  | Not Found    | Resource not found                      |
| 409  | Conflict     | Duplicate resource (e.g., email exists) |
| 500  | Server Error | Internal server error                   |

---

## Example Requests with cURL

### Register a user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "john_doe",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected route

```bash
curl -X GET http://localhost:3000/api/protected/data \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Refresh token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Get profile

```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Token Expiration

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days

When an access token expires, use the refresh token to obtain a new one without logging in again.

---

## Error Handling

All errors include:

- `error`: Description of the error
- `status`: HTTP status code
- `timestamp`: When the error occurred

Example error response:

```json
{
  "error": "Invalid email or password",
  "status": 401,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Best Practices

1. **Store tokens securely**: Never log tokens to console or localStorage in production
2. **Use HTTPS**: Always use HTTPS in production
3. **Refresh tokens**: Use refresh tokens to get new access tokens
4. **Token validation**: Validate tokens before using them
5. **Error handling**: Handle errors gracefully in your client
6. **Rate limiting**: Implement rate limiting to prevent abuse
7. **Input validation**: Validate all input data

---

## Rate Limiting (Recommended)

For production, consider implementing rate limiting using middleware like `express-rate-limit`:

```bash
npm install express-rate-limit
```

---

## CORS Configuration

The API supports CORS. Configure allowed origins in `.env`:

```
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

Last Updated: 2024-01-15
