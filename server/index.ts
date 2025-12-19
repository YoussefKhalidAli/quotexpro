import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import customersRouter from "./routes/customers";
import vendorsRouter from "./routes/vendors";
import productsRouter from "./routes/products";
import invoicesRouter from "./routes/invoices";
import expensesRouter from "./routes/expenses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) =>
  res.json({ ok: true })
);

app.use("/api/customers", customersRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/products", productsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/expenses", expensesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Firestore routes ready");
});
