import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Invoices from "./pages/Invoices";
import InvoiceEditor from "./pages/InvoiceEditor";
import InvoiceView from "./pages/InvoiceView";
import Expenses from "./pages/Expenses";
import Vendors from "./pages/Vendors";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/login";

export default function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/invoices/new" element={<InvoiceEditor />} />
            <Route path="/invoices/:id/edit" element={<InvoiceEditor />} />
            <Route path="/invoices/:id" element={<InvoiceView />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/products" element={<Products />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}
