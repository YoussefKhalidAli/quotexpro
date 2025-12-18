import { Router, Request, Response } from "express";
import db from "../firebase";
import type { Vendor } from "../models/vendor";

const router = Router();
const collection = db.collection("vendors");

router.get("/", async (_req: Request, res: Response) => {
  const snapshot = await collection.get();
  const items = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Vendor)
  );
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const docRef = await collection.add(req.body);
  const doc = await docRef.get();
  res.status(201).json({ id: doc.id, ...doc.data() } as Vendor);
});

router.put("/:id", async (req: Request, res: Response) => {
  const docRef = collection.doc(req.params.id);
  await docRef.set(req.body, { merge: true });
  const updatedDoc = await docRef.get();
  res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Vendor);
});

router.delete("/:id", async (req: Request, res: Response) => {
  await collection.doc(req.params.id).delete();
  res.sendStatus(204);
});

export default router;
