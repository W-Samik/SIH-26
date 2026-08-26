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
        <div className="team-buttons">
          <button className="team-btn register-btn" onClick={() => navigate('/register')}>[ Register ]</button>
        </div>
      </div>
      <div className="team-bottom-bar"></div>
    </div>
  );
};

export default TeamSection;
