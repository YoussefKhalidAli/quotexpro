import { Router, Request, Response } from "express";
import Vendor from "../models/vendor";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const items = await Vendor.find().lean();
  res.json(items);
});

router.post("/", async (req: Request, res: Response) => {
  const doc = new Vendor(req.body);
  await doc.save();
  res.status(201).json(doc.toJSON());
});

router.put("/:id", async (req: Request, res: Response) => {
  const item = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.sendStatus(404);
  res.json(item.toJSON());
});

router.delete("/:id", async (req: Request, res: Response) => {
  await Vendor.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
