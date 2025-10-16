import React, { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5001/api";

function Register({ onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/register`, form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => onSwitchToLogin(), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Create Account
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 w-full rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      {message && <p className="text-center text-sm text-gray-600 mt-3">{message}</p>}

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