import React from 'react';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const getTagClass = (status) => {
    switch (status) {
      case 'In Stock': return 'tag-instock';
      case 'Low Stock': return 'tag-lowstock';
      case 'Out of Stock':
      default: return 'tag-outstock';
    }
  };

  const isOutOfStock = product.stock_status === 'Out of Stock' || product.quantity <= 0;

  return (
    <div className="perfume-card">
      <div className="card-img-wrapper">
        <span className={`card-tag ${getTagClass(product.stock_status)}`}>
          {product.stock_status}
        </span>
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={handleImageError}
        />
        <div className="card-overlay">
          <button
            className="card-btn"
            onClick={() => onQuickView(product)}
            title="Quick View"
            aria-label={`Quick View ${product.name}`}
          >
            <i className="fa-regular fa-eye"></i>
          </button>
          <button
            className="card-btn"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            title="Add to Cart"
            aria-label={`Add ${product.name} to cart`}
          >
            <i className="fa-solid fa-bag-shopping"></i>
          </button>
        </div>
      </div>

      <div className="card-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="card-category">{product.category || 'Luxury'} • 50ml</span>
          <div className="rating-stars">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
          </div>
        </div>

        <h3 className="card-title">{product.name}</h3>

        <div className="card-notes">
          <span><strong>Top:</strong> {product.notes_top || 'Rose, Bergamot'}</span>
          <span><strong>Heart:</strong> {product.notes_middle || 'Jasmine, Iris'}</span>
          <span><strong>Base:</strong> {product.notes_base || 'Musk, Amber'}</span>
        </div>

        <div className="card-footer">
          <span className="card-price" style={{ color: 'var(--primary-charcoal)', fontWeight: 700 }}>
            Rs. {parseFloat(product.price).toLocaleString()}
          </span>
          <button
            className="card-buy-btn"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            style={{ background: 'var(--primary-charcoal)', color: '#FFF' }}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
