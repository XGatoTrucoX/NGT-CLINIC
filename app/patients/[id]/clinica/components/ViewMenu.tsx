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
          <img src="/images/icons/upper-teeth.svg" alt="Mandíbula Superior" width="24" height="24" />
        </div>
      </button>
      <button 
        className="view-button"
        onClick={() => changeView('full')}
        title="Boca Completa"
      >
        <div className="icon">
          <img src="/images/icons/full-mouth.svg" alt="Boca Completa" width="24" height="24" />
        </div>
      </button>
      <button 
        className="view-button"
        onClick={() => changeView('lower')}
        title="Mandíbula Inferior"
      >
        <div className="icon">
          <img src="/images/icons/lower-teeth.svg" alt="Mandíbula Inferior" width="24" height="24" />
        </div>
      </button>
    </div>
  );
};

export default ViewMenu;