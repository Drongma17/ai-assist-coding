const express = require("express");
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/refresh", userController.refreshAccessToken);

// Protected routes
router.get("/profile", authenticateToken, userController.getUserProfile);
router.put("/profile", authenticateToken, userController.updateUserProfile);
router.post("/logout", authenticateToken, userController.logout);

// Admin route
router.get("/users", authenticateToken, userController.getAllUsers);

module.exports = router;
