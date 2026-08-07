import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-subtitle" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
          Floral Scentora
        </span>
        <h1 className="hero-title" style={{ fontSize: '3.5rem', lineHeight: '1.15', margin: '12px 0 20px' }}>
          Discover Your <span>Signature Scent</span>
        </h1>
        <p className="hero-description" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '30px' }}>
          Elegant fragrances crafted to leave a lasting impression.
        </p>
        <div className="btn-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link to="/catalog" className="btn btn-primary" style={{ background: 'var(--primary-charcoal)', color: '#FFF', padding: '14px 28px', borderRadius: '30px', fontWeight: 600 }}>
            Shop Collection <i className="fa-solid fa-arrow-right" style={{ marginLeft: '8px' }}></i>
          </Link>
          <a href="#best-sellers" className="btn btn-secondary" style={{ border: '1px solid var(--accent-gold)', color: 'var(--text-dark)', padding: '14px 28px', borderRadius: '30px', fontWeight: 600 }}>
            Explore Best Sellers <i className="fa-solid fa-sparkles" style={{ marginLeft: '8px' }}></i>
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-circle-bg"></div>
        <div className="hero-img-card" style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--box-shadow-medium)' }}>
          <img src="https://alqadsiya.com/wp-content/uploads/2025/02/01-18.jpg" alt="Floral Scentora Luxury Perfume" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="floating-badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid var(--accent-gold)' }}>
          <span className="badge-title" style={{ color: 'var(--primary-charcoal)', fontWeight: 600 }}>100% Botanical</span>
          <span className="badge-sub" style={{ color: 'var(--accent-gold)' }}>Pure Artisanal Oils</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
