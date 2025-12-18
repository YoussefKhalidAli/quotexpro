import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import customersRouter from "./routes/customers";
import vendorsRouter from "./routes/vendors";
import productsRouter from "./routes/products";
import invoicesRouter from "./routes/invoices";
import expensesRouter from "./routes/expenses";
import companyRouter from "./routes/company";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

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
app.use("/api/company", companyRouter);

async function start() {
  if (!MONGO_URI) {
    console.error("MONGO_URI not set in environment");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

start();
