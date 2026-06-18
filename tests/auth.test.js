const request = require("supertest");
const app = require("../server");
const { dbRun } = require("../config/database");

describe("Authentication API", () => {
  let accessToken;
  let refreshToken;
  let userId;

  beforeAll(async () => {
    // Initialize database before tests
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        username: "testuser",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("tokens.accessToken");
      expect(res.body).toHaveProperty("tokens.refreshToken");
      expect(res.body.user.email).toBe("test@example.com");

      accessToken = res.body.tokens.accessToken;
      refreshToken = res.body.tokens.refreshToken;
      userId = res.body.user.id;
    });

    it("should fail if passwords do not match", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test2@example.com",
        username: "testuser2",
        password: "password123",
        confirmPassword: "password456",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should fail if email already exists", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@example.com",
        username: "newusername",
        password: "password123",
        confirmPassword: "password123",
      });

      expect(res.statusCode).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("tokens.accessToken");
      expect(res.body.user.email).toBe("test@example.com");

      accessToken = res.body.tokens.accessToken;
    });

    it("should fail with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(401);
    });

    it("should fail with non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("Protected Routes", () => {
    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get("/api/protected/data")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
    });

    it("should fail without token", async () => {
      const res = await request(app).get("/api/protected/data");

      expect(res.statusCode).toBe(401);
    });

    it("should fail with invalid token", async () => {
      const res = await request(app)
        .get("/api/protected/data")
        .set("Authorization", "Bearer invalid_token");

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/auth/profile", () => {
    it("should get user profile", async () => {
      const res = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe("test@example.com");
      expect(res.body.username).toBe("testuser");
    });
  });

  describe("PUT /api/auth/profile", () => {
    it("should update user profile", async () => {
      const res = await request(app)
        .put("/api/auth/profile")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
          username: "updateduser",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.user.username).toBe("updateduser");
    });
  });

  describe("POST /api/auth/refresh", () => {
    it("should refresh access token", async () => {
      const res = await request(app).post("/api/auth/refresh").send({
        refreshToken: refreshToken,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should fail with invalid refresh token", async () => {
      const res = await request(app).post("/api/auth/refresh").send({
        refreshToken: "invalid_token",
      });

      expect(res.statusCode).toBe(403);
    });
  });

  describe("GET /api/health", () => {
    it("should return server health status", async () => {
      const res = await request(app).get("/api/health");

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe("OK");
    });
  });
});
