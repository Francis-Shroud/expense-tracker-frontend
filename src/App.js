import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm.js";
import ExpenseList from "./components/ExpenseList.js";
import ExpenseChart from "./components/ExpenseChart.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";

function App() {
  // ---- AUTH STATES ----
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // ---- EXPENSE STATES ----
  const [expenses, setExpenses] = useState([]);

  // ---- FILTER STATES ----
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const storedMonth = localStorage.getItem("selectedMonth");
  const storedYear = localStorage.getItem("selectedYear");

  const [selectedMonth, setSelectedMonth] = useState(storedMonth || currentMonth);
  const [selectedYear, setSelectedYear] = useState(storedYear ? parseInt(storedYear) : currentYear);

  // ---- API BASE URL ----
  const API = process.env.REACT_APP_API || "http://localhost:5001/api";

  // ---- LOAD USER SESSION ON PAGE LOAD ----
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ---- FETCH EXPENSES (ONLY IF LOGGED IN) ----
  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  // ---- SAVE FILTER STATE ----
  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("selectedYear", selectedYear);
  }, [selectedMonth, selectedYear]);

  // ---- ADD NEW EXPENSE ----
  const addExpense = async (expense) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/expenses`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses([res.data, ...expenses]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // ---- DELETE EXPENSE ----
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // ---- IF USER NOT LOGGED IN ----
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login
        onLogin={(u) => setUser(u)}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  // ---- MAIN APP DASHBOARD ----
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-bold text-blue-700">💰 Expense Tracker</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">👤 {user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <ExpenseForm onAdd={addExpense} />
        <ExpenseList
          expenses={expenses}
          onDelete={deleteExpense}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <ExpenseChart
          expenses={expenses}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}

export default App;