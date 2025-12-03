'use client';

import React, { useState } from 'react';
import './styles/ToothDetailView.css';

interface ToothDetailViewProps {
  selectedTooth: number;
  teethData: any[];
  onClose: () => void;
}

const ToothDetailView: React.FC<ToothDetailViewProps> = ({ selectedTooth, teethData, onClose }) => {
  const [activeDetailTab, setActiveDetailTab] = useState('general');
  
  const tooth = teethData.find(t => t.id === selectedTooth);
  
  if (!tooth) return null;

  const renderGeneralInfo = () => (
    <div className="detail-section">
      <h4>Información General</h4>
      <div className="info-grid">
        <div className="info-item">
          <label>Número FDI:</label>
          <span>{tooth.id}</span>
        </div>
        <div className="info-item">
          <label>Estado:</label>
          <span>{tooth.isAbsent ? 'Ausente' : tooth.isImplant ? 'Implante' : tooth.isPontic ? 'Puente' : tooth.hasCarilla ? 'Corona' : 'Presente'}</span>
        </div>
        <div className="info-item">
          <label>Tipo:</label>
          <span>{getToothType(tooth.id)}</span>
        </div>
      </div>
      
      {/* Datos Periodontales */}
      {tooth.perioData && (
        <div className="perio-info">
          <h5>Datos Periodontales</h5>
          <div className="info-grid">
            {tooth.perioData.profundidadPalpacion > 0 && (
              <div className="info-item">
                <label>Profundidad Palpación:</label>
                <span>{tooth.perioData.profundidadPalpacion} mm</span>
              </div>
            )}
            {tooth.perioData.margenGingival !== 0 && (
              <div className="info-item">
                <label>Margen Gingival:</label>
                <span>{tooth.perioData.margenGingival} mm</span>
              </div>
            )}
            {tooth.perioData.furcacion > 0 && (
              <div className="info-item">
                <label>Furcación:</label>
                <span>Etapa {tooth.perioData.furcacion}</span>
              </div>
            )}
            {tooth.perioData.movilidad > 0 && (
              <div className="info-item">
                <label>Movilidad:</label>
                <span>Clase {tooth.perioData.movilidad}</span>
              </div>
            )}
            {tooth.perioData.endoTest && Array.isArray(tooth.perioData.endoTest) && tooth.perioData.endoTest.length > 0 && (
              <div className="info-item">
                <label>Tests Endodónticos:</label>
                <span>{tooth.perioData.endoTest.join(', ')}</span>
              </div>
            )}
            <div className="indicators-info">
              {tooth.perioData.sangrado && <span className="indicator-badge sangrado">Sangrado</span>}
              {tooth.perioData.placa && <span className="indicator-badge placa">Placa</span>}
              {tooth.perioData.pus && <span className="indicator-badge pus">Pus</span>}
              {tooth.perioData.sarro && <span className="indicator-badge sarro">Sarro</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTreatments = () => (
    <div className="detail-section">
      <h4>Tratamientos</h4>
      <div className="treatments-list">
        {tooth.conditions && tooth.conditions.length > 0 ? (
          tooth.conditions.map((condition: any, index: number) => (
            <div key={index} className="treatment-item">
              <span className="treatment-type">{condition.type}</span>
              <span className="treatment-date">{condition.date || 'Sin fecha'}</span>
            </div>
          ))
        ) : (
          <p>No hay tratamientos registrados</p>
        )}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="detail-section">
      <h4>Observaciones</h4>
      <textarea 
        className="notes-textarea"
        placeholder="Escriba observaciones sobre este diente..."
        rows={6}
        defaultValue={tooth.notes || ''}
      />
      <button className="save-notes-btn">Guardar Observaciones</button>
    </div>
  );

  const getToothType = (id: number) => {
    const toothNumber = id % 10;
    if (toothNumber === 1 || toothNumber === 2) return 'Incisivo';
    if (toothNumber === 3) return 'Canino';
    if (toothNumber === 4 || toothNumber === 5) return 'Premolar';
    if (toothNumber === 6 || toothNumber === 7 || toothNumber === 8) return 'Molar';
    return 'Desconocido';
  };

  return (
    <div className="tooth-detail-view">
      <div className="detail-header">
        <h3>Diente {selectedTooth}</h3>
        <button className="close-detail-btn" onClick={onClose}>×</button>
      </div>
      
      <div className="detail-tabs">
        <button 
          className={`detail-tab ${activeDetailTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveDetailTab('general')}
        >
          Resumen Completo
        </button>
        <button 
          className={`detail-tab ${activeDetailTab === 'treatments' ? 'active' : ''}`}
          onClick={() => setActiveDetailTab('treatments')}
        >
          Tratamientos
        </button>
        <button 
          className={`detail-tab ${activeDetailTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveDetailTab('notes')}
        >
          Observaciones
        </button>
      </div>

      <div className="detail-content">
        {activeDetailTab === 'general' && renderGeneralInfo()}
        {activeDetailTab === 'treatments' && renderTreatments()}
        {activeDetailTab === 'notes' && renderNotes()}
      </div>
    </div>
  );
};

export default ToothDetailView;