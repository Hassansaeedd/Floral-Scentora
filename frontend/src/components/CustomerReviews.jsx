import React from 'react';

const CustomerReviews = () => {
  const reviews = [
    {
      name: 'Amina K.',
      rating: 5,
      comment: 'The fragrance lasts all day and the packaging is beautiful. Floral Scentora has become my go-to brand!',
      product: 'Rose Noir',
    },
    {
      name: 'Zaid M.',
      rating: 5,
      comment: 'Truly rich oriental oud notes. Received so many compliments at work and family gatherings.',
      product: 'Oud Al-Subh',
    },
    {
      name: 'Sophia R.',
      rating: 5,
      comment: 'Exquisite sillage! Smells incredibly luxurious and premium. Fast delivery as well.',
      product: 'Lavender Mist',
    },
  ];

  return (
    <section className="reviews-section">
      <div className="section-header" style={{ textAlign: 'center' }}>
        <span className="section-subtitle" style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
          Real Testimonials
        </span>
        <h2 className="section-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', marginTop: '6px' }}>
          Loved by Perfume Enthusiasts
        </h2>
      </div>

      <div className="reviews-grid">
        {reviews.map((r, idx) => (
          <div key={idx} className="review-card">
            <div className="rating-stars" style={{ marginBottom: '10px' }}>
              {[...Array(r.rating)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-dark)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '16px' }}>
              "{r.comment}"
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-charcoal)' }}>{r.name}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: 500 }}>{r.product}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CustomerReviews;
