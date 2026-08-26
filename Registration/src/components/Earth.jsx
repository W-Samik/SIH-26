import React from 'react';
import earthImg from '../assets/pixel_earth.png';

const Earth = () => {
  return (
    <div className="earth-container">
      <img src={earthImg} alt="Pixel Earth" className="earth-image" />
    </div>
  );
};

export default Earth;
