import React, { useState, useEffect } from 'react';
import '../styles/Odontograma.css';
import Tooth from './Tooth';
import DateTimeline from './DateTimeline';
import PerioExamPanel from './PerioExamPanel';
import { getMirrorToothId } from '../utils/dentalViewSystem';
import { teethData as initialTeethData } from '../utils/teethData';

const Odontograma = ({ activeMode }) => {
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [activeView, setActiveView] = useState('full');
  const [teethData, setTeethData] = useState(initialTeethData);
  
  // Escuchar eventos de cambio de vista - CORREGIDO
  useEffect(() => {
    const handleViewChange = (event) => {
      console.log(`Recibido evento changeView: ${event.detail.view}`);
      setActiveView(event.detail.view);
      
      // Agregar un mensaje de confirmación para depuración
      console.log(`Vista actualizada a: ${event.detail.view}`);
      
      // Mantener la selección de dientes al cambiar de vista
      if (selectedTeeth.length > 0) {
        // Actualizar visualmente los dientes seleccionados en la nueva vista
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
  }, [selectedTeeth, activeMode]); // Añadimos selectedTeeth y activeMode como dependencias
  
  // Escuchar eventos de aplicación de opciones a dientes seleccionados
  useEffect(() => {
    const handleApplyToTeeth = (event) => {
      const { teeth, option } = event.detail;
      console.log(`Aplicando ${option} a los dientes:`, teeth);
      console.log('Estado actual de teethData antes del cambio:', teethData);
      
      // Actualizar el estado de los dientes según la opción aplicada
      setTeethData(prevTeethData => {
        const newTeethData = prevTeethData.map(tooth => {
          if (teeth.includes(tooth.id.toString())) {
            console.log(`Actualizando diente ${tooth.id} con opción ${option}`);
            
            // Crear un nuevo objeto limpio para asegurar que React detecte el cambio
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
            
            // Aplicar la opción seleccionada
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
        
        // Forzar la recarga de las imágenes de los dientes con las rutas correctas
        setTimeout(() => {
          // Actualizar las imágenes de los dientes seleccionados con las rutas correctas
          teeth.forEach(toothId => {
            // Seleccionar todos los contenedores del diente (bucal e incisal)
            const toothContainers = document.querySelectorAll(`.tooth-container[data-tooth-id="${toothId}"]`);
            
            if (toothContainers.length > 0) {
              // Iterar sobre todos los contenedores del diente (bucal, incisal, etc.)
              toothContainers.forEach(toothContainer => {
                const img = toothContainer.querySelector('img');
                if (img) {
                  // Obtener la posición (buccal, lingual, incisal)
                  const position = toothContainer.getAttribute('data-position') || 'buccal';
                  
                  // Determinar el ID del diente para la imagen (considerando el espejo)
                  let imageToothId = parseInt(toothId);
                  
                  // Si el diente está en el cuadrante superior derecho (21-28) o inferior derecho (31-38)
                  // usamos su contraparte en el cuadrante izquierdo
                  if ((imageToothId >= 21 && imageToothId <= 28) || (imageToothId >= 31 && imageToothId <= 38)) {
                    // Calcular el ID del diente espejo
                    if (imageToothId >= 21 && imageToothId <= 28) {
                      // Dientes superiores derechos (21-28) -> superiores izquierdos (11-18)
                      imageToothId = imageToothId - 10;
                    } else if (imageToothId >= 31 && imageToothId <= 38) {
                      // Dientes inferiores derechos (31-38) -> inferiores izquierdos (41-48)
                      imageToothId = imageToothId + 10;
                    }
                  }
                  
                  // Construir la nueva ruta de la imagen según la opción aplicada y la posición
                  let newSrc = `/images/teeth/${position}/${position}.`;
                  
                  // Reglas especiales para la vista incisal
                  if (position === 'incisal') {
                    if (option === 'ausente') {
                      // Para dientes ausentes en vista incisal: incisal.18.png (sin "tooth")
                      newSrc = `/images/teeth/incisal/incisal.${imageToothId}.png`;
                    } else if (option === 'implante' || option === 'normal') {
                      // Para implantes y dientes normales en vista incisal: incisal.tooth.18.png
                      newSrc = `/images/teeth/incisal/incisal.tooth.${imageToothId}.png`;
                    } else if (option === 'puente') {
                      newSrc += `pontics.${imageToothId}.png`;
                    } else if (option === 'desgaste') {
                      newSrc += `dental.wear.${imageToothId}.png`;
                    } else if (option === 'corona') {
                      newSrc += `carilla.${imageToothId}.png`;
                    } else {
                      // Otros estados
                      newSrc += `tooth.${imageToothId}.png`;
                    }
                  } else {
                    // Para otras vistas (bucal, lingual)
                    if (option === 'implante') {
                      newSrc += `implant.${imageToothId}.png`;
                    } else if (option === 'puente') {
                      newSrc += `pontics.${imageToothId}.png`;
                    } else if (option === 'desgaste') {
                      newSrc += `dental.wear.${imageToothId}.png`;
                    } else if (option === 'corona') {
                      newSrc += `carilla.${imageToothId}.png`;
                    } else if (option === 'ausente') {
                      newSrc += `${imageToothId}.png`;
                    } else {
                      // Estado normal u otros estados
                      newSrc += `tooth.${imageToothId}.png`;
                    }
                  }
                  
                  // Añadir timestamp para evitar caché
                  newSrc += `?t=${new Date().getTime()}`;
                  
                  console.log(`Actualizando imagen del diente ${toothId} en vista ${position} a estado ${option}. Nueva ruta:`, newSrc);
                  img.src = newSrc;
                  
                  // Actualizar el atributo data-state del contenedor
                  const dataState = option === 'puente' ? 'pontic' : 
                                   option === 'ausente' ? 'faltante' : option;
                  toothContainer.setAttribute('data-state', dataState);
                }
              });
            }
          });
          
          // También actualizar otras imágenes que puedan necesitar recarga
          const otherToothImages = document.querySelectorAll('.tooth-image');
          otherToothImages.forEach(img => {
            const container = img.parentElement;
            if (container && !teeth.includes(container.getAttribute('data-tooth-id'))) {
              const currentSrc = img.src;
              if (currentSrc.includes('?')) {
                img.src = currentSrc.split('?')[0] + '?t=' + new Date().getTime();
              } else {
                img.src = currentSrc + '?t=' + new Date().getTime();
              }
            }
          });
        }, 100);
        
        return newTeethData;
      });
    };
    
    // Escuchar evento para deseleccionar diente
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
  
  // Agrupar dientes por arcada
  const upperTeeth = teethData.filter(tooth => tooth.id >= 11 && tooth.id <= 28);
  const lowerTeeth = teethData.filter(tooth => (tooth.id >= 31 && tooth.id <= 38) || (tooth.id >= 41 && tooth.id <= 48));
  
  // Ordenar los dientes correctamente
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
  
  // Función para actualizar múltiples dientes con un estado específico
  const updateTeeth = (teeth, option) => {
    if (!teeth || teeth.length === 0) return;
    
    console.log(`Actualizando ${teeth.length} dientes al estado: ${option}`);
    
    // Crear un nuevo estado basado en la opción seleccionada
    const newState = {
      isAbsent: option === 'ausente',
      isImplant: option === 'implante',
      isPontic: option === 'puente',
      hasCarilla: option === 'corona',
      hasWear: option === 'desgaste',
      conditions: []
    };
    
    // Añadir condiciones específicas según la opción
    if (option === 'endodoncia') {
      newState.conditions.push({ type: 'endodoncia' });
    } else if (option === 'obturacion') {
      newState.conditions.push({ type: 'obturacion' });
    }
    
    // Actualizar el estado de los dientes seleccionados
    setTeethData(prevTeethData => {
      const newTeethData = prevTeethData.map(tooth => {
        if (teeth.includes(tooth.id.toString())) {
          return { ...tooth, ...newState };
        }
        return tooth;
      });
      return newTeethData;
    });
    
    // Forzar la recarga de las imágenes de los dientes con las rutas correctas
    setTimeout(() => {
      // Actualizar las imágenes de los dientes seleccionados con las rutas correctas
      teeth.forEach(toothId => {
        // Seleccionar todos los contenedores del diente (bucal e incisal)
        const toothContainers = document.querySelectorAll(`.tooth-container[data-tooth-id="${toothId}"]`);
        
        if (toothContainers.length > 0) {
          // Iterar sobre todos los contenedores del diente (bucal, incisal, etc.)
          toothContainers.forEach(toothContainer => {
            const img = toothContainer.querySelector('img');
            if (img) {
              // Obtener la posición (buccal, lingual, incisal)
              const position = toothContainer.getAttribute('data-position') || 'buccal';
              
              // Determinar el ID del diente para la imagen (considerando el espejo)
              let imageToothId = parseInt(toothId);
              
              // Si el diente está en el cuadrante superior derecho (21-28) o inferior derecho (31-38)
              // usamos su contraparte en el cuadrante izquierdo
              if ((imageToothId >= 21 && imageToothId <= 28) || (imageToothId >= 31 && imageToothId <= 38)) {
                // Calcular el ID del diente espejo
                if (imageToothId >= 21 && imageToothId <= 28) {
                  // Dientes superiores derechos (21-28) -> superiores izquierdos (11-18)
                  imageToothId = imageToothId - 10;
                } else if (imageToothId >= 31 && imageToothId <= 38) {
                  // Dientes inferiores derechos (31-38) -> inferiores izquierdos (41-48)
                  imageToothId = imageToothId + 10;
                }
              }
              
              // Construir la nueva ruta de la imagen según la opción aplicada y la posición
              let newSrc = `/images/teeth/${position}/${position}.`;
              
              // Reglas especiales para la vista incisal
              if (position === 'incisal') {
                if (option === 'ausente') {
                  // Para dientes ausentes en vista incisal: incisal.18.png (sin "tooth")
                  newSrc = `/images/teeth/incisal/incisal.${imageToothId}.png`;
                } else if (option === 'implante' || option === 'normal') {
                  // Para implantes y dientes normales en vista incisal: incisal.tooth.18.png
                  newSrc = `/images/teeth/incisal/incisal.tooth.${imageToothId}.png`;
                } else if (option === 'puente') {
                  newSrc += `pontics.${imageToothId}.png`;
                } else if (option === 'desgaste') {
                  newSrc += `dental.wear.${imageToothId}.png`;
                } else if (option === 'corona') {
                  newSrc += `carilla.${imageToothId}.png`;
                } else {
                  // Otros estados
                  newSrc += `tooth.${imageToothId}.png`;
                }
              } else {
                // Para otras vistas (bucal, lingual)
                if (option === 'implante') {
                  newSrc += `implant.${imageToothId}.png`;
                } else if (option === 'puente') {
                  newSrc += `pontics.${imageToothId}.png`;
                } else if (option === 'desgaste') {
                  newSrc += `dental.wear.${imageToothId}.png`;
                } else if (option === 'corona') {
                  newSrc += `carilla.${imageToothId}.png`;
                } else if (option === 'ausente') {
                  newSrc += `${imageToothId}.png`;
                } else {
                  // Estado normal u otros estados
                  newSrc += `tooth.${imageToothId}.png`;
                }
              }
              
              // Añadir timestamp para evitar caché
              newSrc += `?t=${new Date().getTime()}`;
              
              console.log(`Actualizando imagen del diente ${toothId} en vista ${position} a estado ${option}. Nueva ruta:`, newSrc);
              img.src = newSrc;
              
              // Actualizar el atributo data-state del contenedor
              const dataState = option === 'puente' ? 'pontic' : 
                               option === 'ausente' ? 'faltante' : option;
              toothContainer.setAttribute('data-state', dataState);
            }
          });
        }
      });
      
      // También actualizar otras imágenes que puedan necesitar recarga
      const otherToothImages = document.querySelectorAll('.tooth-image');
      otherToothImages.forEach(img => {
        const container = img.parentElement;
        if (container && !teeth.includes(container.getAttribute('data-tooth-id'))) {
          const currentSrc = img.src;
          if (currentSrc.includes('?')) {
            img.src = currentSrc.split('?')[0] + '?t=' + new Date().getTime();
          } else {
            img.src = currentSrc + '?t=' + new Date().getTime();
          }
        }
      });
    }, 100);
    
    // Mostrar mensaje de confirmación
    const optionName = option.charAt(0).toUpperCase() + option.slice(1);
    document.dispatchEvent(new CustomEvent('showConfirmation', {
      detail: { message: `Estado ${optionName} aplicado a ${teeth.length} dientes` }
    }));
  };
  
  // Función para manejar la selección de dientes
  const handleToothSelect = (toothId) => {
    if (activeMode === 'quickselect') {
      // Actualizar el estado de selección
      setSelectedTeeth(prev => {
        if (prev.includes(toothId)) {
          // Si ya está seleccionado, lo quitamos
          return prev.filter(id => id !== toothId);
        } else {
          // Si no está seleccionado, lo añadimos
          return [...prev, toothId];
        }
      });
      
      // Notificar al panel de estado sobre la selección
      setTimeout(() => {
        document.dispatchEvent(new CustomEvent('teethSelectionChange', {
          detail: { selectedTeeth: selectedTeeth }
        }));
      }, 0);
    } else {
      // Modo de selección individual
      if (selectedTooth !== toothId) {
        setSelectedTooth(toothId);
        
        // Notificar al panel de estado sobre la selección individual
        document.dispatchEvent(new CustomEvent('toothSelect', {
          detail: { toothId }
        }));
      }
    }
  };
  
  // Modificar las funciones de renderizado para usar handleToothSelect y verificar si el diente está en selectedTeeth
  // Por ejemplo, en renderFullView:
  
  const renderFullView = () => (
    <>
      {/* Arcada superior */}
      <div className="upper-arch">
        {/* Arcada superior - Vista Bucal */}
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
        
        {/* Arcada superior - Vista Incisal */}
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
        
        {/* Numeración FDI superior */}
        <div className="teeth-numbers">
          {sortedUpperTeeth.map(tooth => (
            <div key={tooth.id} className="tooth-number">{tooth.id}</div>
          ))}
        </div>
      </div>
      
      {/* Arcada inferior */}
      <div className="lower-arch">
        {/* Numeración FDI inferior */}
        <div className="teeth-numbers">
          {sortedLowerTeeth.map(tooth => (
            <div key={tooth.id} className="tooth-number">{tooth.id}</div>
          ))}
        </div>
        
        {/* Arcada inferior - Vista Incisal */}
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
        
        {/* Arcada inferior - Vista Bucal */}
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
  
  // Renderizar solo la arcada superior
  const renderUpperView = () => (
    <>
      {/* Arcada superior - Vista Bucal */}
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
      
      {/* Arcada superior - Vista Incisal */}
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
      
      {/* Arcada superior - Vista Lingual */}
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
      
      {/* Numeración FDI superior */}
      <div className="teeth-numbers">
        {sortedUpperTeeth.map(tooth => (
          <div key={tooth.id} className="tooth-number">{tooth.id}</div>
        ))}
      </div>
    </>
  );
  
  // Renderizar solo la arcada inferior
  const renderLowerView = () => (
    <>
      {/* Arcada inferior - Vista Lingual */}
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
      
      {/* Arcada inferior - Vista Incisal */}
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
      
      {/* Arcada inferior - Vista Bucal */}
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
      
      {/* Numeración FDI inferior - Ahora debajo de todo */}
      <div className="teeth-numbers">
        {sortedLowerTeeth.map(tooth => (
          <div key={tooth.id} className="tooth-number">{tooth.id}</div>
        ))}
      </div>
    </>
  );
  
  // Función para renderizar el panel de parámetros clínicos
  const renderClinicalParameters = () => {
    if (!selectedTooth) {
      return null;
    }

    // Si estamos en modo periodoncia y hay un diente seleccionado
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
        {/* Renderizar la vista según la selección con logs para depuración */}
        {console.log('Estado actual de activeView en render:', activeView)}
        {activeView === 'full' && renderFullView()}
        {activeView === 'upper' && renderUpperView()}
        {activeView === 'lower' && renderLowerView()}
        
        {/* Componente de línea de tiempo */}
        <DateTimeline />
      </div>
      
      {/* Panel de parámetros clínicos */}
      {renderClinicalParameters()}
    </div>
  );
};

export default Odontograma;