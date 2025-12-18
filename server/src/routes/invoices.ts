import { Router, Request, Response } from "express";
import Invoice from "../models/invoice";

const router = Router();

const normalizeInvoice = (inv: any) => ({
  ...inv,
  id: inv._id?.toString(),
  total:
    typeof inv.total === "object" && inv.total?.$numberInt
      ? Number(inv.total.$numberInt)
      : inv.total,
  createdAt: inv.createdAt
    ? new Date(inv.createdAt).toISOString()
    : new Date().toISOString(),
});

router.get("/", async (_req: Request, res: Response) => {
  const items = await Invoice.find().lean();
  const normalized = items.map(normalizeInvoice);
  res.json(normalized);
});

router.post("/", async (req: Request, res: Response) => {
  const body = { ...req.body };
  if (!body.createdAt) body.createdAt = new Date().toISOString();
  const doc = new Invoice(body);
  await doc.save();

  res.status(201).json(normalizeInvoice(doc));
});

router.get("/:id", async (req: Request, res: Response) => {
  const item = await Invoice.findById(req.params.id).lean();
  if (!item) return res.sendStatus(404);
  res.json(normalizeInvoice(item));
});

router.put("/:id", async (req: Request, res: Response) => {
  const item = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!item) return res.sendStatus(404);
  res.json(normalizeInvoice(item.toJSON()));
});

router.delete("/:id", async (req: Request, res: Response) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;
