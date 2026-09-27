import "../Dashboard.css";

function Dashboard({onLogout, onAnalytics, onAI, onReports}) {
  const stats = [
    {
      title: "Today's Sales",
      value: "₹8,450",
      change: "+18.4%",
      icon: "💰",
      type: "positive",
    },
    {
      title: "Total Products",
      value: "842",
      change: "+12",
      icon: "📦",
      type: "positive",
    },
    {
      title: "Low Stock",
      value: "14",
      change: "Needs attention",
      icon: "⚠️",
      type: "warning",
    },
    {
      title: "Bills Today",
      value: "37",
      change: "+8.2%",
      icon: "🧾",
      type: "positive",
    },
  ];

  const topProducts = [
    { name: "Maggi", sold: 145, icon: "🍜" },
    { name: "Pepsi", sold: 120, icon: "🥤" },
    { name: "Parle-G", sold: 98, icon: "🍪" },
    { name: "Milk", sold: 87, icon: "🥛" },
  ];

  const lowStock = [
    { name: "Pepsi", stock: 7 },
    { name: "Milk", stock: 5 },
    { name: "Maggi", stock: 9 },
  ];

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

          <button className="nav-item" onClick={onAI}>
            <span>🤖</span>
            AI Assistant
          </button>

          <button className="nav-item" onClick={onAnalytics}>
            <span>📊</span>
            Analytics
          </button>

          <button className="nav-item" onClick={onReports}>
            <span>📑</span>
            Reports
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            ⚙️ Settings
          </button>

          <button className="logout-button" onClick={onLogout}>
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>
            <p className="greeting">Good evening 👋</p>

            <h1>Shop Dashboard</h1>

            <p className="header-subtitle">
              Here's what's happening in your shop today.
            </p>
          </div>

          <div className="header-actions">

            <button className="notification">
              🔔
              <span></span>
            </button>

            <div className="profile">
              <div className="profile-avatar">SK</div>

              <div>
                <strong>Shop Owner</strong>
                <small>Administrator</small>
              </div>
            </div>

          </div>

        </header>


        {/* AI INSIGHT */}

        <section className="ai-insight">

          <div className="ai-icon">🤖</div>

          <div className="ai-text">

            <span>AI INSIGHT</span>

            <h3>
              Your sales are 18% higher than yesterday!
            </h3>

            <p>
              Maggi and Pepsi are your best-selling products today.
              Consider restocking Pepsi soon.
            </p>

          </div>

          <button>
            View Insights →
          </button>

        </section>


        {/* STAT CARDS */}

        <section className="stats-grid">

          {stats.map((stat) => (

            <div className={`stat-card ${stat.type}`} key={stat.title}>

              <div className="stat-top">

                <div className="stat-icon">
                  {stat.icon}
                </div>

                <span className="stat-menu">•••</span>

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
                <p>Your sales performance</p>
              </div>

              <select>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This year</option>
              </select>

            </div>

            <div className="chart">

              <div className="chart-line line-one"></div>
              <div className="chart-line line-two"></div>
              <div className="chart-line line-three"></div>

              <div className="bars">

                <div style={{ height: "40%" }}></div>
                <div style={{ height: "55%" }}></div>
                <div style={{ height: "48%" }}></div>
                <div style={{ height: "72%" }}></div>
                <div style={{ height: "62%" }}></div>
                <div style={{ height: "85%" }}></div>
                <div style={{ height: "95%" }}></div>

              </div>

              <div className="chart-labels">

                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>

              </div>

            </div>

          </div>


          {/* TOP PRODUCTS */}

          <div className="panel">

            <div className="panel-header">

              <div>
                <h2>Top Products</h2>
                <p>Best sellers today</p>
              </div>

              <button className="view-button">
                View all
              </button>

            </div>

            <div className="product-list">

              {topProducts.map((product, index) => (

                <div className="product-row" key={product.name}>

                  <div className="product-rank">
                    #{index + 1}
                  </div>

                  <div className="product-icon">
                    {product.icon}
                  </div>

                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <small>{product.sold} sold</small>
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
                <p>Products running low</p>
              </div>

              <button className="view-button">
                View all
              </button>

            </div>

            {lowStock.map((item) => (

              <div className="stock-row" key={item.name}>

                <div>
                  <strong>{item.name}</strong>
                  <small>Only {item.stock} left</small>
                </div>

                <div className="stock-warning">
                  Low stock
                </div>

              </div>

            ))}

          </div>


          {/* QUICK ACTIONS */}

          <div className="panel quick-panel">

            <h2>Quick Actions</h2>

            <div className="quick-actions">

              <button>
                <span>➕</span>
                Add Product
              </button>

              <button>
                <span>🧾</span>
                Create Bill
              </button>

              <button>
                <span>📦</span>
                Add Stock
              </button>

              <button>
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