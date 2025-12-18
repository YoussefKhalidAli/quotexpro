import { Router, Request, Response } from "express";
import db from "../firebase";
import type { Invoice } from "../models/invoice";

const router = Router();
const collection = db.collection("invoices");

router.get("/", async (_req: Request, res: Response) => {
  const snapshot = await collection.get();
  const items = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Invoice)
  );
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (!body.createdAt) body.createdAt = new Date().toISOString();
  const docRef = await collection.add(body);
  const doc = await docRef.get();
  res.status(201).json({ id: doc.id, ...doc.data() } as Invoice);
});

router.get("/:id", async (req: Request, res: Response) => {
  const doc = await collection.doc(req.params.id).get();
  if (!doc.exists) return res.sendStatus(404);
  res.json({ id: doc.id, ...doc.data() } as Invoice);
});

router.put("/:id", async (req: Request, res: Response) => {
  const docRef = collection.doc(req.params.id);
  await docRef.set(req.body, { merge: true });
  const updatedDoc = await docRef.get();
  res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Invoice);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await collection.doc(req.params.id).delete();
  res.sendStatus(204);
});

export default router;
