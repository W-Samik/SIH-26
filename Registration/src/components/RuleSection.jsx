import React from 'react';
import '../styles/sections.css';

const RuleSection = () => {
  return (
    <div id="rules" className="rule-section">
      <h2 className="rule-title">Rules /</h2>
      <div className="rule-grid">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div key={i} className="rule-card">
              <h3>Rule {i}</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default RuleSection;
