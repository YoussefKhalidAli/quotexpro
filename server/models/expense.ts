// src/models/expense.ts
export interface Expense {
  id?: string;
  companyID: string;
  title: string;
  amount: number;
  date: string;
  category?: string;
  vendorId?: string;
  vendorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultExpense: Expense = {
  title: "",
  companyID: "",
  amount: 0,
  date: "",
  category: "",
};
