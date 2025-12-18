import mongoose, { Schema } from "mongoose";

const CompanySchema = new Schema(
  {
    name: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    taxId: { type: String, default: "" },
    header: { type: String, default: "" },
    footer: { type: String, default: "" },
    currency: { type: String, default: "AED" },
    taxEnabled: { type: Boolean, default: false },
    taxRate: { type: Number, default: 5 },
  },
  { timestamps: true }
);

CompanySchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Company", CompanySchema);
