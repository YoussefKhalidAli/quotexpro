import { Router, Response } from "express";
import db from "../firebase";
import type { Customer } from "../models/customer";
import { auth, AuthRequest } from "../middleware/auth";

const router = Router();
const collection = db.collection("customers");

router.use(auth);

// Get all customers for this company
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(401).json({ error: "Unauthorized" });

    const snapshot = await collection.where("companyId", "==", companyId).get();

    const customers: Customer[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Customer)
    );

    res.json(customers || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Create new customer for this company
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const data = {
      ...req.body,
      companyId,
      createdAt: new Date().toISOString(),
    };

    const docRef = await collection.add(data);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Get single customer (must belong to this company)
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const doc = await collection.doc(req.params.id).get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId) return res.sendStatus(403);

    res.json({ id: doc.id, ...doc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// Update existing customer (must belong to this company)
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId) return res.sendStatus(403);

    await docRef.update(req.body);
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// Delete customer (must belong to this company)
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.companyId;
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) return res.sendStatus(404);
    if (doc.data()?.companyId !== companyId) return res.sendStatus(403);

    await docRef.delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
