import { getInsights } from "../utils/calculations";

function InsightsPanel({ transactions }) {
  const insights = getInsights(transactions);

  return (
    <div className="insights-grid-theme">
      <div className="insight-card-theme card-theme">
        <h3>Highest Spending Category</h3>
        <p>{insights.highestCategory}</p>
      </div>

      <div className="insight-card-theme card-theme">
        <h3>Monthly Comparison</h3>
        <p>{insights.monthlyComparison}</p>
      </div>

      <div className="insight-card-theme card-theme">
        <h3>Observation</h3>
        <p>{insights.balanceNote}</p>
      </div>
    </div>
  );
}

export default InsightsPanel;