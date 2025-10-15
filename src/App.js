import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseChart from "./components/ExpenseChart";

function App() {
  const [expenses, setExpenses] = useState([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  
  const storedMonth = localStorage.getItem("selectedMonth");
  const storedYear = localStorage.getItem("selectedYear");
  
  const [selectedMonth, setSelectedMonth] = useState(storedMonth || currentMonth);
  const [selectedYear, setSelectedYear] = useState(storedYear ? parseInt(storedYear) : currentYear);

  const API = process.env.REACT_APP_API || "http://localhost:5001";
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    }
  };

    // Fetch all expenses when app loads
  useEffect(() => {
    fetchExpenses();
  }, []);

    // ✅ Save month & year filters in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("selectedYear", selectedYear);
  }, [selectedMonth, selectedYear]);

  // Add new expense
  const addExpense = async (expense) => {
    try {
      const res = await axios.post(`${API}/expenses`, expense);
      setExpenses([res.data, ...expenses]);
    } catch (err) {
      console.error("Error adding expense:", err);
    }
  };

  // Delete expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/expenses/${id}`);
      setExpenses(expenses.filter((e) => e._id !== id));
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
    <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
      Expense Tracker
    </h1>
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <ExpenseForm
        onAdd={ async (addExpense) => {
          const res = await axios.post(`${API}/expenses`, addExpense);
          setExpenses([res.data, ...expenses]);
        }}
      />
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
