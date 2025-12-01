'use client';

import React from 'react';

interface ToothConditionMarkersProps {
  toothId: number;
  conditions: any[];
  position: string;
}

const ToothConditionMarkers: React.FC<ToothConditionMarkersProps> = ({ toothId, conditions, position }) => {
  if (!conditions || conditions.length === 0) return null;

  return (
    <>
      {conditions.map((condition, index) => {
        if (!condition.positions) return null;
        
        return condition.positions
          .filter((pos: any) => pos.view === position)
          .map((pos: any, posIndex: number) => {
            // Invertir coordenadas para vista lingual
            const adjustedX = position === 'lingual' ? 100 - pos.x : pos.x;
            const adjustedY = position === 'lingual' ? 100 - pos.y : pos.y;
            
            return (
              <div
                key={`${index}-${posIndex}`}
                className="condition-marker-overlay"
                style={{
                  position: 'absolute',
                  left: `${adjustedX}%`,
                  top: `${adjustedY}%`,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: condition.type === 'caries' ? '#000000' : '#00ff00',
                  border: '1px solid white',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}
              />
            );
          });
      })}
    </>
  );
};

export default ToothConditionMarkers;