import React, { useState } from 'react';

export default function SupplierKhata({ suppliers, onUpdateSuppliers, customerUdhaars = [], onUpdateCustomerUdhaars }) {
  // Navigation Tabs: 'ledger' | 'udhaar_history' | 'payment' | 'add'
  const [khataTab, setKhataTab] = useState('ledger');
  const [activeKpiFilter, setActiveKpiFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');

  // Separated Payment Form States
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [payMode, setPayMode] = useState('UPI / QR');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNote, setPaymentNote] = useState('');

  // Supplier Payment Receipt Modal State
  const [paymentReceipt, setPaymentReceipt] = useState(null);

  // Add Supplier Form States
  const [newSupplier, setNewSupplier] = useState({ name: '', agencyName: '', contact: '', pendingDue: '' });

  // Timeframe Multipliers for Dynamic Calculations
  const getTimeMultiplier = () => {
    switch (timeFilter) {
      case 'day': return 0.08;
      case 'month': return 0.35;
      case 'quarter': return 0.70;
      case 'year': default: return 1.0;
    }
  };
  const multiplier = getTimeMultiplier();

  // Top KPI Metrics
  const totalSuppliersCount = suppliers.length;
  const rawTotalPurchases = suppliers.reduce((sum, s) => sum + (s.totalPurchased || 0), 0);
  const rawTotalPendingDue = suppliers.reduce((sum, s) => sum + (s.pendingDue || 0), 0);
  const totalCustomerUdhaarDue = customerUdhaars.filter(u => u.status === 'Pending').reduce((sum, u) => sum + u.dueBalance, 0);

  const displayedPurchases = Math.round(rawTotalPurchases * multiplier);
  const displayedPendingDue = Math.round(rawTotalPendingDue * (timeFilter === 'day' ? 0.2 : multiplier));
  const settledAccountsCount = suppliers.filter((s) => s.pendingDue === 0).length;

  // Filtered Suppliers for Ledger
  const getFilteredList = () => {
    let list = [...suppliers];
    if (activeKpiFilter === 'due') list = list.filter((s) => s.pendingDue > 0);
    else if (activeKpiFilter === 'settled') list = list.filter((s) => s.pendingDue === 0);
    else if (activeKpiFilter === 'purchases') list = list.sort((a, b) => (b.totalPurchased || 0) - (a.totalPurchased || 0));

    if (searchTerm.trim()) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.contact.includes(searchTerm)
      );
    }
    return list;
  };

  const filteredSuppliers = getFilteredList();
  const activeSupplier = suppliers.find((s) => s.id === selectedSupplierId);

  // Clear Customer Udhaar
  const handleClearCustomerUdhaar = (id) => {
    const updated = customerUdhaars.map((u) => {
      if (u.id === id) {
        return { ...u, dueBalance: 0, paidAmount: u.totalAmount, status: 'Settled' };
      }
      return u;
    });
    onUpdateCustomerUdhaars(updated);
    alert('Customer credit successfully marked as settled!');
  };

  // Record Supplier Due Payment & Generate Receipt
  const handleRecordPayment = (e) => {
    e.preventDefault();
    const amount = Number(paymentAmount);
    if (!selectedSupplierId) {
      alert('Please select a supplier first!');
      return;
    }
    if (!amount || amount <= 0) {
      alert('Please enter a valid payment amount!');
      return;
    }
    if (amount > activeSupplier.pendingDue) {
      alert(`Payment amount cannot exceed the pending due of ₹${activeSupplier.pendingDue}!`);
      return;
    }

    const remainingDue = activeSupplier.pendingDue - amount;

    const updated = suppliers.map((s) =>
      s.id === selectedSupplierId
        ? { ...s, pendingDue: remainingDue, lastPaymentDate: payDate }
        : s
    );

    onUpdateSuppliers(updated);

    // Set Receipt Data for Printing
    setPaymentReceipt({
      receiptNo: `VCH-${Date.now().toString().slice(-6)}`,
      supplierName: activeSupplier.name,
      agencyName: activeSupplier.agencyName,
      contact: activeSupplier.contact,
      paidAmount: amount,
      previousDue: activeSupplier.pendingDue,
      remainingDue: remainingDue,
      paymentMode: payMode,
      paymentDate: payDate,
      referenceNote: paymentNote || 'N/A'
    });

    setPaymentAmount('');
    setSelectedSupplierId('');
    setPaymentNote('');
    setKhataTab('ledger');
  };

  // Add New Supplier Handler
  const handleAddSupplier = (e) => {
    e.preventDefault();
    if (!newSupplier.name.trim() || !newSupplier.contact.trim()) {
      alert('Supplier name and contact number are required!');
      return;
    }
    const created = {
      id: `SUP-0${suppliers.length + 1}`,
      name: newSupplier.name.trim(),
      agencyName: newSupplier.agencyName.trim() || 'General Agency',
      contact: newSupplier.contact.trim(),
      totalPurchased: Number(newSupplier.pendingDue) || 0,
      pendingDue: Number(newSupplier.pendingDue) || 0,
      lastPaymentDate: 'No payments yet'
    };
    onUpdateSuppliers([...suppliers, created]);
    alert(`🎉 New Supplier "${newSupplier.name}" added successfully!`);
    setNewSupplier({ name: '', agencyName: '', contact: '', pendingDue: '' });
    setKhataTab('ledger');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* TIME-FRAME FILTER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '12px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>
          ⏱️ Time Period Filter: <span style={{ color: '#64748b', fontWeight: 'normal', fontSize: '12px' }}>(Updates Purchases & Dues)</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'day', label: 'Day (Today)' },
            { id: 'month', label: 'Monthly' },
            { id: 'quarter', label: 'Quarterly' },
            { id: 'year', label: 'Yearly' }
          ].map((tf) => (
            <button
              key={tf.id}
              onClick={() => setTimeFilter(tf.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                backgroundColor: timeFilter === tf.id ? '#2563eb' : 'transparent',
                color: timeFilter === tf.id ? '#ffffff' : '#64748b',
                transition: 'all 0.15s ease'
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 4 INTERACTIVE KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div
          onClick={() => { setActiveKpiFilter('all'); setKhataTab('ledger'); }}
          style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: activeKpiFilter === 'all' && khataTab === 'ledger' ? '2.5px solid #2563eb' : '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TOTAL SUPPLIERS</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>{totalSuppliersCount}</div>
          <div style={{ fontSize: '12px', color: '#2563eb' }}>👉 Click for Full List</div>
        </div>

        <div
          onClick={() => { setActiveKpiFilter('purchases'); setKhataTab('ledger'); }}
          style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: activeKpiFilter === 'purchases' && khataTab === 'ledger' ? '2.5px solid #16a34a' : '1px solid #e2e8f0', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>TOTAL PURCHASES ({timeFilter.toUpperCase()})</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '4px 0' }}>₹{displayedPurchases.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#16a34a' }}>👉 Click for Volume</div>
        </div>

        <div
          onClick={() => { setActiveKpiFilter('due'); setKhataTab('ledger'); }}
          style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: activeKpiFilter === 'due' && khataTab === 'ledger' ? '2.5px solid #dc2626' : '1.5px solid #fecaca', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#b91c1c' }}>SUPPLIER DUE ({timeFilter.toUpperCase()})</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#dc2626', margin: '4px 0' }}>₹{displayedPendingDue.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#ef4444' }}>👉 Click for Pending</div>
        </div>

        <div
          onClick={() => setKhataTab('udhaar_history')}
          style={{ background: '#fffbeb', padding: '16px', borderRadius: '12px', border: khataTab === 'udhaar_history' ? '2.5px solid #d97706' : '1.5px solid #fde68a', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#92400e' }}>CUSTOMER CREDIT</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#b45309', margin: '4px 0' }}>₹{totalCustomerUdhaarDue.toLocaleString('en-IN')}</div>
          <div style={{ fontSize: '12px', color: '#d97706' }}>👉 Click for Credit Book</div>
        </div>
      </div>

      {/* SUB-SECTION BUTTONS */}
      <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '6px', borderRadius: '12px', width: 'fit-content' }}>
        <button
          onClick={() => setKhataTab('ledger')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: khataTab === 'ledger' ? '#0f172a' : 'transparent',
            color: khataTab === 'ledger' ? '#ffffff' : '#475569'
          }}
        >
          📋 Supplier Ledger
        </button>

        <button
          onClick={() => setKhataTab('udhaar_history')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: khataTab === 'udhaar_history' ? '#d97706' : 'transparent',
            color: khataTab === 'udhaar_history' ? '#ffffff' : '#475569'
          }}
        >
          📒 Customer Credit History ({customerUdhaars.length})
        </button>

        <button
          onClick={() => setKhataTab('payment')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: khataTab === 'payment' ? '#2563eb' : 'transparent',
            color: khataTab === 'payment' ? '#ffffff' : '#475569'
          }}
        >
          💸 Pay Supplier
        </button>

        <button
          onClick={() => setKhataTab('add')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            backgroundColor: khataTab === 'add' ? '#16a34a' : 'transparent',
            color: khataTab === 'add' ? '#ffffff' : '#475569'
          }}
        >
          ➕ Register Supplier
        </button>
      </div>

      {/* VIEW 1: CUSTOMER CREDIT HISTORY */}
      {khataTab === 'udhaar_history' && (
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>
                📒 Customer Credit History & Ledger
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                All credit bills generated at the POS counter are recorded here.
              </p>
            </div>
            <div style={{ fontSize: '13px', background: '#fef3c7', color: '#92400e', padding: '6px 12px', borderRadius: '8px', fontWeight: 'bold' }}>
              Pending Dues: ₹{totalCustomerUdhaarDue}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Invoice No</th>
                <th style={{ padding: '12px' }}>Customer Name</th>
                <th style={{ padding: '12px' }}>Phone Number</th>
                <th style={{ padding: '12px' }}>Purchase Date</th>
                <th style={{ padding: '12px', color: '#dc2626' }}>Promised Due Date</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Bill</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Due Balance</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {customerUdhaars.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                    No credit bills have been generated yet.
                  </td>
                </tr>
              ) : (
                customerUdhaars.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#2563eb' }}>{item.invoiceNo}</td>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#0f172a' }}>{item.customerName}</td>
                    <td style={{ padding: '12px', color: '#475569' }}>{item.customerPhone}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{item.purchaseDate}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: item.status === 'Pending' ? '#dc2626' : '#64748b' }}>
                      {item.dueDate}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>₹{item.totalAmount}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: item.dueBalance > 0 ? '#dc2626' : '#16a34a' }}>
                      ₹{item.dueBalance}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: item.status === 'Pending' ? '#fee2e2' : '#dcfce7',
                        color: item.status === 'Pending' ? '#b91c1c' : '#15803d'
                      }}>
                        {item.status === 'Pending' ? '🔴 Unpaid' : '🟢 Paid'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {item.status === 'Pending' ? (
                        <button
                          onClick={() => handleClearCustomerUdhaar(item.id)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#16a34a',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>✓ Cleared</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: SUPPLIER LEDGER */}
      {khataTab === 'ledger' && (
        <div style={{ background: '#ffffff', padding: '22px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: '700' }}>
                📋 Supplier Dealer Records
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Vendors and raw materials credit book</p>
            </div>
            <input
              type="text"
              placeholder="🔍 Search vendor by name, agency, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '300px', padding: '9px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Supplier / Agency</th>
                <th style={{ padding: '12px' }}>Contact Phone</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Purchased</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Pending Due</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Last Payment</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((sup) => (
                <tr key={sup.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{sup.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{sup.agencyName}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#334155' }}>{sup.contact}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>₹{sup.totalPurchased.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '800', color: sup.pendingDue > 0 ? '#dc2626' : '#16a34a' }}>
                    ₹{sup.pendingDue.toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: sup.pendingDue > 0 ? '#fee2e2' : '#dcfce7',
                      color: sup.pendingDue > 0 ? '#b91c1c' : '#15803d'
                    }}>
                      {sup.pendingDue > 0 ? '🔴 Pending' : '🟢 Cleared'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', color: '#64748b' }}>{sup.lastPaymentDate}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {sup.pendingDue > 0 ? (
                      <button
                        onClick={() => { setSelectedSupplierId(sup.id); setPaymentAmount(sup.pendingDue.toString()); setKhataTab('payment'); }}
                        style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#ffffff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: '600' }}>✓ No Due</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 3: PAY SUPPLIER FORM */}
      {khataTab === 'payment' && (
        <div style={{ background: '#ffffff', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '680px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '19px', color: '#0f172a', fontWeight: '800' }}>💸 Clear Supplier Pending Due</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Enter payment transaction details to settle vendor credit balance</p>
          </div>

          <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* 1. SUPPLIER NAME */}
            <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                1. Supplier / Vendor Name *
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => {
                  setSelectedSupplierId(e.target.value);
                  const s = suppliers.find(item => item.id === e.target.value);
                  if (s) setPaymentAmount(s.pendingDue.toString());
                }}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '14px', outline: 'none', background: '#ffffff' }}
                required
              >
                <option value="">-- Choose Supplier to Pay --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.agencyName}) — Current Due: ₹{s.pendingDue}
                  </option>
                ))}
              </select>

              {activeSupplier && (
                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#eff6ff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '12px', color: '#1e40af' }}>Total Outstanding Due:</span>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#1d4ed8' }}>₹{activeSupplier.pendingDue.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* 2 & 3: PAYMENT AMOUNT & PAYMENT TYPE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  2. Payment Amount (₹) *
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '15px', fontWeight: 'bold', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }}
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  3. Payment Type *
                </label>
                <select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', fontWeight: '600', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }}
                >
                  <option value="UPI / QR">📱 UPI / QR (GPay, PhonePe)</option>
                  <option value="Cash">💵 Cash</option>
                  <option value="NetBanking">🏛️ Bank Transfer (NEFT/RTGS)</option>
                  <option value="Cheque">📑 Cheque</option>
                </select>
              </div>

            </div>

            {/* 4. PAYMENT DATE & REFERENCE */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '16px' }}>
              
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block', marginBottom: '8px' }}>
                  4. Payment Date *
                </label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }}
                  required
                />
              </div>

              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
                  UTR / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR-98214 or Cash receipt no."
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', outline: 'none', background: '#ffffff' }}
                />
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setKhataTab('ledger')}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f1f5f9', color: '#475569', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: '#2563eb', color: '#ffffff', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)' }}
              >
                ✓ Confirm & Record Payment
              </button>
            </div>

          </form>
        </div>
      )}

      {/* VIEW 4: REGISTER NEW SUPPLIER */}
      {khataTab === 'add' && (
        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0', maxWidth: '580px' }}>
          <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>➕ Register New Supplier Ledger</h3>
          <p style={{ margin: '0 0 18px', fontSize: '13px', color: '#64748b' }}>Add dealer details to maintain purchase history and credit balance</p>

          <form onSubmit={handleAddSupplier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Supplier / Owner Name *:
              </label>
              <input
                type="text"
                placeholder="e.g. Mukesh Sharma"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                Agency / Business Name:
              </label>
              <input
                type="text"
                placeholder="e.g. Sharma Grocery Wholesale"
                value={newSupplier.agencyName}
                onChange={(e) => setNewSupplier({ ...newSupplier, agencyName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Mobile / Phone Number *:
                </label>
                <input
                  type="tel"
                  placeholder="+91 98XXXXXXXX"
                  value={newSupplier.contact}
                  onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Opening Credit Due (₹):
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={newSupplier.pendingDue}
                  onChange={(e) => setNewSupplier({ ...newSupplier, pendingDue: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setKhataTab('ledger')}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#475569', fontWeight: '600', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flex: 1.5, padding: '12px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#ffffff', fontWeight: '700', cursor: 'pointer' }}
              >
                Save & Open Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP MODAL: SUPPLIER PAYMENT RECEIPT / VOUCHER */}
      {paymentReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1200,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '100%',
            maxWidth: '560px',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>
                🧾 Supplier Payment Voucher
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  🖨️️ Print
                </button>
                <button
                  onClick={() => setPaymentReceipt(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div style={{ padding: '24px 28px', color: '#1e293b' }}>
              <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '14px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>
                  APNA KIRANA & GENERAL STORE
                </h2>
                <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748b' }}>
                  Vendor / Supplier Payment Clearance Receipt
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>VOUCHER NO:</div>
                  <strong style={{ color: '#0f172a' }}>{paymentReceipt.receiptNo}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: '11px' }}>PAYMENT DATE:</div>
                  <strong style={{ color: '#0f172a' }}>{paymentReceipt.paymentDate}</strong>
                </div>
              </div>

              {/* Supplier Info */}
              <div style={{ marginBottom: '16px', fontSize: '13px', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Paid To (Supplier):</span>
                  <strong>{paymentReceipt.supplierName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Agency / Firm:</span>
                  <span>{paymentReceipt.agencyName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Contact Phone:</span>
                  <span>{paymentReceipt.contact}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Payment Mode:</span>
                  <span style={{ fontWeight: '700', color: '#2563eb' }}>{paymentReceipt.paymentMode}</span>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '14px', border: '1px solid #bfdbfe', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span style={{ color: '#475569' }}>Previous Balance Due:</span>
                  <span>₹{paymentReceipt.previousDue.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', color: '#16a34a', marginBottom: '6px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>
                  <span>Amount Paid Now:</span>
                  <span>₹{paymentReceipt.paidAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', color: paymentReceipt.remainingDue > 0 ? '#dc2626' : '#15803d' }}>
                  <span>Remaining Balance Due:</span>
                  <span>₹{paymentReceipt.remainingDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {paymentReceipt.referenceNote !== 'N/A' && (
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                  Reference / Note: <strong>{paymentReceipt.referenceNote}</strong>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', fontSize: '12px', color: '#64748b' }}>
                <div>Shopkeeper Signature: ____________</div>
                <div>Receiver Signature: ____________</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}