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
  // 'expenses' will now hold only the data for the selected month (for the list/pie)
  const [expenses, setExpenses] = useState([]); 
  // 'yearlyExpenses' will hold the data for the entire selected year (for the bar chart)
  const [yearlyExpenses, setYearlyExpenses] = useState([]);

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

  // ---- LOAD USER SESSION ----
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);
  
  // Helper to construct query params
  const monthToNumber = (monthName) => {
    return new Date(Date.parse(monthName + " 1, 2012")).getMonth() + 1;
  };

  // ---- FETCH MONTHLY EXPENSES (FOR LIST/PIE CHART) ----
  const fetchMonthlyExpenses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const monthNumber = monthToNumber(selectedMonth);
      
      // API request should now include month and year filters
      const res = await axios.get(`${API}/expenses?month=${monthNumber}&year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error fetching monthly expenses:", err);
      toast.error("Failed to load expenses ❌");
    } finally {
      setLoading(false);
    }
  };

  // ---- FETCH YEARLY EXPENSES (FOR BAR CHART) ----
  const fetchYearlyExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      // API request includes only the year filter
      const res = await axios.get(`${API}/expenses?year=${selectedYear}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYearlyExpenses(res.data);
    } catch (err) {
      console.error("Error fetching yearly expenses:", err);
      // No need for a toast here, as the monthly fetch usually covers it
    }
  };
  
  // ---- FETCH DATA EFFECT ----
  useEffect(() => {
    if (user) {
      // 1. Fetch data for the currently selected month (for list and pie chart)
      fetchMonthlyExpenses();
    }
  }, [user, selectedMonth, selectedYear]);
  
  useEffect(() => {
    if (user) {
      // 2. Fetch data for the entire year (for bar chart) whenever the year changes
      fetchYearlyExpenses();
    }
  }, [user, selectedYear]);

  // ---- SAVE FILTER STATE ----
  useEffect(() => {
    localStorage.setItem("selectedMonth", selectedMonth);
    localStorage.setItem("selectedYear", selectedYear);
  }, [selectedMonth, selectedYear]);

  // ---- ADD EXPENSE ----
  // This needs to update BOTH monthly and yearly expenses.
  const addExpense = async (expense) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/expenses`, expense, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newExpense = res.data;
      const expenseMonth = new Date(newExpense.createdAt).toLocaleString("default", { month: "long" });
      const expenseYear = new Date(newExpense.createdAt).getFullYear();
      
      // Update monthly list only if the new expense is in the currently selected period
      if (expenseMonth === selectedMonth && expenseYear === selectedYear) {
        setExpenses((prev) => [newExpense, ...prev]);
      }
      
      // Always update the yearly list
      setYearlyExpenses((prev) => [newExpense, ...prev]);
      
      toast.success("✅ Expense added successfully!");
    } catch (err) {
      console.error("Error adding expense:", err);
      toast.error("Failed to add expense ❌");
    } finally {
      setLoading(false);
    }
  };

  // ---- DELETE EXPENSE ----
  // This needs to update BOTH monthly and yearly expenses.
  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update monthly list
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      
      // Update yearly list
      setYearlyExpenses((prev) => prev.filter((e) => e._id !== id));
      
      toast("🗑 Expense deleted", { icon: "🗑" });
    } catch (err) {
      console.error("Error deleting expense:", err);
      toast.error("Failed to delete expense ❌");
    } finally {
      setLoading(false);
    }
  };

  // ---- LOGOUT (unchanged) ----
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("👋 Logged out successfully");
  };

  // ---- AUTH SCREEN (unchanged) ----
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

  // ---- MAIN APP (updated props) ----
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-6">
        <h1 className="text-3xl font-bold text-blue-700">💰 Expense Tracker</h1>
        <Toaster position="top-right" reverseOrder={false} />
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
      {loading && expenses.length === 0 ? (
        <Loader message = "Please Wait..."/>
      ) : (
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
          // Pass the monthly data for the pie chart, and the yearly data for the bar chart
          expenses={expenses} // Used for pie chart (and will be filtered further by Chart component)
          yearlyExpenses={yearlyExpenses} // NEW PROP for the bar chart
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div> )}
    </div>
  );
}

export default App;