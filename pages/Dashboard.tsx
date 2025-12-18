import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, subValue }: { title: string, value: string, icon: React.ReactNode, color: string, subValue?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {subValue && <p className="text-xs text-slate-400 mt-2">{subValue}</p>}
    </div>
    <div className={`p-3 rounded-lg ${color} text-white`}>
      {icon}
    </div>
  </div>
);

type FilterType = 'daily' | 'weekly' | 'monthly';

export default function Dashboard() {
  const { invoices, expenses, company } = useData();
  const [filter, setFilter] = useState<FilterType>('monthly');

  const filterDate = useMemo(() => {
    const now = new Date();
    if (filter === 'daily') {
      return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    } else if (filter === 'weekly') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d.getTime();
    } else {
      const d = new Date(now);
      d.setDate(d.getDate() - 30);
      return d.getTime();
    }
  }, [filter]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => new Date(i.createdAt).getTime() >= filterDate);
  }, [invoices, filterDate]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => new Date(e.date).getTime() >= filterDate);
  }, [expenses, filterDate]);

  const stats = useMemo(() => {
    const totalIncome = filteredInvoices
      .filter(i => i.status === 'paid' || i.status === 'completed')
      .reduce((sum, i) => sum + i.total, 0);
    
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const pendingInvoices = filteredInvoices.filter(i => i.status === 'invoiced').length;
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, pendingInvoices, balance };
  }, [filteredInvoices, filteredExpenses]);

  const chartData = useMemo(() => {
    const days = filter === 'daily' ? 1 : filter === 'weekly' ? 7 : 30;
    const data = [];
    
    // For 'daily', show hourly or just one bar? 
    // Let's stick to showing daily bars for weekly/monthly, and if 'daily' maybe show previous days?
    // User requested "Filter in dashboard for daily weekly monthly".
    // Usually means "Show stats for this period". The chart usually shows breakdown of that period.
    
    if (filter === 'daily') {
      // Show stats for today, maybe no chart or chart is just today
      const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      data.push({ 
        name: today, 
        income: stats.totalIncome, 
        expense: stats.totalExpenses 
      });
    } else {
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        const isoDate = date.toISOString().split('T')[0];

        const dailyIncome = invoices
          .filter(inv => inv.createdAt.startsWith(isoDate) && (inv.status === 'paid' || inv.status === 'completed'))
          .reduce((s, inv) => s + inv.total, 0);

        const dailyExpense = expenses
          .filter(exp => exp.date.startsWith(isoDate))
          .reduce((s, exp) => s + exp.amount, 0);

        data.push({ name: dayStr, income: dailyIncome, expense: dailyExpense });
      }
    }
    return data;
  }, [invoices, expenses, filter, stats]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Overview of your financial performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === f 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          value={`${company.currency} ${stats.totalIncome.toFixed(2)}`} 
          icon={<TrendingUp size={24} />} 
          color="bg-emerald-500" 
          subValue={`For selected period (${filter})`}
        />
        <StatCard 
          title="Total Expenses" 
          value={`${company.currency} ${stats.totalExpenses.toFixed(2)}`} 
          icon={<TrendingDown size={24} />} 
          color="bg-rose-500" 
          subValue={`For selected period (${filter})`}
        />
        <StatCard 
          title="Net Balance" 
          value={`${company.currency} ${stats.balance.toFixed(2)}`} 
          icon={<DollarSign size={24} />} 
          color="bg-indigo-500" 
        />
        <StatCard 
          title="Pending Invoices" 
          value={stats.pendingInvoices.toString()} 
          icon={<FileText size={24} />} 
          color="bg-amber-500"
          subValue="Awaiting payment (Total)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-6">Financial Trend</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} name="Income" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/invoices" className="text-sm text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          <div className="space-y-4">
            {invoices.slice().reverse().slice(0, 5).map(inv => (
              <div key={inv.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{inv.customerName || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">#{inv.id.slice(0, 6)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">{company.currency} {inv.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    inv.status === 'invoiced' ? 'bg-indigo-100 text-indigo-700' :
                    inv.status === 'quotation' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
            {invoices.length === 0 && <p className="text-slate-400 text-center py-4">No invoices yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}