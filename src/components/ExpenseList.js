import React, { useState, useEffect } from "react";
import axios from "axios";

function ExpenseList({
  expenses,
  onDelete,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}) {
  const [selectedDate, setSelectedDate] = useState("All"); // 👈 new state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    createdAt: "",
  });
  const [showAll, setShowAll] = useState(false);

  const API = process.env.REACT_APP_API || "http://localhost:5001";

  const months = [
    "All",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const years = [
    "All",
    ...new Set(
      expenses.map((e) =>
        e.createdAt
          ? new Date(e.createdAt).getFullYear()
          : new Date().getFullYear()
      )
    ),
  ];

  // ✅ Prepare all unique date strings for filtering
  const allDates = [
    "All",
    ...new Set(
      expenses.map((e) =>
        e.createdAt
          ? new Date(e.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : ""
      )
    ),
  ];

  // ✅ Auto-select today's date (if exists)
  useEffect(() => {
    if (!expenses.length) return;
    const today = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (allDates.includes(today)) {
      setSelectedDate(today);
    } else {
      setSelectedDate("All");
      setSelectedMonth(
        new Date().toLocaleString("default", { month: "long" })
      );
    }
  }, [expenses.length]);

  // ✅ Filter expenses
  const filteredExpenses = expenses.filter((exp) => {
    if (!exp.createdAt) return true;
    const expDate = new Date(exp.createdAt);
    const monthName = months[expDate.getMonth() + 1];
    const year = expDate.getFullYear();
    const formattedDate = expDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    const matchesYear = selectedYear === "All" || year === selectedYear;
    const matchesMonth = selectedMonth === "All" || monthName === selectedMonth;
    const matchesDate = selectedDate === "All" || selectedDate === formattedDate;

    return matchesYear && matchesMonth && matchesDate;
  });

  // ✅ Sort & group by date
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const grouped = sortedExpenses.reduce((acc, exp) => {
    const dateKey = new Date(exp.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(exp);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const visibleDates = showAll ? sortedDates : sortedDates.slice(0, 5);

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // --- Edit functionality (same as before)
  const startEditing = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      createdAt: exp.createdAt
        ? new Date(exp.createdAt).toLocaleDateString("en-CA")
        : "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: "", amount: "", category: "", createdAt: "" });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id) => {
    try {
      const payload = {
        ...editForm,
        createdAt: new Date(editForm.createdAt).toISOString(),
      };
      await axios.put(`${API}/expenses/${id}`, payload);
      window.alert("✅ Expense updated!");
      window.location.reload();
    } catch (err) {
      console.error("Error updating expense:", err);
      window.alert("❌ Failed to update expense.");
    }
  };

  if (!expenses.length) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No expenses yet. Add your first one above 👆
      </p>
    );
  }

  return (
    <div className="mt-8">
      {/* Header filters */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex gap-3">
          {/* Month */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            {months.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "All" ? "All" : parseInt(e.target.value)
              )
            }
            className="border border-gray-300 p-2 rounded"
          >
            {years.map((y, i) => (
              <option key={i} value={y}>{y}</option>
            ))}
          </select>

          {/* Date */}
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            {allDates.map((d, i) => (
              <option key={i} value={d}>
                {d === "All" ? "All Dates" : d}
              </option>
            ))}
          </select>
        </div>

        {/* Total */}
        <p className="text-lg font-bold text-gray-700">
          Total: ₹{total.toLocaleString()}
        </p>
      </div>

      {/* Grouped expense display */}
      {visibleDates.map((dateKey) => (
        <div key={dateKey} className="mb-6">
          <h3 className="text-blue-700 font-semibold text-lg flex items-center gap-2 mb-2">
            📅 {dateKey}
          </h3>

          <div className="space-y-3">
            {grouped[dateKey].map((exp) => (
              <div
                key={exp._id}
                className="flex justify-between items-center bg-gray-50 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
              >
                {editingId === exp._id ? (
                  // Edit Mode
                  <div className="flex flex-col md:flex-row gap-2 w-full">
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="border rounded p-2 flex-1"
                    />
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-24"
                    />
                    <input
                      type="text"
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-32"
                    />
                    <input
                      type="date"
                      name="createdAt"
                      value={editForm.createdAt}
                      onChange={handleEditChange}
                      className="border rounded p-2 w-40"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(exp._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div>
                      <p className="text-lg font-semibold">{exp.title}</p>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {exp.category || "Uncategorized"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-green-700 font-bold text-lg">
                        ₹{exp.amount.toLocaleString()}
                      </span>

                      <button
                        onClick={() => startEditing(exp)}
                        className="text-blue-600 hover:text-blue-800 text-xl"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => onDelete(exp._id)}
                        className="text-red-600 hover:text-red-800 text-xl"
                        title="Delete"
                      >
                        🗑
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {sortedDates.length > 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showAll ? "Show Less ▲" : "Show More ▼"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;