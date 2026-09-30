import React from 'react';
import './StockBadge.css';

export default function StockBadge({ stock, minimumStock }) {
  if (stock === 0) {
    return <span className="badge badge-out">Out of Stock</span>;
  }
  if (stock <= minimumStock) {
    return <span className="badge badge-low">Low Stock ({stock})</span>;
  }
  return <span className="badge badge-good">In Stock ({stock})</span>;
}