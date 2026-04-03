function TransactionTable({ transactions, role, onDelete, onEdit }) {
  return (
    <div className="table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={t.type === "income" ? "income-text" : "expense-text"}>
                {t.type}
              </td>
              <td>₹{t.amount.toLocaleString()}</td>

              {role === "admin" && (
                <td className="action-buttons">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => onDelete(t.id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;