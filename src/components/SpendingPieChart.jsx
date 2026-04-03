import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { getCategoryData, getSummary } from "../utils/calculations";

const COLORS = [
  "#ff7b8a",
  "#ffb36b",
  "#ffd66b",
  "#9b8cff",
  "#7ad7f0",
  "#f29ce6",
];

function SpendingPieChart({ transactions }) {
  const data = getCategoryData(transactions);
  const { income } = getSummary(transactions);
  const totalExpense = data.reduce((sum, item) => sum + item.value, 0);
  const incomeRatio =
    income > 0 ? Math.round((income / (income + totalExpense || 1)) * 100) : 0;

  const isDark = document.body.classList.contains("dark");

  const tooltipBg = isDark
    ? "rgba(18, 26, 44, 0.92)"
    : "rgba(255,255,255,0.95)";
  const tooltipText = isDark ? "#ffffff" : "#17314f";
  const tooltipBorder = isDark
    ? "1px solid rgba(255,255,255,0.10)"
    : "1px solid rgba(95,117,151,0.18)";

  return (
    <div className="ratio-card">
      <div className="panel-header">
        <h3>Ratio Income</h3>
      </div>

      <div className="ratio-content">
        {data.length === 0 ? (
          <p className="no-data-text">No expense data available.</p>
        ) : (
          <div className="ratio-chart-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  stroke={isDark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.75)"}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: tooltipBg,
                    border: tooltipBorder,
                    borderRadius: "14px",
                    color: tooltipText,
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                  labelStyle={{ color: tooltipText }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="ratio-center-text">
              <span>Income</span>
              <strong>{incomeRatio}%</strong>
            </div>
          </div>
        )}

        <div className="balance-credit-card">
          <div className="fake-card">
            <div className="fake-card-chip"></div>
            <div className="fake-card-brand"></div>
            <p>1234 **** **** 5678</p>
          </div>

          <div className="balance-card-text">
            <span>Balance</span>
            <strong>₹{(income - totalExpense).toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpendingPieChart;