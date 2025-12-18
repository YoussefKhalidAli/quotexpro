import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Plus, Search, Edit2, Trash2, Tag } from 'lucide-react';
import { Product } from '../types';

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct, company } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: 0, sku: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    closeModal();
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ name: product.name, description: product.description, price: product.price, sku: product.sku || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: 0, sku: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500">Manage your product catalog.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Tag size={20} />
                 </div>
                 <div>
                   <h3 className="font-bold text-slate-900">{p.name}</h3>
                   {p.sku && <p className="text-xs text-slate-400">SKU: {p.sku}</p>}
                 </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteProduct(p.id)} className="p-2 text-slate-400 hover:text-red-600 bg-slate-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-[2.5em]">{p.description || 'No description'}</p>
            
            <div className="font-bold text-lg text-slate-800">
               {company.currency} {p.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
         <div className="text-center py-12 text-slate-400">No products found.</div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input required className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">SKU (Optional)</label>
                <input className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <input type="number" step="0.01" className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}