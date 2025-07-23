import React, { useState, useEffect } from 'react';
import '../styles/PeriodontalModule.css';
import PerioDetailPanel from './PerioDetailPanel';

const PeriodontalModule = ({ selectedTooth, teethData }) => {
  // Estados para los diferentes valores de medición
  const [distopalatal, setDistopalatal] = useState(0);
  const [palatal, setPalatal] = useState(0);
  const [mesiopalatal, setMesiopalatal] = useState(0);
  const [distobucal, setDistobucal] = useState(0);
  const [bucal, setBucal] = useState(0);
  const [mesiobucal, setMesiobucal] = useState(0);
  
  // Estados para profundidad de palpación y margen gingival
  const [profundidadPalpacion, setProfundidadPalpacion] = useState(0);
  const [margenGingival, setMargenGingival] = useState(0);
  
  // Estados para indicadores
  const [sangrado, setSangrado] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [pus, setPus] = useState(false);
  const [sarro, setSarro] = useState(false);
  
  // Estados para furcación y movilidad
  const [furcacion, setFurcacion] = useState(0); // 0, 1, 2, 3
  const [movilidad, setMovilidad] = useState(0); // 0, 1, 2, 3
  
  // Estado para mostrar panel detallado
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [activeMeasurement, setActiveMeasurement] = useState(null);
  
  // Resetear valores cuando cambia el diente seleccionado
  useEffect(() => {
    setDistopalatal(0);
    setPalatal(0);
    setMesiopalatal(0);
    setDistobucal(0);
    setBucal(0);
    setMesiobucal(0);
    setProfundidadPalpacion(0);
    setMargenGingival(0);
    setSangrado(false);
    setPlaca(false);
    setPus(false);
    setSarro(false);
    setFurcacion(0);
    setMovilidad(0);
    setShowDetailPanel(false);
    setActiveMeasurement(null);
  }, [selectedTooth]);
  
  // Función para manejar el clic en una medición
  const handleMeasurementClick = (type) => {
    setActiveMeasurement(type);
    setShowDetailPanel(true);
  };
  
  // Función para manejar el cambio de valor en el panel de detalle
  const handleDetailValueChange = (measurement, value) => {
    // Actualizar el valor correspondiente según el tipo de medición
    switch(measurement) {
      case 'distopalatal':
        setDistopalatal(value);
        break;
      case 'palatal':
        setPalatal(value);
        break;
      case 'mesiopalatal':
        setMesiopalatal(value);
        break;
      case 'distobucal':
        setDistobucal(value);
        break;
      case 'bucal':
        setBucal(value);
        break;
      case 'mesiobucal':
        setMesiobucal(value);
        break;
      default:
        break;
    }
  };
  
  // Función para establecer el valor de profundidad de palpación
  const handleSetProfundidad = (value) => {
    setProfundidadPalpacion(value);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'profundidad',
        value: value
      }
    }));
    
    // Actualizar los datos del diente para persistir los cambios
    if (selectedTooth) {
      // Crear un objeto con los datos periodontales
      const perioData = {
        profundidadPalpacion: value,
        // Mantener el valor actual de margen gingival
        margenGingival: margenGingival
      };
      
      // Disparar un evento para que App.js actualice los datos del diente
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para establecer el valor del margen gingival
  const handleSetMargen = (value) => {
    setMargenGingival(value);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'margen',
        value: value
      }
    }));
    
    // Actualizar los datos del diente para persistir los cambios
    if (selectedTooth) {
      // Crear un objeto con los datos periodontales
      const perioData = {
        // Mantener el valor actual de profundidad
        profundidadPalpacion: profundidadPalpacion,
        margenGingival: value
      };
      
      // Disparar un evento para que App.js actualice los datos del diente
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para establecer el valor de furcación
  const handleSetFurcacion = (value) => {
    setFurcacion(value);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'furcacion',
        value: value
      }
    }));
  };
  
  // Función para establecer el valor de movilidad
  const handleSetMovilidad = (value) => {
    setMovilidad(value);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'movilidad',
        value: value
      }
    }));
  };
  
  // Función para establecer el valor de un indicador
  const handleSetIndicator = (type, value) => {
    switch(type) {
      case 'sangrado':
        setSangrado(value);
        break;
      case 'placa':
        setPlaca(value);
        break;
      case 'pus':
        setPus(value);
        break;
      case 'sarro':
        setSarro(value);
        break;
      default:
        break;
    }
    
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioIndicatorUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: type,
        value: value
      }
    }));
  };
  
  // Si no hay diente seleccionado, mostrar mensaje
  if (!selectedTooth) {
    return (
      <div className="periodontal-module">
        <h2>Periodontal</h2>
        <div className="no-tooth-selected">
          <p>Seleccione un diente para realizar el examen periodontal</p>
        </div>
      </div>
    );
  }
  
  // Obtener los datos del diente seleccionado
  const toothData = teethData.find(tooth => tooth.id === selectedTooth) || {};
  
  return (
    <div className="periodontal-module">
      <div className="panel-title">
        Periodontal
        <button className="palpacion-btn" onClick={() => {
          setActiveMeasurement('profundidad');
          setShowDetailPanel(true);
        }}>
          <span className="icon">+</span> PALPACIÓN
        </button>
      </div>
      
      {/* Mediciones principales con nuevo diseño */}
      <div className="perio-measurements-grid">
        <div className="perio-row">
          <div className="perio-cell" onClick={() => handleMeasurementClick('distopalatal')}>
            <div className="perio-value">{distopalatal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{distopalatal}</div>
            </div>
            <div className="perio-label">Disto Palatal</div>
          </div>
          <div className="perio-cell" onClick={() => handleMeasurementClick('palatal')}>
            <div className="perio-value">{palatal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{palatal}</div>
            </div>
            <div className="perio-label">Palatal</div>
          </div>
          <div className="perio-cell" onClick={() => handleMeasurementClick('mesiopalatal')}>
            <div className="perio-value">{mesiopalatal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{mesiopalatal}</div>
            </div>
            <div className="perio-label">Mesiopalatal</div>
          </div>
        </div>
        
        <div className="perio-row">
          <div className="perio-cell" onClick={() => handleMeasurementClick('distobucal')}>
            <div className="perio-value">{distobucal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{distobucal}</div>
            </div>
            <div className="perio-label">Disto bucal</div>
          </div>
          <div className="perio-cell" onClick={() => handleMeasurementClick('bucal')}>
            <div className="perio-value">{bucal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{bucal}</div>
            </div>
            <div className="perio-label">Bucal</div>
          </div>
          <div className="perio-cell" onClick={() => handleMeasurementClick('mesiobucal')}>
            <div className="perio-value">{mesiobucal}</div>
            <div className="perio-slider">
              <div className="slider-circle">{mesiobucal}</div>
            </div>
            <div className="perio-label">Mesiobucal</div>
          </div>
        </div>
      </div>
      
      {/* Profundidad de palpación */}
      <div className="section">
        <h3>PROFUNDIDAD DE PALPACIÓN</h3>
        <div className="value-grid">
          <button className={profundidadPalpacion === 0 ? 'active' : ''} onClick={() => handleSetProfundidad(0)}>0</button>
          <button className={profundidadPalpacion === 1 ? 'active' : ''} onClick={() => handleSetProfundidad(1)}>1</button>
          <button className={profundidadPalpacion === 2 ? 'active' : ''} onClick={() => handleSetProfundidad(2)}>2</button>
          <button className={profundidadPalpacion === 3 ? 'active' : ''} onClick={() => handleSetProfundidad(3)}>3</button>
          <button className={profundidadPalpacion === 4 ? 'active' : ''} onClick={() => handleSetProfundidad(4)}>4</button>
          <button className={profundidadPalpacion === 5 ? 'active' : ''} onClick={() => handleSetProfundidad(5)}>5</button>
          <button className={profundidadPalpacion === 6 ? 'active' : ''} onClick={() => handleSetProfundidad(6)}>6</button>
          <button className={profundidadPalpacion === 7 ? 'active' : ''} onClick={() => handleSetProfundidad(7)}>7</button>
          <button className={profundidadPalpacion === 8 ? 'active' : ''} onClick={() => handleSetProfundidad(8)}>8</button>
          <button className={profundidadPalpacion === 9 ? 'active' : ''} onClick={() => handleSetProfundidad(9)}>9</button>
          <button className={profundidadPalpacion === 10 ? 'active' : ''} onClick={() => handleSetProfundidad(10)}>10</button>
          <button className={profundidadPalpacion === 11 ? 'active' : ''} onClick={() => handleSetProfundidad(11)}>11</button>
          <button className={profundidadPalpacion === 12 ? 'active' : ''} onClick={() => handleSetProfundidad(12)}>12</button>
        </div>
      </div>
      
      {/* Margen gingival */}
      <div className="section">
        <h3>MARGEN GINGIVAL</h3>
        <div className="value-grid">
          <button className={margenGingival === 0 ? 'active' : ''} onClick={() => handleSetMargen(0)}>0</button>
          <button className={margenGingival === -1 ? 'active' : ''} onClick={() => handleSetMargen(-1)}>-1</button>
          <button className={margenGingival === -2 ? 'active' : ''} onClick={() => handleSetMargen(-2)}>-2</button>
          <button className={margenGingival === -3 ? 'active' : ''} onClick={() => handleSetMargen(-3)}>-3</button>
          <button className={margenGingival === -4 ? 'active' : ''} onClick={() => handleSetMargen(-4)}>-4</button>
          <button className={margenGingival === -5 ? 'active' : ''} onClick={() => handleSetMargen(-5)}>-5</button>
          <button className={margenGingival === -6 ? 'active' : ''} onClick={() => handleSetMargen(-6)}>-6</button>
          <button className={margenGingival === -7 ? 'active' : ''} onClick={() => handleSetMargen(-7)}>-7</button>
          <button className={margenGingival === -8 ? 'active' : ''} onClick={() => handleSetMargen(-8)}>-8</button>
          <button className={margenGingival === -9 ? 'active' : ''} onClick={() => handleSetMargen(-9)}>-9</button>
          <button className={margenGingival === -10 ? 'active' : ''} onClick={() => handleSetMargen(-10)}>-10</button>
          <button className={margenGingival === -11 ? 'active' : ''} onClick={() => handleSetMargen(-11)}>-11</button>
          <button className={margenGingival === -12 ? 'active' : ''} onClick={() => handleSetMargen(-12)}>-12</button>
        </div>
      </div>
      
      {/* Indicadores */}
      <div className="indicators-section">
        <button 
          className={`indicator ${sangrado ? 'active' : ''}`} 
          onClick={() => handleSetIndicator('sangrado', !sangrado)}
        >
          <span className="indicator-color sangrado"></span>
          <span>Sangrado</span>
        </button>
        <button 
          className={`indicator ${placa ? 'active' : ''}`} 
          onClick={() => handleSetIndicator('placa', !placa)}
        >
          <span className="indicator-color placa"></span>
          <span>Placa</span>
        </button>
        <button 
          className={`indicator ${pus ? 'active' : ''}`} 
          onClick={() => handleSetIndicator('pus', !pus)}
        >
          <span className="indicator-color pus"></span>
          <span>Pus</span>
        </button>
        <button 
          className={`indicator ${sarro ? 'active' : ''}`} 
          onClick={() => handleSetIndicator('sarro', !sarro)}
        >
          <span className="indicator-color sarro"></span>
          <span>Sarro</span>
        </button>
      </div>
      
      {/* Furcación */}
      <div className="section">
        <h3>FURCACIÓN</h3>
        <div className="furcation-grid">
          <button className={furcacion === 1 ? 'active' : ''} onClick={() => handleSetFurcacion(1)}>
            <span className="furcation-icon">^</span>
            <span>Etapa 1</span>
          </button>
          <button className={furcacion === 2 ? 'active' : ''} onClick={() => handleSetFurcacion(2)}>
            <span className="furcation-icon">^</span>
            <span>Etapa 2</span>
          </button>
          <button className={furcacion === 3 ? 'active' : ''} onClick={() => handleSetFurcacion(3)}>
            <span className="furcation-icon">^</span>
            <span>Etapa 3</span>
          </button>
        </div>
      </div>
      
      {/* Movilidad dental */}
      <div className="section">
        <h3>MOVILIDAD DENTAL</h3>
        <div className="mobility-grid">
          <button className={movilidad === 1 ? 'active' : ''} onClick={() => handleSetMovilidad(1)}>
            <span className="mobility-icon">&lt; &gt;</span>
            <span>Clase 1</span>
          </button>
          <button className={movilidad === 2 ? 'active' : ''} onClick={() => handleSetMovilidad(2)}>
            <span className="mobility-icon">&lt;=&gt;</span>
            <span>Clase 2</span>
          </button>
          <button className={movilidad === 3 ? 'active' : ''} onClick={() => handleSetMovilidad(3)}>
            <span className="mobility-icon">&lt;==&gt;</span>
            <span>Clase 3</span>
          </button>
        </div>
      </div>
      
      {/* Panel detallado para mediciones específicas */}
      {showDetailPanel && (
        <PerioDetailPanel 
          selectedTooth={selectedTooth}
          activePoint={activeMeasurement}
          onClose={() => setShowDetailPanel(false)}
          tooth={teethData.find(t => t.id === selectedTooth) || {}}
        />
      )}
    </div>
  );
};

export default PeriodontalModule;
