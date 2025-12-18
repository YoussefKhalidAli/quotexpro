import { Router } from "express";
import db from "../firebase.ts";
import type { Product } from "../models/product.ts";

const router = Router();
const collection = db.collection("products");

router.get("/", async (_req, res) => {
  const snapshot = await collection.get();
  const items = snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Product)
  );
  res.json(items);
});

router.post("/", async (req, res) => {
  const docRef = await collection.add(req.body);
  const doc = await docRef.get();
  res.status(201).json({ id: doc.id, ...doc.data() } as Product);
});

router.put("/:id", async (req, res) => {
  const docRef = collection.doc(req.params.id);
  await docRef.set(req.body, { merge: true });
  const updatedDoc = await docRef.get();
  res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Product);
});

router.delete("/:id", async (req, res) => {
  await collection.doc(req.params.id).delete();
  res.sendStatus(204);
});

export default router;
