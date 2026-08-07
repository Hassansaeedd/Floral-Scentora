import React, { useState } from 'react';

const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" fill="none"><rect width="200" height="280" fill="#f8f4ee"/><rect x="65" y="100" width="70" height="130" rx="14" fill="url(#bg)" opacity="0.85"/><rect x="82" y="72" width="36" height="32" rx="6" fill="url(#bg)" opacity="0.75"/><rect x="78" y="56" width="44" height="20" rx="8" fill="#c6a15b" opacity="0.9"/><rect x="74" y="138" width="52" height="58" rx="6" fill="white" opacity="0.6"/><circle cx="100" cy="167" r="3" fill="#c6a15b" opacity="0.7"/><circle cx="88" cy="175" r="2" fill="#c6a15b" opacity="0.5"/><circle cx="112" cy="175" r="2" fill="#c6a15b" opacity="0.5"/><defs><linearGradient id="bg" x1="65" y1="100" x2="135" y2="230" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#f5e6e3"/><stop offset="100%" stop-color="#c6a15b"/></linearGradient></defs></svg>`)}`;

const QuickViewModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('notes');

  if (!isOpen || !product) return null;

  const isOutOfStock = product.stock_status === 'Out of Stock' || product.quantity <= 0;

  const getImageUrl = (image) => {
    if (!image) return FALLBACK_SVG;
    if (image.startsWith('data:')) return image;
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return `/api/image-proxy?url=${encodeURIComponent(image)}`;
    }
    return `/${image}`;
  };

  const handleBuyNow = () => {
    const text = `Hello Floral Scentora! I would like to buy: ${product.name} (${selectedSize}) x ${quantity} - Rs. ${(parseFloat(product.price) * quantity).toLocaleString()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', padding: '35px' }}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="quickview-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '35px' }}>
          <div className="qv-img-wrapper" style={{ borderRadius: '20px', overflow: 'hidden', background: 'var(--pastel-peach)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
            <img src={getImageUrl(product.image)} alt={product.name} style={{ maxHeight: '380px', objectFit: 'contain' }} />
          </div>

          <div className="qv-details">
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent-gold)', fontWeight: 600 }}>
              {product.category || 'Luxury'}
            </span>

            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: 'var(--text-primary)', margin: '6px 0 10px' }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="rating-stars">
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
                <i className="fa-solid fa-star"></i>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(5.0 rating)</span>
            </div>

            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '20px' }}>
              Rs. {parseFloat(product.price).toLocaleString()}
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Select Bottle Size:</label>
              <div className="size-selector">
                {['30ml', '50ml', '100ml'].map(size => (
                  <button
                    key={size}
                    className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dark)' }}>Quantity:</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', border: '1px solid var(--accent-gold)', borderRadius: '25px', padding: '4px 12px' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px', fontSize: '1.1rem' }}>-</button>
                <span style={{ padding: '0 12px', fontWeight: 600 }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px', fontSize: '1.1rem' }}>+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, background: 'var(--text-primary)', color: '#FFF', padding: '14px', borderRadius: '25px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  onAddToCart({ ...product, quantity });
                  onClose();
                }}
                disabled={isOutOfStock}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-secondary"
                style={{ flex: 1, background: 'var(--accent-gold)', color: 'var(--primary-charcoal)', border: 'none', padding: '14px', borderRadius: '25px', fontWeight: 600, cursor: 'pointer' }}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>

            {/* Information Tabs */}
            <div style={{ borderTop: '1px solid rgba(198,161,91,0.3)', paddingTop: '18px' }}>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '14px', borderBottom: '1px solid rgba(198,161,91,0.2)' }}>
                <button onClick={() => setActiveTab('notes')} style={{ border: 'none', background: 'none', paddingBottom: '8px', borderBottom: activeTab === 'notes' ? '2px solid var(--accent-gold)' : 'none', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>Fragrance Notes</button>
                <button onClick={() => setActiveTab('desc')} style={{ border: 'none', background: 'none', paddingBottom: '8px', borderBottom: activeTab === 'desc' ? '2px solid var(--accent-gold)' : 'none', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>Description</button>
                <button onClick={() => setActiveTab('reviews')} style={{ border: 'none', background: 'none', paddingBottom: '8px', borderBottom: activeTab === 'reviews' ? '2px solid var(--accent-gold)' : 'none', fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>Reviews</button>
              </div>

              {activeTab === 'notes' && (
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-dark)' }}>
                  <div><strong>Top Notes:</strong> {product.notes_top || 'Rose, Bergamot'}</div>
                  <div><strong>Heart Notes:</strong> {product.notes_middle || 'Jasmine, Lily'}</div>
                  <div><strong>Base Notes:</strong> {product.notes_base || 'Musk, Vanilla'}</div>
                </div>
              )}
              {activeTab === 'desc' && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {product.description || 'Crafted with fine artisanal oils to deliver an unforgettable olfactory signature.'}
                </p>
              )}
              {activeTab === 'reviews' && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                  <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                  <p style={{ fontStyle: 'italic', marginTop: '4px' }}>"Long lasting sillage, absolutely love this perfume!" — Verified Buyer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
