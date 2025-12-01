'use client';

import React, { useState, useEffect } from 'react';
import './styles/Odontograma.css';
import Tooth from './Tooth';
import DateTimeline from './DateTimeline';
import PerioExamPanel from './PerioExamPanel';
import { getMirrorToothId } from './utils/dentalViewSystem';
import { teethData as initialTeethData } from './utils/teethData';

interface OdontogramaProps {
  activeMode: string;
  selectedTooth?: number | null;
  teethData?: any[];
  selectedTeeth?: number[];
  setSelectedTeeth?: (teeth: number[]) => void;
  setSelectedTooth?: (tooth: number | null) => void;
}

const Odontograma: React.FC<OdontogramaProps> = ({ 
  activeMode, 
  selectedTooth: propSelectedTooth, 
  teethData: propTeethData, 
  selectedTeeth: propSelectedTeeth, 
  setSelectedTeeth: propSetSelectedTeeth,
  setSelectedTooth: propSetSelectedTooth
}) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(propSelectedTooth || null);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>(propSelectedTeeth || []);
  const [activeView, setActiveView] = useState('full');
  const [teethData, setTeethData] = useState(propTeethData || initialTeethData);
  
  // Sincronizar con props
  useEffect(() => {
    if (propSelectedTooth !== undefined) setSelectedTooth(propSelectedTooth);
  }, [propSelectedTooth]);
  
  useEffect(() => {
    if (propSelectedTeeth !== undefined) setSelectedTeeth(propSelectedTeeth);
  }, [propSelectedTeeth]);
  
  useEffect(() => {
    if (propTeethData !== undefined) setTeethData(propTeethData);
  }, [propTeethData]);
  
  useEffect(() => {
    const handleViewChange = (event: any) => {
      console.log(`Recibido evento changeView: ${event.detail.view}`);
      setActiveView(event.detail.view);
      
      console.log(`Vista actualizada a: ${event.detail.view}`);
      
      if (selectedTeeth.length > 0) {
        setTimeout(() => {
          selectedTeeth.forEach(toothId => {
            const toothContainers = document.querySelectorAll(`.tooth-container[data-tooth-id="${toothId}"]`);
            toothContainers.forEach(container => {
              if (activeMode === 'quickselect') {
                container.classList.add('selected');
              }
            });
          });
        }, 100);
      }
    };
    
    document.addEventListener('changeView', handleViewChange);
    console.log('Event listener para changeView configurado');
    console.log(`Estado actual de activeView: ${activeView}`);
    
    return () => {
      document.removeEventListener('changeView', handleViewChange);
      console.log('Event listener para changeView removido');
    };
  }, [selectedTeeth, activeMode]);
  
  useEffect(() => {
    const handleApplyToTeeth = (event: any) => {
      const { teeth, option } = event.detail;
      console.log(`Aplicando ${option} a los dientes:`, teeth);
      console.log('Estado actual de teethData antes del cambio:', teethData);
      
      setTeethData(prevTeethData => {
        const newTeethData = prevTeethData.map(tooth => {
          if (teeth.includes(tooth.id.toString())) {
            console.log(`Actualizando diente ${tooth.id} con opción ${option}`);
            
            const cleanTooth = {
              ...tooth,
              toBeExtracted: false,
              isAbsent: false,
              isImplant: false,
              isPontic: false,
              hasWear: false,
              hasCarilla: false,
              hasImplantEndo: false,
              hasNecrosis: false,
              hasLesionPeriapical: false,
              conditions: []
            };
            
            switch (option) {
              case 'caries':
                cleanTooth.toBeExtracted = true;
                break;
              case 'ausente':
                cleanTooth.isAbsent = true;
                break;
              case 'corona':
                cleanTooth.hasCarilla = true;
                cleanTooth.conditions.push({ type: 'carilla' });
                break;
              case 'puente':
                cleanTooth.isPontic = true;
                break;
              case 'implante':
                cleanTooth.isImplant = true;
                break;
              case 'endodoncia':
                cleanTooth.conditions.push({ type: 'endodoncia' });
                break;
              case 'fractura':
                cleanTooth.conditions.push({ type: 'fractura' });
                break;
              case 'obturacion':
                cleanTooth.conditions.push({ type: 'obturacion' });
                break;
              default:
                break;
            }
            
            return cleanTooth;
          }
          return tooth;
        });
        
        console.log('Nuevo estado de teethData después del cambio:', newTeethData);
        
        setTimeout(() => {
          teeth.forEach((toothId: string) => {
            const toothContainers = document.querySelectorAll(`.tooth-container[data-tooth-id="${toothId}"]`);
            
            if (toothContainers.length > 0) {
              toothContainers.forEach(toothContainer => {
                const img = toothContainer.querySelector('img');
                if (img) {
                  const position = toothContainer.getAttribute('data-position') || 'buccal';
                  
                  let imageToothId = parseInt(toothId);
                  
                  if ((imageToothId >= 21 && imageToothId <= 28) || (imageToothId >= 31 && imageToothId <= 38)) {
                    if (imageToothId >= 21 && imageToothId <= 28) {
                      imageToothId = imageToothId - 10;
                    } else if (imageToothId >= 31 && imageToothId <= 38) {
                      imageToothId = imageToothId + 10;
                    }
                  }
                  
                  let newSrc = `/images/teeth/${position}/${position}.`;
                  
                  if (position === 'incisal') {
                    if (option === 'ausente') {
                      newSrc = `/images/teeth/incisal/incisal.${imageToothId}.png`;
                    } else if (option === 'implante' || option === 'normal') {
                      newSrc = `/images/teeth/incisal/incisal.tooth.${imageToothId}.png`;
                    } else if (option === 'puente') {
                      newSrc += `tooth.${imageToothId}.png`;
                    } else if (option === 'desgaste') {
                      newSrc += `dental.wear.${imageToothId}.png`;
                    } else if (option === 'corona') {
                      newSrc += `tooth.${imageToothId}.png`;
                    } else {
                      newSrc += `tooth.${imageToothId}.png`;
                    }
                  } else {
                    if (option === 'implante') {
                      newSrc += `implant.${imageToothId}.png`;
                    } else if (option === 'puente') {
                      newSrc += `pontics.${imageToothId}.png`;
                    } else if (option === 'desgaste') {
                      newSrc += `dental.wear.${imageToothId}.png`;
                    } else if (option === 'corona') {
                      newSrc += `tooth.${imageToothId}.png`;
                    } else if (option === 'ausente') {
                      newSrc += `${imageToothId}.png`;
                    } else {
                      newSrc += `tooth.${imageToothId}.png`;
                    }
                  }
                  
                  newSrc += `?t=${new Date().getTime()}`;
                  
                  console.log(`Actualizando imagen del diente ${toothId} en vista ${position} a estado ${option}. Nueva ruta:`, newSrc);
                  img.src = newSrc;
                  
                  const dataState = option === 'puente' ? 'pontic' : 
                                   option === 'ausente' ? 'faltante' : option;
                  toothContainer.setAttribute('data-state', dataState);
                }
              });
            }
          });
          
          const otherToothImages = document.querySelectorAll('.tooth-image');
          otherToothImages.forEach(img => {
            const container = (img as HTMLElement).parentElement;
            if (container && !teeth.includes(container.getAttribute('data-tooth-id'))) {
              const currentSrc = (img as HTMLImageElement).src;
              if (currentSrc.includes('?')) {
                (img as HTMLImageElement).src = currentSrc.split('?')[0] + '?t=' + new Date().getTime();
              } else {
                (img as HTMLImageElement).src = currentSrc + '?t=' + new Date().getTime();
              }
            }
          });
        }, 100);
        
        return newTeethData;
      });
    };
    
    const handleToothDeselect = () => {
      setSelectedTooth(null);
    };
    
    console.log('Configurando event listeners');
    document.addEventListener('applyToTeeth', handleApplyToTeeth);
    document.addEventListener('toothDeselect', handleToothDeselect);
    
    return () => {
      document.removeEventListener('applyToTeeth', handleApplyToTeeth);
      document.removeEventListener('toothDeselect', handleToothDeselect);
    };
  }, []);
  
  const upperTeeth = teethData.filter(tooth => tooth.id >= 11 && tooth.id <= 28);
  const lowerTeeth = teethData.filter(tooth => (tooth.id >= 31 && tooth.id <= 38) || (tooth.id >= 41 && tooth.id <= 48));
  
  const sortedUpperTeeth = [...upperTeeth].sort((a, b) => {
    if (a.id >= 11 && a.id <= 18 && b.id >= 11 && b.id <= 18) {
      return b.id - a.id;
    } else if (a.id >= 21 && a.id <= 28 && b.id >= 21 && b.id <= 28) {
      return a.id - b.id;
    } else {
      return a.id < 20 ? -1 : 1;
    }
  });
  
  const sortedLowerTeeth = [...lowerTeeth].sort((a, b) => {
    if (a.id >= 41 && a.id <= 48 && b.id >= 41 && b.id <= 48) {
      return b.id - a.id;
    } else if (a.id >= 31 && a.id <= 38 && b.id >= 31 && b.id <= 38) {
      return a.id - b.id;
    } else {
      return a.id < 40 ? 1 : -1;
    }
  });
  
  const handleToothSelect = (toothId: number) => {
    console.log(`Diente ${toothId} seleccionado en modo ${activeMode}`);
    
    if (activeMode === 'quickselect') {
      const newSelectedTeeth = selectedTeeth.includes(toothId) 
        ? selectedTeeth.filter(id => id !== toothId)
        : [...selectedTeeth, toothId];
      
      console.log('Nuevos dientes seleccionados:', newSelectedTeeth);
      
      setSelectedTeeth(newSelectedTeeth);
      if (propSetSelectedTeeth) propSetSelectedTeeth(newSelectedTeeth);
      
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('teethSelectionChange', {
          detail: { selectedTeeth: newSelectedTeeth }
        }));
      }, 0);
    } else {
      if (selectedTooth !== toothId) {
        console.log('Seleccionando diente individual:', toothId);
        setSelectedTooth(toothId);
        if (propSetSelectedTooth) propSetSelectedTooth(toothId);
        
        document.dispatchEvent(new CustomEvent('toothSelect', {
          detail: { toothId }
        }));
      }
    }
  };
  
  const renderFullView = () => (
    <>
      <div className="upper-arch">
        <div className="upper-teeth">
          {sortedUpperTeeth.map(tooth => (
            <Tooth 
              key={`buccal-${tooth.id}`}
              tooth={{...tooth, position: 'buccal'}}
              isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
              onSelect={() => handleToothSelect(tooth.id)}
              activeMode={activeMode}
            />
          ))}
        </div>
        
        <div className="upper-teeth-incisal">
          {sortedUpperTeeth.map(tooth => (
            <Tooth 
              key={`incisal-${tooth.id}`}
              tooth={{...tooth, position: 'incisal'}}
              isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
              onSelect={() => handleToothSelect(tooth.id)}
              activeMode={activeMode}
            />
          ))}
        </div>
        
        <div className="teeth-numbers">
          {sortedUpperTeeth.map(tooth => (
            <div key={tooth.id} className="tooth-number">{tooth.id}</div>
          ))}
        </div>
      </div>
      
      <div className="lower-arch">
        <div className="teeth-numbers">
          {sortedLowerTeeth.map(tooth => (
            <div key={tooth.id} className="tooth-number">{tooth.id}</div>
          ))}
        </div>
        
        <div className="lower-teeth-incisal">
          {sortedLowerTeeth.map(tooth => (
            <Tooth 
              key={`incisal-${tooth.id}`}
              tooth={{...tooth, position: 'incisal'}}
              isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
              onSelect={() => handleToothSelect(tooth.id)}
              activeMode={activeMode}
            />
          ))}
        </div>
        
        <div className="lower-teeth">
          {sortedLowerTeeth.map(tooth => (
            <Tooth 
              key={`buccal-${tooth.id}-${tooth.isAbsent ? 'absent' : 'present'}-${tooth.isImplant ? 'implant' : ''}-${tooth.isPontic ? 'pontic' : ''}`}
              tooth={{...tooth, position: 'buccal'}}
              isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
              onSelect={() => handleToothSelect(tooth.id)}
              activeMode={activeMode}
            />
          ))}
        </div>
      </div>
    </>
  );
  
  const renderUpperView = () => (
    <>
      <div className="upper-teeth">
        {sortedUpperTeeth.map(tooth => (
          <Tooth 
            key={`buccal-${tooth.id}`}
            tooth={{...tooth, position: 'buccal'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="upper-teeth-incisal">
        {sortedUpperTeeth.map(tooth => (
          <Tooth 
            key={`incisal-${tooth.id}`}
            tooth={{...tooth, position: 'incisal'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="upper-teeth-lingual">
        {sortedUpperTeeth.map(tooth => (
          <Tooth 
            key={`lingual-${tooth.id}`}
            tooth={{...tooth, position: 'lingual'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="teeth-numbers">
        {sortedUpperTeeth.map(tooth => (
          <div key={tooth.id} className="tooth-number">{tooth.id}</div>
        ))}
      </div>
    </>
  );
  
  const renderLowerView = () => (
    <>
      <div className="lower-teeth-lingual">
        {sortedLowerTeeth.map(tooth => (
          <Tooth 
            key={`lingual-${tooth.id}`}
            tooth={{...tooth, position: 'lingual'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="lower-teeth-incisal">
        {sortedLowerTeeth.map(tooth => (
          <Tooth 
            key={`incisal-${tooth.id}`}
            tooth={{...tooth, position: 'incisal'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="lower-teeth">
        {sortedLowerTeeth.map(tooth => (
          <Tooth 
            key={`buccal-${tooth.id}-${tooth.isAbsent ? 'absent' : 'present'}-${tooth.isImplant ? 'implant' : ''}-${tooth.isPontic ? 'pontic' : ''}`}
            tooth={{...tooth, position: 'buccal'}}
            isSelected={activeMode === 'quickselect' ? selectedTeeth.includes(tooth.id) : selectedTooth === tooth.id}
            onSelect={() => handleToothSelect(tooth.id)}
            activeMode={activeMode}
          />
        ))}
      </div>
      
      <div className="teeth-numbers">
        {sortedLowerTeeth.map(tooth => (
          <div key={tooth.id} className="tooth-number">{tooth.id}</div>
        ))}
      </div>
    </>
  );
  
  const renderClinicalParameters = () => {
    if (!selectedTooth) {
      return null;
    }

    if (activeMode === 'periodoncia' && selectedTooth) {
      return (
        <PerioExamPanel 
          toothId={selectedTooth} 
          onClose={() => setSelectedTooth(null)}
        />
      );
    }

    return (
      <div className="clinical-parameters">
        <h3>Diente {selectedTooth}</h3>
        <p>Parámetros para el diente {selectedTooth}</p>
        <button onClick={() => setSelectedTooth(null)}>Cerrar</button>
      </div>
    );
  };

  return (
    <div className="odontograma-container">
      <div className="teeth-view">
        {console.log('Estado actual de activeView en render:', activeView)}
        {activeView === 'full' && renderFullView()}
        {activeView === 'upper' && renderUpperView()}
        {activeView === 'lower' && renderLowerView()}
        
        <DateTimeline />
      </div>
      
      {renderClinicalParameters()}
    </div>
  );
};

export default Odontograma;