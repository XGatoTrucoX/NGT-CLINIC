'use client';

import React from 'react';

interface PerioLinesProps {
  toothId: number;
  profundidadPalpacion: number;
  margenGingival: number;
}

const PerioLines: React.FC<PerioLinesProps> = ({ toothId, profundidadPalpacion, margenGingival }) => {
  return (
    <div className="perio-lines">
      {/* Aquí se pueden agregar las líneas periodontales si es necesario */}
    </div>
  );
};

export default PerioLines;