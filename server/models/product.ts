// src/models/product.ts
export interface Product {
  id?: string;
  companyID: string;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultProduct: Product = {
  name: "",
  companyID: "",
  description: "",
  price: 0,
  sku: "",
};
