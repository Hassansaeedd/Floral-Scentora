import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <span style={{ color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem' }}>
          Exclusive Insider Access
        </span>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.8rem', marginTop: '8px', marginBottom: '12px' }}>
          Join the Scentora Circle
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: '1.6' }}>
          Subscribe to receive early access to new seasonal releases, secret botanical formulations, and VIP offers.
        </p>

        {subscribed ? (
          <div style={{ marginTop: '25px', padding: '16px', background: 'rgba(198,161,91,0.2)', border: '1px solid var(--accent-gold)', borderRadius: '30px', color: 'var(--accent-gold)' }}>
            ✨ Thank you for joining! Check your inbox soon for your exclusive welcome gift.
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="newsletter-btn">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
