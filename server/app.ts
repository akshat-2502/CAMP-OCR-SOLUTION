import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { User } from "./models/User";
import { authenticateToken, requireAdmin } from "./middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-12345";

export async function createApiApp(isDev = process.env.NODE_ENV !== "production") {
  const app = express();
  app.use(express.json({ limit: "50mb" }));

  app.post("/api/auth/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "its_akii_25" && password === "Iwanttobuybmwormercedes") {
      const token = jwt.sign({ username: "its_akii_25", role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
      return res.json({ token, user: { username: "its_akii_25", role: "admin" } });
    }
    return res.status(401).json({ error: "Invalid credentials" });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ username: user.username, role: "user" }, JWT_SECRET, { expiresIn: "24h" });
      res.json({ token, user: { username: user.username, role: "user" } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await User.find({}, "username _id");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Error fetching users" });
    }
  });

  app.post("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) return res.status(400).json({ error: "Username and password required" });

      const existing = await User.findOne({ username });
      if (existing) return res.status(400).json({ error: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new User({ username, password: hashedPassword });
      await user.save();

      res.json({ message: "User created successfully", user: { id: user._id, username: user.username } });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, requireAdmin, async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  });

  app.get("/api/fetch-pdf", authenticateToken, async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const base64 = Buffer.from(response.data).toString("base64");
      res.json({ base64 });
    } catch (error) {
      console.error("Fetch PDF error:", error);
      res.status(500).json({ error: "Failed to fetch PDF from the provided URL" });
    }
  });

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}
