import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  Customer,
  Vendor,
  Invoice,
  Expense,
  CompanySettings,
  Product,
} from "../types";

const API_BASE = import.meta.env.VITE_APP_API_BASE;

interface DataContextType {
  customers: Customer[];
  vendors: Vendor[];
  invoices: Invoice[];
  expenses: Expense[];
  products: Product[];
  company: CompanySettings;

  addCustomer: (c: Omit<Customer, "id">) => Promise<void>;
  updateCustomer: (id: string, c: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  addVendor: (v: Omit<Vendor, "id">) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;

  addProduct: (p: Omit<Product, "id">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addInvoice: (i: Omit<Invoice, "id" | "createdAt">) => Promise<string>;
  updateInvoice: (id: string, i: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  addExpense: (e: Omit<Expense, "id">) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  updateCompany: (c: CompanySettings) => Promise<void>;

  // Bulk Import Helpers
  importData: (
    type: "customers" | "vendors" | "products" | "invoices",
    data: any[]
  ) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

// Data is now persisted on server API. Frontend keeps local state and syncs via REST. Company data is stored localy
const COMPANY_STORAGE_KEY = "company_settings";
const defaultCompany: CompanySettings = {
  name: "Acme Corp",
  address: "123 Business Rd, Tech City",
  phone: "+1 234 567 890",
  email: "contact@acmecorp.com",
  taxId: "TAX-12345678",
  header: "INVOICE",
  footer: "Thank you for your business. Please pay within 30 days.",
  currency: "AED",
  taxEnabled: false,
  taxRate: 5,
};

export const DataProvider = ({ children }: { children?: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [company, setCompany] = useState<CompanySettings>(defaultCompany);

  // Helpers
  const handleError = async (res: Response) => {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res.json().catch(() => null);
  };

  // Load initial data from API
  useEffect(() => {
    const load = async () => {
      try {
        const [c, v, p, i, e /* co */] = await Promise.all([
          fetch(`${API_BASE}/customers`).then((r) => r.json()),
          fetch(`${API_BASE}/vendors`).then((r) => r.json()),
          fetch(`${API_BASE}/products`).then((r) => r.json()),
          fetch(`${API_BASE}/invoices`).then((r) => r.json()),
          fetch(`${API_BASE}/expenses`).then((r) => r.json()),
        ]);

        setCustomers(c);
        setVendors(v);
        setProducts(p);
        setInvoices(i);
        setExpenses(e);

        const raw = localStorage.getItem(COMPANY_STORAGE_KEY);
        if (!raw) setCompany(defaultCompany);
        else {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object" && "name" in parsed) {
            setCompany(parsed as CompanySettings);
          }
        }
      } catch (err) {
        console.error("Failed to load data from API", err);
      }
    };
    load();
  }, []);

  // --- Customers ---
  const addCustomer = async (data: Omit<Customer, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await handleError(res);
      setCustomers((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await handleError(res);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Vendors ---
  const addVendor = async (data: Omit<Vendor, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await handleError(res);
      setVendors((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/vendors/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setVendors((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Products ---
  const addProduct = async (data: Omit<Product, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await handleError(res);
      setProducts((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await handleError(res);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Invoices ---
  const addInvoice = async (data: Omit<Invoice, "id" | "createdAt">) => {
    try {
      const res = await fetch(`${API_BASE}/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await handleError(res);

      setInvoices((prev) => [...prev, created]);

      return created.id;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      const res = await fetch(`${API_BASE}/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await handleError(res);
      setInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updated } : i))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/invoices/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Expenses ---
  const addExpense = async (data: Omit<Expense, "id">) => {
    try {
      const res = await fetch(`${API_BASE}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await handleError(res);
      setExpenses((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/expenses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Settings ---
  const updateCompany = async (data: CompanySettings) => {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(data));

      setCompany(data);
    } catch (err) {
      console.error("Failed to save company settings", err);
    }
  };

  // --- Bulk Import ---
  const importData = async (
    type: "customers" | "vendors" | "products" | "invoices",
    data: any[]
  ) => {
    // Simple import: POST each item to relevant endpoint.
    try {
      const endpoint = `${API_BASE}/${type}`;
      const created: any[] = [];
      for (const item of data) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        });
        const json = await handleError(res);
        if (json) created.push(json);
      }
      if (type === "customers") setCustomers((prev) => [...prev, ...created]);
      if (type === "vendors") setVendors((prev) => [...prev, ...created]);
      if (type === "products") setProducts((prev) => [...prev, ...created]);
      if (type === "invoices") setInvoices((prev) => [...prev, ...created]);
    } catch (err) {
      console.error("Import failed", err);
    }
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        vendors,
        invoices,
        expenses,
        products,
        company,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addVendor,
        deleteVendor,
        addProduct,
        updateProduct,
        deleteProduct,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addExpense,
        deleteExpense,
        updateCompany,
        importData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
