import React, { useState } from 'react';

const ContactPage = () => {
  const CONTACT_EMAIL = 'hschatthi@gmail.com';
  const WHATSAPP_PHONE = '923154327855';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const emailSubject = encodeURIComponent(subject || `Inquiry from ${name}`);
    const emailBody = encodeURIComponent(`Name: ${name}
Email: ${email}

Message:
${message}`);

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="view-section active" id="view-contact" style={{ paddingTop: '120px' }}>
      <div className="section-header">
        <span className="section-subtitle">Reach Out</span>
        <h2 className="section-title">Contact Us</h2>
      </div>

      <div className="contact-layout">
        
        {/* Contact Info Channels Panel */}
        <div className="contact-info-panel">
          <div className="contact-header">
            <h2 className="font-serif">Let's Connect</h2>
            <p>
              We'd love to hear from you. Whether you have an inquiry about our catalog creations, want to discuss a bespoke custom order, or simply want to share your fragrance feedback, reach out to us.
            </p>
          </div>

          <div className="contact-channels">
            <a href={`https://wa.me/${WHATSAPP_PHONE}`} className="channel-card whatsapp-channel" target="_blank" rel="noopener noreferrer">
              <div className="channel-icon">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div className="channel-details">
                <span className="channel-name">WhatsApp Direct</span>
                <span className="channel-val">+92 315 4327855</span>
              </div>
              <span className="channel-action">Chat Now</span>
            </a>

            <a href={`mailto:${CONTACT_EMAIL}`} className="channel-card email-channel">
              <div className="channel-icon">
                <i className="fa-regular fa-envelope"></i>
              </div>
              <div className="channel-details">
                <span className="channel-name">Official Email</span>
                <span className="channel-val">{CONTACT_EMAIL}</span>
              </div>
              <span className="channel-action">Write Us</span>
            </a>

            <div className="channel-card hours-channel">
              <div className="channel-icon">
                <i className="fa-regular fa-clock"></i>
              </div>
              <div className="channel-details">
                <span className="channel-name">Opening Hours</span>
                <span className="channel-val">Mon - Sat: 11:00 AM - 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Contact Form Panel */}
        <div className="contact-form-panel">
          <h3 className="form-title font-serif">Send a Message</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <label htmlFor="contact-name" className="form-label">Full Name *</label>
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-input"
                placeholder=" "
                id="contact-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="contact-email" className="form-label">Email Address *</label>
            </div>

            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder=" "
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <label htmlFor="contact-subject" className="form-label">Subject</label>
            </div>

            <div className="form-group">
              <textarea
                className="form-input"
                placeholder=" "
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <label htmlFor="contact-message" className="form-label">Your Message *</label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Send Message <i className="fa-regular fa-paper-plane"></i>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
