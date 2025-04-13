import React from 'react';
import ProductCard from '../components/Product/ProductCard';
import { sampleProducts } from '../data/sampleProducts';
import './ProductListPage.css'; // We'll create this CSS file next

const ProductListPage: React.FC = () => {
  return (
    <div className="product-list-page">
      <h2>All Products</h2>
      <div className="product-grid">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
