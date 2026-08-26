import React from 'react';
import '../styles/sections.css';
import pixelTrain from '../assets/pixel_train.jpg';

const TimelineSection = () => {
  return (
    <div id="timeline" className="timeline-section">
      <div className="tl-top-bar"></div>
      <div className="tl-middle">
        <div className="tl-middle-left">
           <h2>Timeline</h2>
           <div className="timeline-scroll-area">
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="tl-date">Date {item}</div>
                  <div className="tl-node-wrapper">
                    <div className="tl-node"></div>
                    {index !== 4 && <div className="tl-line"></div>}
                  </div>
                  <div className="tl-event">Event {item}</div>
                </div>
              ))}
           </div>
        </div>
        <div className="tl-middle-right">
           <div className="tl-image-box">
             <img src={pixelTrain} alt="Pixel Train" className="tl-img" />
           </div>
        </div>
      </div>
      <div className="tl-bottom-bar"></div>
    </div>
  );
};

export default TimelineSection;
