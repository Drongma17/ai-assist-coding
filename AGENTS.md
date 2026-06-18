# AI Agent Instructions for Express JWT/SQLite REST API

This file guides AI agents on how to work productively with this codebase.

## Quick Project Overview

**Express REST API** with JWT authentication and SQLite database. See [README.md](README.md) for full details and [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint reference.

**Key tech:** Express.js, JWT (jsonwebtoken), SQLite3, bcryptjs, nodemon

## Build & Run Commands

```bash
npm install              # Install dependencies
npm run dev             # Start dev server (port 3000, auto-reload)
npm start               # Start production server
npm test                # Run Jest tests
```

Server logs to console; database auto-initializes at `data/app.db`.

## Architecture Essentials

### Pattern: Controllers → Routes → Middleware

- **Controllers** (`controllers/userController.js`): Business logic, validation, DB calls
- **Routes** (`routes/users.js`, `routes/protected.js`): Endpoint definitions + middleware stacking
- **Middleware** (`middleware/auth.js`, `middleware/errorHandler.js`): Cross-cutting concerns
- **Database** (`config/database.js`): Promisified SQLite (dbRun, dbGet, dbAll)

### Error Handling

- Throw `new AppError(message, statusCode)` from controllers
- Pass to `next(error)` in route handlers
- `errorHandler` middleware formats as: `{ error, status, timestamp }`

### Authentication Flow

1. User registers → password hashed (bcryptjs), 2 tokens generated
2. Tokens: access (15m) in header `Authorization: Bearer <token>`, refresh (7d) in body
3. Protected routes use `authenticateToken` middleware to verify JWT
4. Refresh token endpoint generates new access token (don't use expired token)

## Key Files & When to Edit

| File                                                           | Purpose                     | Common Tasks                                                           |
| -------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------- |
| [controllers/userController.js](controllers/userController.js) | User auth & profile logic   | Add new auth endpoints, validation rules, token handling               |
| [routes/users.js](routes/users.js)                             | Auth route definitions      | Add/modify auth endpoints, protect new routes with `authenticateToken` |
| [routes/protected.js](routes/protected.js)                     | Protected endpoint examples | Add authenticated feature endpoints                                    |
| [middleware/auth.js](middleware/auth.js)                       | JWT verification            | Modify token extraction logic or add role-based auth                   |
| [middleware/errorHandler.js](middleware/errorHandler.js)       | Error formatting            | Adjust error response structure                                        |
| [config/database.js](config/database.js)                       | SQLite initialization       | Modify schema, add tables, adjust promisified methods                  |
| [server.js](server.js)                                         | Express app setup           | Add middleware, change port, add new route groups                      |

## Database Schema

**users table:**

```sql
id (INTEGER PRIMARY KEY), email (UNIQUE), username (UNIQUE),
password (TEXT hashed), created_at (DATETIME), updated_at (DATETIME)
```

**refresh_tokens table:**

```sql
id (PRIMARY KEY), user_id (FOREIGN KEY), token (UNIQUE JWT),
expires_at (DATETIME), created_at (DATETIME)
```

Foreign keys enabled at startup. Use parameterized SQL to prevent injection.

## Development Conventions

### Code Style

- **async/await throughout** — no callbacks, all DB calls promisified
- **Error handling:** try-catch in controllers, `next(error)` in routes
- **Validation:** Check fields exist, match patterns, meet constraints before DB queries
- **DB columns:** snake_case (e.g., `user_id`, `created_at`); JS objects use camelCase
- **Responses:** Include `message` field, nest data in `user` or `data` keys, use status codes correctly

### Token & Auth

- **Access tokens:** 15 minutes, passed as `Authorization: Bearer <token>` header
- **Refresh tokens:** 7 days, sent in request body `{ refreshToken: "..." }`
- **Password validation:** Minimum 6 characters, confirmed on register, hashed with bcryptjs
- **Protected routes:** Always use `authenticateToken` middleware, access user info via `req.user`

### Testing

- Tests in `tests/**.test.js`, run with `npm test`
- Use supertest for HTTP testing, jest for assertions
- Test both success and error cases (missing fields, invalid tokens, duplicates)

## Common Pitfalls to Avoid

1. **Token expiry not handled** — Access tokens expire in 15m; client must use refresh endpoint with refresh token. Don't assume tokens last forever.

2. **Missing .env file** — JWT secrets default to hardcoded values. Always check `.env` exists for production; update `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values.

3. **Mixing sync/async DB calls** — All DB methods are promisified (dbRun, dbGet, dbAll). Never mix callbacks with promises; always await.

4. **Stale refresh tokens** — Expired refresh tokens are not auto-deleted. When adding logout/token revocation, delete from `refresh_tokens` table.

5. **No role-based authorization** — Auth middleware only checks if token is valid. `/api/auth/users` endpoint is accessible to any authenticated user. Add role checks if needed.

6. **CORS misconfiguration** — CORS is enabled but origins should be restricted in production. Update `.env` `CORS_ORIGIN` accordingly.

7. **Concurrent modifications race conditions** — No locking on user registration. Email uniqueness enforced at DB level, but consider transaction handling for multi-step updates.

8. **No password change endpoint** — Users can only set password once during registration. Add `/api/auth/change-password` if password reset needed.

## Extending the API

### Add a New Protected Endpoint

1. Create logic in `controllers/userController.js`
2. Add route in `routes/users.js` or `routes/protected.js` with `authenticateToken` middleware
3. Add tests in `tests/auth.test.js`
4. Document in [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

Example:

```javascript
// Controller
const deleteProfile = async (req, res, next) => {
  try {
    await dbRun("DELETE FROM users WHERE id = ?", [req.user.id]);
    res.json({ message: "Account deleted" });
  } catch (error) {
    next(error);
  }
};

// Route
router.delete("/profile", authenticateToken, userController.deleteProfile);
```

### Add a New Database Table

1. Add `db.run(CREATE TABLE...)` in [config/database.js](config/database.js) → `initializeDatabase()` function
2. Create promisified helper methods in exports (dbRun, dbGet, dbAll already exist)
3. Use parameterized queries to prevent SQL injection

### Add Input Validation

- Validate in controller before DB query
- Use patterns for email (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), username, etc.
- Throw `AppError(message, 400)` for validation failures

## Useful Links

- [README.md](README.md) — Full documentation, features, security checklist
- [QUICK_START.md](QUICK_START.md) — Getting started, installation, testing with cURL
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) — All endpoint specs, request/response examples, HTTP status codes
- [package.json](package.json) — Dependencies and versions
- [.env](.env) — Environment variables (change JWT secrets for production)

---

**Last Updated:** 2026-06-17

When in doubt, check the existing code in `controllers/userController.js` and `middleware/auth.js`—they exemplify the patterns used throughout.
