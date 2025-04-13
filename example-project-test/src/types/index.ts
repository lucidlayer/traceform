export interface Product {
  id: string | number; // Use string if using UUIDs, number for simple IDs
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

// Add other types as needed, e.g., CartItem, User, Order
