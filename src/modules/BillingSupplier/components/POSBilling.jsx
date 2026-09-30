import React, { useState } from 'react';

export default function POSBilling({ products, onGenerateInvoice }) {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [enableGst, setEnableGst] = useState(true);
  const [discountPercent, setDiscountPercent] = useState('');

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerGst, setCustomerGst] = useState('');

  // Payment State
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [cashTendered, setCashTendered] = useState('');
  const [cardType, setCardType] = useState('Debit Card');
  const [cardTxnId, setCardTxnId] = useState('');
  const [upiId, setUpiId] = useState('shopmanager@upi');
  
  // Format YYYY-MM-DD helper to strictly avoid 0026 bug
  const getFormattedDate = (dateObj) => {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getFormattedDate(new Date());
  const [purchaseDate, setPurchaseDate] = useState(todayStr);

  // Default Due Date (+15 Days automatically set with proper 2026 year)
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 15);
  const [dueDate, setDueDate] = useState(getFormattedDate(defaultDueDate));

  // Quick Days Adder for Udhaar (+7, +15, +30 Days)
  const setQuickDueDays = (days) => {
    const target = new Date();
    target.setDate(target.getDate() + days);
    setDueDate(getFormattedDate(target));
  };

  // Add Item to Cart
  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].qty += 1;
      setCart(updated);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Update Qty
  const handleUpdateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove Item
  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalTax = enableGst
    ? cart.reduce((sum, item) => sum + (item.price * item.qty * (item.gstRate || 0)) / 100, 0)
    : 0;
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const grandTotal = Math.max(0, Math.round(subtotal + totalTax - discountAmount));
  const changeToReturn = Number(cashTendered) > grandTotal ? (Number(cashTendered) - grandTotal).toFixed(2) : '0.00';

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Cart khali hai! Pehle product add karein.');
      return;
    }
    if (paymentMode === 'Udhaar' && (!customerName || !customerPhone || !dueDate)) {
      alert('Udhaar ke liye Customer Name, Mobile Number aur Due Date zaroori hai!');
      return;
    }

    const invoicePayload = {
      invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
      date: purchaseDate,
      customer: {
        name: customerName.trim() || 'Walk-in Customer',
        phone: customerPhone.trim() || 'N/A',
        gstin: customerGst.trim() || 'Unregistered'
      },
      cart,
      subtotal,
      totalTax,
      discountAmount,
      grandTotal,
      paymentMode,
      paymentDetails: {
        cashTendered: paymentMode === 'Cash' ? cashTendered : null,
        changeToReturn: paymentMode === 'Cash' ? changeToReturn : null,
        cardType: paymentMode === 'Card' ? cardType : null,
        cardTxnId: paymentMode === 'Card' ? cardTxnId : null,
        upiId: paymentMode === 'UPI' ? upiId : null,
        dueDate: paymentMode === 'Udhaar' ? dueDate : null
      }
    };

    onGenerateInvoice(invoicePayload);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'start' }}>
      
      {/* LEFT COLUMN: Modern Product Selection & Cart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Quick Product Search & Grid */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: '700' }}>⚡ Quick Product Selection</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Item par click karein add karne ke liye</span>
          </div>

          <input
            type="text"
            placeholder="🔍 Search item by name or code (e.g. Atta, Oil, P102)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              fontSize: '14px',
              boxSizing: 'border-box',
              marginBottom: '14px',
              outline: 'none'
            }}
          />

          {/* Product Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => handleAddToCart(p)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
              >
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px' }}>
                  <span style={{ color: '#2563eb', fontWeight: 'bold' }}>₹{p.price}</span>
                  <span style={{ color: '#94a3b8' }}>Stk: {p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Items Table */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontWeight: '700' }}>🛒 Cart Items ({cart.length})</h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                style={{ fontSize: '12px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '600' }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛍️</div>
              <p style={{ margin: 0, fontSize: '14px' }}>Cart khali hai. Upar se product select karein.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 8px' }}>Product</th>
                  <th style={{ padding: '10px 8px' }}>Rate</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px 8px' }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>GST: {item.gstRate || 0}%</div>
                    </td>
                    <td style={{ padding: '10px 8px', color: '#475569' }}>₹{item.price}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                        <button onClick={() => handleUpdateQty(item.id, -1)} style={{ padding: '2px 8px', border: 'none', background: '#f8fafc', cursor: 'pointer' }}>-</button>
                        <span style={{ padding: '2px 10px', fontWeight: 'bold', fontSize: '12px' }}>{item.qty}</span>
                        <button onClick={() => handleUpdateQty(item.id, 1)} style={{ padding: '2px 8px', border: 'none', background: '#f8fafc', cursor: 'pointer' }}>+</button>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '700', color: '#0f172a' }}>
                      ₹{item.price * item.qty}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <button onClick={() => handleRemove(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Customer Details, Calculations & Smart Payment */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Customer Information Card */}
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#334155', fontWeight: '700' }}>👤 Customer Details</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              placeholder="Customer Name (Optional for Cash)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <input
              type="tel"
              placeholder="Phone Number (e.g. 98XXXXXXXX)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              placeholder="GST Number / GSTIN (Optional)"
              value={customerGst}
              onChange={(e) => setCustomerGst(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Pricing Summary */}
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h4 style={{ margin: '0 0 14px', fontSize: '14px', color: '#334155', fontWeight: '700' }}>📊 Bill Summary</h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#475569' }}>
            <span>Subtotal:</span>
            <span style={{ fontWeight: '600' }}>₹{subtotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', marginBottom: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#475569' }}>
              <input type="checkbox" checked={enableGst} onChange={(e) => setEnableGst(e.target.checked)} />
              Apply GST:
            </label>
            <span style={{ fontWeight: '600', color: '#64748b' }}>₹{totalTax.toFixed(2)}</span>
          </div>

          {/* Discount Input & Live Calculation */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#475569', fontSize: '13px' }}>Discount (%):</span>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  style={{
                    width: '75px',
                    padding: '6px 20px 6px 8px',
                    borderRadius: '6px',
                    border: '1.5px solid #cbd5e1',
                    textAlign: 'right',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    outline: 'none'
                  }}
                />
                <span style={{ position: 'absolute', right: '6px', color: '#94a3b8', fontSize: '12px', pointerEvents: 'none' }}>%</span>
              </div>
            </div>

            {Number(discountPercent) > 0 && (
              <div style={{
                marginTop: '6px',
                padding: '6px 10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                fontSize: '12px',
                color: '#166534',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>🎉 ₹{subtotal.toFixed(2)} ka {discountPercent}% chhoot:</span>
                <strong style={{ color: '#15803d' }}>- ₹{discountAmount.toFixed(2)} off</strong>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '12px' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>Grand Total:</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: '#16a34a' }}>₹{grandTotal}</span>
          </div>
        </div>

        {/* Dedicated Payment Methods */}
        <div style={{ background: '#ffffff', padding: '18px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#334155', fontWeight: '700' }}>💳 Payment Method</h4>

          {/* Mode Selector Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginBottom: '16px' }}>
            {['Cash', 'UPI', 'Card', 'Udhaar'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPaymentMode(mode)}
                style={{
                  padding: '9px 4px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: paymentMode === mode ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: paymentMode === mode ? '#eff6ff' : '#f8fafc',
                  color: paymentMode === mode ? '#1d4ed8' : '#64748b',
                  cursor: 'pointer'
                }}
              >
                {mode === 'Udhaar' ? '📒 Udhaar' : mode}
              </button>
            ))}
          </div>

          {/* Cash Mode */}
          {paymentMode === 'Cash' && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Cash Received (₹):</label>
                <input
                  type="number"
                  placeholder={grandTotal.toString()}
                  value={cashTendered}
                  onChange={(e) => setCashTendered(e.target.value)}
                  style={{ width: '110px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 'bold' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#15803d', fontWeight: '700', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                <span>Change to Return:</span>
                <span>₹{changeToReturn}</span>
              </div>
            </div>
          )}

          {/* UPI Mode */}
          {paymentMode === 'UPI' && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '10px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '8px' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=upi://pay?pa=${upiId}&am=${grandTotal}&pn=ShopManager`}
                  alt="UPI QR"
                  style={{ width: '120px', height: '120px', display: 'block' }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>PhonePe / GPay / Paytm se scan karein</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', background: '#ffffff', padding: '6px', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
                UPI ID: {upiId}
              </div>
            </div>
          )}

          {/* Card Mode */}
          {paymentMode === 'Card' && (
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Select Card Type:</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {['Credit Card', 'Debit Card', 'International'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setCardType(type)}
                    style={{
                      flex: 1,
                      padding: '6px 4px',
                      fontSize: '11px',
                      borderRadius: '6px',
                      border: cardType === type ? '1.5px solid #2563eb' : '1px solid #cbd5e1',
                      background: cardType === type ? '#dbeafe' : '#ffffff',
                      color: cardType === type ? '#1d4ed8' : '#475569',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <input
                type="text"
                placeholder="POS Auth Code / RRN (e.g. TXN-8942)"
                value={cardTxnId}
                onChange={(e) => setCardTxnId(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
              />
            </div>
          )}

          {/* Udhaar Mode (FIXED 2026 DATE BUG + QUICK PRESETS) */}
          {paymentMode === 'Udhaar' && (
            <div style={{ background: '#fffbeb', padding: '14px', borderRadius: '10px', border: '1.5px solid #fde68a' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400e', marginBottom: '10px' }}>
                ⚠️ Khata Credit Entry Required
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#78350f', display: 'block', marginBottom: '4px' }}>Purchase Date:</label>
                  <input
                    type="date"
                    min="2026-01-01"
                    max="2035-12-31"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#dc2626', display: 'block', marginBottom: '4px' }}>Due / Pay Date *:</label>
                  <input
                    type="date"
                    min="2026-01-01"
                    max="2035-12-31"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1.5px solid #f87171', fontSize: '12px', boxSizing: 'border-box' }}
                    required
                  />
                </div>
              </div>

              {/* Quick Preset Buttons (Takes 1 second, no manual typing required) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#92400e', fontWeight: '600' }}>Quick Select:</span>
                <button
                  type="button"
                  onClick={() => setQuickDueDays(7)}
                  style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #f59e0b', background: '#ffffff', color: '#b45309', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  +7 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDueDays(15)}
                  style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #f59e0b', background: '#ffffff', color: '#b45309', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  +15 Days
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDueDays(30)}
                  style={{ padding: '3px 8px', fontSize: '11px', borderRadius: '4px', border: '1px solid #f59e0b', background: '#ffffff', color: '#b45309', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  +30 Days
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '11px', color: '#b45309' }}>
                * Udhaar bill generate hone par Customer Khata me record automatically log hoga.
              </p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            style={{
              width: '100%',
              marginTop: '16px',
              padding: '13px',
              backgroundColor: cart.length === 0 ? '#94a3b8' : '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              boxShadow: cart.length === 0 ? 'none' : '0 4px 6px -1px rgba(22, 163, 74, 0.3)'
            }}
          >
            🖨️ Generate Bill & Print Invoice
          </button>
        </div>

      </div>

    </div>
  );
}