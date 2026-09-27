import { useState } from "react";
import "../Reports.css";
import {products, sales} from "../data/shopdata"

function Reports({ onBack }) {
  const [reportType, setReportType] = useState("Sales");
  const [period, setPeriod] = useState("Today");

  const reports = {
    Today: {
      sales: "₹8,450",
      bills: 37,
      items: 68,
    },
    "7 Days": {
      sales: "₹52,300",
      bills: 284,
      items: 342,
    },
    "30 Days": {
      sales: "₹1,84,500",
      bills: 1248,
      items: 842,
    },
  };

  const current = reports[period];
  const totalSales = sales.reduce(
  (total, sale) => total + sale.totalAmount,
  0
);

const totalItems = sales.reduce(
  (total, sale) => total + sale.quantity,
  0
);

const totalBills = sales.length;
const averageSale =
  totalBills > 0 ? totalSales / totalBills : 0;
  const todaySales = sales
  .filter((sale) => sale.date === "2026-08-23")
  .reduce((total, sale) => total + sale.totalAmount, 0);

const yesterdaySales = sales
  .filter((sale) => sale.date === "2026-08-22")
  .reduce((total, sale) => total + sale.totalAmount, 0);

const growth =
  yesterdaySales > 0
    ? ((todaySales - yesterdaySales) / yesterdaySales) * 100: 0;

const reportProducts = products.map((product) => {
  const sold = sales
    .filter((sale) => sale.productId === product.id)
    .reduce((total, sale) => total + sale.quantity, 0);

  return {
    ...product,
    sold,
    status:
      product.stock <= product.minimumStock
        ? "Low"
        : "Good",
  };
});

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>
          <button className="reports-back" onClick={onBack}>
            ← Dashboard
          </button>

          <p className="reports-label">BUSINESS REPORTS</p>

          <h1>Reports & Insights 📑</h1>

          <p>
            Generate useful reports for your shop.
          </p>
        </div>

        <button className="print-button" onClick={handlePrint}>
          🖨️ Print Report
        </button>

      </div>


      {/* REPORT TYPE */}

      <div className="report-tabs">

        {["Sales", "Stock", "Low Stock"].map((type) => (

          <button
            key={type}
            className={reportType === type ? "active" : ""}
            onClick={() => setReportType(type)}
          >
            {type === "Sales" && "📊 "}
            {type === "Stock" && "📦 "}
            {type === "Low Stock" && "⚠️ "}
            {type} Report
          </button>

        ))}

      </div>


      {/* PERIOD */}

      <div className="report-period">

        <span>Report period:</span>

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


      {/* SUMMARY */}

      <div className="report-summary">

        <div>
          <span>💰 Total Sales</span>
          <strong>₹{totalSales.toLocaleString()}</strong>
        </div>

        <div>
          <span>🧾 Bills Generated</span>
          <strong>{totalBills}</strong>
        </div>

        <div>
          <span>📦 Items Sold</span>
          <strong>{totalItems}</strong>
        </div>
        <div>
            <span>💰 Average Sale</span>
            <strong>₹{Math.round(averageSale).toLocaleString()}</strong>
        </div>

        <div>
          <span>📈 Growth</span>
          <strong className="growth">
            {growth >= 0 ? "+" : ""}
            {growth.toFixed(1)}%
          </strong>
        </div>

      </div>


      {/* REPORT CONTENT */}

      <div className="report-card">

        <div className="report-card-header">

          <div>
            <h2>
              {reportType} Report
            </h2>

            <p>
              Period: {period}
            </p>
          </div>

          <span className="generated">
            Generated just now
          </span>

        </div>


        {/* SALES REPORT */}

        {reportType === "Sales" && (

          <div className="report-table">

            <div className="table-row table-head">
              <span>Date</span>
              <span>Bills</span>
              <span>Items Sold</span>
              <span>Sales</span>
            </div>

            {sales.map((sale) => {
                const product = products.find(
                    (product) => product.id === sale.productId
                );
                return (
                <div className="table-row" key={sale.id}>
                    <span>{sale.date}</span>
                    <span>1</span>
                    <span>{sale.quantity}</span>
                    <strong>₹{sale.totalAmount.toLocaleString()}</strong>
                    </div>
                    );
                    })}
          </div>

        )}


        {/* STOCK REPORT */}

        {reportType === "Stock" && (

          <div className="report-table">

            <div className="table-row table-head">
              <span>Product</span>
              <span>Stock</span>
              <span>Sold</span>
              <span>Status</span>
            </div>

            {reportsProducts.map((product) => (

              <div className="table-row" key={product.name}>

                <span>{product.name}</span>

                <span>{product.stock}</span>

                <span>{product.sold}</span>

                <strong
                  className={
                    product.status === "Low"
                      ? "status-low"
                      : "status-good"
                  }
                >
                  {product.status}
                </strong>

              </div>

            ))}

          </div>

        )}


        {/* LOW STOCK REPORT */}

        {reportType === "Low Stock" && (

          <div className="low-stock-report">

            {reportProducts.filter((product) => product.status === "Low")
              .map((product) => (

                <div
                  className="low-stock-item"
                  key={product.name}
                >

                  <div className="warning-icon">
                    ⚠️
                  </div>

                  <div>
                    <strong>{product.name}</strong>

                    <p>
                      Only {product.stock} items remaining
                    </p>
                  </div>

                  <span>
                    Restock Soon
                  </span>

                </div>

              ))}

          </div>

        )}

      </div>


      {/* AI RECOMMENDATION */}

      <div className="report-ai">

        <div className="report-ai-icon">
          🤖
        </div>

        <div>

          <small>AI REPORT INSIGHT</small>

          <h3>
            Your shop is showing positive growth.
          </h3>

          <p>
            Based on current sales, consider restocking
            Pepsi and Milk before they run out.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Reports;