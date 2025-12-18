import { Router, Request, Response } from "express";
import Customer from "../models/customer";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await Customer.find().lean();
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const doc = new Customer(req.body);
  await doc.save();
  res.status(201).json(doc.toJSON());
});

router.get("/:id", async (req: Request, res: Response) => {
  const item = await Customer.findById(req.params.id).lean();
  if (!item) return res.sendStatus(404);
  res.json(item);
});

router.put("/:id", async (req: Request, res: Response) => {
  const item = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.sendStatus(404);
  res.json(item.toJSON());
});

router.delete("/:id", async (req: Request, res: Response) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
