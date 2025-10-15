// import React, { useState } from "react";

// function ExpenseForm({ onAdd }) {
//   const [form, setForm] = useState({
//     title: "",
//     amount: "",
//     category: "",
//     createdAt: new Date().toISOString().slice(0, 10), // default: current date/time
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.title || !form.amount) return;
//     // Convert date properly before sending
//     onAdd({ ...form, createdAt: new Date(form.createdAt).toISOString() });
//     setForm({
//       title: "",
//       amount: "",
//       category: "",
//       createdAt: new Date().toISOString().slice(0, 10),
//     });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="flex flex-col md:flex-row gap-3 mb-6"
//     >
//       <input
//         type="text"
//         name="title"
//         placeholder="Expense title"
//         value={form.title}
//         onChange={handleChange}
//         className="border border-gray-300 rounded p-2 flex-1"
//       />
//       <input
//         type="number"
//         name="amount"
//         placeholder="Amount ₹"
//         value={form.amount}
//         onChange={handleChange}
//         className="border border-gray-300 rounded p-2 w-full md:w-32"
//       />
//       <input
//         type="text"
//         name="category"
//         placeholder="Category"
//         value={form.category}
//         onChange={handleChange}
//         className="border border-gray-300 rounded p-2 w-full md:w-32"
//       />
//       {/* New date/time field */}
//       <input
//         type="date"
//         name="createdAt"
//         value={form.createdAt}
//         onChange={handleChange}
//         max = {new Date().toISOString().slice(0, 10)} // prevent future dates
//         className="border border-gray-300 rounded p-2 w-full md:w-48"
//       />
//       <button
//         type="submit"
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Add
//       </button>
//     </form>
//   );
// }

// export default ExpenseForm;

import React, { useState } from "react";

function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    onAdd({ ...form, createdAt: new Date(form.createdAt).toISOString() });
    setForm({
      title: "",
      amount: "",
      category: "",
      createdAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm"
    >
      {/* Expense title */}
      <input
        type="text"
        name="title"
        placeholder="Expense title"
        value={form.title}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 flex-1 min-w-[180px]"
      />

      {/* Amount */}
      <input
        type="number"
        name="amount"
        placeholder="Amount ₹"
        value={form.amount}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-[120px]"
      />

      {/* Category */}
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2 w-[130px]"
      />

      {/* Date */}
      <input
        type="date"
        name="createdAt"
        value={form.createdAt}
        onChange={handleChange}
        max={new Date().toISOString().slice(0, 10)} // prevent future dates
        className="border border-gray-300 rounded-lg p-2 w-[160px]"
      />

      {/* Add button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform"
      >
        Add
      </button>
    </form>
  );
}

export default ExpenseForm;