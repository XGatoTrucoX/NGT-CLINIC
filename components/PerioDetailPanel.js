import React, { useState } from 'react';
import '../styles/PerioDetailPanel.css';

const PerioDetailPanel = ({ selectedTooth, activePoint, onClose, tooth }) => {
  // Estados para los valores seleccionados
  const [palpacionValue, setPalpacionValue] = useState(0);
  const [margenGingivalValue, setMargenGingivalValue] = useState(0);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [selectedFurcacion, setSelectedFurcacion] = useState(null);
  const [selectedMovilidad, setSelectedMovilidad] = useState(null);
  
  // Valores para los diferentes selectores
  const palpacionValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, '>12'];
  const margenGingivalValues = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12, '>-12', '+/-'];
  const indicadores = [
    { id: 'sangrado', label: 'Sangrado', color: 'red' },
    { id: 'placa', label: 'Placa', color: 'blue' },
    { id: 'pus', label: 'Pus', color: 'yellow' },
    { id: 'sarro', label: 'Sarro', color: 'white' }
  ];
  const furcacionValues = [
    { id: 'etapa1', label: 'Etapa 1', icon: '∧' },
    { id: 'etapa2', label: 'Etapa 2', icon: '∧' },
    { id: 'etapa3', label: 'Etapa 3', icon: '▲' }
  ];
  const movilidadValues = [
    { id: 'clase1', label: 'Clase 1', icon: '< >' },
    { id: 'clase2', label: 'Clase 2', icon: '<< >>' },
    { id: 'clase3', label: 'Clase 3', icon: '<<< >>>' }
  ];
  
  // Función para manejar la selección de un valor de palpación
  const handlePalpacionSelect = (value) => {
    setPalpacionValue(value);
    // Aquí actualizaríamos el valor en el diente
    document.dispatchEvent(new CustomEvent('updateToothPerioData', {
      detail: {
        toothId: selectedTooth,
        perioData: { [activePoint]: value }
      }
    }));
  };
  
  // Función para manejar la selección de un valor de margen gingival
  const handleMargenGingivalSelect = (value) => {
    setMargenGingivalValue(value);
    // Aquí actualizaríamos el valor en el diente
    document.dispatchEvent(new CustomEvent('updateToothPerioData', {
      detail: {
        toothId: selectedTooth,
        perioData: { [`margenGingival_${activePoint}`]: value }
      }
    }));
  };
  
  // Función para manejar la selección de un indicador
  const handleIndicatorSelect = (indicatorId) => {
    setSelectedIndicator(indicatorId === selectedIndicator ? null : indicatorId);
    // Aquí actualizaríamos el indicador en el diente
    document.dispatchEvent(new CustomEvent('updateToothPerioData', {
      detail: {
        toothId: selectedTooth,
        perioData: { [`indicador_${activePoint}`]: indicatorId === selectedIndicator ? null : indicatorId }
      }
    }));
  };
  
  // Función para manejar la selección de furcación
  const handleFurcacionSelect = (furcacionId) => {
    setSelectedFurcacion(furcacionId === selectedFurcacion ? null : furcacionId);
    // Aquí actualizaríamos la furcación en el diente
    document.dispatchEvent(new CustomEvent('updateToothPerioData', {
      detail: {
        toothId: selectedTooth,
        perioData: { [`furcacion_${activePoint}`]: furcacionId === selectedFurcacion ? null : furcacionId }
      }
    }));
  };
  
  // Función para manejar la selección de movilidad
  const handleMovilidadSelect = (movilidadId) => {
    setSelectedMovilidad(movilidadId === selectedMovilidad ? null : movilidadId);
    // Aquí actualizaríamos la movilidad en el diente
    document.dispatchEvent(new CustomEvent('updateToothPerioData', {
      detail: {
        toothId: selectedTooth,
        perioData: { [`movilidad_${activePoint}`]: movilidadId === selectedMovilidad ? null : movilidadId }
      }
    }));
  };
  
  // Obtener el título del punto periodontal
  const getPointTitle = () => {
    switch (activePoint) {
      case 'distopalatal': return 'Disto Palatal';
      case 'palatal': return 'Palatal';
      case 'mesiopalatal': return 'Mesiopalatal';
      case 'distobucal': return 'Disto bucal';
      case 'bucal': return 'Bucal';
      case 'mesiobucal': return 'Mesobucal';
      default: return 'Periodontal';
    }
  };
  
  return (
    <div className="perio-detail-panel">
      <div className="panel-header">
        <h3>{getPointTitle()}</h3>
        <div className="header-actions">
          <button className="sound-toggle"><span className="icon">🔈</span></button>
          <button className="close-button" onClick={onClose}><span className="icon">×</span></button>
        </div>
      </div>
      
      <div className="panel-content">
        {/* Valores de medición */}
        <div className="measurement-values">
          {['distopalatal', 'palatal', 'mesiopalatal', 'distobucal', 'bucal', 'mesiobucal'].map(point => (
            <div 
              key={point} 
              className={`measurement-value ${activePoint === point ? 'active' : ''}`}
              onClick={() => {
                // Cambiar el punto activo si se hace clic en otro
                if (activePoint !== point) {
                  document.dispatchEvent(new CustomEvent('changeActivePerioPoint', {
                    detail: { point }
                  }));
                }
              }}
            >
              <div className="value">{tooth.perioData?.[point] || 0}</div>
              <div className="label">{point === 'distopalatal' ? 'Disto Palatal' : 
                                     point === 'mesiopalatal' ? 'Mesiopalatal' : 
                                     point === 'distobucal' ? 'Disto bucal' : 
                                     point === 'mesiobucal' ? 'Mesobucal' : 
                                     point.charAt(0).toUpperCase() + point.slice(1)}</div>
            </div>
          ))}
        </div>
        
        {/* Sección de profundidad de palpación */}
        <div className="section">
          <h3>PROFUNDIDAD DE PALPACIÓN</h3>
          <div className="value-grid">
            {palpacionValues.map(value => (
              <button 
                key={value}
                className={palpacionValue === value ? 'active' : ''}
                onClick={() => handlePalpacionSelect(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sección de margen gingival */}
        <div className="section">
          <h3>MARGEN GINGIVAL</h3>
          <div className="value-grid">
            {margenGingivalValues.map(value => (
              <button 
                key={value}
                className={margenGingivalValue === value ? 'active' : ''}
                onClick={() => handleMargenGingivalSelect(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sección de indicadores */}
        <div className="indicators-section">
          {indicadores.map(indicador => (
            <button 
              key={indicador.id}
              className={`indicator ${selectedIndicator === indicador.id ? 'active' : ''}`}
              onClick={() => handleIndicatorSelect(indicador.id)}
            >
              <span className={`indicator-color ${indicador.id}`}></span>
              <span>{indicador.label}</span>
            </button>
          ))}
        </div>
        
        {/* Sección de furcación */}
        <div className="section">
          <h3>FURCACIÓN</h3>
          <div className="value-grid furcacion-grid">
            {furcacionValues.map(furcacion => (
              <button 
                key={furcacion.id}
                className={`furcacion-btn ${selectedFurcacion === furcacion.id ? 'active' : ''}`}
                onClick={() => handleFurcacionSelect(furcacion.id)}
              >
                <span className="icon">{furcacion.icon}</span>
                <span>{furcacion.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Sección de movilidad dental */}
        <div className="section">
          <h3>MOVILIDAD DENTAL</h3>
          <div className="value-grid movilidad-grid">
            {movilidadValues.map(movilidad => (
              <button 
                key={movilidad.id}
                className={`movilidad-btn ${selectedMovilidad === movilidad.id ? 'active' : ''}`}
                onClick={() => handleMovilidadSelect(movilidad.id)}
              >
                <span className="icon">{movilidad.icon}</span>
                <span>{movilidad.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerioDetailPanel;
