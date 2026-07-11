import { Router } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usersTable, studentProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth } from "../lib/auth";
import { logger } from "../lib/logger";

const router = Router();

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  if (!user.isActive) {
    res.status(401).json({ error: "Account is inactive" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, role: user.role, email: user.email });
  const { passwordHash: _ph, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /auth/register
router.post("/auth/register", async (req, res): Promise<void> => {
  // Public registration always creates students; privileged roles require admin action
  const { name, email, password, departmentId, rollNo, batch } = req.body;
  const role = "student"; // force to student — only admins can create officer/admin accounts
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password are required" });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase().trim()));
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    role,
    isActive: true,
    departmentId: departmentId || null,
  }).returning();

  // Auto-create student profile
  if (user.role === "student") {
    await db.insert(studentProfilesTable).values({
      userId: user.id,
      rollNo: rollNo || null,
      batch: batch || null,
    });
  }

  logger.info({ userId: user.id, role }, "New user registered");
  const token = signToken({ userId: user.id, role: user.role, email: user.email });
  const { passwordHash: _ph, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
});

// GET /auth/me
router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user!.userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  const { passwordHash: _ph, ...safeUser } = user;
  res.json(safeUser);
});

export default router;
