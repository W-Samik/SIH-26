import React from 'react';
import '../styles/sections.css';

const ContactSection = () => {
  return (
    <div id="contact" className="contact-section">
      <h2 className="contact-title">Contact Us</h2>
      
      <div className="contact-grid">
        <div className="contact-card">
          <h3>Ankit Ghosh</h3>
          <p>9354031843</p>
          <div className="contact-email">gankitsysdev@gmail.com</div>
        </div>
        
        <div className="contact-card">
          <h3>Rishi Yadav</h3>
          <p>9205089291</p>
          <div className="contact-email">rishiry6789@gmail.com</div>
        </div>

        <div className="contact-card">
          <h3>Samik</h3>
          <p>8920341517</p>
          <div className="contact-email">sam8920341517@gmail.com</div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
