import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Plus, Trash2, DollarSign, Calendar, User } from "lucide-react";

export default function Expenses() {
  const { expenses, vendors, addExpense, deleteExpense, company } = useData();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    vendorId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const vendor = vendors.find((v) => v.id === form.vendorId);

    addExpense({
      title: form.title,
      amount: parseFloat(form.amount),
      date: form.date,
      category: "General",
      vendorId: form.vendorId || undefined,
      vendorName: vendor ? vendor.name : undefined,
    });
    setForm({
      title: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      vendorId: "",
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Expenses</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Office Rent"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Vendor (Optional)
                </label>
                <div className="relative">
                  <select
                    className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    value={form.vendorId}
                    onChange={(e) =>
                      setForm({ ...form, vendorId: e.target.value })
                    }
                  >
                    <option value="">-- Select Vendor --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus size={20} /> Add Expense
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold text-sm">
                <tr>
                  <th className="p-4">Description</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses
                  .slice()
                  .reverse()
                  .map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium text-slate-900">
                        {e.title}
                      </td>
                      <td className="p-4 text-slate-600 text-sm">
                        {e.vendorName || (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-sm flex items-center gap-2">
                        <Calendar size={14} />{" "}
                        {new Date(e.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right font-medium text-rose-600">
                        - {company.currency} {e.amount.toFixed(2)}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => deleteExpense(e.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No expenses recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
