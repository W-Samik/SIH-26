import React from 'react';
import '../styles/sections.css';

const ContactSection = () => {
  return (
    <div id="contact" className="contact-section">
      <div className="contact-content">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-info">
          <p>
            Ankit Ghosh: 9354031843<br/>
            <span style={{ color: 'var(--neon-green)' }}>gankitsysdev@gmail.com</span>
          </p>
          <p>
            Samik: 8920341517<br/>
            <span style={{ color: 'var(--neon-green)' }}>sam8920341517@gmail.com</span>
          </p>
          <p>
            Rishi Yadav: 9205089291<br/>
            <span style={{ color: 'var(--neon-green)' }}>rishiry6789@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
