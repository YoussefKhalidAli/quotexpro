// src/models/vendor.ts
export interface Vendor {
  id?: string;
  name: string;
  phone?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultVendor: Vendor = {
  name: "",
  phone: "",
  note: "",
};
