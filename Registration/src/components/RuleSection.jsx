import React from 'react';
import '../styles/sections.css';

const RuleSection = () => {
  const rules = [
    {
      title: 'College Policy',
      desc: 'All team members must belong to the same college. Inter-college teams are strictly prohibited.'
    },
    {
      title: 'Branch Diversity',
      desc: 'Students are strongly encouraged to form diverse teams by including members from different branches within their institute.'
    },
    {
      title: 'Team Composition',
      desc: 'Each team must consist of exactly six members and must include at least one female participant.'
    },
    {
      title: 'Inter-year Teams',
      desc: 'Inter-year teams are permitted and highly encouraged. Teams are especially urged to include first-year students to promote wider participation.'
    },
    {
      title: 'Code of Conduct',
      desc: 'All participants must maintain absolute integrity, fairness, and professionalism throughout the event.'
    }
  ];

  return (
    <div id="rules" className="rule-section">
      <h2 className="rule-title">Rules /</h2>
      <div className="rule-grid">
         {rules.map((rule, index) => (
           <div key={index} className="rule-card">
              <h3>{rule.title}</h3>
              <p>{rule.desc}</p>
           </div>
         ))}
      </div>
    </div>
  );
};

export default RuleSection;
