import { getSummary } from "../utils/calculations";

function SummaryCards({ transactions }) {
  const { income, expenses, balance } = getSummary(transactions);

  const cards = [
    { title: "Total Balance", value: balance, cls: "balance-glow" },
    { title: "Income", value: income, cls: "income-glow" },
    { title: "Expenses", value: expenses, cls: "expense-glow" },
  ];

  return (
    <div className="summary-stack">
      {cards.map((card) => (
        <div key={card.title} className={`mini-stat-card card-dark ${card.cls}`}>
          <h4>{card.title}</h4>
          <p>₹{card.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;