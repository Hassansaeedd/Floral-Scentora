import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCards = () => {
  const navigate = useNavigate();

  const collections = [
    {
      name: 'Floral Collection',
      filter: 'Floral',
      emoji: '🌹',
      desc: 'Elegant blends of morning roses, blooming jasmine, and delicate peonies.',
    },
    {
      name: 'Oud Collection',
      filter: 'Oud',
      emoji: '🪵',
      desc: 'Rich, majestic agarwood infused with warm spices and precious resins.',
    },
    {
      name: 'Oriental Collection',
      filter: 'Oriental',
      emoji: '🌙',
      desc: 'Mysterious notes of saffron, ambergris, and sweet vanilla accords.',
    },
    {
      name: 'Luxury Collection',
      filter: 'Luxury',
      emoji: '✨',
      desc: 'Handcrafted signature scents from prestigious world perfume houses.',
    },
  ];

  const handleCollectionClick = (filter) => {
    navigate(`/catalog?category=${encodeURIComponent(filter)}`);
  };

  return (
    <section className="categories-section" style={{ marginBottom: '80px' }}>
      <div className="section-header">
        <span className="section-subtitle" style={{ color: 'var(--accent-gold)' }}>Curated Selections</span>
        <h2 className="section-title">Featured Collections</h2>
      </div>

      <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
        {collections.map((col, idx) => (
          <div
            key={idx}
            className="category-card clickable"
            onClick={() => handleCollectionClick(col.filter)}
            style={{
              background: '#FFF',
              border: '1px solid rgba(198, 161, 91, 0.25)',
              borderRadius: '20px',
              padding: '30px 24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
              {col.emoji}
            </div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--primary-charcoal)', marginBottom: '10px' }}>
              {col.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {col.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryCards;
