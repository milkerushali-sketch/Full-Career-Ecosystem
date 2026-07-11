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

// PUT /auth/account — edit name/email (the account-level fields, separate from the
// student-profile fields handled by PUT /students/profile)
router.put("/auth/account", requireAuth, async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }
  const normalizedEmail = String(email).toLowerCase().trim();

  const [conflict] = await db.select().from(usersTable).where(eq(usersTable.email, normalizedEmail));
  if (conflict && conflict.id !== uid) {
    res.status(400).json({ error: "Email is already in use by another account" });
    return;
  }

  const [updated] = await db.update(usersTable)
    .set({ name: String(name).trim(), email: normalizedEmail })
    .where(eq(usersTable.id, uid))
    .returning();

  const token = signToken({ userId: updated.id, role: updated.role, email: updated.email });
  const { passwordHash: _ph, ...safeUser } = updated;
  res.json({ token, user: safeUser });
});

// PUT /auth/password — change password (requires the current password)
router.put("/auth/password", requireAuth, async (req, res): Promise<void> => {
  const uid = req.user!.userId;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Current and new password are required" });
    return;
  }
  if (String(newPassword).length < 6) {
    res.status(400).json({ error: "New password must be at least 6 characters" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Current password is incorrect" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, uid));

  logger.info({ userId: uid }, "Password changed");
  res.json({ success: true });
});

export default router;
