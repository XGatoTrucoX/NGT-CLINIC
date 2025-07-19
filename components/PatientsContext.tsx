"use client"; // <--- Añade esta línea al inicio del archivo

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Patient {
  id: number;
  name: string;
  lastName?: string;
  avatar: string;
  age: number;
  gender: 'M' | 'F';
  lastVisit: string;
  totalPayments: number;
  condition: string;
  nif?: string;
  history?: number;
  birth?: string;
  profession?: string;
  phone1?: string;
  phone2?: string;
  email?: string;
  address?: string;
  insurer?: string;
  notes?: string;
  fuente?: string;
  aseguradora?: string;
  docType?: string;
  docNumber?: string;
  hc?: number | string;
}

const initialPatients: Patient[] = [
  {
    id: 1,
    name: 'Alice',
    lastName: 'Scott',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    age: 52,
    gender: 'F',
    lastVisit: '2024-05-10',
    totalPayments: 3297,
    condition: 'Cardiópata',
    nif: '5300717',
    history: 1,
    birth: '1972-05-10',
    profession: 'Empresaria',
    phone1: '9153644453',
    phone2: '+34649823896',
    email: 'info@dricloud.com',
    address: 'Av 35 B',
    insurer: 'Sanitas',
    notes: 'Recomendada del Dr. Fernández',
  },
  // ...otros pacientes si es necesario
];

interface PatientsContextType {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  updatePatient: (id: number, data: Partial<Patient>) => void;
}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);

export const PatientsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);

  const updatePatient = (id: number, data: Partial<Patient>) => {
    setPatients(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...data } : p);
      if (typeof window !== 'undefined') {
        localStorage.setItem('patients', JSON.stringify(updated));
      }
      return updated;
    });
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('patients');
      if (stored) setPatients(JSON.parse(stored));
    }
  }, []);

  return (
    <PatientsContext.Provider value={{ patients, setPatients, updatePatient }}>
      {children}
    </PatientsContext.Provider>
  );
};

export function usePatients() {
  const context = useContext(PatientsContext);
  if (!context) throw new Error('usePatients debe usarse dentro de PatientsProvider');
  return context;
}