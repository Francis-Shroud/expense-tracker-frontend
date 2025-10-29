// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// function ExpenseList({ expenses, onDelete }) {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     createdAt: "",
//   });
//   const [showAll, setShowAll] = useState(false);

//   const API = process.env.REACT_APP_API || "http://localhost:5001/api";

//   // ✅ Auto-select today (if any expenses exist for today)
//   useEffect(() => {
//     if (!expenses.length) return;
//     const today = new Date();
//     const hasToday = expenses.some(
//       (e) =>
//         new Date(e.createdAt).toDateString() === today.toDateString()
//     );
//     if (hasToday) setSelectedDate(today);
//   }, [expenses]);

//   // ✅ Filter expenses by selected date
//   const filteredExpenses = expenses.filter((exp) => {
//     if (!exp.createdAt) return true;
//     if (!selectedDate) return true;
//     const expDate = new Date(exp.createdAt);
//     return expDate.toDateString() === selectedDate.toDateString();
//   });

//   const sortedExpenses = [...filteredExpenses].sort(
//     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//   );
//   const visibleExpenses = showAll ? sortedExpenses : sortedExpenses.slice(0, 5);
//   const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

//   // --- Edit Logic ---
//   const startEditing = (exp) => {
//     setEditingId(exp._id);
//     setEditForm({
//       title: exp.title,
//       amount: exp.amount,
//       category: exp.category,
//       createdAt: exp.createdAt
//         ? new Date(exp.createdAt).toISOString().slice(0, 10)
//         : "",
//     });
//   };

//   const cancelEditing = () => {
//     setEditingId(null);
//     setEditForm({ title: "", amount: "", category: "", createdAt: "" });
//   };

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const saveEdit = async (id) => {
//     try {
//       const payload = {
//         ...editForm,
//         createdAt: new Date(editForm.createdAt).toISOString(),
//       };
//       await axios.put(`${API}/expenses/${id}`, payload);
//       window.alert("✅ Expense updated!");
//       window.location.reload();
//     } catch (err) {
//       console.error("Error updating expense:", err);
//       window.alert("❌ Failed to update expense.");
//     }
//   };

//   if (!expenses.length)
//     return (
//       <p className="text-center text-gray-500 mt-4">
//         No expenses yet. Add your first one above 👆
//       </p>
//     );

//   return (
//     <div className="mt-8">
//       {/* Filter Header */}
//       <div className="flex flex-wrap justify-between items-center mb-4">
//         {/* 📅 Calendar Filter */}
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => setSelectedDate(date)}
//           isClearable
//           placeholderText="Select a date"
//           dateFormat="dd/MM/yyyy"
//           showMonthDropdown
//           showYearDropdown
//           dropdownMode="select"
//           className="border border-gray-300 p-2 rounded text-gray-700"
//         />

//         {/* 💰 Total */}
//         <p className="text-lg font-bold text-gray-700">
//           Total: ₹{total.toLocaleString()}
//         </p>
//       </div>

