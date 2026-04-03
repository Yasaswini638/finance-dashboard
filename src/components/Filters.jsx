function Filters({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
  categories,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by description or category"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      >
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
        <option value="high">Amount High to Low</option>
        <option value="low">Amount Low to High</option>
      </select>

      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>
  );
}

export default Filters;