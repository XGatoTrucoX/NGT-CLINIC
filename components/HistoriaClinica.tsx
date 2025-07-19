import React, { useState } from 'react';

type HistoriaClinicaProps = {
  historiaForm?: {
    motivoConsulta: string;
    enfermedadActual: string;
    notaEvolucion?: string;
    anamOdontopediatria?: string;
    endodoncia?: string;
    signosVitales?: string;
    consentimientos?: string;
  };
  setHistoriaForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function HistoriaClinica({
  historiaForm = {
    motivoConsulta: '',
    enfermedadActual: '',
    notaEvolucion: '',
    anamOdontopediatria: '',
    endodoncia: '',
    signosVitales: '',
    consentimientos: '',
  },
  setHistoriaForm,
}: HistoriaClinicaProps) {
  const [historiaTab, setHistoriaTab] = useState('Anam. Odontología');

  const historiaTabs = [
    'Anam. Odontología',
    'Nota de evolución',
    'Anam. Odontopediatría',
    'Endodoncia',
    'Signos Vitales',
    'Consentimientos',
  ];

  const renderTabContent = () => {
    switch (historiaTab) {
      case 'Anam. Odontología':
        return (
          <>
            <div>
              <label className="block mb-1 font-semibold text-cyan-200">Motivo de consulta</label>
              <input
                type="text"
                value={historiaForm.motivoConsulta}
                onChange={(e) =>
                  setHistoriaForm((f: any) => ({
                    ...f,
                    motivoConsulta: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-cyan-200">Enfermedad actual</label>
              <input
                type="text"
                value={historiaForm.enfermedadActual}
                onChange={(e) =>
                  setHistoriaForm((f: any) => ({
                    ...f,
                    enfermedadActual: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
              />
            </div>
          </>
        );

      case 'Nota de evolución':
        return (
          <div>
            <label className="block mb-1 font-semibold text-cyan-200">Nota de evolución</label>
            <textarea
              value={historiaForm.notaEvolucion}
              onChange={(e) =>
                setHistoriaForm((f: any) => ({
                  ...f,
                  notaEvolucion: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
            />
          </div>
        );

      case 'Anam. Odontopediatría':
        return (
          <div>
            <label className="block mb-1 font-semibold text-cyan-200">Anamnesis Odontopediatría</label>
            <textarea
              value={historiaForm.anamOdontopediatria}
              onChange={(e) =>
                setHistoriaForm((f: any) => ({
                  ...f,
                  anamOdontopediatria: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
            />
          </div>
        );

      case 'Endodoncia':
        return (
          <div>
            <label className="block mb-1 font-semibold text-cyan-200">Observaciones Endodoncia</label>
            <textarea
              value={historiaForm.endodoncia}
              onChange={(e) =>
                setHistoriaForm((f: any) => ({
                  ...f,
                  endodoncia: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
            />
          </div>
        );

      case 'Signos Vitales':
        return (
          <div>
            <label className="block mb-1 font-semibold text-cyan-200">Signos Vitales</label>
            <textarea
              value={historiaForm.signosVitales}
              onChange={(e) =>
                setHistoriaForm((f: any) => ({
                  ...f,
                  signosVitales: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
            />
          </div>
        );

      case 'Consentimientos':
        return (
          <div>
            <label className="block mb-1 font-semibold text-cyan-200">Consentimientos informados</label>
            <textarea
              value={historiaForm.consentimientos}
              onChange={(e) =>
                setHistoriaForm((f: any) => ({
                  ...f,
                  consentimientos: e.target.value,
                }))
              }
              rows={4}
              className="w-full px-4 py-2 rounded bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-cyan-400 overflow-x-auto">
        {historiaTabs.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-bold text-base focus:outline-none border-b-2 transition-colors duration-200 ${
              historiaTab === tab
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-gray-400'
            }`}
            onClick={() => setHistoriaTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenido dinámico */}
      <form className="space-y-4">{renderTabContent()}</form>
    </div>
  );
}
