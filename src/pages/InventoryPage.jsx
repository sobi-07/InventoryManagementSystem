import React, { useState } from 'react';
import { initialProducts, categoriesList } from '../data/mockInventory';
import ProductModal from '../components/ProductModal';
import StockBadge from '../components/StockBadge';
import { 
  Package, 
  AlertTriangle, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingDown,
  DollarSign,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import './InventoryPage.css';

export default function InventoryPage() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Metrics Calculations
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= p.minimumStock);
  const outOfStockItems = products.filter(p => p.stock === 0);
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  // Quick Stock Adjustment (+1 / -1)
  const handleQuickStock = (id, delta) => {
    setProducts(prev => prev.map(item => {
      if (item.id === id) {
        const nextStock = Math.max(0, item.stock + delta);
        return { ...item, stock: nextStock };
      }
      return item;
    }));
  };

  // Add or Edit Product Handler
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...productData, id: p.id } : p));
    } else {
      const newProduct = {
        ...productData,
        id: 'prod_' + Date.now(),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
  };

  // Delete Product
  const handleDeleteProduct = (id, name) => {
    if (window.confirm(`Kya aap "${name}" ko inventory se delete karna chahte hain?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesLowStock = onlyLowStock ? (product.stock <= product.minimumStock) : true;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  return (
    <div className="inventory-container">
      {/* Top Header */}
      <header className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Real-time stock levels, minimum thresholds & alerts</p>
        </div>
        <button 
          className="btn-add-product"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={18} /> Add New Product
        </button>
      </header>

      {/* KPI Stats Grid */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Package size={22} /></div>
          <div>
            <span className="stat-label">Total Products</span>
            <h3>{totalProducts}</h3>
          </div>
        </div>

        <div 
          className={`stat-card clickable ${onlyLowStock ? 'active-warning' : ''}`}
          onClick={() => setOnlyLowStock(!onlyLowStock)}
          title="Click to toggle low stock filter"
        >
          <div className="stat-icon bg-yellow"><AlertTriangle size={22} /></div>
          <div>
            <span className="stat-label">Low Stock Items</span>
            <h3>{lowStockItems.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-red"><AlertCircle size={22} /></div>
          <div>
            <span className="stat-label">Out of Stock</span>
            <h3>{outOfStockItems.length}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bg-green"><DollarSign size={22} /></div>
          <div>
            <span className="stat-label">Total Valuation</span>
            <h3>₹{totalInventoryValue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </section>

      {/* Low-Stock Alert Banner */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="alert-banner">
          <TrendingDown size={20} className="alert-icon" />
          <div className="alert-text">
            <strong>Stock Alert: </strong> 
            {outOfStockItems.length} items out of stock aur {lowStockItems.length} items minimum threshold se kam hain.
          </div>
          <button 
            className="alert-btn"
            onClick={() => setOnlyLowStock(!onlyLowStock)}
          >
            {onlyLowStock ? 'View All Items' : 'View Alerts Only'}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="table-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categoriesList.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Current Stock</th>
              <th>Min Stock</th>
              <th>Status</th>
              <th>Stock Adjust</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  Koi product nahi mila. Try adjusting search or filters.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="product-title-cell">
                    <strong>{product.name}</strong>
                    <span className="product-id">{product.id}</span>
                  </td>
                  <td><span className="category-tag">{product.category}</span></td>
                  <td>₹{product.price}</td>
                  <td><strong>{product.stock}</strong></td>
                  <td className="text-muted">{product.minimumStock}</td>
                  <td>
                    <StockBadge stock={product.stock} minimumStock={product.minimumStock} />
                  </td>
                  <td>
                    <div className="stock-counter">
                      <button 
                        onClick={() => handleQuickStock(product.id, -1)}
                        className="counter-btn"
                        title="Reduce 1"
                      >
                        <MinusCircle size={16} />
                      </button>
                      <span>{product.stock}</span>
                      <button 
                        onClick={() => handleQuickStock(product.id, 1)}
                        className="counter-btn"
                        title="Add 1"
                      >
                        <PlusCircle size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="actions-cell text-right">
                    <button 
                      className="action-icon-btn edit"
                      onClick={() => {
                        setEditingProduct(product);
                        setIsModalOpen(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-icon-btn delete"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        editProduct={editingProduct}
        categories={categoriesList}
      />
    </div>
  );
}