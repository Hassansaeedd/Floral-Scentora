import React from 'react';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

const SocialGallery = () => {
  const rawImages = [
    '/assets/images/rose_whisper.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/01-18.jpg',
    '/assets/images/oud_subh.jpg',
    'https://alqadsiya.com/wp-content/uploads/2025/02/01-19.jpg',
    '/assets/images/lavender_mist.jpg',
  ];

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
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={handleImageError}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialGallery;
