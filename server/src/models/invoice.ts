import mongoose, { Schema } from "mongoose";

const InvoiceItemSchema = new Schema(
  {
    id: { type: String },
    productId: { type: String },
    desc: { type: String },
    qty: { type: Number },
    price: { type: Number },
  },
  { _id: false }
);

const InvoiceSchema = new Schema(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, default: "" },
    customerDetails: { type: Schema.Types.Mixed },
    items: { type: [InvoiceItemSchema], default: [] },
    notes: { type: String, default: "" },
    subtotal: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, default: "quotation" },
    createdAt: { type: String },
    dueDate: { type: String },
  },
  { timestamps: true }
);

InvoiceSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Invoice", InvoiceSchema);
