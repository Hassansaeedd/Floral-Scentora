import React from 'react';

const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" fill="none"><rect width="200" height="280" fill="#f8f4ee"/><rect x="65" y="100" width="70" height="130" rx="14" fill="url(#bg)" opacity="0.85"/><rect x="82" y="72" width="36" height="32" rx="6" fill="url(#bg)" opacity="0.75"/><rect x="78" y="56" width="44" height="20" rx="8" fill="#c6a15b" opacity="0.9"/><rect x="74" y="138" width="52" height="58" rx="6" fill="white" opacity="0.6"/><circle cx="100" cy="167" r="3" fill="#c6a15b" opacity="0.7"/><circle cx="88" cy="175" r="2" fill="#c6a15b" opacity="0.5"/><circle cx="112" cy="175" r="2" fill="#c6a15b" opacity="0.5"/><defs><linearGradient id="bg" x1="65" y1="100" x2="135" y2="230" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#f5e6e3"/><stop offset="100%" stop-color="#c6a15b"/></linearGradient></defs></svg>`)}`;

const ProductCard = ({ product, onQuickView, onAddToCart }) => {
  const getTagClass = (status) => {
    switch (status) {
      case 'In Stock': return 'tag-instock';
      case 'Low Stock': return 'tag-lowstock';
      case 'Out of Stock':
      default: return 'tag-outstock';
    }
  };

  const getImageUrl = (image) => {
    if (!image) return FALLBACK_SVG;
    if (image.startsWith('data:')) return image;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return `/api/image-proxy?url=${encodeURIComponent(image)}`;
    }
    return `/${image}`;
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
          onError={(e) => {
            if (e.target.src !== FALLBACK_SVG) {
              e.target.onerror = null;
              e.target.src = FALLBACK_SVG;
            }
          }}
          style={{ objectFit: 'contain', background: '#F8F4EE' }}
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
