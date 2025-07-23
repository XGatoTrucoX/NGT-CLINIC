import React from 'react';
import '../styles/TabsNavigation.css';

const TabsNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'general', label: 'General', icon: 'description' },
    { id: 'quickselect', label: 'Selección Rápida', icon: 'grid_view' },
    { id: 'perio', label: 'Periodontal', icon: 'biotech' },
    { id: 'endo', label: 'Endodoncia', icon: 'science' }
  ];

  return (
    <div className="tabs-navigation">
      <div className="tabs-container">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon material-icons">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="examination-label">
          <span className="label-icon material-icons">medical_services</span>
          EXAMEN PERIODONTAL
        </div>
      </div>
    </div>
  );
};

export default TabsNavigation;