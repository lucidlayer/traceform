import React from 'react';
import ProductCard from '../components/Product/ProductCard';
import { sampleProducts } from '../data/sampleProducts';
import './HomePage.css';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <h2>Welcome to MyStore!</h2>
        <p>Your one-stop shop for amazing products.</p>
        <button className="cta-button">Shop Now</button>
      </section>

      <section className="featured-products">
        <h3>Featured Products</h3>
        <div className="product-grid"> {/* Changed class name */}
          {sampleProducts.slice(0, 3).map((product) => ( // Display first 3 featured products
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h3>Shop by Category</h3>
        {/* Category links/cards will go here */}
        <div className="category-grid-placeholder">
          <div>Category A</div>
          <div>Category B</div>
          <div>Category C</div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
