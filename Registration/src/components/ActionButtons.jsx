import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';

const ActionButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="buttons-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <button className="pixel-btn primary-btn" onClick={() => navigate('/register')}>[ REGISTER ]</button>
      <a 
        href="https://chat.whatsapp.com/LmPTj97VgHdFSYxcnhY7nZ?s=qt&p=a&ilr=4" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="pixel-btn" 
        style={{ fontSize: '0.6rem', padding: '0.6rem 1rem', textDecoration: 'none', backgroundColor: 'transparent', color: 'var(--neon-green)', borderColor: 'var(--neon-green)' }}
      >
        [ JOIN WHATSAPP ]
      </a>
    </div>
  );
};

export default ActionButtons;
