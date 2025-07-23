import React from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeMode, setActiveMode }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <button 
          className={`sidebar-button ${activeMode === 'endo' ? 'active' : ''}`}
          onClick={() => setActiveMode('endo')}
        >
          <div className="icon">
            <span className="icon-endo"></span>
          </div>
          <span>Endo</span>
        </button>
        <button 
          className={`sidebar-button ${activeMode === 'periodoncia' ? 'active' : ''}`}
          onClick={() => setActiveMode('periodoncia')}
        >
          <div className="icon">
            <span className="icon-periodoncia"></span>
          </div>
          <span>Periodoncia</span>
        </button>
        <button 
          className={`sidebar-button ${activeMode === 'dental' ? 'active' : ''}`}
          onClick={() => setActiveMode('dental')}
        >
          <div className="icon">
            <span className="icon-dental"></span>
          </div>
          <span>Dental</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;