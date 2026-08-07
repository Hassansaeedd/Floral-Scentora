import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-col footer-about">
          <Link to="/" className="logo" style={{ marginBottom: '20px' }}>
            <span className="logo-main" style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 600 }}>Floral Scentora</span>
            <span className="logo-sub" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.25em', color: 'var(--accent-gold)' }}>Luxury Botanical</span>
          </Link>
          <p>
            Majestic olfactory house dedicated to blending the finest botanical ingredients. Crafting memories, whispering dreams, and defining signature elegance.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalog">Shop Collection</Link></li>
            <li><Link to="/catalog?category=Luxury">Featured Collections</Link></li>
            <li><Link to="/bespoke">Scent Builder</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Collections</h4>
          <ul className="footer-links">
            <li><Link to="/catalog?category=Floral">🌹 Floral Collection</Link></li>
            <li><Link to="/catalog?category=Oud">🪵 Oud Collection</Link></li>
            <li><Link to="/catalog?category=Oriental">🌙 Oriental Collection</Link></li>
            <li><Link to="/catalog?category=Luxury">✨ Luxury Collection</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Inquiries</h4>
          <div className="footer-contact-info">
            <div>
              <i className="fa-solid fa-phone"></i> +92 300 1234567
            </div>
            <div>
              <i className="fa-regular fa-envelope"></i> hello@scentora.com
            </div>
            <div>
              <i className="fa-regular fa-compass"></i> Botanical Boulevard, Pakistan
            </div>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Floral Scentora. All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <Link to="/admin" className="admin-trigger-link">
            <i className="fa-solid fa-gears"></i> Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
