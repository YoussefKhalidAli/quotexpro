import { useData } from "@/context/DataContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginCompany } = useData();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    loginCompany(email, password);
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Company Login</h1>

        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center mt-4 text-slate-600">
          Don’t have a company?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
