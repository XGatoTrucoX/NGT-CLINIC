'use client';

import React, { useState, useEffect, useRef } from 'react';
import './styles/Tooth.css';
import dentalViewSystem from './utils/dentalViewSystem';
import PerioLines from './PerioLines';
import ToothConditionMarkers from './ToothConditionMarkers';

const { cargarVista, needsMirroring, getMirrorToothId } = dentalViewSystem;

interface ToothProps {
  tooth: any;
  isSelected: boolean;
  onSelect: () => void;
  activeMode: string;
}

const Tooth: React.FC<ToothProps> = ({ tooth, isSelected, onSelect, activeMode }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const [showEndoView, setShowEndoView] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [profundidadPalpacion, setProfundidadPalpacion] = useState(tooth.perioData?.profundidadPalpacion || 0);
  const [margenGingival, setMargenGingival] = useState(tooth.perioData?.margenGingival || 0);
  const [furcacion, setFurcacion] = useState(tooth.perioData?.furcacion || 0);
  const [movilidad, setMovilidad] = useState(tooth.perioData?.movilidad || 0);
  const [endoTest, setEndoTest] = useState(tooth.perioData?.endoTest || []);
  const [sangrado, setSangrado] = useState(tooth.perioData?.sangrado || false);
  const [placa, setPlaca] = useState(tooth.perioData?.placa || false);
  const [pus, setPus] = useState(tooth.perioData?.pus || false);
  const [sarro, setSarro] = useState(tooth.perioData?.sarro || false);
  
  useEffect(() => {
    const handleEndoModeChange = (event: any) => {
      setShowEndoView(event.detail.active);
    };
    
    document.addEventListener('endoModeChange', handleEndoModeChange);
    return () => {
      document.removeEventListener('endoModeChange', handleEndoModeChange);
    };
  }, []);
  
  useEffect(() => {
    const handlePerioMeasurementUpdate = (event: any) => {
      const { toothId, type, value } = event.detail;
      
      if (toothId === tooth.id) {
        if (type === 'profundidad') {
          setProfundidadPalpacion(value);
        } else if (type === 'margen') {
          setMargenGingival(value);
        } else if (type === 'furcacion') {
          setFurcacion(value);
        } else if (type === 'movilidad') {
          setMovilidad(value);
        } else if (type === 'endoTest') {
          setEndoTest(value);
        } else if (type === 'sangrado') {
          setSangrado(value);
        } else if (type === 'placa') {
          setPlaca(value);
        } else if (type === 'pus') {
          setPus(value);
        } else if (type === 'sarro') {
          setSarro(value);
        }
      }
    };
    
    document.addEventListener('perioMeasurementUpdate', handlePerioMeasurementUpdate);
    return () => {
      document.removeEventListener('perioMeasurementUpdate', handlePerioMeasurementUpdate);
    };
  }, [tooth.id]);
  
  useEffect(() => {
    setImageKey(Date.now());
    
    if (imageRef.current) {
      const currentSrc = imageRef.current.src;
      if (currentSrc.includes('?')) {
        imageRef.current.src = currentSrc.split('?')[0] + '?t=' + Date.now();
      } else {
        imageRef.current.src = currentSrc + '?t=' + Date.now();
      }
    }
  }, [tooth.isAbsent, tooth.isImplant, tooth.isPontic, tooth.hasWear, tooth.hasCarilla, 
      tooth.hasNecrosis, tooth.hasLesionPeriapical, tooth.conditions]);
      
  useEffect(() => {
    if (tooth.perioData) {
      setProfundidadPalpacion(tooth.perioData.profundidadPalpacion || 0);
      setMargenGingival(tooth.perioData.margenGingival || 0);
      setFurcacion(tooth.perioData.furcacion || 0);
      setMovilidad(tooth.perioData.movilidad || 0);
      setEndoTest(tooth.perioData.endoTest || null);
    } else {
      setProfundidadPalpacion(0);
      setMargenGingival(0);
      setFurcacion(0);
      setMovilidad(0);
      setEndoTest([]);
      setSangrado(false);
      setPlaca(false);
      setPus(false);
      setSarro(false);
    }
  }, [tooth.id, tooth.perioData]);

  const basePath = `/images/teeth/`;
  const position = tooth.position || 'buccal';
  
  let toothId = tooth.id;
  if (needsMirroring(tooth.id)) {
    toothId = getMirrorToothId(tooth.id);
  }

  const getToothImage = () => {
    if (showEndoView && hasEndoCondition()) {
      return getEndoImage();
    }
    
    let estado = 'tooth';
    
    if (tooth.isAbsent) {
      estado = 'faltante';
    } else if (tooth.isImplant) {
      estado = 'implante';
      console.log('Aplicando estado implante al diente', tooth.id);
    } else if (tooth.isPontic) {
      estado = 'pontic';
    } else if (tooth.hasWear) {
      estado = 'desgaste';
    } else if (tooth.hasCarilla) {
      estado = 'carilla';
    } else if (tooth.hasNecrosis) {
      estado = 'necrosis';
    } else if (tooth.hasLesionPeriapical) {
      estado = 'lesion_periapical';
    } else if (hasCondition('corona')) {
      estado = 'corona';
    } else if (hasCondition('endodoncia')) {
      estado = 'endodoncia';
    }
    
    let imageToothId = tooth.id;
    
    if ((tooth.id >= 21 && tooth.id <= 28) || (tooth.id >= 31 && tooth.id <= 38)) {
      imageToothId = getMirrorToothId(tooth.id);
      console.log(`Usando imagen espejo: diente ${tooth.id} -> ${imageToothId}`);
    }
    
    const timestamp = `?t=${Date.now()}`;
    const basePath = `/images/teeth/${position}/`;
    
    let imagePath;
    
    if (tooth.isImplant) {
      // Para vista incisal, usar imagen normal en lugar de implante
      if (position === 'incisal') {
        imagePath = `${basePath}${position}.tooth.${imageToothId}.png${timestamp}`;
      } else {
        // Si es diente 14, usar imagen de implante del 15
        const implantToothId = imageToothId === 14 ? 15 : imageToothId;
        imagePath = `${basePath}${position}.implant.${implantToothId}.png${timestamp}`;
      }
      console.log('Generando ruta para implante:', imagePath);
    } else if (tooth.isPontic) {
      imagePath = position === 'incisal' ? `${basePath}${position}.tooth.${imageToothId}.png${timestamp}` : `${basePath}${position}.pontics.${imageToothId}.png${timestamp}`;
      console.log('Generando ruta para póntico:', imagePath);
    } else if (tooth.hasWear) {
      imagePath = `${basePath}${position}.dental.wear.${imageToothId}.png${timestamp}`;
      console.log('Generando ruta para desgaste:', imagePath);
    } else if (tooth.hasCarilla) {
      imagePath = `${basePath}${position}.tooth.${imageToothId}.png${timestamp}`;
    } else if (tooth.hasNecrosis) {
      imagePath = `${basePath}${position}.necrosis.${imageToothId}.png${timestamp}`;
    } else if (tooth.hasLesionPeriapical) {
      imagePath = `${basePath}${position}.lesion.periapical.${imageToothId}.png${timestamp}`;
    } else if (hasCondition('corona')) {
      imagePath = `${basePath}${position}.tooth.${imageToothId}.png${timestamp}`;
    } else if (hasCondition('endodoncia')) {
      imagePath = `${basePath}${position}.endodoncia.${imageToothId}.png${timestamp}`;
    } else {
      imagePath = `${basePath}${position}.tooth.${imageToothId}.png${timestamp}`;
    }
    
    console.log(`📸 IMAGEN GENERADA:`);
    console.log(`   Diente: ${tooth.id} -> ID imagen: ${imageToothId}`);
    console.log(`   Posición: ${position}`);
    console.log(`   Estado: ${estado}`);
    console.log(`   Ruta: ${imagePath}`);
    console.log(`   Condiciones:`, tooth.conditions);
    return imagePath;
  };
  
  const hasCondition = (conditionType: string) => {
    return tooth.conditions && tooth.conditions.some((condition: any) => condition.type === conditionType);
  };
  
  const hasEndoCondition = () => {
    return tooth.hasNecrosis || 
           tooth.hasLesionPeriapical || 
           tooth.hasImplantEndo || 
           hasCondition('endodoncia') || 
           hasCondition('carilla');
  };
  
  const getEndoImage = () => {
    let endoType = '';
    
    if (tooth.hasNecrosis) {
      endoType = 'necrosis';
    } else if (tooth.hasLesionPeriapical) {
      endoType = 'lesion.periapical';
    } else if (tooth.hasImplantEndo) {
      endoType = 'implant.endo';
    } else if (hasCondition('endodoncia')) {
      endoType = 'endo';
    } else if (hasCondition('carilla')) {
      endoType = 'carilla';
    }
    
    return `${basePath}endodoncia/endo.${endoType}.${toothId}.png?t=${Date.now()}`;
  };
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.error(`🚨 ERROR CARGA IMAGEN:`);
    console.error(`   Diente: ${tooth.id}`);
    console.error(`   Posición: ${position}`);
    console.error(`   URL que falló: ${target.src}`);
    console.error(`   Estado diente:`, {
      isImplant: tooth.isImplant,
      isPontic: tooth.isPontic,
      hasWear: tooth.hasWear,
      hasCarilla: tooth.hasCarilla,
      hasNecrosis: tooth.hasNecrosis,
      hasLesionPeriapical: tooth.hasLesionPeriapical,
      conditions: tooth.conditions
    });
    
    let fallbackToothId = tooth.id;
    if ((tooth.id >= 21 && tooth.id <= 28) || (tooth.id >= 31 && tooth.id <= 38)) {
      fallbackToothId = getMirrorToothId(tooth.id);
    }
    
    // Usar el formato correcto que existe en la carpeta
    const correctFallback = `/images/teeth/${position}/${position}.${fallbackToothId}.png?t=${Date.now()}`;
    console.warn(`🔄 INTENTANDO FALLBACK CORRECTO: ${correctFallback}`);
    
    target.onerror = () => {
      console.error(`❌ FALLBACK CORRECTO FALLÓ, usando placeholder`);
      setImageLoaded(false);
    };
    
    target.src = correctFallback;
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const mirrorClass = needsMirroring(tooth.id) ? 'mirrored' : '';
  
  const viewClass = 
    position === 'incisal' ? 'incisal-view' : 
    position === 'lingual' ? 'lingual-view' : 'buccal-view';
  
  const getAdditionalClasses = () => {
    let classes = '';
    
    if (tooth.toBeExtracted) classes += ' to-be-extracted';
    if (tooth.isAbsent) classes += ' absent-tooth';
    if (tooth.hasCarilla) classes += ' has-carilla';
    if (tooth.hasNecrosis) classes += ' has-necrosis';
    if (tooth.hasLesionPeriapical) classes += ' has-lesion';
    if (showEndoView && hasEndoCondition()) classes += ' endo-view';
    
    return classes;
  };
  
  return (
    <div 
      className={`tooth-container ${viewClass} ${isSelected ? 'selected' : ''} ${getAdditionalClasses()}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      data-tooth-id={tooth.id}
      data-position={position}
    >
      <div className="tooth-image-container">
        {imageLoaded ? (
          <>
            <img 
              key={imageKey}
              ref={imageRef}
              src={getToothImage()} 
              alt={`Diente ${tooth.id} ${tooth.isAbsent ? '(ausente)' : ''}`}
              className={`tooth-image ${mirrorClass} ${tooth.toBeExtracted ? 'to-be-extracted' : ''} ${tooth.isAbsent ? 'absent-tooth-image' : ''}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{ display: imageLoaded ? 'block' : 'none' }}
            />
            
            <PerioLines 
              toothId={tooth.id}
              profundidadPalpacion={profundidadPalpacion}
              margenGingival={margenGingival}
            />
            
            <ToothConditionMarkers 
              toothId={tooth.id}
              conditions={tooth.conditions || []}
              position={position}
            />
            

            

          </>
        ) : (
          <div className="tooth-placeholder">
            <span>{tooth.id}</span>
          </div>
        )}
      </div>
      
      {tooth.isAbsent && <div className="absent-tooth-indicator"></div>}
      
      {hasCondition('corona') && !tooth.isAbsent && <div className="crown-indicator"></div>}
      {hasCondition('endodoncia') && !tooth.isAbsent && <div className="endo-indicator"></div>}
      
      {/* Solo mostrar indicadores en vista buccal y modo perio */}
      {position === 'buccal' && activeMode === 'perio' && (
        <>
          {/* Indicadores furcación y movilidad - lado izquierdo vertical */}
          <div className="left-indicators-container">
            {furcacion > 0 && !tooth.isAbsent && (
              <div className="furcation-indicator">
                <img src={`/images/teeth/furcacion/stage-${furcacion}.png`} alt={`F${furcacion}`} />
              </div>
            )}
            {movilidad > 0 && !tooth.isAbsent && (
              <div className="mobility-indicator">
                <img src={`/images/teeth/movilidad dental/class ${movilidad}.png`} alt={`M${movilidad}`} />
              </div>
            )}
          </div>
          {/* Indicadores endodónticos - lado izquierdo */}
          <div className="endo-indicators-container">
            {Array.isArray(endoTest) && endoTest.map((test, index) => (
              !tooth.isAbsent && (
                <div key={index} className="endo-test-indicator">
                  <img src={`/images/teeth/endodoncia/${test}.png`} alt={test} />
                </div>
              )
            ))}
          </div>
          
          {/* Indicadores periodontales - lado derecho */}
          <div className="perio-indicators-container">
            {sangrado && !tooth.isAbsent && <div className="perio-indicator sangrado-indicator">S</div>}
            {placa && !tooth.isAbsent && <div className="perio-indicator placa-indicator">P</div>}
            {pus && !tooth.isAbsent && <div className="perio-indicator pus-indicator">Pu</div>}
            {sarro && !tooth.isAbsent && <div className="perio-indicator sarro-indicator">Sa</div>}
          </div>
        </>
      )}
      
      {!imageLoaded && (
        <div className="image-error-indicator" style={{ 
          backgroundColor: '#ffcccc', 
          border: '2px solid red',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '10px',
          textAlign: 'center',
          padding: '2px'
        }}>
          Error al cargar imagen
        </div>
      )}
    </div>
  );
};

export default Tooth;