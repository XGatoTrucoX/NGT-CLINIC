import React, { useState, useEffect } from 'react';
import '../styles/PeriodontalPanel.css';
// Material Design Icons ya están disponibles a través del index.html

const PeriodontalPanel = ({ selectedTooth, activeMeasurement, onClose, onNavigate, tooth }) => {
  // Estado para los valores de medición
  const [measurementValue, setMeasurementValue] = useState(0);
  
  // Indicadores periodontales
  const [sangrado, setSangrado] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [pus, setPus] = useState(false);
  const [sarro, setSarro] = useState(false);
  
  // Estados para furcación y movilidad
  const [furcacion, setFurcacion] = useState(0);
  const [movilidad, setMovilidad] = useState(0);
  
  // Valores para profundidad de palpación
  const palpacionValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Valores para margen gingival
  const gingivalValues = [0, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10, -11, -12];
  
  // Cargar valores iniciales del diente
  useEffect(() => {
    if (tooth && tooth.perioData) {
      // Cargar el valor de la medición activa
      if (tooth.perioData[activeMeasurement] !== undefined) {
        setMeasurementValue(tooth.perioData[activeMeasurement]);
      } else {
        setMeasurementValue(0);
      }
      
      // Cargar indicadores
      setSangrado(tooth.perioData.sangrado || false);
      setPlaca(tooth.perioData.placa || false);
      setPus(tooth.perioData.pus || false);
      setSarro(tooth.perioData.sarro || false);
      
      // Cargar furcación y movilidad
      setFurcacion(tooth.perioData.furcacion || 0);
      setMovilidad(tooth.perioData.movilidad || 0);
    }
  }, [tooth, activeMeasurement]);
  
  // Función para obtener el título del panel según la medición activa
  const getPanelTitle = () => {
    switch (activeMeasurement) {
      case 'distopalatal':
        return 'Disto Palatal';
      case 'palatal':
        return 'Palatal';
      case 'mesiopalatal':
        return 'Mesiopalatal';
      case 'distobucal':
        return 'Disto Bucal';
      case 'bucal':
        return 'Bucal';
      case 'mesiobucal':
        return 'Mesiobucal';
      default:
        return 'Periodontal';
    }
  };
  
  // Función para actualizar el valor de la medición
  const handleValueClick = (value) => {
    // Añadir efecto visual al botón seleccionado
    const button = document.querySelector(`.value-grid button[data-value="${value}"]`);
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
    }
    
    setMeasurementValue(value);
    
    // Actualizar los datos del diente
    if (selectedTooth) {
      // Crear un objeto con los datos periodontales actualizados
      const perioData = {
        [activeMeasurement]: value
      };
      
      // Disparar un evento para actualizar los datos del diente
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para actualizar indicadores
  const handleIndicatorChange = (indicator, value) => {
    // Añadir efecto visual al indicador seleccionado
    const button = document.querySelector(`.indicators button[data-indicator="${indicator}"]`);
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
    }
    
    switch(indicator) {
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
    
    // Actualizar los datos del diente
    if (selectedTooth) {
      const perioData = {
        [indicator]: value
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para actualizar furcación
  const handleFurcacionChange = (value) => {
    // Añadir efecto visual al botón seleccionado
    const button = document.querySelector(`.furcacion button[data-value="${value}"]`);
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
    }
    
    setFurcacion(value);
    
    if (selectedTooth) {
      const perioData = {
        furcacion: value
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para actualizar movilidad
  const handleMovilidadChange = (value) => {
    // Añadir efecto visual al botón seleccionado
    const button = document.querySelector(`.movilidad button[data-value="${value}"]`);
    if (button) {
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
    }
    
    setMovilidad(value);
    
    if (selectedTooth) {
      const perioData = {
        movilidad: value
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para navegar a otra medición
  const [contentKey, setContentKey] = useState(activeMeasurement);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = (measurement) => {
    if (measurement !== activeMeasurement) {
      setIsTransitioning(true);
      
      // Animar el botón seleccionado
      const button = document.querySelector(`.navigation-buttons button[data-measurement="${measurement}"]`);
      if (button) {
        button.classList.add('navigating');
        setTimeout(() => {
          button.classList.remove('navigating');
        }, 300);
      }
      
      // Esperar a que termine la animación de salida antes de cambiar el contenido
      setTimeout(() => {
        if (onNavigate) {
          onNavigate(measurement);
        }
        setContentKey(measurement);
        
        // Dar tiempo para que se aplique el nuevo contenido antes de iniciar la animación de entrada
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 200);
    }
  };
  
  // Determinar si la medición es bucal o palatal para mostrar los valores correctos
  const isBucal = ['distobucal', 'bucal', 'mesiobucal'].includes(activeMeasurement);
  const values = isBucal ? gingivalValues : palpacionValues;
  
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Activar la animación después de que el componente se monte
    const timer = setTimeout(() => setIsActive(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`periodontal-panel ${isActive ? 'active' : ''}`}>
      <div className="panel-header">
        <h3>
          <span className="material-icons">analytics</span>
          {getPanelTitle()}
        </h3>
        <div className="navigation-buttons">
          <button 
            className={activeMeasurement === 'distopalatal' ? 'active' : ''}
            onClick={() => handleNavigate('distopalatal')}
            data-measurement="distopalatal"
          >
            <span className="material-icons">arrow_back</span>
            Disto Palatal
          </button>
          <button 
            className={activeMeasurement === 'palatal' ? 'active' : ''}
            onClick={() => handleNavigate('palatal')}
            data-measurement="palatal"
          >
            <span className="material-icons">height</span>
            Palatal
          </button>
          <button 
            className={activeMeasurement === 'mesiopalatal' ? 'active' : ''}
            onClick={() => handleNavigate('mesiopalatal')}
            data-measurement="mesiopalatal"
          >
            <span className="material-icons">arrow_forward</span>
            Mesiopalatal
          </button>
          <button 
            className={activeMeasurement === 'distobucal' ? 'active' : ''}
            onClick={() => handleNavigate('distobucal')}
            data-measurement="distobucal"
          >
            <span className="material-icons">arrow_back</span>
            Disto Bucal
          </button>
          <button 
            className={activeMeasurement === 'bucal' ? 'active' : ''}
            onClick={() => handleNavigate('bucal')}
            data-measurement="bucal"
          >
            <span className="material-icons">height</span>
            Bucal
          </button>
          <button 
            className={activeMeasurement === 'mesiobucal' ? 'active' : ''}
            onClick={() => handleNavigate('mesiobucal')}
            data-measurement="mesiobucal"
          >
            <span className="material-icons">arrow_forward</span>
            Mesiobucal
          </button>
        </div>
        <button 
          className="close-button" 
          onClick={(e) => {
            e.currentTarget.classList.add('clicked');
            setTimeout(() => {
              e.currentTarget.classList.remove('clicked');
              onClose();
            }, 300);
          }}
        >
          <span className="material-icons">close</span>
        </button>
      </div>
      
      <div className={`panel-content ${isTransitioning ? 'transitioning' : 'active'}`}>
        <div className="section-title">
          <span className="material-icons">{isBucal ? 'vertical_align_top' : 'vertical_align_bottom'}</span>
          {isBucal ? 'MARGEN GINGIVAL' : 'PROFUNDIDAD DE PALPACIÓN'}
        </div>
        
        <div className="value-grid">
          {values.map((value) => (
            <button 
              key={value}
              className={measurementValue === value ? 'active' : ''}
              onClick={() => handleValueClick(value)}
              data-value={value}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="section-title">
          <span className="material-icons">flag</span>
          INDICADORES
        </div>
        <div className="indicators">
          <button 
            className={`indicator ${sangrado ? 'active' : ''}`}
            onClick={() => handleIndicatorChange('sangrado', !sangrado)}
            data-indicator="sangrado"
          >
            <span className="indicator-color" style={{ backgroundColor: '#e74c3c' }}></span>
            <span>Sangrado</span>
            {sangrado && <span className="material-icons">check_circle</span>}
          </button>
          <button 
            className={`indicator ${placa ? 'active' : ''}`}
            onClick={() => handleIndicatorChange('placa', !placa)}
            data-indicator="placa"
          >
            <span className="indicator-color" style={{ backgroundColor: '#3498db' }}></span>
            <span>Placa</span>
            {placa && <span className="material-icons">check_circle</span>}
          </button>
          <button 
            className={`indicator ${pus ? 'active' : ''}`}
            onClick={() => handleIndicatorChange('pus', !pus)}
            data-indicator="pus"
          >
            <span className="indicator-color" style={{ backgroundColor: '#f1c40f' }}></span>
            <span>Pus</span>
            {pus && <span className="material-icons">check_circle</span>}
          </button>
          <button 
            className={`indicator ${sarro ? 'active' : ''}`}
            onClick={() => handleIndicatorChange('sarro', !sarro)}
            data-indicator="sarro"
          >
            <span className="indicator-color" style={{ backgroundColor: '#95a5a6' }}></span>
            <span>Sarro</span>
            {sarro && <span className="material-icons">check_circle</span>}
          </button>
        </div>
        
        <div className="section-title">
          <span className="material-icons">call_split</span>
          FURCACIÓN
        </div>
        <div className="furcacion">
          <button 
            className={furcacion === 1 ? 'active' : ''}
            onClick={() => handleFurcacionChange(furcacion === 1 ? 0 : 1)}
            data-value="1"
          >
            <span className="material-icons">looks_one</span>
            Etapa 1
          </button>
          <button 
            className={furcacion === 2 ? 'active' : ''}
            onClick={() => handleFurcacionChange(furcacion === 2 ? 0 : 2)}
            data-value="2"
          >
            <span className="material-icons">looks_two</span>
            Etapa 2
          </button>
          <button 
            className={furcacion === 3 ? 'active' : ''}
            onClick={() => handleFurcacionChange(furcacion === 3 ? 0 : 3)}
            data-value="3"
          >
            <span className="material-icons">looks_3</span>
            Etapa 3
          </button>
        </div>
        
        <div className="section-title">
          <span className="material-icons">swap_horiz</span>
          MOVILIDAD DENTAL
        </div>
        <div className="movilidad">
          <button 
            className={movilidad === 1 ? 'active' : ''}
            onClick={() => handleMovilidadChange(movilidad === 1 ? 0 : 1)}
            data-value="1"
          >
            <span className="material-icons">looks_one</span>
            Clase 1
          </button>
          <button 
            className={movilidad === 2 ? 'active' : ''}
            onClick={() => handleMovilidadChange(movilidad === 2 ? 0 : 2)}
            data-value="2"
          >
            <span className="material-icons">looks_two</span>
            Clase 2
          </button>
          <button 
            className={movilidad === 3 ? 'active' : ''}
            onClick={() => handleMovilidadChange(movilidad === 3 ? 0 : 3)}
            data-value="3"
          >
            <span className="material-icons">looks_3</span>
            Clase 3
          </button>
        </div>
        
        <div className="action-buttons">
          <button 
            className="cancel-button" 
            onClick={(e) => {
              e.currentTarget.classList.add('clicked');
              setTimeout(() => {
                e.currentTarget.classList.remove('clicked');
                onClose();
              }, 300);
            }}
          >
            <span className="material-icons">cancel</span>
            Cancelar
          </button>
          <button 
            className="save-button" 
            onClick={(e) => {
              e.currentTarget.classList.add('clicked');
              setTimeout(() => {
                e.currentTarget.classList.remove('clicked');
                onClose();
              }, 300);
            }}
          >
            <span className="material-icons">save</span>
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodontalPanel;
