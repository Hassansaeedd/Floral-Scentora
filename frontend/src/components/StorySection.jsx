import React from 'react';

const StorySection = () => {
  return (
    <>
      <section className="story-section">
        <div className="story-img">
          <img src="/assets/images/oud_subh.jpg" alt="Majestic Oud morning sun gold theme" />
        </div>
        <div className="story-content">
          <span className="section-subtitle">Our Heritage</span>
          <h2 className="story-title font-serif">Al-Qadsiya Khushbuu Mahal</h2>
          <p className="story-text">
            Established with a deep devotion to classical perfumery, Al-Qadsiya Khushbuu Mahal represents the pinnacle of boutique scent artistry. Every creation is hand-blended using premium floral absolute oils, rare spices, and rich agarwood.
          </p>
          <p className="story-text">
            We believe that a fragrance is more than a simple aroma; it is a canvas of memories, a whisper of dreams, and a statement of signature elegance.
          </p>
        </div>
      </section>

      {/* Brand Benefits Bar */}
      <div className="benefits-bar">
        <div className="benefit-item">
          <div className="benefit-icon">
            <i className="fa-solid fa-droplet"></i>
          </div>
          <div className="benefit-details">
            <h4 className="benefit-title">100% Pure Extracts</h4>
            <p className="benefit-desc">No synthetic dilution, pure concentrated oils</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
          <div className="benefit-details">
            <h4 className="benefit-title">Eternal Longevity</h4>
            <p className="benefit-desc">Formulated to linger all day long</p>
          </div>
        </div>

        <div className="benefit-item">
          <div className="benefit-icon">
            <i className="fa-solid fa-seedling"></i>
          </div>
          <div className="benefit-details">
            <h4 className="benefit-title">Cruelty-Free & Natural</h4>
            <p className="benefit-desc">Ethically sourced premium botanicals</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default StorySection;
