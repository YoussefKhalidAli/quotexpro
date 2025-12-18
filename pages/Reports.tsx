import React, { useRef, useState } from 'react';
import { useData } from '../context/DataContext';
import { Download, Upload, FileText, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Reports() {
  const { invoices, customers, vendors, products, importData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importType, setImportType] = useState<'customers' | 'vendors' | 'products' | 'invoices'>('products');
  const [message, setMessage] = useState('');

  // --- Export Functions ---
  const exportToExcel = (data: any[], fileName: string) => {
    // XLSX might be the default export or have utils directly depending on build
    const utils = XLSX.utils || (XLSX as any).default?.utils;
    const write = XLSX.writeFile || (XLSX as any).default?.writeFile;

    if (!utils || !write) {
       console.error("XLSX utils not found. The library might not be loaded correctly.");
       alert("Export failed: XLSX library not fully loaded. Please refresh and try again.");
       return;
    }

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Sheet1");
    // Use write with bookType to support environments where writeFile might trigger downloads differently
    // Actually standard browser usage often requires specific handling, but writeFile in XLSX defaults to download in browser
    write(wb, `${fileName}.xlsx`);
  };

  const handleExportInvoices = () => {
    const data = invoices.map(i => ({
      ID: i.id,
      Date: new Date(i.createdAt).toLocaleDateString(),
      Customer: i.customerName,
      Status: i.status,
      Total: i.total,
      Tax: i.taxAmount || 0,
      Subtotal: i.subtotal || i.total
    }));
    exportToExcel(data, 'Invoices_Report');
  };

  const handleExportCustomers = () => {
    exportToExcel(customers, 'Customers_List');
  };

  const handleExportVendors = () => {
    exportToExcel(vendors, 'Vendors_List');
  };

  const handleExportProducts = () => {
    exportToExcel(products, 'Products_Catalog');
  };

  // --- Import Functions ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const read = XLSX.read || (XLSX as any).default?.read;
      const utils = XLSX.utils || (XLSX as any).default?.utils;

      if (!read || !utils) {
        setMessage("Error: XLSX library not available.");
        return;
      }

      try {
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws);
        
        console.log('Imported Data:', data);
        
        if (data.length > 0) {
          importData(importType, data);
          setMessage(`Successfully imported ${data.length} items into ${importType}.`);
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage('No data found in file.');
        }
      } catch (error) {
        console.error("Import error:", error);
        setMessage("Failed to parse file. Please check the format.");
      }
    };
    reader.readAsBinaryString(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Reports & Data</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Download size={24}/></div>
             <h2 className="text-xl font-bold text-slate-800">Export Data</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button onClick={handleExportInvoices} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
               <FileText className="text-slate-500" size={32} />
               <span className="font-semibold text-slate-700">Invoices & Quotations</span>
             </button>
             <button onClick={handleExportProducts} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
               <Database className="text-slate-500" size={32} />
               <span className="font-semibold text-slate-700">Products</span>
             </button>
             <button onClick={handleExportCustomers} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
               <Database className="text-slate-500" size={32} />
               <span className="font-semibold text-slate-700">Customers</span>
             </button>
             <button onClick={handleExportVendors} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 flex flex-col items-center gap-2 transition-colors">
               <Database className="text-slate-500" size={32} />
               <span className="font-semibold text-slate-700">Vendors</span>
             </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><Upload size={24}/></div>
             <h2 className="text-xl font-bold text-slate-800">Bulk Upload</h2>
          </div>
          
          <p className="text-slate-500 mb-4 text-sm">Upload an Excel (.xlsx) file to bulk import data. Ensure headers match the data fields (e.g., name, price, phone).</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Select Data Type</label>
            <select 
              value={importType} 
              onChange={(e) => setImportType(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="vendors">Vendors</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileUpload}
               accept=".xlsx, .xls"
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <Upload className="mx-auto text-slate-400 mb-2" size={32} />
             <p className="font-medium text-slate-600">Click to upload Excel file</p>
          </div>
          
          {message && <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">{message}</div>}
        </div>
      </div>
    </div>
  );
}