// import React, { useState , useEffect} from "react";
// import axios from "axios";

// function ExpenseList({ expenses, onDelete ,selectedMonth, selectedYear, setSelectedYear, setSelectedMonth}) {
//   const [expenseList, setExpenseList] = useState(expenses);
//   // const [selectedMonth, setSelectedMonth] = useState("All");
//   // const [selectedYear, setSelectedYear] = useState("All");
//   const [editingId, setEditingId] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     createdAt: "",
//   });
  
//   useEffect(() => {
//     setExpenseList(expenses);
//   }, [expenses]);

//   // Filter setup
//   const years = [
//     "All",
//     ...new Set(
//       expenseList.map((e) =>
//         e.createdAt ? new Date(e.createdAt).getFullYear() : new Date().getFullYear()
//       )
//     ),
//   ];

//   const months = [
//     "All",
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const filteredExpenses = expenseList.filter((exp) => {
//     if (!exp.createdAt) return true;
//     const expDate = new Date(exp.createdAt);
//     const monthName = months[expDate.getMonth() + 1];
//     const year = expDate.getFullYear();
//     const matchesMonth = selectedMonth === "All" || monthName === selectedMonth;
//     const matchesYear = selectedYear === "All" || year === selectedYear;
//     return matchesMonth && matchesYear;
//   });

//   const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

//   //Sort by date descending
//   const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   // ---------- EDITING ----------
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
//   try {
//     // Convert to ISO format for backend compatibility
//     const payload = { ...editForm, createdAt: new Date(editForm.createdAt).toISOString() };
//     console.log("Sending Update:", payload);
//     const res = await axios.put(`http://localhost:5001/api/expenses/${id}`, payload);

//     // Live update without reload
//     setExpenseList((prev) =>
//       prev.map((exp) => (exp._id === id ? res.data : exp))
//     );

//     setEditingId(null);
//     window.alert("✅ Expense updated!");
//   } catch (err) {
//     console.error("Error updating expense:", err);
//     window.alert("❌ Failed to update expense.");
//   }
// };

//   // ---------- UI ----------
//   if (expenseList.length === 0) {
//     return (
//       <p className="text-center text-gray-500 mt-4">
//         No expenses yet. Add your first one above 👆
//       </p>
//     );
//   }

//   return (
//     <div>
//       {/* Filters */}
//       <div className="flex flex-wrap justify-end gap-3 mb-4">
//         <select
//           value={selectedMonth}
//           onChange={(e) => setSelectedMonth(e.target.value)}
//           className="border border-gray-300 p-2 rounded"
//         >
//           {months.map((m, i) => (
//             <option key={i} value={m}>
//               {m}
//             </option>
//           ))}
//         </select>

//         <select
//           value={selectedYear}
//           onChange={(e) =>
//             setSelectedYear(
//               e.target.value === "All" ? "All" : parseInt(e.target.value)
//             )
//           }
//           className="border border-gray-300 p-2 rounded"
//         >
//           {years.map((y, i) => (
//             <option key={i} value={y}>
//               {y}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Expense List */}
//       <div className="space-y-3">
//         {sortedExpenses.map((exp) => (
//           <div
//             key={exp._id}
//             className="flex justify-between items-center bg-gray-50 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
//           >
//             {editingId === exp._id ? (
//               // ---------- EDIT MODE ----------
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
//               // ---------- VIEW MODE ----------
//               <>
//                 <div>
//                   <p className="text-lg font-semibold">{exp.title}</p>
//                   <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
//                     {exp.category || "Uncategorized"}
//                   </span>
//                   {exp.createdAt && (
//                     <p className="text-xs text-gray-400 mt-1">
//                       Added on: {new Date(exp.createdAt).toLocaleString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </p>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-4">
//                   <span className="text-green-700 font-bold text-lg">
//                     ₹{exp.amount}
//                   </span>

//                   <button
//                     onClick={() => startEditing(exp)}
//                     className="text-blue-600 hover:text-blue-800 text-xl"
//                     title="Edit"
//                   >
//                     ✏️
//                   </button>

//                   <button
//                     onClick={() => onDelete(exp._id)}
//                     className="text-red-600 hover:text-red-800 text-xl"
//                     title="Delete"
//                   >
//                     🗑
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Total */}
//       <p className="text-right text-lg font-bold text-gray-700 mt-6">
//         Total: ₹{total}
//       </p>
//     </div>
//   );
// }

// export default ExpenseList;

// ---------- IGNORE BELOW (OLD SNIPPETS) ----------


import React, { useState } from "react";
import axios from "axios";

function ExpenseList({
  expenses,
  onDelete,
  selectedYear,
  setSelectedYear,
  selectedMonth,
  setSelectedMonth,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    createdAt: "",
  });
  const [showAll, setShowAll] = useState(false);

  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract available years
  const years = [
    "All",
    ...new Set(
      expenses.map((e) =>
        e.createdAt ? new Date(e.createdAt).getFullYear() : new Date().getFullYear()
      )
    ),
  ];

  // Filter by selected month/year
  const filteredExpenses = expenses.filter((exp) => {
    if (!exp.createdAt) return true;
    const expDate = new Date(exp.createdAt);
    const monthName = months[expDate.getMonth() + 1];
    const year = expDate.getFullYear();
    const matchesMonth = selectedMonth === "All" || monthName === selectedMonth;
    const matchesYear = selectedYear === "All" || year === selectedYear;
    return matchesMonth && matchesYear;
  });

  // ✅ Sort by date (newest first)
  const sortedExpenses = [...filteredExpenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Show either 5 newest or all
  const visibleExpenses = showAll ? sortedExpenses : sortedExpenses.slice(0, 5);

  // Total amount
  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // --- EDIT FUNCTIONS (unchanged logic) ---
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
      const payload = { ...editForm, createdAt: new Date(editForm.createdAt).toISOString() };
      const res = await axios.put(`http://localhost:5001/api/expenses/${id}`, payload);
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
      {/* Header section with filters + total */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          >
            {months.map((m, i) => (
              <option key={i} value={m}>
                {m}
              </option>
            ))}
          </select>

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
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* ✅ Total on top-right */}
        <p className="text-lg font-bold text-gray-700">
          Total: ₹{total.toLocaleString()}
        </p>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {visibleExpenses.map((exp) => (
          <div
            key={exp._id}
            className="flex justify-between items-center bg-gray-50 p-4 border rounded shadow-sm hover:shadow-md transition-shadow"
          >
            {editingId === exp._id ? (
              // EDIT MODE
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
              // VIEW MODE
              <>
                <div>
                  <p className="text-lg font-semibold">{exp.title}</p>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {exp.category || "Uncategorized"}
                  </span>
                  {exp.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Added on:{" "}
                      {new Date(exp.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
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

      {/* ✅ Show More / Less Button */}
      {sortedExpenses.length > 5 && (
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