export const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 299.99,
    originalPrice: 399.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    category: { id: 1, name: "Electronics" },
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isNew: false,
    onSale: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch featuring GPS and heart rate monitoring.",
    price: 249.99,
    originalPrice: 249.99,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    category: { id: 1, name: "Electronics" },
    rating: 4.6,
    reviews: 89,
    inStock: true,
    isNew: true,
    onSale: false
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt in various colors and sizes.",
    price: 29.99,
    originalPrice: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop",
    category: { id: 2, name: "Clothing" },
    rating: 4.4,
    reviews: 67,
    inStock: true,
    isNew: false,
    onSale: true
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    description: "Stylish and durable leather crossbody bag perfect for everyday use.",
    price: 89.99,
    originalPrice: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    category: { id: 3, name: "Accessories" },
    rating: 4.7,
    reviews: 45,
    inStock: false,
    isNew: false,
    onSale: false
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    description: "Beautiful handcrafted ceramic coffee mugs, set of 4 with unique designs.",
    price: 34.99,
    originalPrice: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400&h=300&fit=crop",
    category: { id: 4, name: "Home & Kitchen" },
    rating: 4.5,
    reviews: 78,
    inStock: true,
    isNew: true,
    onSale: true
  },
  {
    id: 6,
    name: "Yoga Mat Pro",
    description: "Non-slip premium yoga mat with alignment lines and carrying strap.",
    price: 59.99,
    originalPrice: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop",
    category: { id: 5, name: "Sports & Fitness" },
    rating: 4.9,
    reviews: 156,
    inStock: true,
    isNew: false,
    onSale: false
  }
];

export const mockCategories = [
  { id: 1, name: "Electronics", count: 2 },
  { id: 2, name: "Clothing", count: 1 },
  { id: 3, name: "Accessories", count: 1 },
  { id: 4, name: "Home & Kitchen", count: 1 },
  { id: 5, name: "Sports & Fitness", count: 1 }
];