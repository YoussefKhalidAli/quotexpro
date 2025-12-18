import mongoose, { Schema } from "mongoose";

const ExpenseSchema = new Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    category: { type: String, default: "" },
    vendorId: { type: String },
    vendorName: { type: String },
  },
  { timestamps: true }
);

ExpenseSchema.set("toJSON", {
  transform: (_doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model("Expense", ExpenseSchema);
