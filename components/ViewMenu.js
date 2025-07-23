import React from 'react';
import '../styles/ViewMenu.css';

const ViewMenu = () => {
  // Función para cambiar la vista del odontograma
  const changeView = (view) => {
    console.log(`Cambiando a vista: ${view}`);
    
    // Forzar un retraso mínimo para asegurar que el evento se procese correctamente
    setTimeout(() => {
      // Emitir un evento personalizado para que Odontograma.js lo capture
      const event = new CustomEvent('changeView', { 
        detail: { view },
        bubbles: true,  // Permitir que el evento burbujee
        cancelable: true  // Permitir que el evento sea cancelable
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