'use client';

import React from 'react';

interface ToothData {
  id: number;
  state: 'normal' | 'corona' | 'implante' | 'endodoncia' | 'caries' | 'obturacion' | 'ausente';
  cariesLocations: string[];
  obturacionLocations: string[];
}

interface StatePanelProps {
  selectedTooth: number | null;
  selectedTeeth: number[];
  teethData: ToothData[];
  onApplyState: (toothId: number, state: ToothData['state'], locations?: string[]) => void;
  onApplyMultipleState: (teethIds: number[], state: ToothData['state']) => void;
  onClearSelection: () => void;
  onOpenDetailModal: (toothId: number, type: 'caries' | 'obturacion') => void;
}

const StatePanel: React.FC<StatePanelProps> = ({
  selectedTooth,
  selectedTeeth,
  teethData,
  onApplyState,
  onApplyMultipleState,
  onClearSelection,
  onOpenDetailModal
}) => {
  const selectedToothData = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;

  const handleStateClick = (state: ToothData['state']) => {
    if (selectedTooth) {
      if (state === 'caries' || state === 'obturacion') {
        onOpenDetailModal(selectedTooth, state);
      } else {
        onApplyState(selectedTooth, state);
      }
    } else if (selectedTeeth.length > 0) {
      onApplyMultipleState(selectedTeeth, state);
    }
  };

  const stateButtons = [
    { key: 'normal', label: 'Normal', icon: '🦷', color: '#28a745' },
    { key: 'corona', label: 'Corona', icon: '👑', color: '#ffc107' },
    { key: 'implante', label: 'Implante', icon: '🔩', color: '#6c757d' },
    { key: 'endodoncia', label: 'Endodoncia', icon: '🔬', color: '#dc3545' },
    { key: 'caries', label: 'Caries', icon: '🔴', color: '#8b0000' },
    { key: 'obturacion', label: 'Obturación', icon: '⬜', color: '#17a2b8' },
    { key: 'ausente', label: 'Ausente', icon: '❌', color: '#6c757d' }
  ];

  if (!selectedTooth && selectedTeeth.length === 0) {
    return (
      <div className="state-panel">
        <div className="panel-header">
          <h3>Panel de Estados</h3>
        </div>
        <div className="panel-content">
          <p className="instruction-text">
            Selecciona un diente para ver sus opciones o mantén presionado Ctrl y haz clic en varios dientes para selección múltiple.
          </p>
        </div>

        <style jsx>{`
          .state-panel {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 1.5rem;
            min-height: 200px;
          }

          .panel-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 1rem;
            margin-bottom: 1rem;
          }

          .panel-header h3 {
            margin: 0;
            color: #333;
            font-size: 1.25rem;
          }

          .instruction-text {
            color: #666;
            text-align: center;
            margin: 2rem 0;
            line-height: 1.5;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="state-panel">
      <div className="panel-header">
        <h3>
          {selectedTooth 
            ? `Diente ${selectedTooth}` 
            : `Selección múltiple (${selectedTeeth.length} dientes)`
          }
        </h3>
        <button className="clear-button" onClick={onClearSelection}>
          ✕
        </button>
      </div>

      <div className="panel-content">
        {selectedTooth && selectedToothData && (
          <div className="current-state">
            <span className="state-label">Estado actual:</span>
            <span className={`state-badge ${selectedToothData.state}`}>
              {stateButtons.find(b => b.key === selectedToothData.state)?.icon} {selectedToothData.state}
            </span>
          </div>
        )}

        {selectedTeeth.length > 0 && (
          <div className="selected-teeth">
            <span className="state-label">Dientes seleccionados:</span>
            <div className="teeth-chips">
              {selectedTeeth.map(toothId => (
                <span key={toothId} className="tooth-chip">{toothId}</span>
              ))}
            </div>
          </div>
        )}

        <div className="state-buttons">
          <h4>Aplicar estado:</h4>
          <div className="buttons-grid">
            {stateButtons.map(button => (
              <button
                key={button.key}
                className={`state-button ${selectedToothData?.state === button.key ? 'active' : ''}`}
                onClick={() => handleStateClick(button.key as ToothData['state'])}
                style={{ borderColor: button.color }}
              >
                <span className="button-icon">{button.icon}</span>
                <span className="button-label">{button.label}</span>
              </button>
            ))}
          </div>
        </div>

        {selectedTooth && selectedToothData && (
          <div className="tooth-details">
            <h4>Detalles del diente:</h4>
            
            {selectedToothData.cariesLocations.length > 0 && (
              <div className="detail-section">
                <span className="detail-label">Caries en:</span>
                <div className="locations">
                  {selectedToothData.cariesLocations.map((location, index) => (
                    <span key={index} className="location-tag caries">{location}</span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedToothData.obturacionLocations.length > 0 && (
              <div className="detail-section">
                <span className="detail-label">Obturaciones en:</span>
                <div className="locations">
                  {selectedToothData.obturacionLocations.map((location, index) => (
                    <span key={index} className="location-tag obturacion">{location}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .state-panel {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 1.5rem;
          min-height: 300px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .panel-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.25rem;
        }

        .clear-button {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          transition: background-color 0.2s;
        }

        .clear-button:hover {
          background: #c82333;
        }

        .current-state {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .selected-teeth {
          margin-bottom: 1rem;
        }

        .state-label {
          font-weight: 600;
          color: #555;
        }

        .state-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .state-badge.normal { background: #d4edda; color: #155724; }
        .state-badge.corona { background: #fff3cd; color: #856404; }
        .state-badge.implante { background: #e2e3e5; color: #383d41; }
        .state-badge.endodoncia { background: #f8d7da; color: #721c24; }
        .state-badge.caries { background: #f5c6cb; color: #721c24; }
        .state-badge.obturacion { background: #d1ecf1; color: #0c5460; }
        .state-badge.ausente { background: #e2e3e5; color: #383d41; }

        .teeth-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .tooth-chip {
          background: #007bff;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .state-buttons h4 {
          margin: 1.5rem 0 1rem 0;
          color: #333;
          font-size: 1rem;
        }

        .buttons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
        }

        .state-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .state-button:hover {
          background: #f8f9fa;
          transform: translateY(-1px);
        }

        .state-button.active {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .button-icon {
          font-size: 1.25rem;
        }

        .button-label {
          font-weight: 500;
          color: #333;
        }

        .tooth-details {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .tooth-details h4 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 1rem;
        }

        .detail-section {
          margin-bottom: 1rem;
        }

        .detail-label {
          font-weight: 600;
          color: #555;
          display: block;
          margin-bottom: 0.5rem;
        }

        .locations {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .location-tag {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .location-tag.caries {
          background: #f5c6cb;
          color: #721c24;
        }

        .location-tag.obturacion {
          background: #d1ecf1;
          color: #0c5460;
        }

        @media (max-width: 768px) {
          .buttons-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .state-button {
            padding: 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StatePanel;