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
          .map((pos: any, posIndex: number) => (
            <div
              key={`${index}-${posIndex}`}
              className="condition-marker-overlay"
              style={{
                position: 'absolute',
                left: `${pos.x}%`,
                top: `${pos.y}%`,
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
          ));
      })}
    </>
  );
};

export default ToothConditionMarkers;