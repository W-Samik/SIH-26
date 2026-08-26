import React from 'react';
import '../styles/sections.css';
import pixelTrain from '../assets/pixel_train.jpg';

const TimelineSection = () => {
  const timelineEvents = [
    { date: 'Aug 28, 2026', title: 'Registrations Open', desc: 'Team registrations officially begin.' },
    { date: 'Sep 03, 2026', title: 'Registrations Close', desc: 'Last day to register and form your team.' },
    { date: 'TBD', title: 'Problem Reveal', desc: 'Official problem statements are announced.' },
    { date: 'TBD', title: 'Ideathon', desc: 'Brainstorm and submit your innovative ideas.' },
    { date: 'TBD', title: 'Results', desc: 'Shortlisted teams announced for the next round.' }
  ];

  return (
    <div id="timeline" className="timeline-section">
      <div className="tl-top-bar"></div>
      <div className="tl-middle">
        <div className="tl-middle-left">
           <h2>Timeline</h2>
           <div className="timeline-scroll-area">
              {timelineEvents.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="tl-date">{item.date}</div>
                  <div className="tl-node-wrapper">
                    <div className="tl-node"></div>
                    {index !== timelineEvents.length - 1 && <div className="tl-line"></div>}
                  </div>
                  <div className="tl-event">
                    <h3 style={{ margin: 0, color: 'var(--neon-green)', fontSize: '1rem' }}>{item.title}</h3>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#ccc', fontSize: '0.6rem', lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
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
