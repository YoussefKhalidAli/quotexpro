import { Router, Request, Response } from "express";
import db from "../firebase";
import type { Vendor } from "../models/vendor";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();
const collection = db.collection("vendors");

// --- Get all vendors for this company ---
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const snapshot = await collection.where("companyId", "==", companyId).get();
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Vendor)
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

// --- Create a new vendor for this company ---
router.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const data = {
      ...req.body,
      companyId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await collection.add(data);
    const doc = await docRef.get();

    res.status(201).json({ id: doc.id, ...doc.data() } as Vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create vendor" });
  }
});

// --- Update a vendor (only if it belongs to this company) ---
router.put("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Vendor not found" });
    if (doc.data()?.companyId !== companyId)
      return res.status(403).json({ error: "Forbidden" });

    await docRef.set(
      { ...req.body, updatedAt: new Date().toISOString() },
      { merge: true }
    );

    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Vendor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update vendor" });
  }
});

// --- Delete a vendor (only if it belongs to this company) ---
router.delete("/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Vendor not found" });
    if (doc.data()?.companyId !== companyId)
      return res.status(403).json({ error: "Forbidden" });

    await docRef.delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete vendor" });
  }
});

export default router;
