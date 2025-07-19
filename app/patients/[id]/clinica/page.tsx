"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppointmentsProvider } from './AppointmentsContext';
import { PatientsProvider, usePatients } from '../../../../components/PatientsContext';
// import Odontograma from '../../../../components/Odontograma'; - Eliminado
import HistoriaClinica from '../../../../components/HistoriaClinica';
import FichaFiliacion from '../../../../components/FichaFiliacion';
import DatosFiscales from '../../../../components/DatosFiscales';
import SidebarPaciente from '../../../../components/SidebarPaciente';

export default function ClinicaPage() {
  return (
    <PatientsProvider>
      <AppointmentsProvider>
        <ClinicaPageContent />
      </AppointmentsProvider>
    </PatientsProvider>
  );
}

function ClinicaPageContent() {
  const router = useRouter();
  const params = useParams();
  const { patients, updatePatient } = usePatients();
  const patient = patients.find((p) => p.id === Number(params.id));

  const [tab, setTab] = useState('Filiación');
  const [darkMode] = useState(true);

  // ✅ Agregar estados para FichaFiliacion
  const [form, setForm] = useState({ name: '', lastName: '' });
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        lastName: patient.lastName || '',
      });
      setPhone(patient.phone1 || '');
    }
  }, [patient]);

  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    text: darkMode ? 'text-white' : 'text-gray-800',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
  };

  if (!patient) {
    return <div className="p-10 text-center text-white">Paciente no encontrado</div>;
  }

  return (
    <div className={`flex h-screen w-full ${themeClasses.background} ${themeClasses.text}`}>
      {/* Barra lateral del paciente */}
      <SidebarPaciente patient={patient} setTab={setTab} tab={tab} darkMode={darkMode} />

      {/* Panel derecho con contenido dinámico */}
      <div className="flex-1 flex flex-col p-8 overflow-auto">
        <div className={`rounded-lg shadow-lg p-6 ${themeClasses.card}`}>
          {tab === 'Filiación' && (
            <FichaFiliacion
              form={form}
              setForm={setForm}
              phone={phone}
              setPhone={setPhone}
            />
          )}
          {tab === 'Historia clínica' && <HistoriaClinica patient={patient} darkMode={darkMode} />}
          {tab === 'Datos Fiscales' && <DatosFiscales patient={patient} darkMode={darkMode} />}
          {tab === 'Odontograma' && (
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Odontograma</h2>
              <p className="mb-4">El nuevo componente de odontograma será implementado próximamente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
