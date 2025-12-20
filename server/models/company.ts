// src/models/company.ts
export interface Company {
  id?: string; // Firestore document ID
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  taxId: string;
  header: string;
  footer: string;
  currency: string;
  taxEnabled: boolean;
  taxRate: number;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultCompany: Company = {
  name: "",
  address: "",
  phone: "",
  email: "",
  password: "",
  taxId: "",
  header: "",
  footer: "",
  currency: "AED",
  taxEnabled: false,
  taxRate: 5,
};
