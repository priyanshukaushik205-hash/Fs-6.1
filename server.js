const express = require("express");
const app = express();
const PORT = 3000;

// -------------------- Middleware 1: Logger --------------------
const loggerMiddleware = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
};

// -------------------- Middleware 2: Token Authentication --------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if header exists and follows "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authorization header missing or incorrect",
    });
  }

  const token = authHeader.split(" ")[1];

  // Check if token is correct
  if (token !== "mysecrettoken") {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }

  next(); // Token is valid → continue
};

// Apply logger globally
app.use(loggerMiddleware);

// -------------------- Public Route --------------------
app.get("/public", (req, res) => {
  res.status(200).send("This is a public route. No authentication required.");
});

// -------------------- Protected Route --------------------
app.get("/protected", authMiddleware, (req, res) => {
  res
    .status(200)
    .send("You have accessed a protected route with a valid Bearer token!");
});

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
