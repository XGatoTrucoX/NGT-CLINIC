import React, { useEffect, useState } from 'react';
import '../styles/ToothSideView.css';

const ToothSideView = ({ selectedTooth, onSelectTooth }) => {
  // Todos los dientes posibles
  const allTeeth = [
    // Cuadrante superior derecho
    18, 17, 16, 15, 14, 13, 12, 11,
    // Cuadrante superior izquierdo
    21, 22, 23, 24, 25, 26, 27, 28,
    // Cuadrante inferior izquierdo
    31, 32, 33, 34, 35, 36, 37, 38,
    // Cuadrante inferior derecho
    41, 42, 43, 44, 45, 46, 47, 48
  ];

  // Determinar si el diente es superior o inferior
  const isUpperTooth = parseInt(selectedTooth) < 30;
  
  // Función para manejar la selección de un diente
  const handleToothSelect = (toothId) => {
    if (onSelectTooth) {
      // Convertir a string y disparar el evento
      const toothIdStr = toothId.toString();
      onSelectTooth(toothIdStr);
      
      // También disparar el evento de selección de diente para que otros componentes puedan reaccionar
      document.dispatchEvent(new CustomEvent('toothSelect', {
        detail: { toothId: toothIdStr }
      }));
    }
  };

  return (
    <div className="tooth-side-view-container">
      {/* Menú lateral con números de dientes */}
      <div className="tooth-side-menu">
        {allTeeth.map(toothId => (
          <div 
            key={toothId} 
            className={`tooth-menu-item ${parseInt(selectedTooth) === toothId ? 'active' : ''}`}
            onClick={() => handleToothSelect(toothId)}
          >
            {toothId}
          </div>
        ))}
      </div>
      
      {/* Vista principal del diente */}
      <div className="tooth-side-view">
        <div className="tooth-group">
          <div className="tooth-side-view-header">
            <div className="tooth-number">{selectedTooth}</div>
            <div className="selected-indicator">Seleccionado</div>
          </div>
          
          <div className="tooth-images-vertical">
            {/* Vista bucal (superior) */}
            <div className="tooth-side-image-wrapper">
              <img 
                src={`/images/teeth/buccal/buccal.tooth.${selectedTooth}.png`} 
                alt={`Diente ${selectedTooth} - Vista Bucal`} 
                className="tooth-side-image"
              />
            </div>
            
            {/* Vista incisal (medio) */}
            <div className="tooth-side-image-wrapper">
              <img 
                src={`/images/teeth/incisal/incisal.tooth.${selectedTooth}.png`} 
                alt={`Diente ${selectedTooth} - Vista Incisal`} 
                className="tooth-side-image"
              />
            </div>
            
            {/* Vista lingual (inferior) */}
            <div className="tooth-side-image-wrapper">
              <img 
                src={`/images/teeth/lingual/lingual.tooth.${selectedTooth}.png`} 
                alt={`Diente ${selectedTooth} - Vista Lingual`} 
                className="tooth-side-image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToothSideView;
