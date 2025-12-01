'use client';

import React, { useState } from 'react';
import Odontograma from './Odontograma';
import StatePanel from './StatePanel';

interface ToothData {
  id: number;
  state: 'normal' | 'corona' | 'implante' | 'endodoncia' | 'caries' | 'obturacion' | 'ausente';
  cariesLocations: string[];
  obturacionLocations: string[];
}

interface OdontogramaInteractivoProps {
  patientId?: string;
}

const OdontogramaInteractivo: React.FC<OdontogramaInteractivoProps> = ({ patientId }) => {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [teethData, setTeethData] = useState<ToothData[]>([]);

  // Manejar selección de diente
  const handleToothClick = (toothId: number) => {
    setSelectedTooth(toothId);
    
    // Si hay múltiples dientes seleccionados, limpiar selección múltiple
    if (selectedTeeth.length > 0) {
      setSelectedTeeth([]);
    }
  };

  // Manejar selección múltiple con Ctrl+Click
  const handleToothCtrlClick = (toothId: number) => {
    setSelectedTeeth(prev => {
      if (prev.includes(toothId)) {
        return prev.filter(id => id !== toothId);
      } else {
        return [...prev, toothId];
      }
    });
    
    // Limpiar selección individual
    setSelectedTooth(null);
  };

  // Aplicar estado a diente individual
  const applyStateToTooth = (toothId: number, state: ToothData['state'], locations?: string[]) => {
    console.log('Apply state:', toothId, state, locations);
  };

  // Aplicar estado a múltiples dientes
  const applyStateToMultipleTeeth = (teethIds: number[], state: ToothData['state']) => {
    console.log('Apply multiple state:', teethIds, state);
  };

  // Obtener dientes por arcada
  const getUpperTeeth = () => {
    return teethData.filter(tooth => tooth.id >= 11 && tooth.id <= 28)
      .sort((a, b) => {
        // Ordenar: 18-11, 21-28
        if (a.id >= 11 && a.id <= 18 && b.id >= 11 && b.id <= 18) {
          return b.id - a.id; // 18, 17, 16... 11
        }
        if (a.id >= 21 && a.id <= 28 && b.id >= 21 && b.id <= 28) {
          return a.id - b.id; // 21, 22, 23... 28
        }
        return a.id < 20 ? -1 : 1;
      });
  };

  const getLowerTeeth = () => {
    return teethData.filter(tooth => tooth.id >= 31 && tooth.id <= 48)
      .sort((a, b) => {
        // Ordenar: 48-41, 31-38
        if (a.id >= 41 && a.id <= 48 && b.id >= 41 && b.id <= 48) {
          return b.id - a.id; // 48, 47, 46... 41
        }
        if (a.id >= 31 && a.id <= 38 && b.id >= 31 && b.id <= 38) {
          return a.id - b.id; // 31, 32, 33... 38
        }
        return a.id > 40 ? -1 : 1;
      });
  };

  return (
    <div className="odontograma-interactivo">
      <Odontograma 
        activeMode="quickselect"
        selectedTooth={selectedTooth}
        teethData={teethData}
        selectedTeeth={selectedTeeth}
        setSelectedTeeth={setSelectedTeeth}
      />
      
      <StatePanel
        selectedTooth={selectedTooth}
        selectedTeeth={selectedTeeth}
        setSelectedTeeth={setSelectedTeeth}
        teethData={teethData}
        onUpdateTooth={applyStateToTooth}
        onUpdateTeeth={applyStateToMultipleTeeth}
      />

      <style jsx>{`
        .odontograma-interactivo {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default OdontogramaInteractivo;