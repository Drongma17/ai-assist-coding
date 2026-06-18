const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Example protected endpoints
router.get("/data", authenticateToken, (req, res) => {
  res.json({
    message: "This is protected data",
    user: req.user,
    data: {
      id: 1,
      name: "Sample Data",
      description: "Only authenticated users can access this",
    },
  });
});

router.post("/action", authenticateToken, (req, res) => {
  res.json({
    message: "Action performed successfully",
    performedBy: req.user.username,
    action: req.body.action || "No action specified",
  });
});

router.get("/user-info", authenticateToken, (req, res) => {
  res.json({
    message: "Your information",
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    },
  });
});

module.exports = router;
