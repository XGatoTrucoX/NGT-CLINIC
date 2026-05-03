'use client';

import React, { useState, useEffect, useRef } from 'react';
import './styles/EndodonticModule.css';
import Odontograma from './Odontograma';

interface EndodonticModuleProps {
  selectedTooth: number | null;
  teethData: any[];
}

const EndodonticModule: React.FC<EndodonticModuleProps> = ({ selectedTooth, teethData }) => {
  const [endoMode, setEndoMode] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<any>({});
  const activatedOnce = useRef(false);

  useEffect(() => {
    if (selectedTooth && !activatedOnce.current) {
      activatedOnce.current = true;
      setEndoMode(true);
    }
  }, [selectedTooth]);

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
      { id: 'cold',        name: 'Frío',         icon: '/images/teeth/endodoncia/cold.png',        emoji: '❄️' },
      { id: 'heat',        name: 'Calor',        icon: '/images/teeth/endodoncia/heat.png',        emoji: '🔥' },
      { id: 'electricity', name: 'Electricidad', icon: '/images/teeth/endodoncia/electricity.png', emoji: '⚡' },
      { id: 'percussion',  name: 'Percusión',    icon: '/images/teeth/endodoncia/percussion.png',  emoji: '🔨' },
      { id: 'palpation',   name: 'Palpación',    icon: '/images/teeth/endodoncia/palpation.png',   emoji: '👆' }
    ];

    const getLevel = (toothId: number, testId: string): number =>
      testResults[toothId]?.[testId] ?? 0;

    const setLevel = (toothId: number, testId: string, val: number) => {
      const clamped = Math.max(0, Math.min(5, val));
      setTestResults((prev: any) => ({
        ...prev,
        [toothId]: { ...prev[toothId], [testId]: clamped }
      }));
      // Emitir evento para que Tooth.tsx muestre el indicador
      document.dispatchEvent(new CustomEvent('endoTestLevel', {
        detail: { toothId, testId, level: clamped }
      }));
    };

    const levelColor = (level: number) => {
      if (level === 0) return '#475569';
      if (level <= 2)  return '#22c55e';
      if (level === 3) return '#f59e0b';
      return '#ef4444';
    };

    return (
      <div className="endo-tests">
        <h4>Tests Endodónticos — Diente {selectedTooth}</h4>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 1rem' }}>
          Nivel de respuesta: 0 = sin respuesta · 1 leve → 5 fuerte
        </p>
        <div className="tests-grid">
          {tests.map(test => {
            const level = getLevel(selectedTooth, test.id);
            return (
              <div key={test.id} className="test-item">
                <div className="test-header">
                  <img src={test.icon} alt={test.name}
                    style={{ width: 24, height: 24, objectFit: 'contain' }}
                    onError={e => { (e.target as HTMLImageElement).style.display='none'; }}
                  />
                  <span className="test-name">{test.name}</span>
                  <span style={{
                    marginLeft: 'auto', fontWeight: 700, fontSize: '1.1rem',
                    color: levelColor(level), minWidth: 20, textAlign: 'right'
                  }}>
                    {level > 0 ? level : '—'}
                  </span>
                </div>
                {/* Barra visual */}
                <div style={{ display: 'flex', gap: 3, margin: '6px 0' }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{
                      flex: 1, height: 6, borderRadius: 3,
                      background: n <= level ? levelColor(level) : '#334155',
                      transition: 'background 0.2s'
                    }} />
                  ))}
                </div>
                <div className="test-results">
                  <button className="result-button negative"
                    onClick={() => setLevel(selectedTooth, test.id, level - 1)}
                    disabled={level === 0}>
                    −
                  </button>
                  <span style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>
                    {level === 0 ? 'Sin respuesta' : level === 1 ? 'Leve' : level === 2 ? 'Moderado leve' : level === 3 ? 'Moderado' : level === 4 ? 'Intenso' : 'Muy fuerte'}
                  </span>
                  <button className="result-button positive"
                    onClick={() => setLevel(selectedTooth, test.id, level + 1)}
                    disabled={level === 5}>
                    +
                  </button>
                </div>
              </div>
            );
          })}
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
        
        {endoMode && (
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
        )}
      </div>
    </div>
  );
};

export default EndodonticModule;