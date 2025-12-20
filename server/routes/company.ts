import { Router, Request, Response } from "express";
import db from "../firebase";
import { signToken } from "../utils/jwt";
import { auth, AuthRequest } from "../middleware/auth";
import bcrypt from "bcrypt";
import type { Company } from "../models/company";

const router = Router();
const collection = db.collection("companies");

// --- Register ---
router.post("/register", async (req: Request, res: Response) => {
  try {
    const data = req.body as Company;

    // Check if company already exists by email
    const existing = await collection
      .where("email", "==", data.email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ error: "Company already exists" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const docRef = await collection.add({
      ...data,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const token = signToken({
      companyId: docRef.id,
      email: data.email,
    });

    res.status(201).json({
      token,
      company: {
        id: docRef.id,
        ...data,
        password: undefined, // never return password
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// --- Login ---
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const snapshot = await collection
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doc = snapshot.docs[0];
    const company = { id: doc.id, ...doc.data() } as any;

    // Compare password hash
    const match = await bcrypt.compare(password, company.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({
      companyId: doc.id,
      email,
    });

    // Remove password before sending
    delete company.password;

    res.json({ token, company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// --- Get current company ---
router.get("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const doc = await collection.doc(companyId).get();
    if (!doc.exists) return res.sendStatus(404);

    res.json({ id: doc.id, ...doc.data(), password: undefined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch company" });
  }
});

// --- Update current company ---
router.put("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    const docRef = collection.doc(req.user!.companyId);

    // If password is being updated, hash it
    const data = { ...req.body } as any;
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await docRef.update({
      ...data,
      updatedAt: new Date().toISOString(),
    });

    const updated = await docRef.get();

    res.json({
      id: updated.id,
      ...updated.data(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update company" });
  }
});

// --- Delete current company ---
router.delete("/me", auth, async (req: AuthRequest, res: Response) => {
  try {
    await collection.doc(req.user!.companyId).delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

export default router;
