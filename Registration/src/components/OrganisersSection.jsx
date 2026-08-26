import React from 'react';
import '../styles/sections.css';
import desuLogo from '../assets/DESU_logo.png';
import nexusLogo from '../assets/NEXUS_logo.png';
import org1 from '../assets/org1.png';
import org2 from '../assets/org2.png';
import org3 from '../assets/org3.webp';
import pixelSky from '../assets/pixel_sky.jpg';

const OrganisersSection = () => {
  const rotatingLogos = [org1, org2, org3, org1, org2, org3];

  return (
    <div id="organisers" className="organisers-section" style={{ backgroundImage: `url(${pixelSky})`, backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated' }}>
      <div className="org-top-bar"></div>
      <div className="org-middle">
        <div className="org-static-row">
          <div className="org-placeholder-img">
            <img src={desuLogo} alt="DESU" className="org-img" />
          </div>
          <div className="org-cross">X</div>
          <div className="org-placeholder-img" style={{ flexDirection: 'column' }}>
            <img src={nexusLogo} alt="NEXUS" className="org-img nexus-img" />
            <p className="nexus-text">NEXUS AIML SOCIETY</p>
          </div>
        </div>
        <div className="org-marquee-container">
          <div className="org-marquee">
            {/* Render twice for seamless looping */}
            <div className="org-marquee-content">
              {rotatingLogos.map((logo, i) => (
                <div key={`a-${i}`} className="org-logo-box">
                  <img src={logo} alt={`Organiser ${i}`} className={`org-img ${logo === org1 ? 'org1-fix' : ''}`} />
                </div>
              ))}
            </div>
            <div className="org-marquee-content">
              {rotatingLogos.map((logo, i) => (
                <div key={`b-${i}`} className="org-logo-box">
                  <img src={logo} alt={`Organiser ${i}`} className={`org-img ${logo === org1 ? 'org1-fix' : ''}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="org-bottom-bar"></div>
    </div>
  );
};

export default OrganisersSection;
