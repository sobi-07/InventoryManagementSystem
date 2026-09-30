const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  minStockThreshold: { type: Number, default: 5 },
  unit: { type: String, default: 'kg' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);