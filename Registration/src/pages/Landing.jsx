import React from 'react';
import Background from '../components/Background';
import Header from '../components/Header';
import Earth from '../components/Earth';
import Navbar from '../components/Navbar';
import ActionButtons from '../components/ActionButtons';
import AboutSection from '../components/AboutSection';
import OrganisersSection from '../components/OrganisersSection';
import TimelineSection from '../components/TimelineSection';
import RuleSection from '../components/RuleSection';
import TeamSection from '../components/TeamSection';

const Landing = () => {
  return (
    <div className="app-container">
      
      {/* Hero Container for 100vh constraint */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* TOP SECTION: Space Background + Earth Semi-Circle */}
        <div className="top-section">
          <Background />
          <Header />
          <Earth />
        </div>

        {/* BOTTOM SECTION: Solid Color + Navbar + Buttons */}
        <div className="bottom-section">
          <Navbar />
          <ActionButtons />
        </div>
      </div>

      {/* ADDITIONAL SECTIONS */}
      <AboutSection />
      <OrganisersSection />
      <TimelineSection />
      <RuleSection />
      <TeamSection />

    </div>
  );
};

export default Landing;
