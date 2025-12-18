import { Router, Request, Response } from "express";
import db from "../firebase";
import type { Expense } from "../models/expense";

const router = Router();
const collection = db.collection("expenses");

router.get("/", async (_req: Request, res: Response) => {
  try {
    const snapshot = await collection.get();
    const items = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Expense)
    );
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const docRef = await collection.add(req.body);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() } as Expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const docRef = collection.doc(req.params.id);
    await docRef.set(req.body, { merge: true });
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update expense" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await collection.doc(req.params.id).delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

export default router;
