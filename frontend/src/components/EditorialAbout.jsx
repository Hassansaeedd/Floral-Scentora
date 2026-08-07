import React from 'react';

const EditorialAbout = () => {
  const imageUrl = `/api/image-proxy?url=${encodeURIComponent('https://alqadsiya.com/wp-content/uploads/2025/02/01-19.jpg')}`;

  return (
    <section className="editorial-section">
      <div className="editorial-content">
        <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 600 }}>
          Artisanal Craftsmanship
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', color: 'var(--text-primary)', margin: '12px 0 20px', lineHeight: '1.2' }}>
          About Floral Scentora
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '18px' }}>
          Born from a passion for rare botanical essences and timeless fragrance traditions, <strong>Floral Scentora</strong> blends hand-picked floral petals, precious agarwood, and natural extracts into memorable perfume creations.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
          Every bottle is a testament to elegance, designed to captivate your senses and leave an unmistakable signature aura wherever you go.
        </p>
      </div>

      <div className="editorial-image-wrapper">
        <img
          src={imageUrl}
          alt="About Floral Scentora"
          className="editorial-img"
        />
      </div>
    </section>
  );
};

export default EditorialAbout;
