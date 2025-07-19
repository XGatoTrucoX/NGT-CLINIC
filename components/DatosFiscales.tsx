import React from 'react';

type FiscalRow = {
  razonSocial: string;
  documento: string;
  direccion: string;
  departamento: string;
};

type Props = {
  fiscalData?: FiscalRow[];
  setFiscalData: (data: FiscalRow[]) => void;
  setShowFiscalModal: (state: boolean) => void;
};

export default function DatosFiscales({ fiscalData = [], setFiscalData, setShowFiscalModal }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-blue-800">
        <thead>
          <tr className="bg-blue-800 text-white">
            <th className="p-3">Razón Social</th>
            <th className="p-3">Documento</th>
            <th className="p-3">Dirección</th>
            <th className="p-3">Departamento</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {fiscalData.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-400">
                Sin registros fiscales
              </td>
            </tr>
          ) : (
            fiscalData.map((row, idx) => (
              <tr key={idx} className="border-b border-blue-800">
                <td className="p-3 text-white">{row.razonSocial}</td>
                <td className="p-3 text-white">{row.documento}</td>
                <td className="p-3 text-white">{row.direccion}</td>
                <td className="p-3 text-white">{row.departamento}</td>
                <td className="p-3">
                  <button
                    onClick={() => setFiscalData(data => data.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="text-center mt-6">
        <button
          onClick={() => setShowFiscalModal(true)}
          className="px-6 py-2 bg-cyan-400 text-blue-900 rounded-full font-semibold hover:bg-cyan-500 transition"
        >
          Nuevo Registro
        </button>
      </div>
    </div>
  );
}
