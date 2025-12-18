import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Download,
} from "lucide-react";

export default function Invoices() {
  const { invoices, company } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredInvoices = invoices
    .filter((inv) => {
      const matchesSearch =
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "invoiced":
        return "bg-indigo-100 text-indigo-800";
      case "approved":
        return "bg-amber-100 text-amber-800";
      case "quotation":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
          <p className="text-slate-500">Manage your invoices and quotations.</p>
        </div>
        <button
          onClick={() => navigate("/invoices/new")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create New
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by client or invoice ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-slate-400" size={18} />
            <select
              className="p-2 border border-slate-300 rounded-lg focus:ring-indigo-500 outline-none bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="quotation">Quotation</option>
              <option value="approved">Approved</option>
              <option value="invoiced">Invoiced</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-slate-200">
                  Invoice ID
                </th>
                <th className="p-4 font-semibold border-b border-slate-200">
                  Client
                </th>
                <th className="p-4 font-semibold border-b border-slate-200">
                  Date
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 text-right">
                  Amount
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 text-center">
                  Status
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4 font-medium text-slate-900">
                    <Link
                      to={`/invoices/${inv.id}`}
                      className="hover:text-indigo-600 flex items-center gap-2"
                    >
                      <FileText size={16} /> #{inv.id.slice(0, 6)}
                    </Link>
                  </td>
                  <td className="p-4 text-slate-700">{inv.customerName}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(inv.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right font-semibold text-slate-900">
                    {company.currency} {inv.total.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        inv.status
                      )}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/invoices/${inv.id}`}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="View"
                      >
                        <FileText size={18} />
                      </Link>
                      <Link
                        to={`/invoices/${inv.id}/edit`}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <MoreHorizontal size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
