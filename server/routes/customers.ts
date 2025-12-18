// src/routes/customers.ts
import { Router } from "express";
import db from "../firebase.ts"; // your initialized Firestore
import type { Customer } from "../models/customer.ts";

const router = Router();
const collection = db.collection("customers");

// Get all customers
router.get("/", async (_req, res) => {
  try {
    const snapshot = await collection.get();
    const customers = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Customer)
    );
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Create new customer
router.post("/", async (req, res) => {
  try {
    const docRef = await collection.add(req.body);
    const doc = await docRef.get();
    res.status(201).json({ id: doc.id, ...doc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Get single customer by ID
router.get("/:id", async (req, res) => {
  try {
    const doc = await collection.doc(req.params.id).get();
    if (!doc.exists) return res.sendStatus(404);
    res.json({ id: doc.id, ...doc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// Update existing customer
router.put("/:id", async (req, res) => {
  try {
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.sendStatus(404);

    await docRef.update(req.body); // only updates existing doc
    const updatedDoc = await docRef.get();
    res.json({ id: updatedDoc.id, ...updatedDoc.data() } as Customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const docRef = collection.doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) return res.sendStatus(404);

    await docRef.delete();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;
