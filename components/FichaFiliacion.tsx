import React from 'react';

type Props = {
  form: {
    name: string;
    lastName: string;
  };
  setForm: (form: any) => void;
  phone: string;
  setPhone: (phone: string) => void;
};

export default function FichaFiliacion({ form, setForm, phone, setPhone }: Props) {
  if (!form || typeof form.name === 'undefined') {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-md">
        ⚠️ Formulario no cargado. Verifica que el estado `form` se haya inicializado en el componente padre.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <label className="block mb-1 font-semibold text-blue-900 dark:text-white">Nombres</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((f: any) => ({ ...f, name: e.target.value }))}
          className="w-full px-4 py-2 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
        />
      </div>
      <div>
        <label className="block mb-1 font-semibold text-blue-900 dark:text-white">Apellidos</label>
        <input
          type="text"
          value={form.lastName}
          onChange={(e) => setForm((f: any) => ({ ...f, lastName: e.target.value }))}
          className="w-full px-4 py-2 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block mb-1 font-semibold text-blue-900 dark:text-white">Teléfono</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 rounded-full bg-blue-50 dark:bg-gray-700 text-blue-900 dark:text-white"
        />
      </div>
    </div>
  );
}
