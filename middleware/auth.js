const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token is required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ error: "Token has expired" });
        }
        return res.status(403).json({ error: "Invalid token" });
      }

      req.user = user;
      next();
    },
  );
};

const authenticateRefreshToken = (req, res, next) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Invalid refresh token" });
      }

      req.user = user;
      next();
    },
  );
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken,
};
