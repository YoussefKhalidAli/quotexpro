import React, { ReactElement } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ShoppingBag, 
  DollarSign, 
  Settings, 
  Briefcase,
  Package,
  BarChart2
} from 'lucide-react';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { label: 'Invoices', path: '/invoices', icon: <FileText size={20} /> },
    { label: 'Products', path: '/products', icon: <Package size={20} /> },
    { label: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { label: 'Expenses', path: '/expenses', icon: <DollarSign size={20} /> },
    { label: 'Vendors', path: '/vendors', icon: <ShoppingBag size={20} /> },
    { label: 'Reports', path: '/reports', icon: <BarChart2 size={20} /> },
    { label: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col no-print">
        <div className="p-6 flex items-center gap-3">
          <Briefcase className="text-indigo-400" size={28} />
          <span className="text-xl font-bold tracking-tight">FinCashier</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          v1.1.0
        </div>
      </aside>

      {/* Mobile Nav Placeholder (Simple) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white z-50 flex justify-between px-4 py-2 overflow-x-auto no-print">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className="p-2 min-w-[3rem] flex justify-center">
            {React.cloneElement(item.icon as ReactElement<any>, { size: 24 })}
          </Link>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="min-h-full pb-16 md:pb-0">
           {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;