'use client';

import React, { useState, useEffect } from 'react';
import './styles/EndodonticModule.css';
import Odontograma from './Odontograma';

interface EndodonticModuleProps {
  selectedTooth: number | null;
  teethData: any[];
}

const EndodonticModule: React.FC<EndodonticModuleProps> = ({ selectedTooth, teethData }) => {
  const [endoMode, setEndoMode] = useState<boolean>(true);
  const [testResults, setTestResults] = useState<any>({});

  useEffect(() => {
    document.dispatchEvent(new CustomEvent('endoModeChange', {
      detail: { active: endoMode }
    }));
  }, [endoMode]);

  const handleTestResult = (toothId: number, test: string, result: string) => {
    setTestResults(prev => ({
      ...prev,
      [toothId]: {
        ...prev[toothId],
        [test]: result
      }
    }));
  };

  const renderEndoTests = () => {
    if (!selectedTooth) return null;

    const tests = [
      { id: 'cold', name: 'Frío', icon: '❄️' },
      { id: 'heat', name: 'Calor', icon: '🔥' },
      { id: 'electricity', name: 'Electricidad', icon: '⚡' },
      { id: 'percussion', name: 'Percusión', icon: '🔨' },
      { id: 'palpation', name: 'Palpación', icon: '👆' }
    ];

    return (
      <div className="endo-tests">
        <h4>Pruebas Endodónticas - Diente {selectedTooth}</h4>
        <div className="tests-grid">
          {tests.map(test => (
            <div key={test.id} className="test-item">
              <div className="test-header">
                <span className="test-icon">{test.icon}</span>
                <span className="test-name">{test.name}</span>
              </div>
              <div className="test-results">
                <button 
                  className={`result-button positive ${testResults[selectedTooth]?.[test.id] === 'positive' ? 'active' : ''}`}
                  onClick={() => handleTestResult(selectedTooth, test.id, 'positive')}
                >
                  +
                </button>
                <button 
                  className={`result-button negative ${testResults[selectedTooth]?.[test.id] === 'negative' ? 'active' : ''}`}
                  onClick={() => handleTestResult(selectedTooth, test.id, 'negative')}
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="endodontic-module">
      <div className="endo-header">
        <h3>Módulo Endodóntico</h3>
        <button 
          className={`endo-toggle ${endoMode ? 'active' : ''}`}
          onClick={() => setEndoMode(!endoMode)}
        >
          {endoMode ? 'Desactivar' : 'Activar'} Vista Endodóntica
        </button>
      </div>
      
      <div className="endo-content">
        <div className="endo-odontograma">
          <Odontograma 
            activeMode="endo"
            selectedTooth={selectedTooth}
            teethData={teethData}
          />
        </div>
        
        <div className="endo-panel">
          {renderEndoTests()}
          
          {selectedTooth && (
            <div className="endo-diagnosis">
              <h4>Diagnóstico</h4>
              <textarea 
                className="diagnosis-textarea"
                placeholder="Escriba el diagnóstico endodóntico..."
                rows={4}
              />
              <button className="save-diagnosis-button">
                Guardar Diagnóstico
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EndodonticModule;