"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define los tipos para las citas
export type AppointmentStatus = 'Por llegar' | 'Esperando' | 'En consulta' | 'Finalizado' | 'No asistió' | 'Confirmada';

export interface Appointment {
  id: number;
  patientId: number;
  fecha: string;
  hora: string;
  doctor: string;
  motivo: string;
  estado: AppointmentStatus;
  comentario?: string;
}

// Datos iniciales de ejemplo
const initialAppointments: Appointment[] = [
  {
    id: 1,
    patientId: 1,
    fecha: '2024-05-15',
    hora: '09:00',
    doctor: 'Dr. Martínez',
    motivo: 'Revisión general',
    estado: 'Finalizado',
    comentario: 'Paciente en buen estado'
  },
  // Puedes agregar más citas de ejemplo si lo deseas
];

// Definir el tipo para el contexto
interface AppointmentsContextType {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;
}

// Crear el contexto
const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

// Proveedor del contexto
export const AppointmentsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    // Intentar cargar citas desde localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('appointments');
      if (stored) return JSON.parse(stored);
    }
    return initialAppointments;
  });

  // Función para agregar una nueva cita
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    setAppointments(prev => {
      const newId = prev.length > 0 ? Math.max(...prev.map(a => a.id)) + 1 : 1;
      const newAppointments = [...prev, { ...appointment, id: newId }];
      if (typeof window !== 'undefined') {
        localStorage.setItem('appointments', JSON.stringify(newAppointments));
      }
      return newAppointments;
    });
  };

  // Función para actualizar el estado de una cita
  const updateAppointmentStatus = (id: number, status: AppointmentStatus) => {
    setAppointments(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, estado: status } : a);
      if (typeof window !== 'undefined') {
        localStorage.setItem('appointments', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Guardar citas en localStorage cuando cambien
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appointments', JSON.stringify(appointments));
    }
  }, [appointments]);

  return (
    <AppointmentsContext.Provider value={{ appointments, setAppointments, addAppointment, updateAppointmentStatus }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments debe usarse dentro de AppointmentsProvider');
  }
  return context;
}