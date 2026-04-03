import { useEffect, useState } from "react";

function TransactionForm({
  onAdd,
  editingTransaction,
  defaultDate = "",
  defaultType = "income",
}) {
  const [form, setForm] = useState({
    date: defaultDate,
    description: "",
    amount: "",
    category: "",
    type: defaultType,
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        date: editingTransaction.date,
        description: editingTransaction.description,
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        type: editingTransaction.type,
      });
    } else {
      setForm({
        date: defaultDate,
        description: "",
        amount: "",
        category: "",
        type: defaultType,
      });
    }
  }, [editingTransaction, defaultDate, defaultType]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.date || !form.description || !form.amount || !form.category) {
      return;
    }

    onAdd({
      ...form,
      amount: Number(form.amount),
    });

    setForm({
      date: defaultDate,
      description: "",
      amount: "",
      category: "",
      type: defaultType,
    });
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        type="text"
        placeholder={form.type === "income" ? "Salary / Freelance / Bonus" : "Groceries / Rent / Travel"}
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <input
        type="number"
        placeholder="Amount"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />

      <input
        type="text"
        placeholder={form.type === "income" ? "Salary / Freelance" : "Food / Bills / Transport"}
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <select
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <button type="submit">
        {editingTransaction
          ? "Update Transaction"
          : form.type === "income"
          ? "Add Income"
          : "Add Expense"}
      </button>
    </form>
  );
}

export default TransactionForm;