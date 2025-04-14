import React from 'react';
import { useParams } from 'react-router-dom';
import { sampleProducts } from '../data/sampleProducts';
import { useCart } from '../context/CartContext'; // Import useCart
import './ProductDetailPage.css';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL

  // Find the product in the sample data.
  // In a real app, you'd fetch this from an API based on the ID.
  const { addToCart } = useCart(); // Use the hook

  // Find the product in the sample data.
  // In a real app, you'd fetch this from an API based on the ID.
  // Need to handle potential type mismatch (string vs number) if IDs are numbers
  const product = sampleProducts.find(p => p.id.toString() === id);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Optionally: add user feedback
      console.log(`${product.name} added to cart from detail page`);
    }
  };

  if (!product) {
    return <div className="product-detail-page"><p>Product not found!</p></div>;
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-image-container">
          <img src={product.imageUrl} alt={product.name} className="product-detail-image" />
        </div>
        <div className="product-info-container">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-category">Category: {product.category}</p>
          <p className="product-detail-description">{product.description}</p>
          <p className="product-detail-stock">In Stock: {product.stock}</p>
          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <div className="product-actions">
             {/* Add quantity selector later */}
            <button className="add-to-cart-button-detail" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
