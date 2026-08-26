import React from 'react';

const Header = () => {
  return (
    <div className="title-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'var(--font-pixel)', fontSize: '0.6rem', marginBottom: '1rem', textAlign: 'center', lineHeight: '1.5' }}>
        BPDSEU INVITES YOU TO
      </p>
      <div className="title-box" style={{ textAlign: 'center' }}>
        <h1>SMART INDIA HACKATHON</h1>
        <h1 style={{ marginTop: '0.5rem' }}>Internal Round</h1>
      </div>
      <div className="year-box">
        <h2>2026</h2>
      </div>
      <p style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-pixel)', fontSize: '0.8rem', marginTop: '1.5rem', textAlign: 'center', textShadow: '0 0 5px var(--neon-green)', lineHeight: '1.5' }}>
        INNOVATE, COLLABORATE, CREATE
      </p>
    </div>
  );
};

export default Header;
