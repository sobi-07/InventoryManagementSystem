const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.send('Backend Server is Running!');
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://rj2368836_db_user:j86Z0JN5aXErV90V@cluster0.bxmaccq.mongodb.net/shop_db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Note:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});