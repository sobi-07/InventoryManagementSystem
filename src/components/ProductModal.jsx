import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './ProductModal.css';

export default function ProductModal({ isOpen, onClose, onSave, editProduct, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Groceries',
    price: '',
    stock: '',
    minimumStock: ''
  });

  useEffect(() => {
    if (editProduct) {
      setFormData(editProduct);
    } else {
      setFormData({
        name: '',
        category: categories.find(c => c !== 'All') || 'Groceries',
        price: '',
        stock: '',
        minimumStock: ''
      });
    }
  }, [editProduct, isOpen, categories]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'category' ? value : Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Product name zaroori hai!');
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Fortune Oil 1L"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                placeholder="0"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Minimum Stock Level</label>
              <input
                type="number"
                name="minimumStock"
                min="0"
                placeholder="0"
                value={formData.minimumStock}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">
              {editProduct ? 'Update Product' : 'Add to Inventory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}