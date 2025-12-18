import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Invoice, InvoiceItem, InvoiceStatus } from "../types";
import { Plus, Trash2, Save, ArrowLeft, UserPlus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function InvoiceEditor() {
  const { id } = useParams(); // If present, editing
  const navigate = useNavigate();
  const { customers, invoices, products, addInvoice, updateInvoice, company } =
    useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<Invoice>>({
    customerId: "",
    customerName: "",
    items: [{ id: uuidv4(), desc: "", qty: 1, price: 0 }],
    notes: "",
    status: "quotation",
    total: 0,
    subtotal: 0,
    taxRate: company.taxEnabled ? company.taxRate : 0,
    taxAmount: 0,
  });

  useEffect(() => {
    if (isEditing && id) {
      const existing = invoices.find((i) => i.id === id);
      if (existing) {
        setFormData(existing);
      } else {
        alert("Invoice not found");
        navigate("/invoices");
      }
    } else {
      // Initialize tax for new invoice
      setFormData((prev) => ({
        ...prev,
        taxRate: company.taxEnabled ? company.taxRate : 0,
      }));
    }
  }, [id, invoices, isEditing, navigate, company.taxEnabled, company.taxRate]);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const custId = e.target.value;
    const cust = customers.find((c) => c.id === custId);
    if (cust) {
      setFormData((prev) => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        customerDetails: cust,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: "",
        customerName: "",
        customerDetails: undefined,
      }));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: any
  ) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  // Special handler for selecting a predefined product
  const handleProductSelect = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const newItems = [...(formData.items || [])];
      newItems[index] = {
        ...newItems[index],
        productId: product.id,
        desc:
          product.name +
          (product.description ? ` - ${product.description}` : ""),
        price: product.price,
      };
      setFormData((prev) => ({ ...prev, items: newItems }));
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { id: uuidv4(), desc: "", qty: 1, price: 0 },
      ],
    }));
  };

  const removeItem = (index: number) => {
    if ((formData.items?.length || 0) <= 1) return;
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const calculateTotals = () => {
    const subtotal = (formData.items || []).reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
    const taxRate = formData.taxRate || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSave = async (status?: InvoiceStatus) => {
    const { subtotal, taxAmount, total } = calculateTotals();
    const finalData = {
      ...formData,
      subtotal,
      taxAmount,
      total,
      status: status || formData.status || "quotation",
    };

    if (!finalData.customerId) {
      alert("Please select a customer");
      return;
    }

    if (isEditing && id) {
      await updateInvoice(id, finalData);
      navigate(`/invoices/${id}`);
    } else {
      const newId = await addInvoice(
        finalData as Omit<Invoice, "id" | "createdAt">
      );
      navigate(`/invoices/${newId}`);
    }
  };

  const { subtotal, taxAmount, total } = calculateTotals();

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600" />
        </button>
        <h1 className="text-3xl font-bold text-slate-900">
          {isEditing ? "Edit Invoice" : "New Invoice"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Customer Details
            </h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Select Customer
                </label>
                <select
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                >
                  <option value="">-- Choose a Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => navigate("/customers")}
                className="mt-6 p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                title="Add New Customer"
              >
                <UserPlus size={20} />
              </button>
            </div>
            {formData.customerDetails && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
                <p className="font-semibold text-slate-900">
                  {formData.customerDetails.name}
                </p>
                <p>{formData.customerDetails.address}</p>
                <p>
                  {formData.customerDetails.email} •{" "}
                  {formData.customerDetails.phone}
                </p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">Items</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 text-sm font-medium text-slate-500 px-2">
                <div className="col-span-6">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-3 text-right">Price</div>
                <div className="col-span-1"></div>
              </div>

              {formData.items?.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-start"
                >
                  <div className="col-span-6 space-y-2">
                    {/* Product Selector */}
                    {products.length > 0 && (
                      <select
                        className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        onChange={(e) =>
                          handleProductSelect(index, e.target.value)
                        }
                      >
                        <option value="">Select Product (Optional)</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} - {p.price}
                          </option>
                        ))}
                      </select>
                    )}
                    <input
                      type="text"
                      placeholder="Item description"
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={item.desc}
                      onChange={(e) =>
                        handleItemChange(index, "desc", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-2 border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500 outline-none mt-[38px]"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "qty",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full p-2 border border-slate-300 rounded-lg text-right focus:ring-2 focus:ring-indigo-500 outline-none mt-[38px]"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="col-span-1 text-center mt-[45px]">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      disabled={(formData.items?.length || 0) <= 1}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-2 text-slate-800">Notes</h2>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              placeholder="Payment terms, delivery details, etc."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold mb-4 text-slate-800">
              Summary
            </h2>
            <div className="flex justify-between items-center mb-2 text-slate-600">
              <span>Subtotal</span>
              <span>
                {company.currency} {subtotal.toFixed(2)}
              </span>
            </div>
            {/* Tax Display */}
            {formData.taxRate ? (
              <div className="flex justify-between items-center mb-2 text-slate-600">
                <span>Tax ({formData.taxRate}%)</span>
                <span>
                  {company.currency} {taxAmount.toFixed(2)}
                </span>
              </div>
            ) : null}

            <div className="flex justify-between items-center mb-6 text-xl font-bold text-slate-900 border-t pt-4">
              <span>Total</span>
              <span>
                {company.currency} {total.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-600">
                Status
              </label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg bg-slate-50"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as InvoiceStatus,
                  }))
                }
              >
                <option value="quotation">Quotation</option>
                <option value="approved">Approved</option>
                <option value="invoiced">Invoiced</option>
                <option value="paid">Paid</option>
                <option value="completed">Completed</option>
              </select>

              <button
                onClick={() => handleSave()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <Save size={20} /> Save Invoice
              </button>

              {formData.status === "quotation" && (
                <button
                  onClick={() => handleSave("invoiced")}
                  className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors"
                >
                  Convert to Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
