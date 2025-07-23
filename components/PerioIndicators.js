import React from 'react';
import '../styles/PerioIndicators.css';

const PerioIndicators = ({ toothId, isSelected, activeMode }) => {
  // Función para obtener el diente espejo
  const getMirrorToothId = (id) => {
    // Para dientes superiores
    if (id >= 11 && id <= 18) {
      return id + 10; // 11 -> 21, 12 -> 22, etc.
    } else if (id >= 21 && id <= 28) {
      return id - 10; // 21 -> 11, 22 -> 12, etc.
    }
    // Para dientes inferiores
    else if (id >= 31 && id <= 38) {
      return id + 10; // 31 -> 41, 32 -> 42, etc.
    } else if (id >= 41 && id <= 48) {
      return id - 10; // 41 -> 31, 42 -> 32, etc.
    }
    return id;
  };

  // Determinar si el diente necesita ser espejado
  const needsMirroring = (id) => {
    return (id >= 21 && id <= 28) || (id >= 31 && id <= 38);
  };
  
  // Datos de ejemplo para placa, sangrado y pus
  // En una aplicación real, estos datos vendrían de una base de datos
  const perioData = {
    // Placa (true/false para cada cara: vestibular, mesial, distal, lingual)
    plaque: {
      vestibular: Math.random() > 0.5,
      mesial: Math.random() > 0.5,
      distal: Math.random() > 0.5,
      lingual: Math.random() > 0.5
    },
    // Sangrado (true/false para cada cara)
    bleeding: {
      vestibular: Math.random() > 0.7,
      mesial: Math.random() > 0.7,
      distal: Math.random() > 0.7,
      lingual: Math.random() > 0.7
    },
    // Pus (true/false para cada cara)
    pus: {
      vestibular: Math.random() > 0.9,
      mesial: Math.random() > 0.9,
      distal: Math.random() > 0.9,
      lingual: Math.random() > 0.9
    }
  };
  
  // Determinar si necesitamos aplicar la clase de espejo
  const mirrorClass = needsMirroring(toothId) ? 'mirrored' : '';
  
  return (
    <div className={`perio-indicator-container ${isSelected ? 'selected' : ''} ${mirrorClass}`}>
      {/* Indicadores de placa */}
      <div className="plaque-indicators">
        {perioData.plaque.vestibular && <div className="plaque vestibular"></div>}
        {perioData.plaque.mesial && <div className="plaque mesial"></div>}
        {perioData.plaque.distal && <div className="plaque distal"></div>}
        {perioData.plaque.lingual && <div className="plaque lingual"></div>}
      </div>
      
      {/* Indicadores de sangrado */}
      <div className="bleeding-indicators">
        {perioData.bleeding.vestibular && <div className="bleeding vestibular"></div>}
        {perioData.bleeding.mesial && <div className="bleeding mesial"></div>}
        {perioData.bleeding.distal && <div className="bleeding distal"></div>}
        {perioData.bleeding.lingual && <div className="bleeding lingual"></div>}
      </div>
      
      {/* Indicadores de pus */}
      <div className="pus-indicators">
        {perioData.pus.vestibular && <div className="pus vestibular"></div>}
        {perioData.pus.mesial && <div className="pus mesial"></div>}
        {perioData.pus.distal && <div className="pus distal"></div>}
        {perioData.pus.lingual && <div className="pus lingual"></div>}
      </div>
    </div>
  );
};

export default PerioIndicators;