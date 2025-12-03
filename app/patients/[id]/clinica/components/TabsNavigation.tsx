'use client';

import React from 'react';
import './styles/TabsNavigation.css';
import './styles/MaterialIcons.css';

interface TabsNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsNavigation: React.FC<TabsNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'quickselect', label: 'Selección Rápida' },
    { id: 'perio', label: 'Periodontal' },
    { id: 'endo', label: 'Endodoncia' }
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