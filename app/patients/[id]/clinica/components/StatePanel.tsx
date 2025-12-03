'use client';

import React, { useEffect, useState } from 'react';
import './styles/StatePanel.css';
import ToothConditionModal from './ToothConditionModal';

interface StatePanelProps {
  selectedTooth: number | null;
  selectedTeeth: number[];
  setSelectedTeeth: (teeth: number[]) => void;
  teethData: any[];
  onUpdateTooth: (toothId: number, newState: any) => void;
  onUpdateTeeth: (teethIds: number[], option: string) => void;
  activeMode?: string;
}

const StatePanel: React.FC<StatePanelProps> = ({ 
  selectedTooth, 
  selectedTeeth, 
  setSelectedTeeth, 
  teethData, 
  onUpdateTooth, 
  onUpdateTeeth,
  activeMode = 'quickselect'
}) => {
  const tooth = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [conditionType, setConditionType] = useState<'caries' | 'obturacion'>('caries');
  
  console.log('📊 StatePanel render - showConditionModal:', showConditionModal, 'selectedTooth:', selectedTooth, 'selectedTeeth:', selectedTeeth, 'activeMode:', activeMode);
  
  // Si hay dientes seleccionados pero no selectedTooth, usar el primero para el modal
  const effectiveSelectedTooth = selectedTooth || (selectedTeeth.length === 1 ? selectedTeeth[0] : null);

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
    console.log('🔍 applyState llamado con:', state);
    if (!effectiveSelectedTooth) {
      console.log('❌ No hay diente seleccionado');
      return;
    }
    
    if (state === 'caries' || state === 'obturacion') {
      console.log('🦷 Detectado caries/obturación, abriendo modal');
      setConditionType(state as 'caries' | 'obturacion');
      setShowConditionModal(true);
      console.log('📊 Estado modal:', { conditionType: state, showModal: true });
      return;
    }
    
    console.log('⚙️ Aplicando estado normal:', state);
    
    const newState = {
      isAbsent: state === 'ausente',
      isImplant: state === 'implante',
      isPontic: state === 'puente',
      hasCarilla: state === 'carilla',
      conditions: [] as any[]
    };
    
    if (state === 'endodoncia' || state === 'fractura') {
      newState.conditions = [{ type: state }];
    }
    
    onUpdateTooth(effectiveSelectedTooth!, newState);
    
    const stateName = state.charAt(0).toUpperCase() + state.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${stateName} aplicado al diente ${effectiveSelectedTooth}` }
    }));
    
    setTimeout(() => {
      const toothContainer = document.querySelector(`.tooth-container[data-tooth-id="${effectiveSelectedTooth}"]`);
      if (toothContainer) {
        const img = toothContainer.querySelector('img');
        if (img) {
          const position = toothContainer.getAttribute('data-position') || 'buccal';
          
          let imageToothId = effectiveSelectedTooth;
          
          if ((effectiveSelectedTooth >= 21 && effectiveSelectedTooth <= 28) || (effectiveSelectedTooth >= 31 && effectiveSelectedTooth <= 38)) {
            if (effectiveSelectedTooth >= 21 && effectiveSelectedTooth <= 28) {
              imageToothId = effectiveSelectedTooth - 10;
            } else if (effectiveSelectedTooth >= 31 && effectiveSelectedTooth <= 38) {
              imageToothId = effectiveSelectedTooth + 10;
            }
          }
          
          let newSrc = `/images/teeth/${position}/${position}.`;
          
          if (state === 'implante') {
            newSrc += position === 'incisal' ? `tooth.${imageToothId}.png` : `implant.${imageToothId}.png`;
          } else if (state === 'puente') {
            newSrc += position === 'incisal' ? `tooth.${imageToothId}.png` : `pontics.${imageToothId}.png`;
          } else if (state === 'desgaste') {
            newSrc += `dental.wear.${imageToothId}.png`;
          } else if (state === 'corona') {
            newSrc += `tooth.${imageToothId}.png`;
          } else if (state === 'ausente') {
            newSrc += `${imageToothId}.png`;
          } else {
            newSrc += `tooth.${imageToothId}.png`;
          }
          
          newSrc += `?t=${new Date().getTime()}`;
          
          console.log(`Actualizando imagen del diente ${effectiveSelectedTooth} a estado ${state}. Nueva ruta:`, newSrc);
          
          // Manejar errores de carga de imagen
          (img as HTMLImageElement).onerror = () => {
            console.warn(`Error cargando imagen: ${newSrc}`);
            // Fallback a imagen normal del diente
            const fallbackSrc = `/images/teeth/${position}/${position}.tooth.${imageToothId}.png?t=${new Date().getTime()}`;
            (img as HTMLImageElement).src = fallbackSrc;
          };
          
          (img as HTMLImageElement).src = newSrc;
          
          toothContainer.setAttribute('data-state', state === 'puente' ? 'pontic' : state);
        }
      }
      
      const otherToothImages = document.querySelectorAll('.tooth-image');
      otherToothImages.forEach(img => {
        const container = (img as HTMLElement).parentElement;
        if (container && !container.matches(`.tooth-container[data-tooth-id="${effectiveSelectedTooth}"]`)) {
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
        onClick={() => {
          console.log('🔘 Botón presionado:', state, 'selectedTooth:', selectedTooth);
          applyState(state);
        }}
      >
        {icon && <span className="state-icon">{icon}</span>}
        {label}
      </button>
    );
  };

  const applyToSelectedTeeth = (option: string) => {
    if (selectedTeeth.length === 0) return;
    
    if (option === 'caries' || option === 'obturacion') {
      // Para selección múltiple, aplicar sin modal
      onUpdateTeeth(selectedTeeth, option);
    } else {
      onUpdateTeeth(selectedTeeth, option);
    }
    
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
    if (effectiveSelectedTooth) {
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
        {(effectiveSelectedTooth || selectedTeeth.length > 0) && (
          <button className="close-button" onClick={handleClose} title="Cerrar selección">
            ×
          </button>
        )}
      </div>
      
      {effectiveSelectedTooth ? (
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
      
      <ToothConditionModal
        isOpen={showConditionModal}
        onClose={() => setShowConditionModal(false)}
        toothId={effectiveSelectedTooth || 0}
        conditionType={conditionType}
        onSave={(positions) => {
          const tooth = teethData.find(t => t.id === effectiveSelectedTooth);
          const existingConditions = tooth?.conditions || [];
          
          // Filtrar condiciones existentes del mismo tipo
          const filteredConditions = existingConditions.filter((c: any) => c.type !== conditionType);
          
          const newState = {
            isAbsent: false,
            isImplant: false,
            isPontic: false,
            hasCarilla: false,
            conditions: [...filteredConditions, { type: conditionType, positions }]
          };
          onUpdateTooth(effectiveSelectedTooth!, newState);
          
          const stateName = conditionType.charAt(0).toUpperCase() + conditionType.slice(1);
          document.dispatchEvent(new CustomEvent('showConfirmation', {
            detail: { message: `${stateName} aplicada al diente ${effectiveSelectedTooth}` }
          }));
        }}
      />
    </div>
  );
};

export default StatePanel;