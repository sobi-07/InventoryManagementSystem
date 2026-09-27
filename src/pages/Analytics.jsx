import { useState } from "react";
import "../Analytics.css";
import {products, sales} from "../data/shopdata";
function Analytics({onBack}) {
  const [period, setPeriod] = useState("7 Days");

  const data = {
    Today: {
      revenue: "₹8,450",
      bills: "37",
      products: "68",
      growth: "+18.4%",
    },

    "7 Days": {
      revenue: "₹52,300",
      bills: "284",
      products: "342",
      growth: "+14.8%",
    },

    "30 Days": {
      revenue: "₹1,84,500",
      bills: "1,248",
      products: "842",
      growth: "+21.6%",
    },
  };

  const current = data[period];

  const topProducts = products.map((product) => {
  const productSales = sales
    .filter((sale) => sale.productId === product.id)
    .reduce((total, sale) => total + sale.quantity, 0);

  return {
    name: product.name,
    sold: productSales,
    icon: "📦",
  };
});

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <button className="back-button" onClick={onBack}>
            ← Dashboard
            </button>
        <div>
          <p className="analytics-label">BUSINESS ANALYTICS</p>

          <h1>Sales Analytics 📊</h1>

          <p>
            Understand how your shop is performing.
          </p>
        </div>

        <div className="period-buttons">

          {["Today", "7 Days", "30 Days"].map((item) => (

            <button
              key={item}
              className={period === item ? "active" : ""}
              onClick={() => setPeriod(item)}
            >
              {item}
            </button>

          ))}

        </div>

      </div>


      {/* STAT CARDS */}

      <div className="analytics-stats">

        <div className="analytics-card">

          <div className="analytics-card-icon">💰</div>

          <p>Total Revenue</p>

          <h2>{current.revenue}</h2>

          <span className="positive">
            ↑ {current.growth} from previous period
          </span>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">🧾</div>

          <p>Total Bills</p>

          <h2>{current.bills}</h2>

          <span className="positive">
            ↑ 12.5% growth
          </span>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">📦</div>

          <p>Items Sold</p>

          <h2>{current.products}</h2>

          <span className="positive">
            ↑ 8.2% growth
          </span>

        </div>


        <div className="analytics-card">

          <div className="analytics-card-icon">📈</div>

          <p>Growth</p>

          <h2>{current.growth}</h2>

          <span className="positive">
            Business is growing
          </span>

        </div>

      </div>


      {/* CHART + INSIGHT */}

      <div className="analytics-main-grid">

        {/* SALES CHART */}

        <div className="analytics-panel">

          <div className="panel-title">

            <div>
              <h2>Sales Performance</h2>
              <p>Revenue generated over time</p>
            </div>

            <span>₹52.3K</span>

          </div>

          <div className="sales-chart">

            <div className="chart-grid"></div>

            <div className="chart-bars">

              <div style={{ height: "35%" }}>
                <span>₹5K</span>
              </div>

              <div style={{ height: "50%" }}>
                <span>₹7K</span>
              </div>

              <div style={{ height: "42%" }}>
                <span>₹6K</span>
              </div>

              <div style={{ height: "65%" }}>
                <span>₹9K</span>
              </div>

              <div style={{ height: "58%" }}>
                <span>₹8K</span>
              </div>

              <div style={{ height: "78%" }}>
                <span>₹11K</span>
              </div>

              <div style={{ height: "92%" }}>
                <span>₹13K</span>
              </div>

            </div>

            <div className="chart-days">

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


        {/* AI INSIGHT */}

        <div className="analytics-panel ai-analytics">

          <div className="ai-circle">
            🤖
          </div>

          <span className="ai-small">
            AI BUSINESS INSIGHT
          </span>

          <h2>Your shop is doing great!</h2>

          <p>
            Sales are increasing steadily. Maggi and Pepsi
            are your strongest products this week.
          </p>

          <div className="recommendation">

            <span>⚡</span>

            <div>
              <strong>AI Recommendation</strong>

              <small>
                Consider ordering more Pepsi stock.
              </small>
            </div>

          </div>

          <button className="insight-button">
            Ask AI about my sales →
          </button>

        </div>

      </div>


      {/* BOTTOM GRID */}

      <div className="analytics-bottom-grid">

        {/* TOP PRODUCTS */}

        <div className="analytics-panel">

          <div className="panel-title">

            <div>
              <h2>🏆 Top Selling Products</h2>
              <p>Products customers love</p>
            </div>

          </div>

          <div className="analytics-products">

            {topProducts.map((product, index) => (

              <div
                className="analytics-product"
                key={product.name}
              >

                <span className="product-number">
                  #{index + 1}
                </span>

                <span className="product-emoji">
                  {product.icon}
                </span>

                <div className="product-details">

                  <strong>{product.name}</strong>

                  <div className="product-progress">

                    <div
                      style={{
                        width: `${(product.sold / 145) * 100}%`,
                      }}
                    ></div>

                  </div>

                </div>

                <strong>
                  {product.sold}
                </strong>

              </div>

            ))}

          </div>

        </div>


        {/* SALES SUMMARY */}

        <div className="analytics-panel">

          <div className="panel-title">

            <div>
              <h2>📌 Sales Summary</h2>
              <p>Quick business overview</p>
            </div>

          </div>

          <div className="summary-row">
            <span>Average bill value</span>
            <strong>₹1,410</strong>
          </div>

          <div className="summary-row">
            <span>Best selling day</span>
            <strong>Saturday</strong>
          </div>

          <div className="summary-row">
            <span>Peak sales time</span>
            <strong>6 PM – 9 PM</strong>
          </div>

          <div className="summary-row">
            <span>Returning customers</span>
            <strong>68%</strong>
          </div>

          <div className="summary-highlight">
            🎯 Keep focusing on your top-selling products.
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;