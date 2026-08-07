import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ cartCount, onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return 'active-link';
    if (path !== '/' && location.pathname.startsWith(path)) return 'active-link';
    return '';
  };

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <Link to="/" className="logo">
        <span className="logo-main" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', fontWeight: 600, letterSpacing: '0.04em', color: '#FFF' }}>
          Floral Scentora
        </span>
        <span className="logo-sub" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent-gold)' }}>
          Luxury Botanical
        </span>
      </Link>

      <nav className={mobileMenuOpen ? 'mobile-nav-active' : ''}>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/catalog" className={isActive('/catalog')}>Shop</Link>
        <Link to="/catalog?category=Luxury" className={isActive('/collections')}>Collections</Link>
        <Link to="/bespoke" className={isActive('/bespoke')}>Scent Builder</Link>
        <Link to="/contact" className={isActive('/contact')}>Contact Us</Link>
      </nav>

      <div className="nav-icons" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Direct Admin Portal Access Button */}
        <Link
          to="/admin"
          className="admin-nav-btn"
          title="Admin Panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '20px',
            background: 'rgba(229, 193, 88, 0.12)',
            border: '1px solid var(--accent-gold)',
            color: 'var(--accent-gold)',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <i className="fa-solid fa-user-shield"></i>
          <span>Admin</span>
        </Link>

        {/* Shopping Cart Button */}
        <button 
          className="nav-icon-btn" 
          onClick={onCartClick}
          aria-label="Shopping Cart"
        >
          <i className="fa-solid fa-bag-shopping"></i>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>

        {/* Mobile Navigation Toggle */}
        <button 
          className="menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
          <span style={{ opacity: mobileMenuOpen ? 0 : 1 }}></span>
          <span style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
