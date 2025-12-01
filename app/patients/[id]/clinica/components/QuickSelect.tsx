'use client';

import React, { useState, useEffect } from 'react';
import './styles/QuickSelect.css';

interface QuickSelectProps {
  selectedTeeth: number[];
  onApplyToTeeth: (teeth: number[], option: string) => void;
}

const QuickSelect: React.FC<QuickSelectProps> = ({ selectedTeeth, onApplyToTeeth }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(selectedTeeth.length > 0);
  }, [selectedTeeth]);

  const applyOption = (option: string) => {
    if (selectedTeeth.length > 0) {
      onApplyToTeeth(selectedTeeth, option);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="quick-select">
      <div className="quick-select-header">
        <h4>Aplicar a {selectedTeeth.length} dientes seleccionados</h4>
      </div>
      <div className="quick-select-options">
        <button 
          className="quick-option-button"
          onClick={() => applyOption('ausente')}
        >
          <span className="option-icon">🦷</span>
          Ausente
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('implante')}
        >
          <span className="option-icon">🔩</span>
          Implante
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('puente')}
        >
          <span className="option-icon">🌉</span>
          Puente
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('corona')}
        >
          <span className="option-icon">👑</span>
          Corona
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('endodoncia')}
        >
          <span className="option-icon">🔬</span>
          Endodoncia
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('caries')}
        >
          <span className="option-icon">🔴</span>
          Caries
        </button>
        <button 
          className="quick-option-button"
          onClick={() => applyOption('obturacion')}
        >
          <span className="option-icon">⬜</span>
          Obturación
        </button>
      </div>
    </div>
  );
};

export default QuickSelect;