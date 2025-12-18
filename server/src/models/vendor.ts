import mongoose, { Schema } from "mongoose";

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

VendorSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Vendor", VendorSchema);
