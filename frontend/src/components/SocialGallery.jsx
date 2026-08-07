import React from 'react';

const FALLBACK_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280" fill="none"><rect width="200" height="280" fill="#090a0f"/><rect x="65" y="100" width="70" height="130" rx="14" fill="url(#bg)" opacity="0.85"/><rect x="82" y="72" width="36" height="32" rx="6" fill="url(#bg)" opacity="0.75"/><rect x="78" y="56" width="44" height="20" rx="8" fill="#e5c158" opacity="0.9"/><rect x="74" y="138" width="52" height="58" rx="6" fill="white" opacity="0.6"/><circle cx="100" cy="167" r="3" fill="#e5c158" opacity="0.7"/><defs><linearGradient id="bg" x1="65" y1="100" x2="135" y2="230" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#e8b4b8"/><stop offset="100%" stop-color="#e5c158"/></linearGradient></defs></svg>`)}`;

const SocialGallery = () => {
  const rawImages = [
    'https://alqadsiya.com/wp-content/uploads/2025/02/01-18.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/01-19.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/11-5.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/66.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/111-1.jpg',
  ];

  const getImageUrl = (url) => {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  return (
    <section className="gallery-section">
      <div className="section-header" style={{ textAlign: 'center' }}>
        <span className="section-subtitle">@FloralScentora</span>
        <h2 className="section-title">Follow Our Scent Journey</h2>
      </div>

      <div className="gallery-grid">
        {rawImages.map((img, idx) => (
          <div key={idx} className="gallery-item">
            <img
              src={getImageUrl(img)}
              alt={`Floral Scentora Photography ${idx + 1}`}
              onError={(e) => {
                if (e.target.src !== FALLBACK_SVG) {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_SVG;
                }
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialGallery;