//       {/* Expense List */}
//       <div className="space-y-3">
//         {visibleExpenses.map((exp) => (
//           <div
//             key={exp._id}
//             className="flex justify-between items-center bg-gray-50 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
//           >
//             {editingId === exp._id ? (
//               // Edit Mode
//               <div className="flex flex-col md:flex-row gap-2 w-full">
//                 <input
//                   type="text"
//                   name="title"
//                   value={editForm.title}
//                   onChange={handleEditChange}
//                   className="border rounded p-2 flex-1"
//                 />
//                 <input
//                   type="number"
//                   name="amount"
//                   value={editForm.amount}
//                   onChange={handleEditChange}
//                   className="border rounded p-2 w-24"
//                 />
//                 <input
//                   type="text"
//                   name="category"
//                   value={editForm.category}
//                   onChange={handleEditChange}
//                   className="border rounded p-2 w-32"
//                 />
//                 <input
//                   type="date"
//                   name="createdAt"
//                   value={editForm.createdAt}
//                   onChange={handleEditChange}
//                   className="border rounded p-2 w-40"
//                 />
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => saveEdit(exp._id)}
//                     className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                   >
//                     Save
//                   </button>
//                   <button
//                     onClick={cancelEditing}
//                     className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               // View Mode
//               <>
//                 <div>
//                   <p className="text-lg font-semibold">{exp.title}</p>
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                     {exp.category || "Uncategorized"}
//                   </span>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Added on:{" "}
//                     {new Date(exp.createdAt).toLocaleDateString("en-GB", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-green-700 font-bold text-lg">
//                     ₹{exp.amount.toLocaleString()}
//                   </span>
//                   <button
//                     onClick={() => startEditing(exp)}
//                     className="text-blue-600 hover:text-blue-800 text-xl"
//                   >
//                     ✏️
//                   </button>
//                   <button
//                     onClick={() => onDelete(exp._id)}
//                     className="text-red-600 hover:text-red-800 text-xl"
//                   >
//                     🗑
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Show More / Less */}
//       {sortedExpenses.length > 5 && (
//         <div className="text-center mt-4">
//           <button
//             onClick={() => setShowAll(!showAll)}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             {showAll ? "Show Less ▲" : "Show More ▼"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default ExpenseList;

//Grok version

import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ExpenseList({ expenses, onDelete }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    createdAt: "",
  });
  const [showAll, setShowAll] = useState(false);

  const API = process.env.REACT_APP_API || "http://localhost:5001/api";

  // Auto-select today if expenses exist
  useEffect(() => {
    if (!expenses.length) return;
    const today = new Date();
    const hasToday = expenses.some(
      (e) => new Date(e.createdAt).toDateString() === today.toDateString()
    );
    if (hasToday) setSelectedDate(today);
  }, [expenses]);

  // Filter by selected date
  const filteredExpenses = expenses.filter((exp) => {
    if (!exp.createdAt || !selectedDate) return true;
    return new Date(exp.createdAt).toDateString() === selectedDate.toDateString();
  });

  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const visibleExpenses = showAll ? sortedExpenses : sortedExpenses.slice(0, 5);
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Edit handlers
  const startEditing = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      title: exp.title,
      amount: exp.amount,
      category: exp.category,
      createdAt: exp.createdAt
        ? new Date(exp.createdAt).toISOString().slice(0, 10)
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
        amount: parseFloat(editForm.amount),
        createdAt: new Date(editForm.createdAt).toISOString(),
      };
      await axios.put(`${API}/expenses/${id}`, payload);
      alert("Expense updated!");
      window.location.reload();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update expense.");
    }
  };

  if (!expenses.length) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No expenses yet. Add your first one above
      </p>
    );
  }

  return (
    <div className="mt-8">
      {/* Filter Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          isClearable
          placeholderText="Filter by date"
          dateFormat="dd/MM/yyyy"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          className="border border-gray-300 p-2 rounded text-gray-700 text-sm"
        />
        <p className="text-lg font-bold text-gray-700">
          Total: ₹{total.toLocaleString()}
        </p>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {visibleExpenses.map((exp) => (
          <div
            key={exp._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
          >
            {editingId === exp._id ? (
              <div className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="border rounded p-2"
                  placeholder="Title"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    className="border rounded p-2 w-24"
                    placeholder="Amt"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="border rounded p-2 flex-1"
                    placeholder="Category"
                  />
                  <input
                    type="date"
                    name="createdAt"
                    value={editForm.createdAt}
                    onChange={handleEditChange}
                    className="border rounded p-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(exp._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-lg font-semibold">{exp.title}</p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {exp.category || "Uncategorized"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(exp.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className="text-green-700 font-bold text-lg">
                    ₹{exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => startEditing(exp)}
                    className="text-blue-600 hover:text-blue-800 text-xl"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(exp._id)}
                    className="text-red-600 hover:text-red-800 text-xl"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Show More/Less */}
      {sortedExpenses.length > 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            {showAll ? "Show Less Up" : "Show More Down"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;