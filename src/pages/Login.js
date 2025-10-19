import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader.js";
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API || "http://localhost:5001/api";

function Login({ onLogin, onSwitchToRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ added loading state

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/auth/login`, form);
      const { token, user } = res.data;

      // ✅ Save token + user info in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("✅ Logged in successfully!");
      onLogin(user);
    } catch (err) {
      console.error("Login failed:", err);
      setMessage(err.response?.data?.message || "Login failed");
      toast.error("❌ Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loader if waiting for response
  if (loading) {
    return <Loader message="Logging you in, please wait..." />;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Welcome Back
      </h2>

      {/* ⚠️ Server warm-up notice */}
      <p className="text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md p-2 text-sm mb-4 text-center">
        ⚠️ The server may take up to <b>60 seconds</b> to start. Please wait and do not click twice.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
          required
          disabled={loading}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Please Wait..." : "Login"}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-red-600 mt-3">{message}</p>
      )}

      <p className="text-center text-gray-500 mt-4">
        Don’t have an account?{" "}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}

export default Login;