// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ExpenseForm from "./components/ExpenseForm.js";
// import ExpenseList from "./components/ExpenseList.js";
// import ExpenseChart from "./components/ExpenseChart.js";
// import Login from "./pages/Login.js";
// import Register from "./pages/Register.js";
// import { Toaster, toast } from "react-hot-toast";
// import Loader from "./components/Loader.js";

// function App() {
//   // ---- AUTH STATES ----
//   const [user, setUser] = useState(null);
//   const [showRegister, setShowRegister] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // ---- EXPENSE STATES ----
//   const [expenses, setExpenses] = useState([]);

//   // ---- FILTER STATES ----
//   const currentDate = new Date();
//   const currentYear = currentDate.getFullYear();
//   const currentMonth = currentDate.toLocaleString("default", { month: "long" });

//   const storedMonth = localStorage.getItem("selectedMonth");
//   const storedYear = localStorage.getItem("selectedYear");

//   const [selectedMonth, setSelectedMonth] = useState(storedMonth || currentMonth);
//   const [selectedYear, setSelectedYear] = useState(storedYear ? parseInt(storedYear) : currentYear);

//   // ---- API BASE URL ----
//   const API = process.env.REACT_APP_API || "http://localhost:5001/api";

//   // ---- LOAD USER SESSION ----
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   // ---- FETCH EXPENSES ----
//   const fetchExpenses = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`${API}/expenses`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setExpenses(res.data);
//     } catch (err) {
//       console.error("Error fetching expenses:", err);
//       toast.error("Failed to load expenses ❌");
//     }
//     finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchExpenses();
//   }, [user]);

//   // ---- SAVE FILTER STATE ----
//   useEffect(() => {
//     localStorage.setItem("selectedMonth", selectedMonth);
//     localStorage.setItem("selectedYear", selectedYear);
//   }, [selectedMonth, selectedYear]);

//   // ---- ADD EXPENSE ----
//   const addExpense = async (expense) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(`${API}/expenses`, expense, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setExpenses([res.data, ...expenses]);
//       toast.success("✅ Expense added successfully!");
//     } catch (err) {
//       console.error("Error adding expense:", err);
//       toast.error("Failed to add expense ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- DELETE EXPENSE ----
//   const deleteExpense = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${API}/expenses/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setExpenses(expenses.filter((e) => e._id !== id));
//       toast("🗑 Expense deleted", { icon: "🗑" });
//     } catch (err) {
//       console.error("Error deleting expense:", err);
//       toast.error("Failed to delete expense ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---- LOGOUT ----
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     toast.success("👋 Logged out successfully");
//   };

//   // ---- AUTH SCREEN ----
//   if (!user) {
//     return showRegister ? (
//       <Register onSwitchToLogin={() => setShowRegister(false)} />
//     ) : (
//       <Login
//         onLogin={(u) => setUser(u)}
//         onSwitchToRegister={() => setShowRegister(true)}
//       />
//     );
//   }

//   // ---- MAIN APP ----
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center w-full max-w-4xl mb-6">
//         <h1 className="text-3xl font-bold text-blue-700">💰 Expense Tracker</h1>
//         <Toaster position="top-right" reverseOrder={false} />
//         <div className="flex items-center gap-4">
//           <span className="text-gray-700">👤 {user.name}</span>
//           <button
//             onClick={logout}
//             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//       {/* Content */}
//       {loading ? (
//         <Loader message = "Please Wait..."/>
//       ) : (
//       <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg">
//         <ExpenseForm onAdd={addExpense} />
//         <ExpenseList
//           expenses={expenses}
//           onDelete={deleteExpense}
//           selectedMonth={selectedMonth}
//           setSelectedMonth={setSelectedMonth}
//           selectedYear={selectedYear}
//           setSelectedYear={setSelectedYear}
//         />
//         <ExpenseChart
//           expenses={expenses}
//           selectedMonth={selectedMonth}
//           selectedYear={selectedYear}
//         />
//       </div> )}
//     </div>
//   );
// }

// export default App;

//Grok Version


import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "./components/ExpenseForm.js";
import ExpenseList from "./components/ExpenseList.js";
import ExpenseChart from "./components/ExpenseChart.js";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import { Toaster, toast } from "react-hot-toast";
import Loader from "./components/Loader.js";

function App() {
  // ---- AUTH STATES ----
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---- EXPENSE STATES ----
  const [expenses, setExpenses] = useState([]);

  // ---- CHART FILTER STATES (Monthly/Yearly) ----
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });

  const storedChartMonth = localStorage.getItem("chartMonth");
  const storedChartYear = localStorage.getItem("chartYear");

  const [chartMonth, setChartMonth] = useState(storedChartMonth || currentMonth);
  const [chartYear, setChartYear] = useState(
    storedChartYear ? parseInt(storedChartYear) : currentYear
  );

  // ---- API BASE URL ----
  const API = process.env.REACT_APP_API || "http://localhost:5001/api";

  // ---- LOAD USER SESSION ----
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // ---- FETCH EXPENSES ----
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  // ---- SAVE CHART FILTERS ----
  useEffect(() => {
    localStorage.setItem("chartMonth", chartMonth);
    localStorage.setItem("chartYear", chartYear);
  }, [chartMonth, chartYear]);

  // ---- ADD EXPENSE ----
  const addExpense = async (expense) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/expenses`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses([res.data, ...expenses]);
      toast.success("Expense added successfully!");
      fetchExpenses(); // Refresh to keep chart in sync
    } catch (err) {
      console.error("Error adding expense:", err);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  // ---- DELETE EXPENSE ----
  const deleteExpense = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
      toast.success("Expense deleted");
      fetchExpenses();
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense");
    } finally {
      setLoading(false);
    }
  };

  // ---- LOGOUT ----
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("chartMonth");
    localStorage.removeItem("chartYear");
    setUser(null);
    toast.success("Logged out successfully");
  };

  // ---- AUTH SCREEN ----
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

  // ---- MAIN APP ----
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Expense Tracker</h1>
        <Toaster position="top-right" reverseOrder={false} />
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{user.name}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Please Wait..." />
      ) : (
        <div className="max-w-4xl w-full bg-white p-8 rounded-2xl shadow-lg space-y-8">
          <ExpenseForm onAdd={addExpense} />

          {/* Daily Expense List */}
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />

          {/* Chart Filter UI */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center p-4 bg-gray-50 rounded-lg">
            <label className="font-semibold text-gray-700">Chart Period:</label>
            <select
              value={chartMonth}
              onChange={(e) => setChartMonth(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select
              value={chartYear}
              onChange={(e) => setChartYear(parseInt(e.target.value))}
              className="border rounded px-3 py-2 text-sm"
            >
              {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Monthly Chart */}
          <ExpenseChart
            expenses={expenses}
            selectedMonth={chartMonth}
            selectedYear={chartYear}
          />
        </div>
      )}
    </div>
  );
}

export default App;