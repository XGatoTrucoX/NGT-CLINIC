'use client';

import React, { useState } from 'react';
import './styles/ToothConditionModal.css';

interface ToothConditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  toothId: number;
  conditionType: 'caries' | 'obturacion';
  onSave: (positions: { view: string; x: number; y: number }[]) => void;
}

const ToothConditionModal: React.FC<ToothConditionModalProps> = ({
  isOpen,
  onClose,
  toothId,
  conditionType,
  onSave
}) => {
  const [positions, setPositions] = useState<{ view: string; x: number; y: number }[]>([]);

  console.log('📺 Modal render - isOpen:', isOpen, 'toothId:', toothId, 'conditionType:', conditionType);

  if (!isOpen) {
    console.log('❌ Modal cerrado, no renderizando');
    return null;
  }
  
  console.log('✅ Modal abierto, renderizando...');

  const views = ['buccal', 'lingual', 'incisal'];
  const color = conditionType === 'caries' ? '#000000' : '#00ff00';

  const handleImageClick = (view: string, event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    setPositions(prev => [...prev, { view, x, y }]);
  };

  const removePosition = (index: number) => {
    setPositions(prev => prev.filter((_, i) => i !== index));
  };

  const getImageToothId = () => {
    if ((toothId >= 21 && toothId <= 28) || (toothId >= 31 && toothId <= 38)) {
      if (toothId >= 21 && toothId <= 28) {
        return toothId - 10;
      } else if (toothId >= 31 && toothId <= 38) {
        return toothId + 10;
      }
    }
    return toothId;
  };

  const imageToothId = getImageToothId();

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Marcar {conditionType === 'caries' ? 'Caries' : 'Obturación'} - Diente {toothId}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="tooth-views">
          {views.map(view => (
            <div key={view} className="tooth-view-section">
              <h4>{view.charAt(0).toUpperCase() + view.slice(1)}</h4>
              <div 
                className="tooth-image-container"
                onClick={(e) => handleImageClick(view, e)}
              >
                <img 
                  src={`/images/teeth/${view}/${view}.tooth.${imageToothId}.png`}
                  alt={`${view} view`}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `/images/teeth/${view}/${view}.${imageToothId}.png`;
                  }}
                />
                {positions
                  .filter(pos => pos.view === view)
                  .map((pos, index) => (
                    <div
                      key={index}
                      className="condition-marker"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        backgroundColor: color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removePosition(positions.findIndex(p => p === pos));
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button 
            className="clear-all-btn" 
            onClick={() => setPositions([])}
          >
            Limpiar Todo
          </button>
          <div className="action-buttons">
            <button className="cancel-btn" onClick={onClose}>Cancelar</button>
            <button 
              className="save-btn" 
              onClick={() => {
                onSave(positions);
                onClose();
              }}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToothConditionModal;