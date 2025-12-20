export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface Vendor {
  id: string;
  name: string;
  phone: string;
  note: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku?: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string; // Link to a product
  desc: string;
  qty: number;
  price: number;
}

export type InvoiceStatus =
  | "quotation"
  | "approved"
  | "invoiced"
  | "paid"
  | "completed";

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string; // Snapshot for display if customer deleted
  customerDetails?: Customer; // Snapshot of full details at time of invoice
  items: InvoiceItem[];
  notes: string;

  // Financials
  subtotal: number;
  taxRate: number; // Stored at creation time
  taxAmount: number;
  total: number;

  status: InvoiceStatus;
  createdAt: string;
  dueDate?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO date
  category?: string;
  vendorId?: string; // Linked vendor
  vendorName?: string; // Snapshot
}

export interface CompanySettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  taxId: string;
  header: string;
  footer: string;
  currency: string;
  password: string;

  // Tax Settings
  taxEnabled: boolean;
  taxRate: number; // Percentage, e.g. 5
}

export interface DashboardStats {
  income: number;
  expenses: number;
  balance: number;
  invoiceCount: number;
}
