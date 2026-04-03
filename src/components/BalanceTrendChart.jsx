import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMonthlyTrend } from "../utils/calculations";

function BalanceTrendChart({ transactions, activeMonth, selectedYear }) {
  const fullData = getMonthlyTrend(transactions);

  const monthOrder = {
    JANUARY: 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12,
  };

  const filteredData = fullData.filter((item) => {
    const [year, month] = item.month.split("-");
    return (
      year === selectedYear &&
      Number(month) <= monthOrder[activeMonth]
    );
  });

  const displayData = filteredData.map((item) => {
    const [year, month] = item.month.split("-");
    const monthNames = {
      "01": "JAN",
      "02": "FEB",
      "03": "MAR",
      "04": "APR",
      "05": "MAY",
      "06": "JUN",
      "07": "JUL",
      "08": "AUG",
      "09": "SEP",
      "10": "OCT",
      "11": "NOV",
      "12": "DEC",
    };

    return {
      ...item,
      label: monthNames[month],
    };
  });

  const isDark = document.body.classList.contains("dark");
  const axisColor = isDark ? "#d3deea" : "#4b647f";
  const gridColor = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(70,95,130,0.14)";
  const tooltipBg = isDark
    ? "rgba(18, 26, 44, 0.92)"
    : "rgba(255,255,255,0.95)";
  const tooltipText = isDark ? "#ffffff" : "#17314f";
  const tooltipBorder = isDark
    ? "1px solid rgba(255,255,255,0.10)"
    : "1px solid rgba(95,117,151,0.18)";

  return (
    <div className="chart-panel">
      <div className="panel-header">
        <h3>Income, Expenses, Balance & Monthly Difference</h3>
      </div>

      <div className="chart-box large-chart">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={displayData}>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} />
            <YAxis tick={{ fill: axisColor, fontSize: 11 }} />
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
            <Legend
              wrapperStyle={{
                color: axisColor,
                fontSize: "13px",
              }}
            />

            <Bar
              dataKey="difference"
              fill="#7c83fd"
              name="monthly difference"
              radius={[6, 6, 0, 0]}
            />

            <Line
              type="monotone"
              dataKey="income"
              stroke="#ff9a62"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffd6c2" }}
              activeDot={{ r: 6 }}
              name="income"
            />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#d978ff"
              strokeWidth={3}
              dot={{ r: 4, fill: "#f0c8ff" }}
              activeDot={{ r: 6 }}
              name="expenses"
            />

            <Line
              type="monotone"
              dataKey="balance"
              stroke="#ff5f87"
              strokeWidth={3}
              dot={{ r: 4, fill: "#ffc2d1" }}
              activeDot={{ r: 6 }}
              name="balance"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BalanceTrendChart;