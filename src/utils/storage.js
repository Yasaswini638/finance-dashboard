export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

export const loadTransactions = () => {
  try {
    const data = localStorage.getItem("finance_transactions");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading transactions:", error);
    return null;
  }
};