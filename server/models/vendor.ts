// src/models/vendor.ts
export interface Vendor {
  id?: string;
  companyID: string;
  name: string;
  phone?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultVendor: Vendor = {
  name: "",
  companyID: "",
  phone: "",
  note: "",
};
