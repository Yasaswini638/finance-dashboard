export const getSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

export const getCategoryData = (transactions) => {
  const categoryMap = {};

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  return Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));
};

export const getMonthlyTrend = (transactions) => {
  const monthMap = {};

  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    if (!monthMap[month]) {
      monthMap[month] = { month, income: 0, expenses: 0, balance: 0 };
    }

    if (t.type === "income") {
      monthMap[month].income += t.amount;
    } else {
      monthMap[month].expenses += t.amount;
    }

    monthMap[month].balance = monthMap[month].income - monthMap[month].expenses;
  });

  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

export const getInsights = (transactions) => {
  const categoryData = getCategoryData(transactions);
  const summary = getSummary(transactions);
  const monthlyData = getMonthlyTrend(transactions);

  let highestCategory = "N/A";
  if (categoryData.length > 0) {
    highestCategory = categoryData.reduce((max, item) =>
      item.value > max.value ? item : max
    ).name;
  }

  let monthlyComparison = "Not enough data";
  if (monthlyData.length >= 2) {
    const last = monthlyData[monthlyData.length - 1];
    const prev = monthlyData[monthlyData.length - 2];
    monthlyComparison =
      last.expenses > prev.expenses
        ? "Expenses increased compared to previous month"
        : "Expenses decreased compared to previous month";
  }

  return {
    highestCategory,
    monthlyComparison,
    balanceNote:
      summary.balance >= 0
        ? "Your balance is healthy this period."
        : "Expenses are exceeding income.",
  };
};