'use client';

import React, { useState, useEffect } from 'react';
import './styles/OdontogramaApp.css';
import Odontograma from './Odontograma';
import StatePanel from './StatePanel';
import ViewMenu from './ViewMenu';
import Sidebar from './Sidebar';
import { teethData as initialTeethData } from './utils/teethData';

const OdontogramaApp: React.FC = () => {
  const [activeMode, setActiveMode] = useState('quickselect');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [teethData, setTeethData] = useState(initialTeethData);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    const handleToothSelect = (event: any) => {
      const { toothId } = event.detail;
      setSelectedTooth(toothId);
    };

    document.addEventListener('toothSelect', handleToothSelect);
    return () => {
      document.removeEventListener('toothSelect', handleToothSelect);
    };
  }, []);

  const handleUpdateTooth = (toothId: number, newState: any) => {
    setTeethData(prevTeethData => {
      return prevTeethData.map(tooth => {
        if (tooth.id === toothId) {
          return { ...tooth, ...newState };
        }
        return tooth;
      });
    });
  };

  const handleUpdateTeeth = (teethIds: number[], option: string) => {
    const updatedTeethData = [...teethData];
    
    teethIds.forEach(toothId => {
      const toothIndex = updatedTeethData.findIndex(t => t.id === toothId);
      if (toothIndex !== -1) {
        const cleanTooth = {
          ...updatedTeethData[toothIndex],
          isAbsent: option === 'ausente',
          isImplant: option === 'implante',
          isPontic: option === 'puente',
          hasCarilla: option === 'corona',
          conditions: [] as any[]
        };
        
        if (option === 'endodoncia') {
          cleanTooth.conditions.push({ type: 'endodoncia' });
        } else if (option === 'caries') {
          cleanTooth.conditions.push({ type: 'caries' });
        } else if (option === 'obturacion') {
          cleanTooth.conditions.push({ type: 'obturacion' });
        }
        
        updatedTeethData[toothIndex] = cleanTooth;
      }
    });
    
    setTeethData(updatedTeethData);
    
    document.dispatchEvent(new CustomEvent('applyToTeeth', {
      detail: { teeth: teethIds, option }
    }));
  };

  return (
    <div className="odontograma-app">
      {/* HEADER VISIBLE PARA VERIFICAR CAMBIOS */}
      <div style={{
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
        color: 'white',
        padding: '20px',
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
      }}>
        🦷 ODONTOGRAMA CLÍNICA NGT - CAMBIOS APLICADOS ✅
        <div style={{ fontSize: '14px', marginTop: '5px', opacity: 0.9 }}>
          Última actualización: {new Date().toLocaleTimeString()} | Clics: {clickCount}
        </div>
      </div>
      <div className="main-layout">
        <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
          <div className="tooth-view-area">
            <Odontograma 
              activeMode={activeMode}
            />
          </div>
          <div className="view-menu-container">
            <ViewMenu />
          </div>
          <div className="sidebar-container">
            <Sidebar activeMode={activeMode} setActiveMode={setActiveMode} />
          </div>
          <button 
            className="toggle-panel-button"
            onClick={() => {
              setShowRightPanel(!showRightPanel);
              setClickCount(prev => prev + 1);
            }}
            title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
            style={{
              background: showRightPanel ? '#ff4757' : '#2ed573',
              color: 'white',
              border: '3px solid #fff',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              fontSize: '20px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {showRightPanel ? "✕" : "☰"}
          </button>
        </div>
        {showRightPanel && (
          <div className="right-panel">
            <StatePanel 
              selectedTooth={selectedTooth} 
              selectedTeeth={selectedTeeth}
              setSelectedTeeth={setSelectedTeeth}
              teethData={teethData} 
              onUpdateTooth={handleUpdateTooth}
              onUpdateTeeth={handleUpdateTeeth}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OdontogramaApp;