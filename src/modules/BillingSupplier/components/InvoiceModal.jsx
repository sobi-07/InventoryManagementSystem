import React from 'react';

export default function InvoiceModal({ invoiceData, onClose, onNewBilling }) {
  if (!invoiceData) return null;

  const {
    invoiceNo,
    date,
    customer,
    cart,
    subtotal,
    totalTax,
    discountAmount,
    grandTotal,
    paymentMode,
    paymentDetails
  } = invoiceData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: '#ffffff',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Top Action Bar (Print + Close X) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>🧾</span>
            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>Tax Invoice Preview</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* New Billing Button */}
            <button
              onClick={onNewBilling}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#2563eb',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              + New Billing
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#16a34a',
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🖨️ Print Bill
            </button>

            {/* Close Cut Button (X) */}
            <button
              onClick={onClose}
              title="Close & Return to Billing"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#64748b',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div style={{ padding: '28px 32px', fontFamily: 'system-ui, sans-serif', color: '#1e293b' }}>
          
          {/* Shop Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px dashed #cbd5e1', paddingBottom: '16px', marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '800', color: '#0f172a', letterSpacing: '0.5px' }}>
              APNA KIRANA & GENERAL STORE
            </h2>
            <p style={{ margin: '2px 0', fontSize: '12px', color: '#64748b' }}>
              Station Road, Near Bus Stand, Main Market | Ph: +91 98765 43210
            </p>
            <p style={{ margin: '2px 0', fontSize: '12px', color: '#0f172a', fontWeight: '600' }}>
              GSTIN: 27AABCS1429B1Z | Tax Invoice
            </p>
          </div>

          {/* Meta Information (Customer & Invoice) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', fontSize: '13px' }}>
            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Billed To:</div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>{customer.name}</div>
              <div style={{ color: '#64748b', marginTop: '2px' }}>Phone: {customer.phone}</div>
              {customer.gstin && customer.gstin !== 'Unregistered' && (
                <div style={{ color: '#2563eb', fontWeight: '600', marginTop: '2px' }}>
                  GSTIN: {customer.gstin}
                </div>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
              <div style={{ color: '#64748b' }}>Invoice No: <strong style={{ color: '#0f172a' }}>{invoiceNo}</strong></div>
              <div style={{ color: '#64748b', marginTop: '4px' }}>Date: <strong>{date}</strong></div>
              <div style={{ marginTop: '4px' }}>
                Payment Mode:{' '}
                <span style={{
                  background: paymentMode === 'Udhaar' ? '#fee2e2' : '#dcfce7',
                  color: paymentMode === 'Udhaar' ? '#b91c1c' : '#15803d',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '11px'
                }}>
                  {paymentMode.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#ffffff', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', width: '30px' }}>#</th>
                <th style={{ padding: '8px 10px' }}>Item Name</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 10px', textAlign: 'center' }}>GST</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '10px 10px', color: '#94a3b8' }}>{idx + 1}</td>
                  <td style={{ padding: '10px 10px', fontWeight: '600' }}>{item.name}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right' }}>₹{item.price}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'center', color: '#64748b' }}>{item.gstRate || 0}%</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontWeight: '700' }}>
                    ₹{item.price * item.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Amount Summary */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '260px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b' }}>
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748b' }}>
                <span>Tax (GST):</span>
                <span>₹{totalTax.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#16a34a', fontWeight: '600' }}>
                  <span>Discount Off:</span>
                  <span>- ₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderTop: '2px solid #0f172a',
                marginTop: '6px',
                fontSize: '16px',
                fontWeight: '800',
                color: '#0f172a'
              }}>
                <span>Grand Total:</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Mode Specific Note / Udhaar Khata Details */}
          {paymentMode === 'Udhaar' ? (
            <div style={{
              background: '#fef2f2',
              border: '1.5px dashed #ef4444',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '12px',
              color: '#991b1b',
              marginBottom: '20px'
            }}>
              <strong>⚠️ Udhaar Khata Record:</strong> This bill has been booked under credit. Due payment promised by{' '}
              <strong>{paymentDetails.dueDate || 'N/A'}</strong>. Added to customer ledger.
            </div>
          ) : (
            paymentMode === 'Cash' && paymentDetails.cashTendered && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#166534',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>Cash Received: ₹{paymentDetails.cashTendered}</span>
                <span>Change Returned: ₹{paymentDetails.changeToReturn}</span>
              </div>
            )
          )}

          {/* Footer Note */}
          <div style={{ textAlign: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '14px', fontSize: '11px', color: '#94a3b8' }}>
            Thank you for shopping with us! Terms & Conditions: Goods once sold will be replaced within 3 days with bill.
          </div>

        </div>

      </div>
    </div>
  );
}