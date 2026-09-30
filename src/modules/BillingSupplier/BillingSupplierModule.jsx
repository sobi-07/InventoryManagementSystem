import React, { useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from './data/mockData';
import POSBilling from './components/POSBilling';
import SupplierKhata from './components/SupplierKhata';
import InvoiceModal from './components/InvoiceModal';

export default function BillingSupplierModule() {
  const [activeTab, setActiveTab] = useState('pos');
  const [products] = useState(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  
  // Real-time Udhaar / Customer Credit Orders History
  const [customerUdhaars, setCustomerUdhaars] = useState([
    {
      id: 'UDH-101',
      invoiceNo: 'INV-882190',
      customerName: 'Rahul Verma',
      customerPhone: '9876543210',
      totalAmount: 1450,
      paidAmount: 0,
      dueBalance: 1450,
      purchaseDate: '2026-09-25',
      dueDate: '2026-10-05',
      status: 'Pending'
    },
    {
      id: 'UDH-102',
      invoiceNo: 'INV-773412',
      customerName: 'Pooja Sharma',
      customerPhone: '9988776655',
      totalAmount: 820,
      paidAmount: 820,
      dueBalance: 0,
      purchaseDate: '2026-09-20',
      dueDate: '2026-09-28',
      status: 'Settled'
    }
  ]);

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [billingKey, setBillingKey] = useState(1);

  // Bill generate handler
  const handleGenerateInvoice = (invoiceData) => {
    setActiveInvoice(invoiceData);

    // Agar payment mode Udhaar hai, toh customer khata me record add karo
    if (invoiceData.paymentMode === 'Udhaar') {
      const newUdhaarEntry = {
        id: `UDH-${Date.now().toString().slice(-4)}`,
        invoiceNo: invoiceData.invoiceNo,
        customerName: invoiceData.customer.name,
        customerPhone: invoiceData.customer.phone,
        totalAmount: invoiceData.grandTotal,
        paidAmount: 0,
        dueBalance: invoiceData.grandTotal,
        purchaseDate: invoiceData.date,
        dueDate: invoiceData.paymentDetails.dueDate || 'No Date Specified',
        status: 'Pending'
      };
      setCustomerUdhaars((prev) => [newUdhaarEntry, ...prev]);
    }
  };

  return (
    <div style={{ maxWidth: '1120px', margin: '24px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Module Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #e2e8f0' }}>
        <div>
          <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
            Module 2
          </span>
          <h1 style={{ margin: '8px 0 4px', fontSize: '26px', color: '#0f172a' }}>Billing (POS) & Supplier Khata</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Cashier counter & Udhaar/Supplier management system</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('pos')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'pos' ? '#2563eb' : 'transparent',
              color: activeTab === 'pos' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            🛒 POS Cashier
          </button>
          
          <button
            onClick={() => setActiveTab('suppliers')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'suppliers' ? '#2563eb' : 'transparent',
              color: activeTab === 'suppliers' ? '#ffffff' : '#64748b',
              transition: 'all 0.2s ease'
            }}
          >
            📒 Suppliers & Khata
          </button>
        </div>
      </div>

      {/* Screen Body */}
      {activeTab === 'pos' ? (
        <POSBilling
          key={billingKey}
          products={products}
          onGenerateInvoice={handleGenerateInvoice}
        />
      ) : (
        <SupplierKhata
          suppliers={suppliers}
          onUpdateSuppliers={setSuppliers}
          customerUdhaars={customerUdhaars}
          onUpdateCustomerUdhaars={setCustomerUdhaars}
        />
      )}

      {/* Invoice Modal */}
      {activeInvoice && (
        <InvoiceModal
          invoiceData={activeInvoice}
          onClose={() => setActiveInvoice(null)}
          onNewBilling={() => {
            setActiveInvoice(null);
            setBillingKey((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}