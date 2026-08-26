import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActionButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="buttons-container">
      <button className="pixel-btn" onClick={() => navigate('/register')}>REGISTER</button>
    </div>
  );
};

export default ActionButtons;
