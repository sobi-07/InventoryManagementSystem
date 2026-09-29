import "../Dashboard.css";
import { products, sales } from "../data/shopdata";

function Dashboard({
  user,
  userRole,
  onLogout,
  onAnalytics,
  onAI,
  onReports,
  onAccount,
  onSettings,
}) {
  // =========================================
  // USER INFORMATION
  // =========================================

  const userName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    user?.email?.trim().toLowerCase() || "";

  const initials = userName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // =========================================
  // USER ROLE
  // =========================================

  const isOwner = userRole === "owner";

  // =========================================
  // REAL DATA FROM SHOPDATA
  // =========================================

  const totalProducts = products.length;

  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minimumStock
  );

  const totalUnitsSold = sales.reduce(
    (total, sale) => total + sale.quantity,
    0
  );

  const totalRevenue = sales.reduce(
    (total, sale) => total + sale.totalAmount,
    0
  );

  // Use the latest date available in the sample data
  const latestDate =
    sales.length > 0
      ? sales.reduce((latest, sale) =>
          sale.date > latest ? sale.date : latest,
        sales[0].date)
      : null;

  const latestDaySales = sales.filter(
    (sale) => sale.date === latestDate
  );

  const latestDayRevenue = latestDaySales.reduce(
    (total, sale) => total + sale.totalAmount,
    0
  );

  const latestDayUnits = latestDaySales.reduce(
    (total, sale) => total + sale.quantity,
    0
  );

  // =========================================
  // TOP PRODUCTS
  // =========================================

  const topProducts = products
    .map((product) => {
      const sold = sales
        .filter((sale) => sale.productId === product.id)
        .reduce(
          (total, sale) => total + sale.quantity,
          0
        );

      return {
        ...product,
        sold,
        icon:
          product.category === "Food"
            ? "🍜"
            : product.category === "Beverages"
            ? "🥤"
            : product.category === "Biscuits"
            ? "🍪"
            : product.category === "Dairy"
            ? "🥛"
            : "📦",
      };
    })
    .sort((a, b) => b.sold - a.sold);

  // =========================================
  // DASHBOARD STATS
  // =========================================

  const stats = [
    {
      title: "Today's Sales",
      value: `₹${latestDayRevenue.toLocaleString("en-IN")}`,
      change:
        latestDate
          ? `${latestDayUnits} items sold`
          : "No sales data",
      icon: "💰",
      type: "positive",
    },
    {
      title: "Total Products",
      value: totalProducts,
      change: `${totalUnitsSold} units sold`,
      icon: "📦",
      type: "positive",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.length,
      change:
        lowStockProducts.length > 0
          ? "Needs attention"
          : "Stock looks good",
      icon: "⚠️",
      type:
        lowStockProducts.length > 0
          ? "warning"
          : "positive",
    },
    {
      title: "Sales Records",
      value: sales.length,
      change: `₹${totalRevenue.toLocaleString("en-IN")} total`,
      icon: "🧾",
      type: "positive",
    },
  ];

  // =========================================
  // LOW STOCK
  // =========================================

  const lowStock = lowStockProducts.map((product) => ({
    name: product.name,
    stock: product.stock,
  }));

  // =========================================
  // SALES CHART DATA
  // =========================================

  const salesByDate = sales.reduce((result, sale) => {
    if (!result[sale.date]) {
      result[sale.date] = 0;
    }

    result[sale.date] += sale.totalAmount;

    return result;
  }, {});

  const chartData = Object.entries(salesByDate)
    .sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    )
    .slice(-7);

  const maxChartValue = Math.max(
    ...chartData.map(([, amount]) => amount),
    1
  );

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div>🏪</div>

          <span>
            <strong>ShopManager</strong>
            <small>AI Inventory</small>
          </span>
        </div>

        <nav>

          <button className="nav-item active">
            <span>🏠</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>📦</span>
            Inventory
          </button>

          <button className="nav-item">
            <span>🧾</span>
            Billing
          </button>

          <button className="nav-item">
            <span>👥</span>
            Suppliers
          </button>

          <button
            className="nav-item"
            onClick={onAI}
          >
            <span>🤖</span>
            AI Assistant
          </button>

          {isOwner && (
            <button
              className="nav-item"
              onClick={onAnalytics}
            >
              <span>📊</span>
              Analytics
            </button>
          )}

          {isOwner && (
            <button
              className="nav-item"
              onClick={onReports}
            >
              <span>📑</span>
              Reports
            </button>
          )}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={onSettings}
          >
            <span>⚙️</span>
            Settings
          </button>

          <button
            className="logout-button"
            onClick={onLogout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <p className="greeting">
              Good evening, {userName} 👋
            </p>

            <h1>Shop Dashboard</h1>

            <p className="header-subtitle">
              Here's what's happening in your shop today.
            </p>

          </div>

          <div className="header-actions">

            <button
              className="notification"
              onClick={() => {
                if (lowStockProducts.length > 0) {
                  alert(
                    `${lowStockProducts.length} product(s) are low on stock.`
                  );
                } else {
                  alert("No low-stock alerts.");
                }
              }}
            >
              🔔
              {lowStockProducts.length > 0 && (
                <span></span>
              )}
            </button>

            <button
              className="profile"
              onClick={onAccount}
              title="Open Account"
            >

              <div className="profile-avatar">
                {initials}
              </div>

              <div>

                <strong>
                  {userName}
                </strong>

                <small>
                  {userEmail}
                </small>

                <small className="user-role">
                  {isOwner
                    ? "👑 Shop Owner"
                    : "👤 Staff"}
                </small>

              </div>

            </button>

          </div>

        </header>


        {/* AI INSIGHT */}

        <section className="ai-insight">

          <div className="ai-icon">🤖</div>

          <div className="ai-text">

            <span>SHOP INSIGHT</span>

            <h3>
              {topProducts[0]?.name
                ? `${topProducts[0].name} is your top-selling product.`
                : "Start recording sales to see insights."}
            </h3>

            <p>
              {topProducts[0]?.sold
                ? `${topProducts[0].name} has sold ${topProducts[0].sold} units. ${
                    lowStockProducts.length > 0
                      ? `${lowStockProducts[0].name} is currently low on stock.`
                      : "Your current stock levels look good."
                  }`
                : "Your sales insights will appear here when sales are recorded."}
            </p>

          </div>

          <button onClick={onAI}>
            Ask AI →
          </button>

        </section>


        {/* STAT CARDS */}

        <section className="stats-grid">

          {stats.map((stat) => (

            <div
              className={`stat-card ${stat.type}`}
              key={stat.title}
            >

              <div className="stat-top">

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <span className="stat-menu">
                  •••
                </span>

              </div>

              <p>{stat.title}</p>

              <h2>{stat.value}</h2>

              <small>{stat.change}</small>

            </div>

          ))}

        </section>


        {/* ANALYTICS AREA */}

        <section className="dashboard-grid">

          {/* SALES CHART */}

          <div className="panel sales-panel">

            <div className="panel-header">

              <div>
                <h2>Sales Overview</h2>
                <p>
                  Revenue from available sales data
                </p>
              </div>

              <span className="dashboard-data-label">
                {chartData.length} day(s)
              </span>

            </div>

            <div className="chart">

              <div className="chart-line line-one"></div>
              <div className="chart-line line-two"></div>
              <div className="chart-line line-three"></div>

              <div className="bars">

                {chartData.length > 0 ? (
                  chartData.map(([date, amount]) => (
                    <div
                      key={date}
                      title={`${date}: ₹${amount}`}
                      style={{
                        height: `${Math.max(
                          (amount / maxChartValue) * 90,
                          15
                        )}%`,
                      }}
                    ></div>
                  ))
                ) : (
                  <div
                    style={{ height: "20%" }}
                  ></div>
                )}

              </div>

              <div className="chart-labels">

                {chartData.length > 0 ? (
                  chartData.map(([date]) => (
                    <span key={date}>
                      {date.slice(5)}
                    </span>
                  ))
                ) : (
                  <span>No data</span>
                )}

              </div>

            </div>

          </div>


          {/* TOP PRODUCTS */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Top Products</h2>
                <p>Based on recorded sales</p>
              </div>

              <button
                className="view-button"
                onClick={onAnalytics}
              >
                View all
              </button>

            </div>

            <div className="product-list">

              {topProducts.map((product, index) => (

                <div
                  className="product-row"
                  key={product.id}
                >

                  <div className="product-rank">
                    #{index + 1}
                  </div>

                  <div className="product-icon">
                    {product.icon}
                  </div>

                  <div className="product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <small>
                      {product.sold} sold
                    </small>

                  </div>

                  <span className="product-arrow">
                    →
                  </span>

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* BOTTOM AREA */}

        <section className="bottom-grid">

          {/* LOW STOCK */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>⚠️ Stock Alerts</h2>

                <p>
                  Products running low
                </p>

              </div>

              <span className="dashboard-data-label">
                {lowStockProducts.length} alert(s)
              </span>

            </div>

            {lowStock.length > 0 ? (
              lowStock.map((item) => (

                <div
                  className="stock-row"
                  key={item.name}
                >

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      Only {item.stock} left
                    </small>

                  </div>

                  <div className="stock-warning">
                    Low stock
                  </div>

                </div>

              ))
            ) : (
              <p className="dashboard-empty">
                ✓ No products are currently low on stock.
              </p>
            )}

          </div>


          {/* QUICK ACTIONS */}

          <div className="panel quick-panel">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

              <button
                onClick={() =>
                  alert("Inventory module will be connected here.")
                }
              >
                <span>➕</span>
                Add Product
              </button>

              <button
                onClick={() =>
                  alert("Billing module will be connected here.")
                }
              >
                <span>🧾</span>
                Create Bill
              </button>

              <button
                onClick={() =>
                  alert("Inventory stock update will be connected here.")
                }
              >
                <span>📦</span>
                Add Stock
              </button>

              <button onClick={onAI}>
                <span>🤖</span>
                Ask AI
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;