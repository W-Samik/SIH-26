import React from 'react';
import { Info, FileText, Users, Clock, Star } from 'lucide-react';

const Navbar = () => {
  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="nav-pill">
      <div className="nav-item" onClick={() => handleScroll('about')}>
        <Info size={24} />
        <span>About</span>
      </div>
      <div className="nav-item" onClick={() => handleScroll('organisers')}>
        <Star size={24} />
        <span>Organisers</span>
      </div>
      <div className="nav-item" onClick={() => handleScroll('timeline')}>
        <Clock size={24} />
        <span>Timeline</span>
      </div>
      <div className="nav-item" onClick={() => handleScroll('rules')}>
        <FileText size={24} />
        <span>Rules</span>
      </div>
      <div className="nav-item" onClick={() => handleScroll('team')}>
        <Users size={24} />
        <span>Team</span>
      </div>
    </div>
  );
};

export default Navbar;
