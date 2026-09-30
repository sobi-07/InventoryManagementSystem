export const initialProducts = [
  {
    id: 'prod_1',
    name: 'Aashirvaad Atta 5kg',
    category: 'Groceries',
    price: 245,
    stock: 18,
    minimumStock: 10,
  },
  {
    id: 'prod_2',
    name: 'Tata Salt 1kg',
    category: 'Groceries',
    price: 28,
    stock: 4,
    minimumStock: 15, // Low stock demo
  },
  {
    id: 'prod_3',
    name: 'Amul Butter 500g',
    category: 'Dairy',
    price: 275,
    stock: 1,
    minimumStock: 6, // Critical low stock demo
  },
  {
    id: 'prod_4',
    name: 'Surf Excel Quick Wash 1kg',
    category: 'Household',
    price: 140,
    stock: 22,
    minimumStock: 10,
  },
  {
    id: 'prod_5',
    name: 'Fortune Sunlite Oil 1L',
    category: 'Groceries',
    price: 135,
    stock: 0,
    minimumStock: 8, // Out of stock demo
  },
  {
    id: 'prod_6',
    name: 'Good Day Butter Biscuits',
    category: 'Snacks',
    price: 30,
    stock: 45,
    minimumStock: 20,
  }
];

export const categoriesList = [
  'All',
  'Groceries',
  'Dairy',
  'Household',
  'Snacks',
  'Beverages'
];