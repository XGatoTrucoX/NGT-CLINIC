'use client';

import React, { useState, useEffect } from 'react';
import './styles/OdontogramaApp.css';
import TabsNavigation from './TabsNavigation';
import Odontograma from './Odontograma';
import StatePanel from './StatePanel';
import QuickSelect from './QuickSelect';
import ViewMenu from './ViewMenu';
import EndodonticModule from './EndodonticModule';
import PeriodontalModule from './PeriodontalModule';
import Sidebar from './Sidebar';
import ConfirmationMessage from './ConfirmationMessage';
import DateTimeline from './DateTimeline';
import ToothDetailView from './ToothDetailView';
import { teethData as initialTeethData } from './utils/teethData';
import { applyStateToTooth } from './utils/dentalViewSystem';

const OdontogramaApp: React.FC = () => {
  const [activeMode, setActiveMode] = useState('quickselect');
  const [activeTab, setActiveTab] = useState('general');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [teethData, setTeethData] = useState(initialTeethData);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);

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
  
  useEffect(() => {
    const handleUpdateToothPerioData = (event: any) => {
      const { toothId, perioData } = event.detail;
      
      setTeethData(prevTeethData => {
        return prevTeethData.map(tooth => {
          if (tooth.id === toothId) {
            return { 
              ...tooth, 
              perioData: {
                ...tooth.perioData,
                ...perioData
              }
            };
          }
          return tooth;
        });
      });
    };
    
    document.addEventListener('updateToothPerioData', handleUpdateToothPerioData);
    return () => {
      document.removeEventListener('updateToothPerioData', handleUpdateToothPerioData);
    };
  }, []);

  const handleUpdateTooth = (toothId: number, newState: any) => {
    setTeethData(prevTeethData => {
      const updatedTeethData = prevTeethData.map(tooth => {
        if (tooth.id === toothId) {
          return { ...tooth, ...newState };
        }
        return tooth;
      });

      return applyStateToTooth(updatedTeethData, toothId, 'custom', true);
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

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        if (selectedTooth && activeMode !== 'quickselect') {
          return (
            <div className="main-layout clean-detail-view">
              <div className="main-panel">
                <div className="tooth-view-area tooth-detail-container">
                  <ToothDetailView 
                    selectedTooth={selectedTooth} 
                    teethData={teethData}
                    onClose={() => setSelectedTooth(null)}
                  />
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="main-layout">
              <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
                <div className="tooth-view-area">
                  <Odontograma 
                    activeMode={activeMode} 
                    selectedTooth={selectedTooth} 
                    teethData={teethData} 
                    selectedTeeth={selectedTeeth}
                    setSelectedTeeth={setSelectedTeeth}
                    setSelectedTooth={setSelectedTooth}
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
                  onClick={() => setShowRightPanel(!showRightPanel)}
                  title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
                >
                  {showRightPanel ? "❮" : "❯"}
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
          );
        }
      case 'quickselect':
        return (
          <div className="main-layout">
            <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
              <div className="tooth-view-area">
                <Odontograma 
                  activeMode={activeMode} 
                  selectedTooth={selectedTooth} 
                  teethData={teethData} 
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                  setSelectedTooth={setSelectedTooth}
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
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
              >
                {showRightPanel ? "❮" : "❯"}
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
        );
      case 'perio':
        return (
          <div className="main-layout">
            <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
              <div className="tooth-view-area">
                <Odontograma 
                  activeMode={activeMode} 
                  selectedTooth={selectedTooth} 
                  teethData={teethData} 
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                  setSelectedTooth={setSelectedTooth}
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
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
              >
                {showRightPanel ? "❮" : "❯"}
              </button>
            </div>
            {showRightPanel && (
              <div className="right-panel">
                <PeriodontalModule 
                  selectedTooth={selectedTooth} 
                  teethData={teethData}
                />
              </div>
            )}
          </div>
        );
      case 'endo':
        return (
          <div className="main-layout">
            <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
              <EndodonticModule 
                selectedTooth={selectedTooth}
                teethData={teethData}
              />
              <div className="view-menu-container">
                <ViewMenu />
              </div>
              <div className="sidebar-container">
                <Sidebar activeMode={activeMode} setActiveMode={setActiveMode} />
              </div>
              <button 
                className="toggle-panel-button"
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
              >
                {showRightPanel ? "❮" : "❯"}
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
        );
      default:
        return (
          <div className="main-layout">
            <div className={`left-panel ${!showRightPanel ? 'expanded' : ''}`}>
              <div className="tooth-view-area">
                <Odontograma 
                  activeMode={activeMode} 
                  selectedTooth={selectedTooth} 
                  teethData={teethData} 
                  selectedTeeth={selectedTeeth}
                  setSelectedTeeth={setSelectedTeeth}
                  setSelectedTooth={setSelectedTooth}
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
                onClick={() => setShowRightPanel(!showRightPanel)}
                title={showRightPanel ? "Ocultar panel" : "Mostrar panel"}
              >
                {showRightPanel ? "❮" : "❯"}
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
        );
    }
  };

  return (
    <div className="odontograma-app">
      <div className="mb-4">
        <TabsNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <main className="app-main">
        {renderContent()}
        <div className="fixed-components">
          <ConfirmationMessage />
          <DateTimeline />
        </div>
      </main>
    </div>
  );
};

export default OdontogramaApp;