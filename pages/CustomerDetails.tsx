import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ArrowLeft, FileText, Mail, Phone, MapPin } from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  const { customers, invoices, company } = useData();
  const customer = customers.find(c => c.id === id);

  if (!customer) return <div className="p-8">Customer not found</div>;

  const history = invoices.filter(i => i.customerId === id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <Link to="/customers" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Customers
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-8 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {customer.name.charAt(0)}
             </div>
             <div>
               <h1 className="text-3xl font-bold text-slate-900">{customer.name}</h1>
               <p className="text-slate-500">Customer ID: {customer.id}</p>
             </div>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Mail size={20} /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                <p>{customer.email || 'N/A'}</p>
              </div>
           </div>
           <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Phone size={20} /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Phone</p>
                <p>{customer.phone || 'N/A'}</p>
              </div>
           </div>
           <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><MapPin size={20} /></div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Address</p>
                <p>{customer.address || 'N/A'}</p>
              </div>
           </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-4">Invoice History</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No invoices found for this customer.</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold text-sm">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="p-4 font-medium text-indigo-600">#{inv.id.slice(0,6)}</td>
                  <td className="p-4 text-slate-600">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-medium capitalize">{inv.status}</span>
                  </td>
                  <td className="p-4 text-right font-medium">{company.currency} {inv.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <Link to={`/invoices/${inv.id}`} className="text-slate-400 hover:text-indigo-600"><FileText size={18} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}