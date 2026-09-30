import React from 'react';
import InventoryPage from './pages/InventoryPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <nav style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb' }}>📦 ShopManager</span>
          <span style={{ fontSize: '0.8rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            Inventory Module
          </span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>College Project Demo</span>
      </nav>

      <main>
        <InventoryPage />
      </main>
    </div>
  );
}