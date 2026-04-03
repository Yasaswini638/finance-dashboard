import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import Header from "../components/Header";
import SummaryCards from "../components/SummaryCards";
import BalanceTrendChart from "../components/BalanceTrendChart";
import SpendingPieChart from "../components/SpendingPieChart";
import Filters from "../components/Filters";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import InsightsPanel from "../components/InsightsPanel";
import EmptyState from "../components/EmptyState";
import { initialTransactions } from "../data/transactions";
import { loadTransactions, saveTransactions } from "../utils/storage";
import { exportTransactionsToCSV } from "../utils/exportCsv";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { getSummary, getCategoryData, getInsights } from "../utils/calculations";

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [role, setRole] = useState(currentUser?.role || "viewer");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [darkMode, setDarkMode] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeMonth, setActiveMonth] = useState("AUGUST");
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const stored = loadTransactions();

    if (stored && stored.length > 0) {
      setTransactions(stored);
    } else {
      setTransactions(initialTransactions);
    }

    const savedTheme = localStorage.getItem("finance_dark_mode");
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    document.body.className = darkMode ? "dark dashboard-body" : "light dashboard-body";
    localStorage.setItem("finance_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ];

  const monthToNumber = {
    JANUARY: "01",
    FEBRUARY: "02",
    MARCH: "03",
    APRIL: "04",
    MAY: "05",
    JUNE: "06",
    JULY: "07",
    AUGUST: "08",
    SEPTEMBER: "09",
    OCTOBER: "10",
    NOVEMBER: "11",
    DECEMBER: "12",
  };

  const selectedYear = useMemo(() => {
    if (transactions.length === 0) {
      return new Date().getFullYear().toString();
    }
    return transactions[0].date.slice(0, 4);
  }, [transactions]);

  const monthFilteredTransactions = useMemo(() => {
    const selectedMonthNumber = monthToNumber[activeMonth];

    return transactions.filter((t) => {
      const year = t.date.slice(0, 4);
      const month = t.date.slice(5, 7);
      return year === selectedYear && month === selectedMonthNumber;
    });
  }, [transactions, activeMonth, selectedYear]);

  const filteredTransactions = useMemo(() => {
    let data = [...monthFilteredTransactions];

    if (search) {
      data = data.filter((t) =>
        `${t.description} ${t.category}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (typeFilter !== "all") {
      data = data.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      data = data.filter((t) => t.category === categoryFilter);
    }

    if (startDate) {
      data = data.filter((t) => new Date(t.date) >= new Date(startDate));
    }

    if (endDate) {
      data = data.filter((t) => new Date(t.date) <= new Date(endDate));
    }

    if (sortOrder === "latest") {
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOrder === "oldest") {
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOrder === "high") {
      data.sort((a, b) => b.amount - a.amount);
    } else if (sortOrder === "low") {
      data.sort((a, b) => a.amount - b.amount);
    }

    return data;
  }, [
    monthFilteredTransactions,
    search,
    typeFilter,
    categoryFilter,
    sortOrder,
    startDate,
    endDate,
  ]);

  const categories = [...new Set(monthFilteredTransactions.map((t) => t.category))];
  const summary = getSummary(monthFilteredTransactions);
  const categoryData = getCategoryData(monthFilteredTransactions);
  const insights = getInsights(monthFilteredTransactions);

  const monthHasIncome = monthFilteredTransactions.some((t) => t.type === "income");
  const suggestedDate = `${selectedYear}-${monthToNumber[activeMonth]}-01`;
  const suggestedType = monthHasIncome ? "expense" : "income";

  const handleAddOrUpdateTransaction = (transactionData) => {
    if (editingTransaction) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTransaction.id
            ? { ...transactionData, id: editingTransaction.id }
            : t
        )
      );
      setEditingTransaction(null);
    } else {
      setTransactions((prev) => [
        { ...transactionData, id: Date.now() },
        ...prev,
      ]);
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    if (editingTransaction && editingTransaction.id === id) {
      setEditingTransaction(null);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/signin");
  };

  const sidebarItems = [
    { key: "dashboard", label: "Dashboard" },
    { key: "budgeting", label: "Budgeting" },
    { key: "income", label: "Income" },
    { key: "expenses", label: "Expenses" },
    { key: "investments", label: "Investments" },
    { key: "debts", label: "Debts" },
    { key: "goals", label: "Goals" },
  ];

  const renderStarterWidget = () => {
    if (monthFilteredTransactions.length === 0) {
      return (
        <div className="starter-widget card-theme">
          <h3>Start {activeMonth} by adding your income</h3>
          <p>
            No transactions exist for {activeMonth}. Add your income first, then
            add expenses like food, bills, travel, and shopping.
          </p>
        </div>
      );
    }

    if (!monthHasIncome) {
      return (
        <div className="starter-widget card-theme">
          <h3>Add income first for {activeMonth}</h3>
          <p>
            You currently have expenses without income in this month. Add salary,
            bonus, or freelance income so balance and insights become meaningful.
          </p>
        </div>
      );
    }

    return null;
  };

  const renderMainContent = () => {
    if (activeSection === "dashboard") {
      return (
        <>
          <div className="month-strip card-theme">
            <div className="months-row">
              {months.map((month) => (
                <button
                  key={month}
                  className={`month-pill ${activeMonth === month ? "active" : ""}`}
                  onClick={() => setActiveMonth(month)}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>

          {renderStarterWidget()}

          <div className="top-dashboard-grid">
            <div className="left-top-panel">
              <BalanceTrendChart
                transactions={transactions}
                activeMonth={activeMonth}
                selectedYear={selectedYear}
              />
            </div>

            <div className="right-top-panel">
              <SpendingPieChart transactions={monthFilteredTransactions} />
              <SummaryCards transactions={monthFilteredTransactions} />
            </div>
          </div>

          <div className="mid-grid">
            <InsightsPanel transactions={monthFilteredTransactions} />
          </div>

          <div className="section section-theme">
            <div className="section-header">
              <h2>Transactions - {activeMonth}</h2>
              <button
                className="export-btn"
                onClick={() => exportTransactionsToCSV(filteredTransactions)}
              >
                Export CSV
              </button>
            </div>

            <Filters
              search={search}
              setSearch={setSearch}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              categories={categories}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {role === "admin" && (
              <TransactionForm
                onAdd={handleAddOrUpdateTransaction}
                editingTransaction={editingTransaction}
                defaultDate={suggestedDate}
                defaultType={suggestedType}
              />
            )}

            {filteredTransactions.length === 0 ? (
              <EmptyState message={`No transactions found for ${activeMonth}.`} />
            ) : (
              <TransactionTable
                transactions={filteredTransactions}
                role={role}
                onDelete={handleDeleteTransaction}
                onEdit={setEditingTransaction}
              />
            )}
          </div>
        </>
      );
    }

    if (activeSection === "budgeting") {
      return (
        <div className="section section-theme">
          <h2>Budgeting - {activeMonth}</h2>
          <div className="insights-grid-theme">
            <div className="insight-card-theme card-theme">
              <h3>Total Expenses</h3>
              <p>₹{summary.expenses.toLocaleString()}</p>
            </div>
            <div className="insight-card-theme card-theme">
              <h3>Total Balance</h3>
              <p>₹{summary.balance.toLocaleString()}</p>
            </div>
            <div className="insight-card-theme card-theme">
              <h3>Top Spending Area</h3>
              <p>{insights.highestCategory}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeSection === "income") {
      const incomeTransactions = monthFilteredTransactions.filter((t) => t.type === "income");
      return (
        <div className="section section-theme">
          <h2>Income - {activeMonth}</h2>
          {incomeTransactions.length === 0 ? (
            <EmptyState message={`No income transactions available in ${activeMonth}.`} />
          ) : (
            <TransactionTable
              transactions={incomeTransactions}
              role={role}
              onDelete={handleDeleteTransaction}
              onEdit={setEditingTransaction}
            />
          )}
        </div>
      );
    }

    if (activeSection === "expenses") {
      const expenseTransactions = monthFilteredTransactions.filter((t) => t.type === "expense");
      return (
        <div className="section section-theme">
          <h2>Expenses - {activeMonth}</h2>
          {expenseTransactions.length === 0 ? (
            <EmptyState message={`No expense transactions available in ${activeMonth}.`} />
          ) : (
            <TransactionTable
              transactions={expenseTransactions}
              role={role}
              onDelete={handleDeleteTransaction}
              onEdit={setEditingTransaction}
            />
          )}
        </div>
      );
    }

    if (activeSection === "investments") {
      return (
        <div className="section section-theme">
          <h2>Investments</h2>
          <div className="insight-card-theme card-theme">
            <h3>Investment Overview</h3>
            <p>This section can later be extended for investment tracking.</p>
          </div>
        </div>
      );
    }

    if (activeSection === "debts") {
      return (
        <div className="section section-theme">
          <h2>Debts</h2>
          <div className="insight-card-theme card-theme">
            <h3>Debt Overview</h3>
            <p>This section can later be extended for loans and EMI tracking.</p>
          </div>
        </div>
      );
    }

    if (activeSection === "goals") {
      return (
        <div className="section section-theme">
          <h2>Goals - {activeMonth}</h2>
          <div className="insights-grid-theme">
            <div className="insight-card-theme card-theme">
              <h3>Observation</h3>
              <p>{insights.balanceNote}</p>
            </div>
            <div className="insight-card-theme card-theme">
              <h3>Monthly Comparison</h3>
              <p>{insights.monthlyComparison}</p>
            </div>
            <div className="insight-card-theme card-theme">
              <h3>Spending Categories</h3>
              <p>{categoryData.length} categories tracked</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">₿</div>
          <div>
            <h3>Personal Finance</h3>
            <p>{currentUser?.name || "User"}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeSection === item.key ? "active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="dashboard-main">
        <Header
          role={role}
          setRole={setRole}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
        />
        {renderMainContent()}
      </main>
    </div>
  );
}

export default Dashboard;