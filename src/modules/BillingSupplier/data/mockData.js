// src/modules/BillingSupplier/data/mockData.js

export const INITIAL_PRODUCTS = [
  { id: 'P101', name: 'Aashirvaad Atta 5kg', price: 245, stock: 18, gstRate: 0 },
  { id: 'P102', name: 'Fortune Sunflower Oil 1L', price: 135, stock: 32, gstRate: 5 },
  { id: 'P103', name: 'Tata Salt 1kg', price: 28, stock: 50, gstRate: 0 },
  { id: 'P104', name: 'Amul Butter 500g', price: 275, stock: 12, gstRate: 12 },
  { id: 'P105', name: 'Surf Excel 1kg', price: 140, stock: 25, gstRate: 18 },
  { id: 'P106', name: 'Maggi Noodles 70g', price: 14, stock: 95, gstRate: 12 },
  { id: 'P107', name: 'Tata Tea Gold 500g', price: 310, stock: 15, gstRate: 5 },
  { id: 'P108', name: 'Dettol Soap (Pack of 3)', price: 165, stock: 20, gstRate: 18 }
];

export const INITIAL_SUPPLIERS = [
  {
    id: 'SUP-01',
    name: 'Ramesh Gupta',
    agencyName: 'Gupta FMCG Distributors',
    contact: '+91 98231 45670',
    totalPurchased: 145000,
    pendingDue: 18500,
    lastPaymentDate: '2026-08-10'
  },
  {
    id: 'SUP-02',
    name: 'Sunil Traders',
    agencyName: 'Sunil Edible Oils & Grains',
    contact: '+91 97112 33445',
    totalPurchased: 210000,
    pendingDue: 42000,
    lastPaymentDate: '2026-07-30'
  },
  {
    id: 'SUP-03',
    name: 'Harpreet Singh',
    agencyName: 'Punjab Dairy & Agro Supply',
    contact: '+91 94170 88990',
    totalPurchased: 89000,
    pendingDue: 0,
    lastPaymentDate: '2026-08-20'
  },
  {
    id: 'SUP-04',
    name: 'Kiran Patel',
    agencyName: 'Western Wholesale Agency',
    contact: '+91 98980 11223',
    totalPurchased: 65000,
    pendingDue: 9200,
    lastPaymentDate: '2026-08-05'
  }
];