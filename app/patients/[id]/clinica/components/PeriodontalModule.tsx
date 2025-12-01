'use client';

import React, { useState } from 'react';
import './styles/PeriodontalModule.css';

interface PeriodontalModuleProps {
  selectedTooth: number | null;
  teethData: any[];
}

const PeriodontalModule: React.FC<PeriodontalModuleProps> = ({ selectedTooth, teethData }) => {
  const [perioData, setPerioData] = useState<any>({});

  const handlePerioMeasurement = (toothId: number, type: string, value: number) => {
    setPerioData((prev: any) => ({
      ...prev,
      [toothId]: {
        ...prev[toothId],
        [type]: value
      }
    }));

    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { toothId, type, value }
    }));
  };

  const renderPerioMeasurements = () => {
    if (!selectedTooth) return null;

    const currentData = perioData[selectedTooth] || {};

    return (
      <div className="perio-measurements">
        <h4>Mediciones Periodontales - Diente {selectedTooth}</h4>
        
        <div className="measurement-group">
          <label>Profundidad de Sondaje (mm)</label>
          <div className="measurement-inputs">
            {['mesial', 'central', 'distal'].map(position => (
              <div key={position} className="measurement-input">
                <label>{position}</label>
                <input 
                  type="number"
                  min="0"
                  max="15"
                  value={currentData[`profundidad_${position}`] || ''}
                  onChange={(e) => handlePerioMeasurement(
                    selectedTooth, 
                    `profundidad_${position}`, 
                    parseInt(e.target.value) || 0
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="measurement-group">
          <label>Margen Gingival (mm)</label>
          <div className="measurement-inputs">
            {['mesial', 'central', 'distal'].map(position => (
              <div key={position} className="measurement-input">
                <label>{position}</label>
                <input 
                  type="number"
                  min="-5"
                  max="10"
                  value={currentData[`margen_${position}`] || ''}
                  onChange={(e) => handlePerioMeasurement(
                    selectedTooth, 
                    `margen_${position}`, 
                    parseInt(e.target.value) || 0
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="measurement-group">
          <label>Movilidad Dental</label>
          <select 
            value={currentData.movilidad || ''}
            onChange={(e) => handlePerioMeasurement(selectedTooth, 'movilidad', e.target.value)}
          >
            <option value="">Sin movilidad</option>
            <option value="1">Grado 1</option>
            <option value="2">Grado 2</option>
            <option value="3">Grado 3</option>
          </select>
        </div>

        <div className="measurement-group">
          <label>Furcación</label>
          <select 
            value={currentData.furcacion || ''}
            onChange={(e) => handlePerioMeasurement(selectedTooth, 'furcacion', e.target.value)}
          >
            <option value="">Sin furcación</option>
            <option value="1">Grado 1</option>
            <option value="2">Grado 2</option>
            <option value="3">Grado 3</option>
          </select>
        </div>

        <div className="perio-indicators">
          <label>
            <input 
              type="checkbox"
              checked={currentData.sangrado || false}
              onChange={(e) => handlePerioMeasurement(selectedTooth, 'sangrado', e.target.checked)}
            />
            Sangrado al sondaje
          </label>
          <label>
            <input 
              type="checkbox"
              checked={currentData.supuracion || false}
              onChange={(e) => handlePerioMeasurement(selectedTooth, 'supuracion', e.target.checked)}
            />
            Supuración
          </label>
          <label>
            <input 
              type="checkbox"
              checked={currentData.placa || false}
              onChange={(e) => handlePerioMeasurement(selectedTooth, 'placa', e.target.checked)}
            />
            Placa bacteriana
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="periodontal-module">
      <div className="perio-header">
        <h3>Módulo Periodontal</h3>
      </div>
      
      <div className="perio-content">
        {renderPerioMeasurements()}
        
        {selectedTooth && (
          <div className="perio-notes">
            <h4>Observaciones Periodontales</h4>
            <textarea 
              className="notes-textarea"
              placeholder="Observaciones adicionales sobre el estado periodontal..."
              rows={3}
            />
            <button className="save-notes-button">
              Guardar Observaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodontalModule;