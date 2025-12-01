'use client';

import React from 'react';

interface PerioExamPanelProps {
  toothId: number;
  onClose: () => void;
}

const PerioExamPanel: React.FC<PerioExamPanelProps> = ({ toothId, onClose }) => {
  return (
    <div className="perio-exam-panel">
      <h3>Examen Periodontal - Diente {toothId}</h3>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default PerioExamPanel;