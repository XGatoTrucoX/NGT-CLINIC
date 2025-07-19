import React from 'react';

type Patient = {
  avatar: string;
  name: string;
  lastName: string;
  birth?: string;
  gender: 'F' | 'M';
  lastVisit?: string;
  totalPayments: number;
  condition?: string;
};

type Props = {
  patient: Patient;
  tab: string;
  setTab: (tab: string) => void;
};

// Función para calcular edad desde fecha de nacimiento
function calcularEdad(fechaNacimiento?: string) {
  if (!fechaNacimiento) return '';
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;
  return edad;
}

export default function SidebarPaciente({ patient, tab, setTab }: Props) {
  const secciones = ['Filiación', 'Datos Fiscales', 'Historia clínica', 'Odontograma'];

  return (
    <div className="w-80 flex flex-col items-center py-8 border-r border-gray-800 bg-gray-800 rounded-2xl shadow-lg mx-4">
      <img
        src={patient.avatar}
        alt={patient.name}
        className="w-24 h-24 rounded-full border-4 border-cyan-400 mb-4"
      />
      <div className="text-2xl font-bold text-white mb-2">
        {patient.name} {patient.lastName}
      </div>
      <div className="flex flex-col gap-2 w-full items-center mb-4">
        <span className="px-4 py-1 rounded-full text-white text-sm font-semibold shadow-lg bg-orange-500">
          Edad {calcularEdad(patient.birth || '')}
        </span>
        <span
          className={`px-4 py-1 rounded-full text-white text-sm font-semibold ${
            patient.gender === 'F' ? 'bg-pink-600' : 'bg-blue-600'
          }`}
        >
          {patient.gender === 'F' ? '♀️ Femenino' : '♂️ Masculino'}
        </span>
        <span className="px-4 py-1 rounded-full text-white text-sm font-semibold bg-green-500">
          Hace{' '}
          {patient.lastVisit
            ? Math.floor(
                (new Date().getTime() - new Date(patient.lastVisit).getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            : '--'}{' '}
          días
        </span>
        <span className="px-4 py-1 rounded-full text-white text-sm font-semibold bg-blue-700">
          Bs. {patient.totalPayments}
        </span>
        <span className="px-4 py-1 rounded-full text-white text-sm font-semibold bg-purple-700">
          {patient.condition}
        </span>
      </div>
      <nav className="w-full flex flex-col gap-1 mt-2">
        {secciones.map((sec) => (
          <button
            key={sec}
            className={`flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-base font-medium ${
              tab === sec
                ? 'bg-cyan-300 text-blue-900 shadow-lg'
                : 'text-white hover:bg-gray-700'
            }`}
            onClick={() => setTab(sec)}
          >
            {sec}
          </button>
        ))}
      </nav>
    </div>
  );
}
