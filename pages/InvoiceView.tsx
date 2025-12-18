import React, { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { Printer, Edit, Download, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceView() {
  const { id } = useParams();
  const { invoices, company } = useData();
  const invoice = invoices.find((i) => i.id === id);
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return <div className="p-8 text-center">Invoice not found</div>;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    try {
      // @ts-ignore - html2canvas default export handling
      const canvasFunc = html2canvas.default || html2canvas;
      const canvas = await canvasFunc(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      // @ts-ignore - jsPDF default export handling
      const JsPDFClass = jsPDF.default || jsPDF;
      // @ts-ignore
      const pdf = new JsPDFClass("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.id.slice(0, 6)}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed", err);
      alert(
        "Could not generate PDF. Please try printing to PDF instead (Select 'Save as PDF' in the print dialog)."
      );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 no-print">
        <div className="flex items-center gap-4">
          <Link
            to="/invoices"
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {invoice.status === "quotation" ? "Quotation" : "Invoice"} #
              {invoice.id.slice(0, 6)}
            </h1>
            <span
              className={`text-xs px-2 py-1 rounded-full capitalize ${
                invoice.status === "paid"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/invoices/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit size={18} /> Edit
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer size={18} /> Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="flex justify-center">
        <div
          id="invoice-print"
          ref={printRef}
          className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[10mm] md:p-[20mm] shadow-lg text-slate-900 leading-relaxed relative"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-12 border-b-2 border-slate-900 pb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wide">
                {company.name}
              </h1>
              <div className="mt-2 text-sm text-slate-600 space-y-1">
                <p>{company.address}</p>
                <p>{company.phone}</p>
                <p>{company.email}</p>
                {company.taxId && <p>Tax ID: {company.taxId}</p>}
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-light text-indigo-600 tracking-wider">
                {company.header ||
                  (invoice.status === "quotation" ? "QUOTATION" : "INVOICE")}
              </h2>
              <div className="mt-4 space-y-1 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">No:</span> #
                  {invoice.id.slice(0, 8)}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Date:</span>{" "}
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
                {invoice.dueDate && (
                  <p>
                    <span className="font-semibold text-slate-900">Due:</span>{" "}
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-12">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Bill To
            </h3>
            <div className="text-lg font-semibold text-slate-900">
              {invoice.customerName}
            </div>
            {invoice.customerDetails && (
              <div className="text-slate-600 text-sm mt-1">
                <p>{invoice.customerDetails.address}</p>
                <p>{invoice.customerDetails.email}</p>
                <p>{invoice.customerDetails.phone}</p>
              </div>
            )}
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-600 text-sm uppercase tracking-wider text-left">
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Price</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, index) => (
                <tr key={item.id || index} className="text-sm">
                  <td className="py-4 pr-4">{item.desc}</td>
                  <td className="py-4 px-2 text-center">{item.qty}</td>
                  <td className="py-4 px-2 text-right">
                    {item.price.toFixed(2)}
                  </td>
                  <td className="py-4 pl-4 text-right font-medium">
                    {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer / Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>
                  {company.currency} {invoice.subtotal.toFixed(2)}
                </span>
              </div>
              {invoice.taxAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Tax ({invoice.taxRate}%)</span>
                  <span>
                    {company.currency} {invoice.taxAmount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-900 font-bold text-lg border-t-2 border-slate-900 pt-2">
                <span>Total</span>
                <span>
                  {company.currency} {invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Notes
              </h3>
              <p className="text-sm text-slate-600">{invoice.notes}</p>
            </div>
          )}

          {/* Footer Message */}
          <div className="text-center text-slate-500 text-sm mt-12 pt-8 border-t border-slate-200">
            <p>{company.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
