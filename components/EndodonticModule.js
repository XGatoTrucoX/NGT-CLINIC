import React, { useState, useEffect } from 'react';
import '../styles/EndodonticModule.css';
import { isTestCompatibleWithState } from '../utils/dentalViewSystem';

const EndodonticModule = ({ selectedTooth, teethData, onUpdateTooth }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({
    frio: { positive: false, negative: false },
    calor: { positive: false, negative: false },
    electricidad: { positive: false, negative: false },
    percusion: { positive: false, negative: false },
    palpacion: { positive: false, negative: false }
  });

  // Obtener el estado actual del diente seleccionado
  const getToothState = () => {
    if (!selectedTooth) return 'normal';
    
    const tooth = teethData.find(t => t.id === selectedTooth);
    if (!tooth) return 'normal';
    
    if (tooth.isAbsent) return 'faltante';
    if (tooth.isImplant) return tooth.hasImplantEndo ? 'implante_endodoncia' : 'implante';
    if (tooth.isPontic) return 'pontic';
    if (tooth.hasNecrosis) return 'necrosis';
    if (tooth.hasCarilla) return 'carilla';
    
    return 'normal';
  };

  // Verificar si una prueba es compatible con el estado actual del diente
  const isTestCompatible = (test) => {
    const currentState = getToothState();
    return isTestCompatibleWithState(currentState, test);
  };

  // Activar el modo endodóntico cuando se monte el componente
  useEffect(() => {
    document.dispatchEvent(new CustomEvent('endoModeChange', {
      detail: { active: true }
    }));
    
    return () => {
      document.dispatchEvent(new CustomEvent('endoModeChange', {
        detail: { active: false }
      }));
    };
  }, []);

  // Manejar la selección de una prueba
  const handleTestSelect = (test) => {
    if (!isTestCompatible(test)) {
      alert(`La prueba ${test} no es compatible con el estado actual del diente.`);
      return;
    }
    
    setActiveTest(activeTest === test ? null : test);
  };

  // Manejar el resultado de una prueba
  const handleTestResult = (test, result) => {
    setTestResults(prev => ({
      ...prev,
      [test]: {
        positive: result === 'positive',
        negative: result === 'negative'
      }
    }));
    
    // Actualizar el estado del diente según el resultado
    if (selectedTooth) {
      const updatedConditions = [];
      
      // Agregar condición de necrosis si la prueba de frío es negativa
      if (test === 'frio' && result === 'negative') {
        onUpdateTooth(selectedTooth, { hasNecrosis: true, conditions: [...updatedConditions, { type: 'necrosis' }] });
      }
      
      // Agregar condición de lesión periapical si la prueba de percusión es positiva
      if (test === 'percusion' && result === 'positive') {
        onUpdateTooth(selectedTooth, { hasLesionPeriapical: true, conditions: [...updatedConditions, { type: 'lesion_periapical' }] });
      }
    }
  };

  // Renderizar el botón para una prueba específica
  const renderTestButton = (test, label, icon) => {
    const isCompatible = isTestCompatible(test);
    const isActive = activeTest === test;
    const testResult = testResults[test];
    
    return (
      <div className={`endo-test-button ${isActive ? 'active' : ''} ${!isCompatible ? 'disabled' : ''}`}>
        <button 
          onClick={() => handleTestSelect(test)}
          disabled={!isCompatible}
          className={`test-button ${isActive ? 'active' : ''}`}
        >
          {icon && <img src={`/images/teeth/endodoncia/${icon}.png`} alt={label} className="test-icon" />}
          <span>{label}</span>
        </button>
        
        {isActive && (
          <div className="test-results">
            <button 
              className={`result-button ${testResult.positive ? 'active' : ''}`}
              onClick={() => handleTestResult(test, 'positive')}
            >
              Positivo
            </button>
            <button 
              className={`result-button ${testResult.negative ? 'active' : ''}`}
              onClick={() => handleTestResult(test, 'negative')}
            >
              Negativo
            </button>
          </div>
        )}
      </div>
    );
  };

  // Si no hay diente seleccionado, mostrar mensaje
  if (!selectedTooth) {
    return (
      <div className="endodontic-module">
        <h3>Módulo Endodóntico</h3>
        <p>Seleccione un diente para realizar pruebas endodónticas.</p>
      </div>
    );
  }

  // Obtener el diente seleccionado
  const tooth = teethData.find(t => t.id === selectedTooth);
  
  return (
    <div className="endodontic-module">
      <h3>Módulo Endodóntico - Diente {selectedTooth}</h3>
      
      <div className="endo-tests">
        {renderTestButton('frio', 'Prueba de Frío', 'cold')}
        {renderTestButton('calor', 'Prueba de Calor', 'heat')}
        {renderTestButton('electricidad', 'Prueba Eléctrica', 'electricity')}
        {renderTestButton('percusion', 'Percusión', 'percussion')}
        {renderTestButton('palpacion', 'Palpación', 'palpation')}
      </div>
      
      <div className="endo-states">
        <h4>Estados Endodónticos</h4>
        <div className="endo-state-buttons">
          <button 
            className={`state-button ${tooth?.hasNecrosis ? 'active' : ''}`}
            onClick={() => onUpdateTooth(selectedTooth, { hasNecrosis: !tooth?.hasNecrosis })}
            disabled={tooth?.isAbsent || tooth?.isPontic}
          >
            Necrosis
          </button>
          <button 
            className={`state-button ${tooth?.hasLesionPeriapical ? 'active' : ''}`}
            onClick={() => onUpdateTooth(selectedTooth, { hasLesionPeriapical: !tooth?.hasLesionPeriapical })}
            disabled={tooth?.isAbsent || tooth?.isPontic}
          >
            Lesión Periapical
          </button>
          <button 
            className={`state-button ${tooth?.hasImplantEndo ? 'active' : ''}`}
            onClick={() => onUpdateTooth(selectedTooth, { hasImplantEndo: !tooth?.hasImplantEndo })}
            disabled={!tooth?.isImplant}
          >
            Implante Endodóntico
          </button>
          <button 
            className={`state-button ${tooth?.hasCarilla ? 'active' : ''}`}
            onClick={() => onUpdateTooth(selectedTooth, { hasCarilla: !tooth?.hasCarilla })}
            disabled={tooth?.isAbsent || tooth?.isPontic || tooth?.isImplant}
          >
            Carilla
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndodonticModule;
