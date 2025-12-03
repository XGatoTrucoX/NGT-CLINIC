import React, { useState, useEffect, useRef } from 'react';
import '../styles/Tooth.css';
import dentalViewSystem from '../utils/dentalViewSystem';
import PerioLines from './PerioLines';

// Extraer las funciones del objeto importado
const { cargarVista, needsMirroring, getMirrorToothId } = dentalViewSystem;

const Tooth = ({ tooth, isSelected, onSelect, activeMode }) => {
  // Estado para rastrear si la imagen se cargó correctamente
  const [imageLoaded, setImageLoaded] = useState(true);
  // Estado para rastrear si se está mostrando la vista endodóntica
  const [showEndoView, setShowEndoView] = useState(false);
  // Referencia a la imagen para poder actualizarla
  const imageRef = useRef(null);
  // Estado para forzar la recarga de la imagen
  const [imageKey, setImageKey] = useState(Date.now());
  // Estados para valores periodontales
  const [profundidadPalpacion, setProfundidadPalpacion] = useState(tooth.perioData?.profundidadPalpacion || 0);
  const [margenGingival, setMargenGingival] = useState(tooth.perioData?.margenGingival || 0);
  const [furcacion, setFurcacion] = useState(tooth.perioData?.furcacion || 0);
  const [movilidad, setMovilidad] = useState(tooth.perioData?.movilidad || 0);
  const [endoTest, setEndoTest] = useState(tooth.perioData?.endoTest || null);
  
  // Escuchar eventos de cambio de modo endodóntico
  useEffect(() => {
    const handleEndoModeChange = (event) => {
      setShowEndoView(event.detail.active);
    };
    
    document.addEventListener('endoModeChange', handleEndoModeChange);
    return () => {
      document.removeEventListener('endoModeChange', handleEndoModeChange);
    };
  }, []);
  
  // Escuchar eventos de actualización de mediciones periodontales
  useEffect(() => {
    const handlePerioMeasurementUpdate = (event) => {
      const { toothId, type, value } = event.detail;
      
      // Solo actualizar si el evento es para este diente
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
        }
      }
    };
    
    document.addEventListener('perioMeasurementUpdate', handlePerioMeasurementUpdate);
    return () => {
      document.removeEventListener('perioMeasurementUpdate', handlePerioMeasurementUpdate);
    };
  }, [tooth.id]);
  
  // Efecto para actualizar la imagen cuando cambie el estado del diente
  useEffect(() => {
    // Forzar la recarga de la imagen cuando cambie el estado del diente
    setImageKey(Date.now());
    
    // Si tenemos una referencia a la imagen, forzar su recarga
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
      
  // Efecto para actualizar los valores periodontales cuando cambie el diente
  useEffect(() => {
    // Cargar los datos periodontales del diente si existen
    if (tooth.perioData) {
      setProfundidadPalpacion(tooth.perioData.profundidadPalpacion || 0);
      setMargenGingival(tooth.perioData.margenGingival || 0);
      setFurcacion(tooth.perioData.furcacion || 0);
      setMovilidad(tooth.perioData.movilidad || 0);
      setEndoTest(tooth.perioData.endoTest || null);
    } else {
      // Reiniciar valores si no hay datos
      setProfundidadPalpacion(0);
      setMargenGingival(0);
      setFurcacion(0);
      setMovilidad(0);
      setEndoTest(null);
    }
  }, [tooth.id, tooth.perioData]);

  // Variables para la ruta de la imagen
  const basePath = `/images/teeth/`;
  const position = tooth.position || 'buccal';
  
  // Determinar el ID del diente para la imagen (considerando el espejo)
  let toothId = tooth.id;
  if (needsMirroring(tooth.id)) {
    toothId = getMirrorToothId(tooth.id);
  }

  // Determinar qué imagen mostrar según el estado del diente
  const getToothImage = () => {
    // Si estamos en modo endodóntico y el diente tiene condiciones relacionadas
    if (showEndoView && hasEndoCondition()) {
      return getEndoImage();
    }
    
    // Determinar el estado del diente
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
    
    // Obtener el ID del diente para la imagen (considerando el espejo)
    // Siempre usamos el diente espejo para la imagen (11-18 o 41-48)
    let imageToothId = tooth.id;
    
    // Si el diente está en el cuadrante superior derecho (21-28) o inferior derecho (31-38)
    // usamos su contraparte en el cuadrante izquierdo
    if ((tooth.id >= 21 && tooth.id <= 28) || (tooth.id >= 31 && tooth.id <= 38)) {
      imageToothId = getMirrorToothId(tooth.id);
      console.log(`Usando imagen espejo: diente ${tooth.id} -> ${imageToothId}`);
    }
    
    // Timestamp para evitar caché
    const timestamp = `?t=${Date.now()}`;
    
    // Construir la ruta base
    const basePath = `/images/teeth/${position}/`;
    
    // Construir la ruta completa según el estado
    let imagePath;
    
    if (tooth.isImplant) {
      imagePath = `${basePath}${position}.implant.${imageToothId}.png${timestamp}`;
      console.log('Generando ruta para implante:', imagePath);
    } else if (tooth.isPontic) {
      imagePath = `${basePath}${position}.pontics.${imageToothId}.png${timestamp}`;
      console.log('Generando ruta para póntico:', imagePath);
    } else if (tooth.hasWear) {
      imagePath = `${basePath}${position}.dental.wear.${imageToothId}.png${timestamp}`;
      console.log('Generando ruta para desgaste:', imagePath);
    } else if (tooth.hasCarilla) {
      imagePath = `${basePath}${position}.carilla.${imageToothId}.png${timestamp}`;
    } else if (tooth.hasNecrosis) {
      imagePath = `${basePath}${position}.necrosis.${imageToothId}.png${timestamp}`;
    } else if (tooth.hasLesionPeriapical) {
      imagePath = `${basePath}${position}.lesion.periapical.${imageToothId}.png${timestamp}`;
    } else if (hasCondition('corona')) {
      imagePath = `${basePath}${position}.corona.${imageToothId}.png${timestamp}`;
    } else if (hasCondition('endodoncia')) {
      imagePath = `${basePath}${position}.endodoncia.${imageToothId}.png${timestamp}`;
    } else {
      // Estado normal (tooth)
      imagePath = `${basePath}${position}.tooth.${imageToothId}.png${timestamp}`;
    }
    
    console.log('Ruta de imagen generada:', imagePath, 'Estado:', estado, 'ID original:', tooth.id, 'ID para imagen:', imageToothId);
    return imagePath;
  };
  
  // Verificar si el diente tiene una condición específica
  const hasCondition = (conditionType) => {
    return tooth.conditions && tooth.conditions.some(condition => condition.type === conditionType);
  };
  
  // Verificar si el diente tiene alguna condición relacionada con endodoncia
  const hasEndoCondition = () => {
    return tooth.hasNecrosis || 
           tooth.hasLesionPeriapical || 
           tooth.hasImplantEndo || 
           hasCondition('endodoncia') || 
           hasCondition('carilla');
  };
  
  // Obtener la imagen endodóntica correspondiente
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
  
  // Función para manejar errores de carga de imágenes
  const handleImageError = (e) => {
    console.error(`Error al cargar imagen: ${e.target.src}`);
    setImageLoaded(false);
    
    // Extraer el estado actual del diente de la URL que falló
    const srcUrl = e.target.src;
    console.log('URL que falló:', srcUrl);
    
    // Obtener el ID del diente para la imagen de respaldo
    // Siempre usamos el diente en el cuadrante izquierdo (11-18 o 41-48)
    let fallbackToothId = tooth.id;
    
    // Si el diente está en el cuadrante superior derecho (21-28) o inferior derecho (31-38)
    // usamos su contraparte en el cuadrante izquierdo
    if ((tooth.id >= 21 && tooth.id <= 28) || (tooth.id >= 31 && tooth.id <= 38)) {
      fallbackToothId = getMirrorToothId(tooth.id);
    }
    
    // Intentamos con una imagen alternativa más simple (siempre la imagen del diente normal)
    const fallbackPath = `${basePath}${position}/${position}.tooth.${fallbackToothId}.png?t=${Date.now()}`;
    console.log('Intentando con imagen alternativa:', fallbackPath);
    e.target.src = fallbackPath;
    
    // Registrar el error para diagnóstico
    console.warn(`Problema de carga de imagen para diente ${tooth.id} (usando ${fallbackToothId} como respaldo) con estado: ${
      tooth.isImplant ? 'implante' : 
      tooth.isPontic ? 'pontic' : 
      tooth.hasWear ? 'desgaste' : 
      tooth.hasCarilla ? 'carilla' : 
      tooth.hasNecrosis ? 'necrosis' : 
      tooth.hasLesionPeriapical ? 'lesion_periapical' : 
      'normal'
    }`);
  };
  
  // Función para confirmar carga exitosa
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Determinar si necesitamos aplicar la clase de espejo
  const mirrorClass = needsMirroring(tooth.id) ? 'mirrored' : '';
  
  // Determinar la clase de vista
  const viewClass = 
    position === 'incisal' ? 'incisal-view' : 
    position === 'lingual' ? 'lingual-view' : 'buccal-view';
  
  // Determinar clases adicionales basadas en el estado del diente
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
            
            {/* Componente para mostrar las líneas periodontales */}
            <PerioLines 
              toothId={tooth.id}
              profundidadPalpacion={profundidadPalpacion}
              margenGingival={margenGingival}
            />
            
            {/* Mostrar imagen de furcación si está activa */}
            {furcacion > 0 && (
              <div className="furcation-overlay">
                <img 
                  src={`/images/teeth/furcacion/stage-${furcacion}.png`}
                  alt={`Furcación etapa ${furcacion}`}
                  className="furcation-overlay-image"
                />
              </div>
            )}
            
            {/* Mostrar imagen de movilidad dental si está activa */}
            {movilidad > 0 && (
              <div className="mobility-overlay">
                <img 
                  src={`/images/teeth/movilidad dental/class ${movilidad}.png`}
                  alt={`Movilidad clase ${movilidad}`}
                  className="mobility-overlay-image"
                />
              </div>
            )}
            
            {/* Mostrar imagen de test endodóntico si está activo */}
            {endoTest && (
              <div className="endo-test-overlay">
                <img 
                  src={`/images/teeth/endodoncia/${endoTest}.png`}
                  alt={`Test ${endoTest}`}
                  className="endo-test-overlay-image"
                />
              </div>
            )}
          </>
        ) : (
          <div className="tooth-placeholder">
            <span>{tooth.id}</span>
          </div>
        )}
      </div>
      
      {/* Indicador visual para dientes ausentes */}
      {tooth.isAbsent && <div className="absent-tooth-indicator"></div>}
      
      {/* Indicadores para condiciones específicas */}
      {hasCondition('corona') && !tooth.isAbsent && <div className="crown-indicator"></div>}
      {hasCondition('endodoncia') && !tooth.isAbsent && <div className="endo-indicator"></div>}
      
      {/* Indicadores para datos periodontales */}
      {furcacion > 0 && !tooth.isAbsent && <div className="furcation-indicator">{furcacion}</div>}
      {movilidad > 0 && !tooth.isAbsent && <div className="mobility-indicator">{movilidad}</div>}
      {endoTest && !tooth.isAbsent && <div className="endo-test-indicator">{endoTest.charAt(0).toUpperCase()}</div>}
      
      {/* Indicador visual para errores de carga */}
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
