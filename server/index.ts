// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";

// Import routes
import customersRouter from "./routes/customers";
import vendorsRouter from "./routes/vendors";
import productsRouter from "./routes/products";
import invoicesRouter from "./routes/invoices";
import expensesRouter from "./routes/expenses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) =>
  res.json({ ok: true })
);

// Mount all routes
app.use("/api/customers", customersRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/products", productsRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/expenses", expensesRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    "Firestore routes ready (connect to emulator if running locally)"
  );
});
