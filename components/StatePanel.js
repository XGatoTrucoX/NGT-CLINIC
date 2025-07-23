import React, { useEffect } from 'react';
import '../styles/StatePanel.css';

const StatePanel = ({ selectedTooth, selectedTeeth, setSelectedTeeth, teethData, onUpdateTooth, onUpdateTeeth }) => {
  // Obtener el diente seleccionado
  const tooth = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;

  // Función para obtener el estado actual del diente
  const getCurrentState = () => {
    if (!tooth) return null;
    
    if (tooth.isAbsent) return 'ausente';
    if (tooth.isImplant) return 'implante';
    if (tooth.isPontic) return 'puente';
    if (tooth.hasCarilla) return 'corona';
    
    // Verificar condiciones
    if (tooth.conditions && tooth.conditions.length > 0) {
      const condition = tooth.conditions[0];
      return condition.type;
    }
    
    return 'normal';
  };

  // Función para aplicar un estado al diente seleccionado
  const applyState = (state) => {
    if (!selectedTooth) return;
    
    const newState = {
      isAbsent: state === 'ausente',
      isImplant: state === 'implante',
      isPontic: state === 'puente',
      hasCarilla: state === 'carilla', // Corregido: 'corona' a 'carilla'
      conditions: []
    };
    
    if (state === 'endodoncia' || state === 'caries' || state === 'obturacion' || state === 'fractura') {
      newState.conditions = [{ type: state }];
    }
    
    onUpdateTooth(selectedTooth, newState);
    
    // Mostrar mensaje de confirmación
    const stateName = state.charAt(0).toUpperCase() + state.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${stateName} aplicado al diente ${selectedTooth}` }
    }));
    
    // Forzar la recarga de la imagen del diente con la ruta correcta
    setTimeout(() => {
      // Seleccionar solo la imagen del diente seleccionado
      const toothContainer = document.querySelector(`.tooth-container[data-tooth-id="${selectedTooth}"]`);
      if (toothContainer) {
        const img = toothContainer.querySelector('img');
        if (img) {
          // Obtener la posición (buccal, lingual, incisal)
          const position = toothContainer.getAttribute('data-position') || 'buccal';
          
          // Determinar el ID del diente para la imagen (considerando el espejo)
          let imageToothId = selectedTooth;
          const isMirrored = toothContainer.getAttribute('data-mirrored') === 'true';
          
          // Si el diente está en el cuadrante superior derecho (21-28) o inferior derecho (31-38)
          if ((selectedTooth >= 21 && selectedTooth <= 28) || (selectedTooth >= 31 && selectedTooth <= 38)) {
            // Calcular el ID del diente espejo
            if (selectedTooth >= 21 && selectedTooth <= 28) {
              // Dientes superiores derechos (21-28) -> superiores izquierdos (11-18)
              imageToothId = selectedTooth - 10;
            } else if (selectedTooth >= 31 && selectedTooth <= 38) {
              // Dientes inferiores derechos (31-38) -> inferiores izquierdos (41-48)
              imageToothId = selectedTooth + 10;
            }
          }
          
          // Construir la nueva ruta de la imagen según el estado
          let newSrc = `/images/teeth/${position}/${position}.`;
          
          if (state === 'implante') {
            newSrc += `implant.${imageToothId}.png`;
          } else if (state === 'puente') {
            newSrc += `pontics.${imageToothId}.png`;
          } else if (state === 'desgaste') {
            newSrc += `dental.wear.${imageToothId}.png`;
          } else if (state === 'corona') {
            newSrc += `carilla.${imageToothId}.png`;
          } else if (state === 'ausente') {
            newSrc += `${imageToothId}.png`;
          } else {
            // Estado normal u otros estados
            newSrc += `tooth.${imageToothId}.png`;
          }
          
          // Añadir timestamp para evitar caché
          newSrc += `?t=${new Date().getTime()}`;
          
          console.log(`Actualizando imagen del diente ${selectedTooth} a estado ${state}. Nueva ruta:`, newSrc);
          img.src = newSrc;
          
          // Actualizar el atributo data-state del contenedor
          toothContainer.setAttribute('data-state', state === 'puente' ? 'pontic' : state);
        }
      }
      
      // También actualizar otras imágenes que puedan necesitar recarga
      const otherToothImages = document.querySelectorAll('.tooth-image');
      otherToothImages.forEach(img => {
        if (!img.parentElement.matches(`.tooth-container[data-tooth-id="${selectedTooth}"]`)) {
          const currentSrc = img.src;
          if (currentSrc.includes('?')) {
            img.src = currentSrc.split('?')[0] + '?t=' + new Date().getTime();
          } else {
            img.src = currentSrc + '?t=' + new Date().getTime();
          }
        }
      });
    }, 100);
  };

  // Renderizar botón de estado
  const renderStateButton = (state, label, icon = null) => {
    const isActive = getCurrentState() === state;
    return (
      <button 
        className={`state-button ${isActive ? 'active' : ''}`}
        onClick={() => applyState(state)}
      >
        {icon && <span className="state-icon">{icon}</span>}
        {label}
      </button>
    );
  };

  // Aplicar opción a todos los dientes seleccionados
  const applyToSelectedTeeth = (option) => {
    if (selectedTeeth.length === 0) return;
    
    // Aplicar el estado a todos los dientes seleccionados
    onUpdateTeeth(selectedTeeth, option);
    
    // Mostrar mensaje de confirmación
    const optionName = option.charAt(0).toUpperCase() + option.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${optionName} aplicado a ${selectedTeeth.length} dientes` }
    }));
  };
  
  // Escuchar eventos de selección de dientes
  useEffect(() => {
    const handleToothSelect = (event) => {
      const { toothId } = event.detail;
      // No necesitamos hacer nada aquí ya que selectedTooth se actualiza a través de props
      console.log('Diente seleccionado:', toothId);
    };
    
    const handleTeethSelectionChange = (event) => {
      const { selectedTeeth: newSelectedTeeth } = event.detail;
      console.log('Dientes seleccionados:', newSelectedTeeth);
      // Actualizar el estado local si es necesario
      if (JSON.stringify(newSelectedTeeth) !== JSON.stringify(selectedTeeth)) {
        setSelectedTeeth(newSelectedTeeth);
      }
    };
    
    document.addEventListener('toothSelect', handleToothSelect);
    document.addEventListener('teethSelectionChange', handleTeethSelectionChange);
    
    return () => {
      document.removeEventListener('toothSelect', handleToothSelect);
      document.removeEventListener('teethSelectionChange', handleTeethSelectionChange);
    };
  }, [selectedTeeth, setSelectedTeeth]);
  
  // Función para cerrar el panel y deseleccionar el diente
  const handleClose = () => {
    if (selectedTooth) {
      // Disparar evento para deseleccionar el diente
      document.dispatchEvent(new CustomEvent('toothDeselect'));
    } else if (selectedTeeth.length > 0) {
      setSelectedTeeth([]);
    }
  };
  
  // Renderizar opciones de selección rápida
  const renderQuickSelectOptions = () => {
    return (
      <div className="quick-select-section">
        <h4>Selección rápida</h4>
        <div className="quick-select-options">
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('ausente')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">🦷</span>
            <span className="option-label">Ausente</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('implante')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">🔩</span>
            <span className="option-label">Implante</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('puente')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">🌉</span>
            <span className="option-label">Puente</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('corona')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">👑</span>
            <span className="option-label">Corona</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('endodoncia')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">🔬</span>
            <span className="option-label">Endodoncia</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('caries')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">🔴</span>
            <span className="option-label">Caries</span>
          </button>
          <button 
            className="quick-select-button"
            onClick={() => applyToSelectedTeeth('obturacion')}
            disabled={selectedTeeth.length === 0}
          >
            <span className="option-icon">⬜</span>
            <span className="option-label">Obturación</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="state-panel">
      <div className="panel-header">
        <h3>
          {selectedTooth ? `Diente ${selectedTooth}` : 
           selectedTeeth.length > 0 ? `Selección múltiple (${selectedTeeth.length})` : 
           'Panel de estados'}
        </h3>
        {(selectedTooth || selectedTeeth.length > 0) && (
          <button className="close-button" onClick={handleClose} title="Cerrar selección">
            ×
          </button>
        )}
      </div>
      
      {selectedTooth ? (
        <>
          <div className="state-buttons">
            {renderStateButton('normal', 'Normal')}
            {renderStateButton('ausente', 'Ausente', '🦷')}
            {renderStateButton('implante', 'Implante', '🔩')}
            {renderStateButton('puente', 'Puente', '🌉')}
            {renderStateButton('corona', 'Corona', '👑')}
            {renderStateButton('endodoncia', 'Endodoncia', '🔬')}
            {renderStateButton('caries', 'Caries', '🔴')}
            {renderStateButton('obturacion', 'Obturación', '⬜')}
            {renderStateButton('fractura', 'Fractura', '⚡')}
          </div>
        </>
      ) : selectedTeeth.length > 0 ? (
        <>
          <div className="teeth-selection-info">
            <p>Dientes seleccionados:</p>
            <div className="selected-teeth-list">
              {selectedTeeth.map(toothId => (
                <span key={toothId} className="selected-tooth-chip">{toothId}</span>
              ))}
            </div>
          </div>
          {renderQuickSelectOptions()}
          <div className="action-buttons">
            <button 
              className="clear-selection-button"
              onClick={() => setSelectedTeeth([])}
            >
              Limpiar selección
            </button>
          </div>
        </>
      ) : (
        <p>Seleccione un diente o varios dientes para ver sus opciones.</p>
      )}
    </div>
  );
};

export default StatePanel;
