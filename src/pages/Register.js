import React, { useState } from "react";
import axios from "axios";
import Loader from "../components/Loader.js";
import { toast } from "react-hot-toast";

const API = process.env.REACT_APP_API || "http://localhost:5001/api";

function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // ✅ new loading state

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API}/auth/register`, form);
      setMessage(res.data.message || "Registration successful!");
      toast.success("✅ Account created successfully!");

      setForm({ name: "", email: "", password: "" });

      // Redirect to login after short delay
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      setMessage(err.response?.data?.message || "Registration failed");
      toast.error("❌ Failed to register, please try again");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loader while waiting
  if (loading) {
    return <Loader message="Creating your account..." />;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Create Account
      </h2>

      {/* ⚠️ Server warm-up message */}
      <p className="text-yellow-600 bg-yellow-100 border border-yellow-300 rounded-md p-2 text-sm mb-4 text-center">
        ⚠️ The server may take up to <b>60 seconds</b> to start. Please wait and do not click twice.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
          required
          disabled={loading}
        />
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
          {loading ? "Please Wait..." : "Register"}
        </button>
      </form>

      {message && (
        <p className="text-center text-sm text-gray-600 mt-3">{message}</p>
      )}

      <p className="text-center text-gray-500 mt-4">
        Already have an account?{" "}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </div>
  );
}

export default Register;