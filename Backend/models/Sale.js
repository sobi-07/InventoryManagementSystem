const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    price: Number,
    subtotal: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
  customerPhone: String
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);