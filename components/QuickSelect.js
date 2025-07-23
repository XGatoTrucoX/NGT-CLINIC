import React, { useState, useEffect } from 'react';
import '../styles/QuickSelect.css';

const QuickSelect = ({ selectedTeeth, setSelectedTeeth, teethData, onUpdateTeeth }) => {
  // Estado para la opción de selección rápida activa
  const [activeOption, setActiveOption] = useState(null);
  
  // Opciones para la selección rápida
  const quickSelectOptions = [
    { id: 'caries', label: 'Para ser Extraido' },
    { id: 'ausente', label: 'Faltante' },
    { id: 'corona', label: 'Carrilla dental' },
    { id: 'puente', label: 'Pónticos' }, // Cambiado de 'implante' a 'puente'
    { id: 'implante', label: 'Implantes' }, // Nueva opción agregada
    { id: 'endodoncia', label: 'Corona' },
    { id: 'fractura', label: 'Prueba de endodoncia' },
    { id: 'obturacion', label: 'Obturación' }
  ];

  // Escuchar eventos de selección de dientes
  useEffect(() => {
    const handleToothSelect = (event) => {
      const toothId = event.detail.toothId;
      
      // Agregar o quitar diente de la selección
      setSelectedTeeth(prev => {
        if (prev.includes(toothId)) {
          return prev.filter(id => id !== toothId);
        } else {
          return [...prev, toothId];
        }
      });
    };
    
    document.addEventListener('toothSelect', handleToothSelect);
    
    return () => {
      document.removeEventListener('toothSelect', handleToothSelect);
    };
  }, [setSelectedTeeth]);

  // Función para manejar la selección de una opción
  const handleOptionSelect = (optionId) => {
    console.log(`🎯 Opción seleccionada: ${optionId}`);
    console.log(`📋 Dientes seleccionados:`, selectedTeeth);
    
    if (selectedTeeth.length === 0) {
      alert('Por favor, selecciona al menos un diente antes de aplicar una opción.');
      return;
    }
    
    // Actualizar el estado activo
    setActiveOption(optionId);
    
    // Aplicar la opción a los dientes seleccionados usando la función proporcionada por el padre
    onUpdateTeeth(selectedTeeth, optionId);
    
    // Mostrar mensaje de confirmación en la interfaz en lugar de un alert
    const confirmationMessage = document.createElement('div');
    confirmationMessage.className = 'confirmation-message';
    confirmationMessage.textContent = `Se ha aplicado "${optionId}" a ${selectedTeeth.length} diente(s) seleccionado(s).`;
    document.body.appendChild(confirmationMessage);
    
    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
      confirmationMessage.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(confirmationMessage);
      }, 500);
    }, 2500);
  };

  // Función para agrupar los dientes por cuadrante
  const groupTeethByQuadrant = () => {
    const quadrants = {
      'Superior Derecho': [],
      'Superior Izquierdo': [],
      'Inferior Izquierdo': [],
      'Inferior Derecho': []
    };
    
    selectedTeeth.forEach(toothId => {
      const id = parseInt(toothId);
      if (id >= 11 && id <= 18) {
        quadrants['Superior Derecho'].push(id);
      } else if (id >= 21 && id <= 28) {
        quadrants['Superior Izquierdo'].push(id);
      } else if (id >= 31 && id <= 38) {
        quadrants['Inferior Izquierdo'].push(id);
      } else if (id >= 41 && id <= 48) {
        quadrants['Inferior Derecho'].push(id);
      }
    });
    
    return quadrants;
  };

  return (
    <div className="quick-select-container">
      <div className="selected-teeth-info">
        {selectedTeeth.length > 0 ? (
          <div className="teeth-selection-display">
            <h3>Dientes seleccionados: <span className="teeth-count">{selectedTeeth.length}</span></h3>
            <div className="teeth-quadrants">
              {Object.entries(groupTeethByQuadrant()).map(([quadrant, teeth]) => {
                if (teeth.length === 0) return null;
                return (
                  <div key={quadrant} className="quadrant">
                    <span className="quadrant-name">{quadrant}:</span>
                    <div className="teeth-chips">
                      {teeth.sort((a, b) => a - b).map(tooth => (
                        <span key={tooth} className="tooth-chip">{tooth}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="no-selection">{/* Se eliminó el texto */}</p>
        )}
      </div>
      <div className="quick-select-options">
        {quickSelectOptions.map(option => (
          <button 
            key={option.id}
            className={`quick-select-button ${activeOption === option.id ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(option.id)}
            disabled={selectedTeeth.length === 0}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSelect;