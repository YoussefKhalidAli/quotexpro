import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Save } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Settings() {
  const { company, updateCompany, addCompany } = useData();
  const [formData, setFormData] = useState(company);
  const [saved, setSaved] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === "/register") {
      if (!formData.password) {
        alert("Password is required for registration.");
        return;
      }
      addCompany(formData);
    } else {
      updateCompany(company.id, formData);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    navigate("/", { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          Company Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Company Name
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Currency Symbol
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tax ID / TRN
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.taxId}
                onChange={(e) =>
                  setFormData({ ...formData, taxId: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Invoice Header Title
              </label>
              <input
                className="w-full p-2 border rounded-lg"
                value={formData?.header}
                onChange={(e) =>
                  setFormData({ ...formData, header: e.target.value })
                }
                placeholder="e.g. TAX INVOICE"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Invoice Footer Note
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={formData?.footer}
                onChange={(e) =>
                  setFormData({ ...formData, footer: e.target.value })
                }
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-lg font-bold mb-4 text-slate-800">
              Tax Settings
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="taxEnabled"
                  checked={formData?.taxEnabled}
                  onChange={(e) =>
                    setFormData({ ...formData, taxEnabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="taxEnabled"
                  className="text-sm font-medium text-slate-700"
                >
                  Enable Tax (VAT)
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Rate (%)
                </label>
                <input
                  type="number"
                  className="w-24 p-2 border rounded-lg"
                  value={formData?.taxRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxRate: parseFloat(e.target.value),
                    })
                  }
                  disabled={!formData?.taxEnabled}
                />
              </div>
            </div>
          </div>

          {pathname === "/register" && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                value={formData?.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter a secure password"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Save size={18} /> Save Settings
              </button>
              {saved && (
                <span className="text-emerald-600 font-medium">
                  Settings saved successfully!
                </span>
              )}
            </div>

            {Object.keys(company).length !== 0 && (
              <button
                onClick={logout} // Make sure you have a logout function defined
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
