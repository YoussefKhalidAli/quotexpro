import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, ShoppingBag, Trash2 } from 'lucide-react';

export default function Vendors() {
  const { vendors, addVendor, deleteVendor } = useData();
  const [form, setForm] = useState({ name: '', phone: '', note: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addVendor(form);
    setForm({ name: '', phone: '', note: '' });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Vendors</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h2 className="text-lg font-bold mb-4">Add Vendor</h2>
             <form onSubmit={handleSubmit} className="space-y-4">
               <input className="w-full p-2 border rounded-lg" placeholder="Vendor Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
               <input className="w-full p-2 border rounded-lg" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
               <input className="w-full p-2 border rounded-lg" placeholder="Note / Service" value={form.note} onChange={e => setForm({...form, note: e.target.value})} />
               <button className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex justify-center items-center gap-2">
                 <Plus size={18} /> Add
               </button>
             </form>
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendors.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex justify-between items-start">
               <div className="flex gap-3">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg h-fit">
                   <ShoppingBag size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">{v.name}</h3>
                   <p className="text-sm text-slate-500">{v.phone}</p>
                   <p className="text-sm text-slate-400 mt-1">{v.note}</p>
                 </div>
               </div>
               <button onClick={() => deleteVendor(v.id)} className="text-slate-300 hover:text-red-500">
                 <Trash2 size={18} />
               </button>
            </div>
          ))}
          {vendors.length === 0 && <div className="text-slate-400 col-span-2 text-center py-8">No vendors added yet.</div>}
        </div>
      </div>
    </div>
  );
}