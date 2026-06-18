const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { dbRun, dbGet, dbAll } = require("../config/database");
const { AppError } = require("../middleware/errorHandler");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
};

// Register user
const register = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      throw new AppError("All fields are required", 400);
    }

    if (password !== confirmPassword) {
      throw new AppError("Passwords do not match", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters long", 400);
    }

    // Check if user already exists
    const existingUser = await dbGet(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username],
    );

    if (existingUser) {
      throw new AppError("Email or username already in use", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await dbRun(
      "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
      [email, username, hashedPassword],
    );

    const user = {
      id: result.id,
      email,
      username,
    };

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token
    const expiryDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    await dbRun(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiryDate],
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    // Find user
    const user = await dbGet(
      "SELECT id, email, username, password FROM users WHERE email = ?",
      [email],
    );

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate tokens
    const userData = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);

    // Store refresh token
    const expiryDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    await dbRun(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiryDate],
    );

    res.json({
      message: "Login successful",
      user: userData,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh token
const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    // Get user
    const user = await dbGet(
      "SELECT id, email, username FROM users WHERE id = ?",
      [decoded.id],
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.json({
      accessToken,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new AppError("Invalid refresh token", 403));
    } else {
      next(error);
    }
  }
};

// Get all users (admin endpoint)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await dbAll(
      "SELECT id, email, username, created_at FROM users",
    );
    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await dbGet(
      "SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?",
      [userId],
    );

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username && !email) {
      throw new AppError("At least one field is required to update", 400);
    }

    let query = "UPDATE users SET updated_at = CURRENT_TIMESTAMP";
    const params = [];

    if (username) {
      query += ", username = ?";
      params.push(username);
    }

    if (email) {
      query += ", email = ?";
      params.push(email);
    }

    query += " WHERE id = ?";
    params.push(userId);

    await dbRun(query, params);

    const user = await dbGet(
      "SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?",
      [userId],
    );

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Logout (invalidate refresh token)
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await dbRun("DELETE FROM refresh_tokens WHERE token = ?", [refreshToken]);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  logout,
};
