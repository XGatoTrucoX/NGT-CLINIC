'use client';

import React, { useState } from 'react';

const SimpleOdontograma: React.FC = () => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const teeth = [11, 12, 13, 14, 15, 16, 17, 18, 21, 22, 23, 24, 25, 26, 27, 28, 31, 32, 33, 34, 35, 36, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48];

  const applyState = (state: string) => {
    if (!selectedTooth) return;
    alert(`Aplicando ${state} al diente ${selectedTooth}`);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1f2e', color: 'white' }}>
      {/* Panel izquierdo - Odontograma */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px' }}>Odontograma</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {teeth.slice(0, 16).map(toothId => (
            <button
              key={toothId}
              onClick={() => setSelectedTooth(toothId)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: selectedTooth === toothId ? '#4a90e2' : '#2a3142',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {toothId}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px' }}>
          {teeth.slice(16, 32).map(toothId => (
            <button
              key={toothId}
              onClick={() => setSelectedTooth(toothId)}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: selectedTooth === toothId ? '#4a90e2' : '#2a3142',
                color: 'white',
                border: '1px solid #444',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {toothId}
            </button>
          ))}
        </div>
      </div>

      {/* Panel derecho - Estados - SIEMPRE VISIBLE */}
      <div style={{ 
        width: '300px', 
        backgroundColor: '#2a3142', 
        padding: '20px', 
        borderLeft: '1px solid #444',
        position: 'fixed',
        right: '0',
        top: '0',
        height: '100vh',
        zIndex: 1000
      }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>
          {selectedTooth ? `Diente ${selectedTooth}` : 'Selecciona un diente'}
        </h3>
        
        {/* BOTONES SIEMPRE VISIBLES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => applyState('Normal')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            Normal
          </button>
          <button 
            onClick={() => applyState('Ausente')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            🦷 Ausente
          </button>
          <button 
            onClick={() => applyState('Implante')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            🔩 Implante
          </button>
          <button 
            onClick={() => applyState('Corona')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            👑 Corona
          </button>
          <button 
            onClick={() => applyState('Caries')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            🔴 Caries
          </button>
          <button 
            onClick={() => applyState('Endodoncia')}
            disabled={!selectedTooth}
            style={{
              padding: '10px',
              backgroundColor: selectedTooth ? '#3a4152' : '#666',
              color: 'white',
              border: '1px solid #4a5162',
              borderRadius: '4px',
              cursor: selectedTooth ? 'pointer' : 'not-allowed'
            }}
          >
            🔬 Endodoncia
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleOdontograma;