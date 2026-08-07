import React from 'react';
import ProductCard from './ProductCard';

const BestSellers = ({ products, onQuickView, onAddToCart }) => {
  // Select first 8 products as Best Sellers showcase
  const bestSellers = products.slice(0, 8);

  return (
    <section id="best-sellers" className="best-sellers-section" style={{ padding: '70px 20px', background: 'var(--color-bg)' }}>
      <div className="section-header" style={{ textAlign: 'center', marginBottom: '45px' }}>
        <span className="section-subtitle" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          Customer Favorites
        </span>
        <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginTop: '6px' }}>
          Best Sellers
        </h2>
      </div>

      <div className="products-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {bestSellers.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
