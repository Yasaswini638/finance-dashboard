export const exportTransactionsToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    t.date,
    t.description,
    t.category,
    t.type,
    t.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((item) => `"${item}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "transactions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};