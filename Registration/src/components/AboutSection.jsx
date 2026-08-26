import React from 'react';
import sihLogo from '../assets/SIH_logo.png';

const AboutSection = () => {
  return (
    <div id="about" className="about-section">
      
      <div className="about-top-bar"></div>
      
      <div className="about-middle">
        
        <div className="about-middle-left">
          <div className="about-image-box">
            <img src={sihLogo} alt="SIH Logo" className="about-logo" />
            <p>SMART INDIA<br/>HACKATHON</p>
          </div>
        </div>

        <div className="about-middle-right">
          <h2>About</h2>
          <p>
            Welcome to the BPIBS Smart India Hackathon 2026 registration portal. 
            Prepare yourself to embark on an incredible coding journey where innovation 
            meets execution. Gather your team, brainstorm groundbreaking ideas, and 
            build solutions that will shape the future. 
            <br /><br />
            The pixel galaxy awaits your contribution. Are you ready to level up?
          </p>
        </div>

      </div>

      <div className="about-bottom-bar"></div>
      
    </div>
  );
};

export default AboutSection;
