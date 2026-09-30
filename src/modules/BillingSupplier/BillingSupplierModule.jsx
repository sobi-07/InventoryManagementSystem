import React, { useEffect, useState } from "react";
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from "./data/mockData";
import POSBilling from "./components/POSBilling";
import SupplierKhata from "./components/SupplierKhata";
import InvoiceModal from "./components/InvoiceModal";

export default function BillingSupplierModule({
  initialTab = "pos",
  onBack,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [products] = useState(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState(
    INITIAL_SUPPLIERS
  );

  // =========================================
  // CUSTOMER UDHAAR / CREDIT HISTORY
  // =========================================

  const [customerUdhaars, setCustomerUdhaars] =
    useState([
      {
        id: "UDH-101",
        invoiceNo: "INV-882190",
        customerName: "Rahul Verma",
        customerPhone: "9876543210",
        totalAmount: 1450,
        paidAmount: 0,
        dueBalance: 1450,
        purchaseDate: "2026-09-25",
        dueDate: "2026-10-05",
        status: "Pending",
      },
      {
        id: "UDH-102",
        invoiceNo: "INV-773412",
        customerName: "Pooja Sharma",
        customerPhone: "9988776655",
        totalAmount: 820,
        paidAmount: 820,
        dueBalance: 0,
        purchaseDate: "2026-09-20",
        dueDate: "2026-09-28",
        status: "Settled",
      },
    ]);

  // =========================================
  // INVOICE STATE
  // =========================================

  const [activeInvoice, setActiveInvoice] =
    useState(null);

  const [billingKey, setBillingKey] = useState(1);

  // =========================================
  // GENERATE INVOICE
  // =========================================

  const handleGenerateInvoice = (invoiceData) => {
    setActiveInvoice(invoiceData);

    // Add Udhaar transaction to customer history
    if (invoiceData.paymentMode === "Udhaar") {
      const newUdhaarEntry = {
        id: `UDH-${Date.now()
          .toString()
          .slice(-4)}`,

        invoiceNo: invoiceData.invoiceNo,

        customerName:
          invoiceData.customer.name,

        customerPhone:
          invoiceData.customer.phone,

        totalAmount:
          invoiceData.grandTotal,

        paidAmount: 0,

        dueBalance:
          invoiceData.grandTotal,

        purchaseDate:
          invoiceData.date,

        dueDate:
          invoiceData.paymentDetails
            ?.dueDate ||
          "No Date Specified",

        status: "Pending",
      };

      setCustomerUdhaars((prev) => [
        newUdhaarEntry,
        ...prev,
      ]);
    }
  };

  // =========================================
  // PAGE TITLE
  // =========================================

  const isBilling = activeTab === "pos";

  const pageTitle = isBilling
    ? "Billing (POS)"
    : "Supplier Management";

  const pageSubtitle = isBilling
    ? "Create bills and manage customer payments"
    : "Manage suppliers, payments and customer credit";

  return (
    <div
      style={{
        maxWidth: "1120px",
        margin: "24px auto",
        padding: "20px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >

      {/* =========================================
          HEADER
          ========================================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          marginBottom: "24px",
          paddingBottom: "16px",
          borderBottom:
            "2px solid #e2e8f0",
        }}
      >

        {/* TITLE */}

        <div>

          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "26px",
              color: "#0f172a",
            }}
          >
            {pageTitle}
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            {pageSubtitle}
          </p>

        </div>

        {/* BACK BUTTON */}

        {onBack && (
          <button
            onClick={onBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              padding: "10px 16px",
              borderRadius: "8px",
              border:
                "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ← Dashboard
          </button>
        )}

      </div>

      {/* =========================================
          BILLING / SUPPLIER SCREEN
          ========================================= */}

      {activeTab === "pos" ? (
        <POSBilling
          key={billingKey}
          products={products}
          onGenerateInvoice={
            handleGenerateInvoice
          }
        />
      ) : (
        <SupplierKhata
          suppliers={suppliers}
          onUpdateSuppliers={
            setSuppliers
          }
          customerUdhaars={
            customerUdhaars
          }
          onUpdateCustomerUdhaars={
            setCustomerUdhaars
          }
        />
      )}

      {/* =========================================
          INVOICE MODAL
          ========================================= */}

      {activeInvoice && (
        <InvoiceModal
          invoiceData={activeInvoice}
          onClose={() =>
            setActiveInvoice(null)
          }
          onNewBilling={() => {
            setActiveInvoice(null);
            setBillingKey(
              (key) => key + 1
            );
          }}
        />
      )}

    </div>
  );
}