'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppointmentsProvider } from './AppointmentsContext';
import { PatientsProvider, usePatients } from '../../../../components/PatientsContext';

import HistoriaClinica from '../../../../components/HistoriaClinica';
import FichaFiliacion from '../../../../components/FichaFiliacion';
import DatosFiscales from '../../../../components/DatosFiscales';
import SidebarPaciente from '../../../../components/SidebarPaciente';

import Odontograma from '@/components/Odontograma'; // ✅ Usando alias
import '@/styles/Odontograma.css'; // ✅ Estilo aplicado

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

  const [form, setForm] = useState({ name: '', lastName: '' });
  const [phone, setPhone] = useState('');
  const [view, setView] = useState<'full' | 'upper' | 'lower'>('full'); // ✅ Para controlar vista

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name || '',
        lastName: patient.lastName || '',
      });
      setPhone(patient.phone1 || '');
    }
  }, [patient]);

  useEffect(() => {
    // ✅ Dispara evento personalizado para cambiar vista
    document.dispatchEvent(new CustomEvent('changeView', {
      detail: { view }
    }));
  }, [view]);

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
      <SidebarPaciente patient={patient} setTab={setTab} tab={tab} darkMode={darkMode} />

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

          {tab === 'Historia clínica' && (
            <HistoriaClinica patient={patient} darkMode={darkMode} />
          )}

          {tab === 'Datos Fiscales' && (
            <DatosFiscales patient={patient} darkMode={darkMode} />
          )}

          {tab === 'Odontograma' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Odontograma</h2>

              {/* ✅ Selector de vista */}
              <div className="flex gap-4">
                <button
                  onClick={() => setView('full')}
                  className={`px-4 py-2 rounded ${view === 'full' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  Vista Completa
                </button>
                <button
                  onClick={() => setView('upper')}
                  className={`px-4 py-2 rounded ${view === 'upper' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  Superior
                </button>
                <button
                  onClick={() => setView('lower')}
                  className={`px-4 py-2 rounded ${view === 'lower' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  Inferior
                </button>
              </div>

              {/* ✅ Componente Odontograma */}
              <div className="overflow-auto max-h-[80vh]">
                <Odontograma activeMode="quickselect" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
