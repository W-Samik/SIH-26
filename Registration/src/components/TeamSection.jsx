import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/sections.css';
import pixelNasa from '../assets/pixel_nasa.jpg';

const TeamSection = () => {
  const navigate = useNavigate();

  return (
    <div id="team" className="team-section" style={{ backgroundImage: `url(${pixelNasa})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}>
      <div className="team-top-bar"></div>
      <div className="team-middle">
        <h2 className="team-title">Take part</h2>
        <div className="team-buttons" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button className="team-btn register-btn" onClick={() => navigate('/register')}>[ Register ]</button>
          <a 
            href="https://chat.whatsapp.com/LmPTj97VgHdFSYxcnhY7nZ?s=qt&p=a&ilr=4" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="team-btn" 
            style={{ fontSize: '0.8rem', padding: '0.8rem 1rem', textDecoration: 'none', backgroundColor: 'transparent', color: 'var(--neon-green)', border: '2px dashed var(--neon-green)', textAlign: 'center', width: '300px', maxWidth: '90%' }}
          >
            [ JOIN WHATSAPP ]
          </a>
        </div>
      </div>
      <div className="team-bottom-bar"></div>
    </div>
  );
};

export default TeamSection;
