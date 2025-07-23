import React, { useState } from 'react';
import '../styles/PerioExamPanel.css';

const PerioExamPanel = ({ toothId, onClose }) => {
  // Estados para los diferentes valores
  const [distalLingual, setDistalLingual] = useState(0);
  const [lingual, setLingual] = useState(0);
  const [mesialLingual, setMesialLingual] = useState(0);
  const [distalBucal, setDistalBucal] = useState(0);
  const [bucal, setBucal] = useState(0);
  const [mesialBucal, setMesialBucal] = useState(0);
  const [profundidad, setProfundidad] = useState(0);
  const [sangrado, setSangrado] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [pus, setPus] = useState(false);

  // Función para manejar cambios en los valores numéricos
  const handleValueChange = (setter, value) => {
    if (value >= 0 && value <= 12) {
      setter(value);
    }
  };

  return (
    <div className="perio-exam-panel">
      <div className="panel-header">
        <h3>DIENTE {toothId}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="measurements-grid">
        <div className="measurement-row">
          <div className="measurement-cell">
            <span className="value">{distalLingual}</span>
            <span className="label">Distal Lingual</span>
          </div>
          <div className="measurement-cell">
            <span className="value">{lingual}</span>
            <span className="label">Lingual</span>
          </div>
          <div className="measurement-cell">
            <span className="value">{mesialLingual}</span>
            <span className="label">Mesial Lingual</span>
          </div>
        </div>

        <div className="measurement-row">
          <div className="measurement-cell">
            <span className="value">{distalBucal}</span>
            <span className="label">Distal Bucal</span>
          </div>
          <div className="measurement-cell">
            <span className="value">{bucal}</span>
            <span className="label">Bucal</span>
          </div>
          <div className="measurement-cell">
            <span className="value">{mesialBucal}</span>
            <span className="label">Mesial Bucal</span>
          </div>
        </div>
      </div>

      <div className="perio-indicators-section">
        <h4>PROFUNDIDAD DE PALPACIÓN</h4>
        <div className="depth-buttons">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(value => (
            <button 
              key={value} 
              className={profundidad === value ? 'active' : ''}
              onClick={() => setProfundidad(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="perio-indicators-section">
        <h4>MARGEN GINGIVAL</h4>
        <div className="indicators-row">
          <button 
            className={`indicator-button ${sangrado ? 'active' : ''}`}
            onClick={() => setSangrado(!sangrado)}
          >
            Sangrado
          </button>
          <button 
            className={`indicator-button ${placa ? 'active' : ''}`}
            onClick={() => setPlaca(!placa)}
          >
            Placa
          </button>
          <button 
            className={`indicator-button ${pus ? 'active' : ''}`}
            onClick={() => setPus(!pus)}
          >
            Pus
          </button>
        </div>
      </div>

      <div className="panel-footer">
        <button className="save-button">SIGUIENTE DIENTE</button>
      </div>
    </div>
  );
};

export default PerioExamPanel;