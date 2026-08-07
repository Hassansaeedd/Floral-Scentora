import React, { useRef, useState } from 'react';
import ProductCard from './ProductCard';

const FeaturedSlider = ({ products, onQuickView, onAddToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  // We only display up to 5 featured items in the slider
  const featured = products.slice(0, 5);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < featured.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // On mobile we might show 1 card, on tablet 2, on desktop 3.
  // We can calculate offset percentage dynamically or translate by exact card width.
  // Since styling track has gap: 30px, we can translate by a factor:
  const getTranslationStyle = () => {
    // 33.333% width for desktop.
    // In our original CSS, slider track flex has gap: 30px.
    // Let's use simple calculation: each step translates by (100% / 3) + gap offset.
    // But since it's responsive, we can translate by (300px + 30px) * index or just percentages:
    return {
      transform: `translateX(calc(-${currentIndex * 33.333}% - ${currentIndex * 10}px))`
    };
  };

  if (featured.length === 0) return null;

  return (
    <section className="featured-perfumes">
      <div className="section-header">
        <span className="section-subtitle">Exquisite Selections</span>
        <h2 className="section-title">Featured Creations</h2>
      </div>

      <div className="slider-container">
        {currentIndex > 0 && (
          <button 
            className="slider-btn slider-btn-prev" 
            onClick={handlePrev}
            aria-label="Previous perfume"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
        )}

        <div className="slider-track" ref={trackRef} style={getTranslationStyle()}>
          {featured.map((product) => (
            <div key={product.id} className="slider-item" style={{ minWidth: 'calc(33.333% - 20px)', flexShrink: 0 }}>
              <ProductCard
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        {currentIndex < featured.length - 3 && (
          <button 
            className="slider-btn slider-btn-next" 
            onClick={handleNext}
            aria-label="Next perfume"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        )}
      </div>
    </section>
  );
};

export default FeaturedSlider;
