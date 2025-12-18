import { Router, Request, Response } from "express";
import Company from "../models/company";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const doc = (await Company.findOne().lean()) || null;
  if (!doc) return res.json({ error: "Company info not found" });
  res.json(doc);
});

router.get("/:id", async (_req: Request, res: Response) => {
  const doc = (await Company.findOne().lean()) || null;
  if (!doc) return res.sendStatus(404);
  res.json(doc);
});

router.put("/", async (req: Request, res: Response) => {
  const update = req.body;
  let doc = await Company.findOne();
  if (!doc) {
    const created = new Company(update);
    await created.save();
    return res.json(created.toJSON());
  }
  Object.assign(doc, update);
  await doc.save();
  res.json(doc.toJSON());
});

export default router;
