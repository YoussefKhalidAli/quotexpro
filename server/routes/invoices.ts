import { Router, Request, Response } from "express";
import db from "../firebase";
import type { Invoice } from "../models/invoice";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();
const collection = db.collection("invoices");

// --- Get all invoices for this company ---
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const snapshot = await collection.where("companyId", "==", companyId).get();
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Invoice)
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// --- Create a new invoice for this company ---
router.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const body = {
      ...req.body,
      companyId,
      createdAt: req.body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await collection.add(body);
    const doc = await docRef.get();

    res.status(201).json({ id: doc.id, ...doc.data() } as Invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create invoice" });
  }
});

// --- Get a single invoice (only if it belongs to this company) ---
router.get("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const doc = await collection.doc(req.params.id).get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId)
      return res.status(403).json({ error: "Forbidden" });

    res.json({ id: doc.id, ...doc.data() } as Invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

// --- Update an invoice (only if it belongs to this company) ---
router.put("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId)
      return res.status(403).json({ error: "Forbidden" });

    await docRef.set(
      { ...req.body, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update invoice" });
  }
});

// --- Delete an invoice (only if it belongs to this company) ---
router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId)
      return res.status(403).json({ error: "Forbidden" });

    await docRef.delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
});

export default router;
