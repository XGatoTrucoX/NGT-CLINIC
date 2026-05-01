'use client';

import React, { useState, useEffect, useRef } from 'react';
import './styles/PeriodontalModule.css';

interface PeriodontalModuleProps {
  selectedTooth: number | null;
  teethData: any[];
}

const PeriodontalModule: React.FC<PeriodontalModuleProps> = ({ selectedTooth, teethData }) => {
  // Estados para los diferentes valores de medición
  const [distopalatal, setDistopalatal] = useState(0);
  const [palatal, setPalatal] = useState(0);
  const [mesiopalatal, setMesiopalatal] = useState(0);
  const [distobucal, setDistobucal] = useState(0);
  const [bucal, setBucal] = useState(0);
  const [mesiobucal, setMesiobucal] = useState(0);
  
  // Estados para profundidad de palpación y margen gingival
  const [profundidadPalpacion, setProfundidadPalpacion] = useState(0);
  // margenGingival ya no se usa como input manual — viene de la línea gingival
  
  // Estados para indicadores
  const [sangrado, setSangrado] = useState(false);
  const [placa, setPlaca] = useState(false);
  const [pus, setPus] = useState(false);
  const [sarro, setSarro] = useState(false);
  
  // Estados para furcación y movilidad
  const [furcacion, setFurcacion] = useState(0); // 0, 1, 2, 3
  const [movilidad, setMovilidad] = useState(0); // 0, 1, 2, 3
  
  // Estados para endodoncia
  const [endoTest, setEndoTest] = useState<string[]>([]); // ['cold', 'heat', 'electricity', 'palpation', 'percussion']
  
  // Estado para mostrar panel detallado
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [activeMeasurement, setActiveMeasurement] = useState<string | null>(null);
  const [gingivalStatus, setGingivalStatus] = useState<{ label: string; color: string; delta?: number } | null>(null);
  const selectedToothRef = useRef<number | null>(null);

  useEffect(() => { selectedToothRef.current = selectedTooth; }, [selectedTooth]);

  useEffect(() => {
    const handler = (e: any) => {
      // Aceptar el evento si coincide con el diente seleccionado actual (via ref para evitar stale)
      if (e.detail.toothId === selectedToothRef.current) {
        setGingivalStatus({ label: e.detail.label, color: e.detail.color, delta: e.detail.delta });
      }
    };
    document.addEventListener('gingivalStatus', handler);
    document.addEventListener('gingivalStatusUpdate', handler);
    return () => {
      document.removeEventListener('gingivalStatus', handler);
      document.removeEventListener('gingivalStatusUpdate', handler);
    };
  }, []); // solo una vez, usa ref internamente

  // Al cambiar diente, pedir el estado actual a GingivalLine
  useEffect(() => {
    if (!selectedTooth) { setGingivalStatus(null); return; }
    // Disparar toothSelect para que GingivalLine emita el estado actual
    document.dispatchEvent(new CustomEvent('toothSelect', { detail: { toothId: selectedTooth } }));
  }, [selectedTooth]);
  
  // Resetear valores cuando cambia el diente seleccionado
  useEffect(() => {
    setDistopalatal(0);
    setPalatal(0);
    setMesiopalatal(0);
    setDistobucal(0);
    setBucal(0);
    setMesiobucal(0);
    setProfundidadPalpacion(0);
    setSangrado(false);
    setPlaca(false);
    setPus(false);
    setSarro(false);
    setFurcacion(0);
    setMovilidad(0);
    setEndoTest([]);
    setShowDetailPanel(false);
    setActiveMeasurement(null);
  }, [selectedTooth]);
  
  // Función para manejar el clic en una medición
  const handleMeasurementClick = (type: string) => {
    setActiveMeasurement(type);
    setShowDetailPanel(true);
  };
  
  // Función para establecer el valor de profundidad de palpación
  const handleSetProfundidad = (value: number) => {
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
        furcacion: furcacion,
        movilidad: movilidad,
        endoTest: endoTest
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
  const handleSetFurcacion = (value: number) => {
    setFurcacion(value);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'furcacion',
        value: value
      }
    }));
    
    // Actualizar los datos del diente para persistir los cambios
    if (selectedTooth) {
      const perioData = {
        profundidadPalpacion: profundidadPalpacion,
        furcacion: value,
        movilidad: movilidad,
        endoTest: endoTest
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para establecer el valor de movilidad
  const handleSetMovilidad = (value: number) => {
    setMovilidad(value);
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { toothId: selectedTooth, type: 'movilidad', value: value }
    }));
    if (selectedTooth) {
      const perioData = {
        profundidadPalpacion: profundidadPalpacion,
        furcacion: furcacion,
        movilidad: value,
        endoTest: endoTest
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para establecer el test endodóntico
  const handleSetEndoTest = (testType: string) => {
    const newTests = endoTest.includes(testType) 
      ? endoTest.filter(test => test !== testType)
      : [...endoTest, testType];
    setEndoTest(newTests);
    // Disparar evento para actualizar la visualización en el diente
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: 'endoTest',
        value: testType
      }
    }));
    
    // Actualizar los datos del diente para persistir los cambios
    if (selectedTooth) {
      const perioData = {
        profundidadPalpacion: profundidadPalpacion,
        furcacion: furcacion,
        movilidad: movilidad,
        endoTest: newTests
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
  };
  
  // Función para establecer el valor de un indicador
  const handleSetIndicator = (type: string, value: boolean) => {
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
    document.dispatchEvent(new CustomEvent('perioMeasurementUpdate', {
      detail: { 
        toothId: selectedTooth,
        type: type,
        value: value
      }
    }));
    
    // Actualizar los datos del diente para persistir los cambios
    if (selectedTooth) {
      const perioData = {
        profundidadPalpacion: profundidadPalpacion,
        furcacion: furcacion,
        movilidad: movilidad,
        endoTest: endoTest,
        sangrado: type === 'sangrado' ? value : sangrado,
        placa: type === 'placa' ? value : placa,
        pus: type === 'pus' ? value : pus,
        sarro: type === 'sarro' ? value : sarro
      };
      
      document.dispatchEvent(new CustomEvent('updateToothPerioData', {
        detail: {
          toothId: selectedTooth,
          perioData: perioData
        }
      }));
    }
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

      {/* Estado gingival */}
      {gingivalStatus && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#0f172a', borderRadius: '8px', padding: '0.5rem 0.75rem',
          marginBottom: '1rem', border: `1px solid ${gingivalStatus.color}`
        }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: gingivalStatus.color, flexShrink: 0,
            boxShadow: `0 0 6px ${gingivalStatus.color}`
          }} />
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>Estado encía:</span>
          <strong style={{ fontSize: '0.85rem', color: gingivalStatus.color }}>
            {gingivalStatus.label}
          </strong>
        </div>
      )}
      
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
      
      {/* Margen Gingival — tomado de la línea gingival */}
      <div className="section">
        <h3>MARGEN GINGIVAL</h3>
        {gingivalStatus ? (
          <div style={{
            background: '#0f172a', borderRadius: '10px',
            padding: '1rem', border: `2px solid ${gingivalStatus.color}`,
            display: 'flex', flexDirection: 'column', gap: '0.6rem'
          }}>
            {/* Indicador visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                background: gingivalStatus.color,
                boxShadow: `0 0 8px ${gingivalStatus.color}`
              }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: gingivalStatus.color }}>
                {gingivalStatus.label}
              </span>
            </div>
            {/* Descripción del estado */}
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>
              {gingivalStatus.label === 'Encía retraída' &&
                'La encía se ha retraído por encima del nivel normal. Se recomienda evaluación de recesión gingival.'}
              {gingivalStatus.label === 'Hiperplasia gingival' &&
                'La encía presenta un crecimiento excesivo por debajo del nivel normal. Puede requerir tratamiento.'}
              {gingivalStatus.label === 'Normal' &&
                'La encía se encuentra en posición normal. No se observan alteraciones significativas.'}
            </p>
            {/* Barra de desplazamiento visual */}
            {gingivalStatus.delta !== undefined && (
              <div style={{ marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.3rem' }}>
                  Desplazamiento: {gingivalStatus.delta > 0 ? '+' : ''}{Math.round(gingivalStatus.delta)}px
                </div>
                <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: gingivalStatus.color,
                    width: `${Math.min(Math.abs(gingivalStatus.delta) / 40 * 100, 100)}%`,
                    transition: 'width 0.3s'
                  }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            background: '#0f172a', borderRadius: '10px', padding: '1rem',
            border: '1px solid #334155', textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569' }}>
              Selecciona el diente en el odontograma para ver el estado de la encía según la línea gingival
            </p>
          </div>
        )}
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
            <img src="/images/teeth/furcacion/stage-1.png" alt="Etapa 1" className="furcation-image" />
            <span>Etapa 1</span>
          </button>
          <button className={furcacion === 2 ? 'active' : ''} onClick={() => handleSetFurcacion(2)}>
            <img src="/images/teeth/furcacion/stage-2.png" alt="Etapa 2" className="furcation-image" />
            <span>Etapa 2</span>
          </button>
          <button className={furcacion === 3 ? 'active' : ''} onClick={() => handleSetFurcacion(3)}>
            <img src="/images/teeth/furcacion/stage-3.png" alt="Etapa 3" className="furcation-image" />
            <span>Etapa 3</span>
          </button>
        </div>
      </div>
      
      {/* Movilidad dental */}
      <div className="section">
        <h3>MOVILIDAD DENTAL</h3>
        <div className="mobility-grid">
          <button className={movilidad === 1 ? 'active' : ''} onClick={() => handleSetMovilidad(1)}>
            <img src="/images/teeth/movilidad dental/class 1.png" alt="Clase 1" className="mobility-image" />
            <span>Clase 1</span>
          </button>
          <button className={movilidad === 2 ? 'active' : ''} onClick={() => handleSetMovilidad(2)}>
            <img src="/images/teeth/movilidad dental/class 2.png" alt="Clase 2" className="mobility-image" />
            <span>Clase 2</span>
          </button>
          <button className={movilidad === 3 ? 'active' : ''} onClick={() => handleSetMovilidad(3)}>
            <img src="/images/teeth/movilidad dental/class 3.png" alt="Clase 3" className="mobility-image" />
            <span>Clase 3</span>
          </button>
        </div>
      </div>
      
      {/* Tests Endodónticos */}
      <div className="section">
        <h3>TESTS ENDODÓNTICOS</h3>
        <div className="endo-tests-grid">
          <button className={endoTest.includes('cold') ? 'active' : ''} onClick={() => handleSetEndoTest('cold')}>
            <img src="/images/teeth/endodoncia/cold.png" alt="Frío" className="endo-test-image" />
            <span>Frío</span>
          </button>
          <button className={endoTest.includes('heat') ? 'active' : ''} onClick={() => handleSetEndoTest('heat')}>
            <img src="/images/teeth/endodoncia/heat.png" alt="Calor" className="endo-test-image" />
            <span>Calor</span>
          </button>
          <button className={endoTest.includes('electricity') ? 'active' : ''} onClick={() => handleSetEndoTest('electricity')}>
            <img src="/images/teeth/endodoncia/electricity.png" alt="Electricidad" className="endo-test-image" />
            <span>Electricidad</span>
          </button>
          <button className={endoTest.includes('palpation') ? 'active' : ''} onClick={() => handleSetEndoTest('palpation')}>
            <img src="/images/teeth/endodoncia/palpation.png" alt="Palpación" className="endo-test-image" />
            <span>Palpación</span>
          </button>
          <button className={endoTest.includes('percussion') ? 'active' : ''} onClick={() => handleSetEndoTest('percussion')}>
            <img src="/images/teeth/endodoncia/percussion.png" alt="Percusión" className="endo-test-image" />
            <span>Percusión</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeriodontalModule;