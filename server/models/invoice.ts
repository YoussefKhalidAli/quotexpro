// src/models/invoice.ts

export interface InvoiceItem {
  id?: string;
  productId?: string;
  desc?: string;
  qty?: number;
  price?: number;
}

export interface Invoice {
  id?: string;
  customerId: string;
  customerName?: string;
  customerDetails?: Record<string, any>;
  items: InvoiceItem[];
  notes?: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: string;
  createdAt?: string;
  dueDate?: string;
  updatedAt?: string;
}

export const defaultInvoice: Invoice = {
  customerId: "",
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  status: "quotation",
};
