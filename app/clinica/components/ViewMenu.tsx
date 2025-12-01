'use client';

import React from 'react';
import './styles/ViewMenu.css';

const ViewMenu: React.FC = () => {
  const changeView = (view: string) => {
    console.log(`Cambiando a vista: ${view}`);
    
    setTimeout(() => {
      const event = new CustomEvent('changeView', { 
        detail: { view },
        bubbles: true,
        cancelable: true
      });
      document.dispatchEvent(event);
      
      console.log(`Evento changeView emitido con vista: ${view}`);
    }, 10);
  };

  return (
    <div className="view-menu">
      <button 
        className="view-button"
        onClick={() => changeView('upper')}
        title="Mandíbula Superior"
      >
        <div className="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 5 5 5 9v6c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z"/>
          </svg>
        </div>
      </button>
      <button 
        className="view-button"
        onClick={() => changeView('full')}
        title="Boca Completa"
      >
        <div className="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8 2 5 5 5 9v6c0 4 3 7 7 7s7-3 7-7V9c0-4-3-7-7-7z"/>
            <path d="M12 22C8 22 5 19 5 15V9c0-4 3-7 7-7s7 3 7 7v6c0 4-3 7-7 7z"/>
          </svg>
        </div>
      </button>
      <button 
        className="view-button"
        onClick={() => changeView('lower')}
        title="Mandíbula Inferior"
      >
        <div className="icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22C8 22 5 19 5 15V9c0-4 3-7 7-7s7 3 7 7v6c0 4-3 7-7 7z"/>
          </svg>
        </div>
      </button>
    </div>
  );
};

export default ViewMenu;