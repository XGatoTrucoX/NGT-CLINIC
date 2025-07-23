import React, { useState, useEffect } from 'react';
import '../styles/PerioLines.css';

const PerioLines = ({ toothId, profundidadPalpacion, margenGingival }) => {
  // Estado para controlar si se muestran las líneas
  const [showLines, setShowLines] = useState(true);
  
  // Determinar la posición de las líneas según el ID del diente
  const getLinePosition = () => {
    // Dientes superiores
    if (toothId >= 11 && toothId <= 28) {
      return 'top';
    } 
    // Dientes inferiores
    else if (toothId >= 31 && toothId <= 48) {
      return 'bottom';
    }
    return 'top';
  };
  
  // Determinar si el diente está en el lado derecho o izquierdo
  const getSide = () => {
    // Dientes del lado derecho (desde la perspectiva del paciente)
    if ((toothId >= 11 && toothId <= 18) || (toothId >= 41 && toothId <= 48)) {
      return 'right';
    } 
    // Dientes del lado izquierdo
    else {
      return 'left';
    }
  };
  
  // Calcular la posición de la línea de profundidad de palpación
  const getProfundidadStyle = () => {
    const position = getLinePosition();
    const side = getSide();
    
    // Valor base para la posición
    let basePosition = 0;
    
    // Ajustar según la profundidad
    const depth = profundidadPalpacion * 2; // Multiplicamos por 2 para hacer más visible la diferencia
    
    if (position === 'top') {
      // Para dientes superiores, la línea se dibuja hacia abajo
      basePosition = 80; // Posición base en porcentaje desde la parte superior del diente
      return {
        top: `${basePosition + depth}%`,
        [side]: '10%',
        width: '80%',
        height: '2px',
        backgroundColor: '#3498db' // Azul para profundidad de palpación
      };
    } else {
      // Para dientes inferiores, la línea se dibuja hacia arriba
      basePosition = 20; // Posición base en porcentaje desde la parte superior del diente
      return {
        top: `${basePosition - depth}%`,
        [side]: '10%',
        width: '80%',
        height: '2px',
        backgroundColor: '#3498db' // Azul para profundidad de palpación
      };
    }
  };
  
  // Calcular la posición de la línea de margen gingival
  const getMargenStyle = () => {
    const position = getLinePosition();
    const side = getSide();
    
    // Valor base para la posición
    let basePosition = 0;
    
    // Ajustar según el margen (negativo significa recesión gingival)
    const margin = margenGingival * -2; // Multiplicamos por -2 para hacer más visible la diferencia
    
    if (position === 'top') {
      // Para dientes superiores, la línea se dibuja hacia abajo
      basePosition = 60; // Posición base en porcentaje desde la parte superior del diente
      return {
        top: `${basePosition + margin}%`,
        [side]: '10%',
        width: '80%',
        height: '2px',
        backgroundColor: '#e74c3c' // Rojo para margen gingival
      };
    } else {
      // Para dientes inferiores, la línea se dibuja hacia arriba
      basePosition = 40; // Posición base en porcentaje desde la parte superior del diente
      return {
        top: `${basePosition - margin}%`,
        [side]: '10%',
        width: '80%',
        height: '2px',
        backgroundColor: '#e74c3c' // Rojo para margen gingival
      };
    }
  };
  
  // Si no hay valores de profundidad o margen, no mostrar nada
  if (profundidadPalpacion === 0 && margenGingival === 0) {
    return null;
  }
  
  return (
    <div className="perio-lines-container">
      {profundidadPalpacion > 0 && (
        <div 
          className="perio-line profundidad-line"
          style={getProfundidadStyle()}
        />
      )}
      
      {margenGingival !== 0 && (
        <div 
          className="perio-line margen-line"
          style={getMargenStyle()}
        />
      )}
    </div>
  );
};

export default PerioLines;
