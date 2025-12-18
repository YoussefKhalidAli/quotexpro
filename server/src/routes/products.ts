import { Router, Request, Response } from "express";
import Product from "../models/product";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await Product.find().lean();
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const doc = new Product(req.body);
  await doc.save();
  res.status(201).json(doc.toJSON());
});

router.put("/:id", async (req: Request, res: Response) => {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.sendStatus(404);
  res.json(item.toJSON());
});

router.delete("/:id", async (req: Request, res: Response) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
