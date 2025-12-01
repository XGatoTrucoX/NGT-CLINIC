'use client';

import React, { useEffect } from 'react';
import './styles/StatePanel.css';

interface StatePanelProps {
  selectedTooth: number | null;
  selectedTeeth: number[];
  setSelectedTeeth: (teeth: number[]) => void;
  teethData: any[];
  onUpdateTooth: (toothId: number, newState: any) => void;
  onUpdateTeeth: (teethIds: number[], option: string) => void;
}

const StatePanel: React.FC<StatePanelProps> = ({ 
  selectedTooth, 
  selectedTeeth, 
  setSelectedTeeth, 
  teethData, 
  onUpdateTooth, 
  onUpdateTeeth 
}) => {
  const tooth = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;

  const getCurrentState = () => {
    if (!tooth) return null;
    
    if (tooth.isAbsent) return 'ausente';
    if (tooth.isImplant) return 'implante';
    if (tooth.isPontic) return 'puente';
    if (tooth.hasCarilla) return 'corona';
    
    if (tooth.conditions && tooth.conditions.length > 0) {
      const condition = tooth.conditions[0];
      return condition.type;
    }
    
    return 'normal';
  };

  const applyState = (state: string) => {
    if (!selectedTooth) return;
    
    const newState = {
      isAbsent: state === 'ausente',
      isImplant: state === 'implante',
      isPontic: state === 'puente',
      hasCarilla: state === 'carilla',
      conditions: [] as any[]
    };
    
    if (state === 'endodoncia' || state === 'caries' || state === 'obturacion' || state === 'fractura') {
      newState.conditions = [{ type: state }];
    }
    
    onUpdateTooth(selectedTooth, newState);
    
    const stateName = state.charAt(0).toUpperCase() + state.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${stateName} aplicado al diente ${selectedTooth}` }
    }));
    
    setTimeout(() => {
      const toothContainer = document.querySelector(`.tooth-container[data-tooth-id="${selectedTooth}"]`);
      if (toothContainer) {
        const img = toothContainer.querySelector('img');
        if (img) {
          const position = toothContainer.getAttribute('data-position') || 'buccal';
          
          let imageToothId = selectedTooth;
          
          if ((selectedTooth >= 21 && selectedTooth <= 28) || (selectedTooth >= 31 && selectedTooth <= 38)) {
            if (selectedTooth >= 21 && selectedTooth <= 28) {
              imageToothId = selectedTooth - 10;
            } else if (selectedTooth >= 31 && selectedTooth <= 38) {
              imageToothId = selectedTooth + 10;
            }
          }
          
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
            newSrc += `tooth.${imageToothId}.png`;
          }
          
          newSrc += `?t=${new Date().getTime()}`;
          
          console.log(`Actualizando imagen del diente ${selectedTooth} a estado ${state}. Nueva ruta:`, newSrc);
          (img as HTMLImageElement).src = newSrc;
          
          toothContainer.setAttribute('data-state', state === 'puente' ? 'pontic' : state);
        }
      }
      
      const otherToothImages = document.querySelectorAll('.tooth-image');
      otherToothImages.forEach(img => {
        const container = (img as HTMLElement).parentElement;
        if (container && !container.matches(`.tooth-container[data-tooth-id="${selectedTooth}"]`)) {
          const currentSrc = (img as HTMLImageElement).src;
          if (currentSrc.includes('?')) {
            (img as HTMLImageElement).src = currentSrc.split('?')[0] + '?t=' + new Date().getTime();
          } else {
            (img as HTMLImageElement).src = currentSrc + '?t=' + new Date().getTime();
          }
        }
      });
    }, 100);
  };

  const renderStateButton = (state: string, label: string, icon: string | null = null) => {
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

  const applyToSelectedTeeth = (option: string) => {
    if (selectedTeeth.length === 0) return;
    
    onUpdateTeeth(selectedTeeth, option);
    
    const optionName = option.charAt(0).toUpperCase() + option.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${optionName} aplicado a ${selectedTeeth.length} dientes` }
    }));
  };
  
  useEffect(() => {
    const handleToothSelect = (event: any) => {
      const { toothId } = event.detail;
      console.log('Diente seleccionado:', toothId);
    };
    
    const handleTeethSelectionChange = (event: any) => {
      const { selectedTeeth: newSelectedTeeth } = event.detail;
      console.log('Dientes seleccionados:', newSelectedTeeth);
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
  
  const handleClose = () => {
    if (selectedTooth) {
      document.dispatchEvent(new CustomEvent('toothDeselect'));
    } else if (selectedTeeth.length > 0) {
      setSelectedTeeth([]);
    }
  };
  
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