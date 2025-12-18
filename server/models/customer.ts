// src/models/customer.ts
export interface Customer {
  id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  address: "",
};
