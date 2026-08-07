import React, { useState } from 'react';
import ProductCard from './ProductCard';

const ScentQuiz = ({ products, onQuickView, onAddToCart }) => {
  const [selectedPreference, setSelectedPreference] = useState(null);

  const options = [
    { label: 'Floral', icon: '🌸', keywords: ['Floral', 'Rose', 'Jasmine', 'Peony', 'Bloom'] },
    { label: 'Woody', icon: '🪵', keywords: ['Woody', 'Oud', 'Cedar', 'Sandalwood', 'Aoud'] },
    { label: 'Fresh', icon: '🍋', keywords: ['Fresh', 'Citrus', 'Lemon', 'Mint', 'Aqua', 'Blue'] },
    { label: 'Oriental', icon: '🌙', keywords: ['Oriental', 'Amber', 'Saffron', 'Musk', 'Attar'] },
  ];

  // Get recommended products based on preference
  const getRecommendations = () => {
    if (!selectedPreference) return [];
    const opt = options.find(o => o.label === selectedPreference);
    if (!opt) return [];

    return products.filter(p => {
      const text = `${p.name} ${p.category} ${p.notes_top} ${p.notes_middle} ${p.notes_base}`.toLowerCase();
      return opt.keywords.some(kw => text.includes(kw.toLowerCase()));
    }).slice(0, 4);
  };

  const recommendations = getRecommendations();

  return (
    <section className="quiz-section">
      <div className="section-header" style={{ textAlign: 'center' }}>
        <span className="section-subtitle" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          Personal Scent Finder
        </span>
        <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginTop: '6px' }}>
          Find Your Scent
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontSize: '1rem' }}>
          What kind of fragrance do you prefer? Select your mood below:
        </p>
      </div>

      <div className="quiz-grid">
        {options.map((opt) => (
          <div
            key={opt.label}
            className={`quiz-card ${selectedPreference === opt.label ? 'selected' : ''}`}
            onClick={() => setSelectedPreference(opt.label)}
          >
            <div className="quiz-icon">{opt.icon}</div>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'var(--primary-charcoal)' }}>
              {opt.label}
            </h3>
          </div>
        ))}
      </div>

      {selectedPreference && (
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', marginBottom: '25px', color: 'var(--primary-charcoal)' }}>
            Recommended {selectedPreference} Fragrances for You ✨
          </h3>

          {recommendations.length > 0 ? (
            <div className="products-grid" style={{ maxWidth: '1100px', margin: '0 auto' }}>
              {recommendations.map(p => (
                <ProductCard key={p.id} product={p} onQuickView={onQuickView} onAddToCart={onAddToCart} />
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No exact matches found for this preference. Browse our full shop!</p>
          )}
        </div>
      )}
    </section>
  );
};

export default ScentQuiz;
