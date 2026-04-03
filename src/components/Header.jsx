function Header({
  role,
  setRole,
  darkMode,
  setDarkMode,
  onLogout,
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="dashboard-header card-theme">
      <div className="header-center-title">
        <h1>Personal Finance Dashboard</h1>
      </div>

      <div className="header-right-meta">
        <span className="today-text">Today: {today}</span>

        <select
          className="role-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="button"
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button type="button" className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;