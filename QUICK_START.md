# Quick Start Guide

Get your Express REST API with JWT authentication and SQLite up and running in minutes.

## Prerequisites

- Node.js v14+ ([Download](https://nodejs.org/))
- npm or yarn
- Git (optional)

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:

- **express**: Web framework
- **sqlite3**: Database
- **jsonwebtoken**: JWT tokens
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables
- **cors**: Cross-origin support
- **body-parser**: Request parsing

## Step 2: Setup Environment Variables

Create a `.env` file from the template:

```bash
cp .env.example .env
```

The `.env` file contains:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
```

**For development:** You can keep the default secrets.
**For production:** Change them to strong random values.

## Step 3: Start the Server

**Development mode** (with hot reload):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
Connected to SQLite database at: /path/to/data/app.db
Users table initialized
Refresh tokens table initialized
Server running on port 3000
Environment: development
```

## Step 4: Test the API

### 1. Register a User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "username": "johndoe",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save the `accessToken` for next steps.**

### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Access Protected Route

Replace `YOUR_ACCESS_TOKEN` with the token from registration:

```bash
curl -X GET http://localhost:3000/api/protected/data \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**

```json
{
  "message": "This is protected data",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "username": "johndoe"
  },
  "data": {
    "id": 1,
    "name": "Sample Data",
    "description": "Only authenticated users can access this"
  }
}
```

## Project Structure

```
project-root/
├── config/
│   └── database.js              # SQLite setup
├── controllers/
│   └── userController.js        # Business logic
├── middleware/
│   ├── auth.js                  # JWT verification
│   └── errorHandler.js          # Error handling
├── routes/
│   ├── users.js                 # Auth routes
│   └── protected.js             # Protected routes
├── data/                        # Database file (created automatically)
├── tests/
│   └── auth.test.js             # Test suite
├── server.js                    # Main server
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore
├── README.md                    # Full documentation
├── API_DOCUMENTATION.md         # API reference
└── QUICK_START.md              # This file
```

## Key Features

✅ **User Registration** - Create new user accounts
✅ **User Login** - Authenticate with email and password
✅ **JWT Tokens** - Secure token-based authentication
✅ **Refresh Tokens** - Get new access tokens without re-login
✅ **Protected Routes** - Endpoints that require authentication
✅ **Password Hashing** - Secure password storage with bcryptjs
✅ **SQLite Database** - Local database for users
✅ **Error Handling** - Comprehensive error responses
✅ **CORS Support** - Enable cross-origin requests

## Available Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `GET /api/auth/users` - Get all users (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Protected Data

- `GET /api/protected/data` - Get protected data (protected)
- `GET /api/protected/user-info` - Get user info (protected)
- `POST /api/protected/action` - Perform action (protected)

### System

- `GET /api/health` - Server health check

## Database Schema

The app automatically creates two tables:

**users table:**

- `id` - Auto-increment primary key
- `email` - Unique email address
- `username` - Unique username
- `password` - Hashed password
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

**refresh_tokens table:**

- `id` - Auto-increment primary key
- `user_id` - Reference to user
- `token` - JWT refresh token
- `expires_at` - Token expiration time
- `created_at` - Creation timestamp

## Token Flow

1. **Register/Login** → Server returns `accessToken` and `refreshToken`
2. **Use accessToken** → Add to `Authorization: Bearer <token>` header
3. **Token Expires** → Use `refreshToken` to get new `accessToken`
4. **Refresh Token Expires** → User needs to login again

## Troubleshooting

### Port Already in Use

Change port in `.env`:

```
PORT=3001
```

### Database Errors

Delete the `data/app.db` file to reset the database:

```bash
rm data/app.db
```

### Module Not Found Error

Reinstall dependencies:

```bash
rm node_modules package-lock.json
npm install
```

### Token Errors

Make sure to:

- Include `Bearer` keyword: `Authorization: Bearer token`
- Use the correct token (not the refresh token as access token)
- Check token hasn't expired

## Next Steps

1. **Read** [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete endpoint reference
2. **Read** [README.md](README.md) for detailed information
3. **Explore** the code in `controllers/` and `routes/` directories
4. **Run tests** with `npm test`
5. **Add more endpoints** following the existing pattern
6. **Implement** rate limiting for production

## Testing

Run the test suite:

```bash
npm test
```

## Development

Run in development mode with auto-reload:

```bash
npm run dev
```

## Production

Prepare for production:

1. **Update `.env` file:**
   - Change `NODE_ENV=production`
   - Set strong `JWT_SECRET`
   - Set strong `JWT_REFRESH_SECRET`

2. **Install production dependencies:**

   ```bash
   npm install --production
   ```

3. **Start server:**
   ```bash
   npm start
   ```

## Security Checklist

- [ ] Changed JWT secrets in `.env`
- [ ] Using HTTPS in production
- [ ] Added rate limiting
- [ ] Implemented CSRF protection
- [ ] Added input validation
- [ ] Using strong passwords
- [ ] Regular security updates
- [ ] Error messages don't expose sensitive data
- [ ] CORS properly configured
- [ ] Database backups implemented

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [bcryptjs Documentation](https://github.com/dcodeIO/bcrypt.js)
- [SQLite Documentation](https://www.sqlite.org/docs.html)

## Common Tasks

### Add a New Endpoint

1. Create controller function in `controllers/userController.js`
2. Add route in `routes/users.js` or `routes/protected.js`
3. Optionally add tests in `tests/auth.test.js`

Example:

```javascript
// In controllers/userController.js
const deleteUser = async (req, res, next) => {
  // Your logic here
};

// In routes/users.js
router.delete("/profile", authenticateToken, userController.deleteUser);
```

### Change Token Expiry

Edit `controllers/userController.js`:

```javascript
const ACCESS_TOKEN_EXPIRY = "30m"; // Change from 15m to 30m
const REFRESH_TOKEN_EXPIRY = "14d"; // Change from 7d to 14d
```

### Add Email Verification

Install nodemailer:

```bash
npm install nodemailer
```

Then add verification logic to registration.

## Need Help?

1. Check the logs in terminal
2. Review error responses from API
3. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Review the code in `controllers/` and `middleware/`

## License

ISC

---

**Ready to go!** Start building your application on top of this API. 🚀
