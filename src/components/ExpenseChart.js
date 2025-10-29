import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// ✅ Responsive hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

function ExpenseChart({
  expenses,
  selectedYear = "All",
  selectedMonth = "All",
  selectedDate = "All",
}) {
  const isMobile = useIsMobile();

  if (!expenses.length)
    return (
      <p className="text-center text-gray-500 mt-6">
        No expenses yet 📊
      </p>
    );

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentDate = new Date();
  const activeYear =
    selectedYear === "All" ? currentDate.getFullYear() : selectedYear;
  const activeMonth =
    selectedMonth === "All"
      ? months[currentDate.getMonth()]
      : selectedMonth;
  const activeDate =
    selectedDate === "All"
      ? null
      : new Date(selectedDate).toISOString().split("T")[0]; // YYYY-MM-DD

  // ✅ Filter logic
  const filteredExpenses = expenses.filter((exp) => {
    if (!exp.createdAt) return false;
    const date = new Date(exp.createdAt);
    const year = date.getFullYear();
    const monthName = months[date.getMonth()];
    const dateOnly = date.toISOString().split("T")[0];

    const matchesYear = selectedYear === "All" || year === selectedYear;
    const matchesMonth = selectedMonth === "All" || monthName === selectedMonth;
    const matchesDate = selectedDate === "All" || dateOnly === activeDate;

    return matchesYear && matchesMonth && matchesDate;
  });

  if (!filteredExpenses.length)
    return (
      <p className="text-center text-gray-500 mt-6">
        No expenses found for the selected period 📆
      </p>
    );

  // ---------- 🥧 Category Breakdown ----------
  const categoryTotals = filteredExpenses.reduce((acc, exp) => {
    const cat = exp.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  // ---------- 📊 Monthly Breakdown ----------
  const categories = [
    ...new Set(filteredExpenses.map((e) => e.category || "Uncategorized")),
  ];

  const monthlyData = months.map((m, i) => {
    const monthExpenses = expenses.filter((exp) => {
      if (!exp.createdAt) return false;
      const d = new Date(exp.createdAt);
      const year = d.getFullYear();
      return (
        (selectedYear === "All" || year === selectedYear) &&
        d.getMonth() === i
      );
    });

    const monthObject = { month: m };
    categories.forEach((cat) => {
      const total = monthExpenses
        .filter((e) => (e.category || "Uncategorized") === cat)
        .reduce((sum, e) => sum + e.amount, 0);
      monthObject[cat] = total;
    });
    return monthObject;
  });

  const COLORS = [
    "#2563eb", "#10b981", "#f59e0b", "#ef4444",
    "#8b5cf6", "#14b8a6", "#e11d48", "#a16207", "#0ea5e9",
  ];

  // ---------- Title ----------
  const title =
    selectedDate !== "All"
      ? `📅 Daily Expense Report – ${new Date(selectedDate).toLocaleDateString("en-GB")}`
      : `💹 Expense Dashboard – ${activeMonth} ${activeYear}`;

  return (
    <div className="mt-10 bg-white rounded-lg shadow p-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-700">
        {title}
      </h2>

      <div className="flex flex-col gap-12 items-center w-full">
        {/* 🥧 Pie Chart */}
        <div className="w-full max-w-3xl">
          <ResponsiveContainer width="100%" height={isMobile ? 300 : 400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 100 : 140}
                label={({ name, value }) =>
                  `${name}: ₹${value.toLocaleString()}`
                }
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Section Title */}
        {selectedDate === "All" && (
          <>
            <h3 className="text-lg font-semibold text-gray-600 text-center">
              Monthly Breakdown
            </h3>

            {/* 📊 Stacked Bar Chart */}
            <div className="w-full max-w-4xl">
              <ResponsiveContainer width="100%" height={isMobile ? 320 : 420}>
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  {categories.map((cat, i) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="a"
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ExpenseChart;