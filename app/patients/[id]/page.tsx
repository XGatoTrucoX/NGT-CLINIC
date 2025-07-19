"use client";
import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, MapPin, Phone, MessageCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import 'flag-icons/css/flag-icons.min.css';
import PhoneInput from 'react-phone-input-2';
import { AppointmentsProvider, useAppointments } from './clinica/AppointmentsContext';
import { PatientsProvider, usePatients } from '../../../components/PatientsContext';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return (
    <PatientsProvider>
      <PatientDetailPageContent params={params} />
    </PatientsProvider>
  );
}

function PatientDetailPageContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { patients } = usePatients();
  const patient = patients.find((p: any) => p.id === Number(params.id));
  if (!patient) return <div className="p-10 text-center">Paciente no encontrado.</div>;

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [sections, setSections] = React.useState(1);
  const [showModal, setShowModal] = React.useState(false);
  const [sectionsToAdd, setSectionsToAdd] = React.useState(1);
  const [tratamiento, setTratamiento] = React.useState('Profilaxis');
  const [seccionActiva, setSeccionActiva] = React.useState('Historia clínica');
  const secciones = [
    'Historia clínica',
    // 'Odontograma', - Eliminado
    'Periodontograma',
    'Ortodoncia',
    'Estado de cuenta',
    'Prescripciones',
    'Archivos',
  ];

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (sections >= 2) {
      setShowModal(true);
      setSectionsToAdd(sections);
    }
  }, [sections]);

  const [darkMode, setDarkMode] = React.useState(true);
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    sidebar: darkMode ? 'bg-gradient-to-b from-blue-900 to-blue-700 border-gray-800' : 'bg-gradient-to-b from-blue-100 to-blue-50 border-gray-200',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-400' : 'text-gray-600',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    border: darkMode ? 'border-gray-800' : 'border-gray-200',
    input: darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
    button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
    menu: darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800',
    menuHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
  };

  const [tab, setTab] = React.useState('Datos Personales');
  const tabs = ['Datos Personales', 'Datos Fiscales', 'Familiar'];
  const [form, setForm] = React.useState({
    name: patient.name,
    lastName: 'Scott',
    nationality: 'Boliviana',
    phone: patient.phone1,
    docType: 'Cédula',
    docNumber: patient.nif,
    email: patient.email,
    fijo: '',
    hc: patient.history,
  });
  const [birth, setBirth] = React.useState<Date | null>(null);
  const [lastVisit, setLastVisit] = React.useState<Date | null>(null);
  const [gender, setGender] = React.useState('Mujer');
  const [group, setGroup] = React.useState('');
  const [linea, setLinea] = React.useState('');
  const [fuente, setFuente] = React.useState('');
  const [aseguradora, setAseguradora] = React.useState('');
  const [adicional, setAdicional] = React.useState('');
  const [address, setAddress] = React.useState('No hay dirección registrada');
  const [ocupacion, setOcupacion] = React.useState('ocupación');

  // Estado para validación
  const [touched, setTouched] = React.useState<{[k: string]: boolean}>({});
  const [phone, setPhone] = React.useState(form.phone || '591');
  const isValidName = form.name.trim().length > 0;
  const isValidPhone = phone.trim().length >= 8; // Puedes ajustar la longitud mínima
  const isValidCI = form.docNumber.trim().length > 0;
  const isValidAddress = address.trim().length > 0;

  const handleBlur = (field: string) => setTouched(t => ({ ...t, [field]: true }));

  // Paleta de colores para la vista previa
  const previewTheme = {
    background: darkMode ? '#19202A' : '#F5F8FA',
    card: darkMode ? '#232C3B' : '#FFFFFF',
    input: darkMode ? '#263447' : '#F0F4F8',
    border: darkMode ? '#2E3A4B' : '#B0BEC5',
    focus: '#3DE6FF',
    valid: '#2EE59D',
    error: '#FF5A5F',
    text: darkMode ? '#FFFFFF' : '#263447',
    label: darkMode ? '#B0BEC5' : '#607D8B',
    button: '#3DE6FF',
    buttonText: '#19202A',
  };

  // Nuevo componente para mostrar el historial de citas sincronizado
  function HistorialCitasTabla() {
    const { appointments } = useAppointments();
    const citasPaciente = appointments.filter(a => a.patientId === patient.id);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-700 text-white">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Doctor</th>
              <th className="p-3 text-left">Motivo</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {citasPaciente.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-gray-400 text-lg">Sin citas registradas</td></tr>
            )}
            {citasPaciente.map((cita, idx) => (
              <tr key={cita.id} className="bg-blue-50 dark:bg-gray-800 border-b border-blue-100 dark:border-gray-700">
                <td className="p-3 font-semibold text-blue-900 dark:text-white">{cita.fecha} | {cita.hora}</td>
                <td className="p-3 text-blue-900 dark:text-white">{cita.doctor}</td>
                <td className="p-3 text-blue-900 dark:text-white">{cita.motivo}</td>
                <td className={`p-3 font-bold ${cita.estado === 'Finalizado' ? 'text-gray-500' : cita.estado === 'No asistió' ? 'text-red-500' : cita.estado === 'En consulta' ? 'text-yellow-400' : cita.estado === 'Esperando' ? 'text-blue-500' : cita.estado === 'Por llegar' ? 'text-cyan-400' : 'text-green-600 dark:text-green-400'}`}>{cita.estado === 'Confirmada' ? '✓ Confirmada' : cita.estado}</td>
                <td className="p-3 text-blue-900 dark:text-white">{cita.comentario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Renderizado condicional para la sección Clínica
  if (isClient && typeof window !== 'undefined' && window.location.hash === '#clinica') {
    return (
      <div className={`flex h-screen w-full ${themeClasses.background} ${themeClasses.text}`}>
        {/* Sidebar paciente actualizado con todos los datos sincronizados */}
        <div className={`w-80 flex flex-col items-center py-8 border-r ${themeClasses.border} ${themeClasses.sidebar} rounded-2xl shadow-lg mx-4 h-full`} style={{background: previewTheme.card}}>
          <img src={patient.avatar} alt={patient.name} className="w-24 h-24 rounded-full border-4 border-cyan-400 mb-4" />
          <div className="text-2xl font-bold mb-2" style={{color: previewTheme.text}}>{patient.name} {patient.lastName}</div>
          <div className="flex flex-row gap-4 w-full mt-2 px-6 justify-center items-center">
            {/* Botón Llamada */}
            <a href={`https://wa.me/${patient.phone1}?text=Hola,%20te%20llamo%20de%20NGT%20Clinic`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full py-2 px-4 text-base shadow-lg transition-colors duration-200" style={{ minHeight: '44px', minWidth: '120px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.95-.24c1.04.28 2.16.43 3.32.43a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.16.15 2.28.43 3.32a1 1 0 01-.24.95l-2.07 2.07z"/></svg>
              Llamada
            </a>
            {/* Botón WhatsApp */}
            <a href={`https://wa.me/${patient.phone1}?text=Hola,%20te%20escribo%20de%20NGT%20Clinic`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full py-2 px-4 text-base shadow-lg transition-colors duration-200" style={{ minHeight: '44px', minWidth: '120px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 6.01L0 24l6.09-1.59A12.04 12.04 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.62.95.97-3.53-.23-.37A9.97 9.97 0 012 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 5.01 4.23.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" fill="#fff"/></svg>
              WhatsApp
            </a>
          </div>
          <div className="flex flex-col gap-2 w-full items-center mb-4">
            <span className="px-4 py-1 rounded-full text-white text-sm font-semibold shadow-lg" style={{background:'#E76F1C', boxShadow: '0 0 0 2px #3DE6FF'}}>
              Edad {patient.age}
            </span>
            <span className="px-4 py-1 rounded-full text-white text-sm font-semibold flex items-center gap-1" style={{background: patient.gender==='F'?'#C13B8A':'#2B7FC1'}}>
              {patient.gender==='F'?<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0a5 5 0 0 0-1 9.9V12H5.5a.5.5 0 0 0 0 1H7v1.5a.5.5 0 0 0 1 0V13h1.5a.5.5 0 0 0 0-1H9V9.9A5 5 0 0 0 8 0zm0 1a4 4 0 1 1 0 8A4 4 0 0 1 8 1z"/></svg>:<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M9 1a3 3 0 0 1 3 3c0 1.306-.835 2.417-2 2.83V9h1.5a.5.5 0 0 1 0 1H10v1.5a.5.5 0 0 1-1 0V10H7.5a.5.5 0 0 1 0-1H9V6.83A3.001 3.001 0 0 1 9 1z"/></svg>}
              {patient.gender==='F'?'Femenino':'Masculino'}
            </span>
            <span className="px-4 py-1 rounded-full text-white text-sm font-semibold" style={{background:'#1CBF4B'}}>Hace 367 días</span>
            <span className="px-4 py-1 rounded-full text-white text-sm font-semibold" style={{background:'#2B4FC1'}}>Bs. {patient.totalPayments}</span>
            <span className="px-4 py-1 rounded-full text-white text-sm font-semibold" style={{background:'#8B2BC1'}}>{patient.condition}</span>
          </div>
          <span className="text-3xl text-white mt-2 mb-4">...</span>
          {/* Menú lateral moderno */}
          <nav className="w-full flex flex-col gap-1 mt-2">
            {[
              {label:'Filiación', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z"/><path d="M12 14c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>},
              {label:'Historia clínica', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>},
              // Mantener solo el botón de Odontograma
              {label:'Odontograma', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2C7 2 2 7 2 12c0 5 5 10 10 10s10-5 10-10c0-5-5-10-10-10z"/></svg>},
              {label:'Periodontograma', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>},
              {label:'Ortodoncia', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="8" rx="4"/></svg>},
              {label:'Estado de cuenta', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/></svg>},
              {label:'Prescripciones', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8M8 12h6"/></svg>},
              {label:'Archivos', icon:<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>},
            ].map(sec => (
              <button
                key={sec.label}
                className={`flex items-center gap-3 px-6 py-2 rounded-lg transition-colors text-base font-medium ${seccionActiva===sec.label ? 'bg-cyan-300 text-blue-900 shadow-lg' : themeClasses.menu+' '+themeClasses.menuHover}`}
                onClick={()=>setSeccionActiva(sec.label)}
              >
                {sec.icon}
                {sec.label}
              </button>
            ))}
          </nav>
        </div>
        {/* Panel principal */}
        <div className="flex-1 flex flex-col p-8 h-full min-h-0">
          <div className="flex gap-4 mb-6">
            {tabs.map(t => (
              <button key={t} className={`px-4 py-2 rounded-t ${tab === t ? 'bg-blue-600 text-white' : themeClasses.card + ' ' + themeClasses.text}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>
          <div className={`rounded-b-lg shadow-lg p-8 ${themeClasses.card} ${themeClasses.text} h-full flex flex-col`}>
            {tab === 'Datos Personales' && (
              <div className="w-full max-w-5xl mx-auto p-8 rounded-2xl shadow-lg flex-1 flex flex-col justify-between" style={{ background: darkMode ? '#232C3B' : '#F8FBFF' }}>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  {/* Columna izquierda */}
                  <div className="flex flex-col gap-6">
                    {/* Nombres */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Nombres:*</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                        required
                      />
                    </div>
                    {/* Apellidos */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Apellidos:*</label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                        required
                      />
                    </div>
                    {/* Nacionalidad */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Nacionalidad:</label>
                      <input
                        type="text"
                        value={form.nationality}
                        onChange={e => setForm({ ...form, nationality: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      />
                    </div>
                    {/* Celular internacional */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Celular:*</label>
                      <PhoneInput
                        country={'bo'}
                        preferredCountries={['bo']}
                        value={phone}
                        onChange={setPhone}
                        inputStyle={{
                          width: '100%',
                          borderRadius: '1.5rem',
                          background: darkMode ? '#263447' : '#F0F4F8',
                          color: darkMode ? '#fff' : '#263447',
                          border: `2px solid ${isValidPhone ? '#2EE59D' : '#B0BEC5'}`,
                          fontSize: '1.125rem',
                          paddingLeft: '48px',
                        }}
                        buttonStyle={{
                          borderRadius: '1.5rem 0 0 1.5rem',
                          background: darkMode ? '#263447' : '#F0F4F8',
                          border: `2px solid ${isValidPhone ? '#2EE59D' : '#B0BEC5'}`,
                        }}
                        dropdownStyle={{
                          background: darkMode ? '#232C3B' : '#F8FBFF',
                          color: darkMode ? '#fff' : '#263447',
                          border: `1px solid ${darkMode ? '#2E3A4B' : '#B0BEC5'}`,
                          fontSize: '1rem',
                        }}
                        containerStyle={{ width: '100%' }}
                        inputProps={{ required: true, name: 'phone' }}
                        dropdownClass={darkMode ? 'custom-phone-dropdown-dark' : 'custom-phone-dropdown-light'}
                      />
                      {!isValidPhone && touched.phone && (
                        <span className="text-xs text-red-500">Campo obligatorio</span>
                      )}
                    </div>
                  </div>
                  {/* Columna derecha */}
                  <div className="flex flex-col gap-6">
                    {/* Tipo de documento */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Tipo documentos:*</label>
                      <select
                        value={form.docType}
                        onChange={e => setForm({ ...form, docType: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                        required
                      >
                        <option value="DNI">DNI</option>
                        <option value="Cédula">Cédula</option>
                        <option value="Pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    {/* N° Doc */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">N° Doc:</label>
                      <input
                        type="text"
                        value={form.docNumber}
                        onChange={e => setForm({ ...form, docNumber: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      />
                    </div>
                    {/* E-mail */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">E-mail:</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      />
                    </div>
                    {/* N° HC */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">N° HC:</label>
                      <input
                        type="number"
                        value={form.hc}
                        onChange={e => setForm({ ...form, hc: Number(e.target.value) })}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      />
                    </div>
                    {/* Fuente de captación */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Fuente de captación:</label>
                      <select
                        value={fuente}
                        onChange={e => setFuente(e.target.value)}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      >
                        <option>Seleccione una opción</option>
                        <option>Facebook</option>
                        <option>Instagram</option>
                        <option>Tiktok</option>
                        <option>Influencer</option>
                        <option>Google</option>
                        <option>Fachada</option>
                        <option>Referido por paciente</option>
                        <option>Referido por doctor</option>
                        <option>Amigos y familiares</option>
                        <option>otro</option>
                      </select>
                    </div>
                    {/* Aseguradora */}
                    <div>
                      <label className="block mb-1 text-base font-semibold text-blue-900 dark:text-blue-200">Aseguradora:</label>
                      <select
                        value={aseguradora}
                        onChange={e => setAseguradora(e.target.value)}
                        className="w-full rounded-full px-5 py-2 bg-blue-50 dark:bg-gray-700 border-none text-blue-900 dark:text-white"
                      >
                        <option>Seleccione una opción</option>
                        <option>Alianza</option>
                        <option>BISA</option>
                        <option>Crediseguros</option>
                        <option>Fortaleza</option>
                        <option>MAPFRE</option>
                        <option>Mercantil Santa Cruz</option>
                        <option>Nacional</option>
                      </select>
                    </div>
                  </div>
                  {/* Botón guardar centrado */}
                  <div className="md:col-span-2 flex justify-center mt-8">
                    <button
                      type="submit"
                      className="px-10 py-3 rounded-full font-bold text-lg shadow-lg transition-colors duration-200"
                      style={{ background: '#3DE6FF', color: '#19202A' }}
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
                {/* Línea divisoria */}
                <div className="my-8 border-t border-blue-200 dark:border-gray-700" />
                {/* Historial de citas sincronizado */}
                <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">Historial de citas</h2>
                <HistorialCitasTabla />
              </div>
            )}
            {tab === 'Datos Fiscales' && (
              <div className="text-center text-lg opacity-70">En construcción</div>
            )}
            {tab === 'Familiar' && (
              <div className="text-center text-lg opacity-70">En construcción</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppointmentsProvider>
      <div className="flex flex-col md:flex-row gap-8 p-8 w-full">
        {/* Panel izquierdo */}
        <div className="bg-blue-900/30 rounded-xl p-6 w-full md:w-80 flex flex-col items-center relative">
          <button
            className="absolute top-4 left-4 bg-blue-800 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg flex items-center"
            onClick={() => router.push('/patients')}
            title="Volver a pacientes"
          >
            <ChevronLeft size={20} />
          </button>
          <img src={patient.avatar} alt={patient.name} className="w-24 h-24 rounded-full border-4 border-cyan-400 mb-4" />
          <div className="text-2xl font-bold mb-2" style={{color: previewTheme.text}}>{patient.name}</div>
          {/* Botones de acción: Llamada y WhatsApp (compactos y en fila) */}
          <div className="flex flex-row gap-4 w-full mt-2 px-6 justify-center items-center">
            {/* Botón Llamada (WhatsApp call) */}
            <a
              href={`https://wa.me/${patient.phone1}?text=Hola,%20te%20llamo%20de%20NGT%20Clinic`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-full py-2 px-4 text-base shadow-lg transition-colors duration-200"
              style={{ minHeight: '44px', minWidth: '120px' }}
            >
              {/* Icono Teléfono moderno */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="#fff" d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 01.95-.24c1.04.28 2.16.43 3.32.43a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.16.15 2.28.43 3.32a1 1 0 01-.24.95l-2.07 2.07z"/></svg>
              Llamada
            </a>
            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/${patient.phone1}?text=Hola,%20te%20escribo%20de%20NGT%20Clinic`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full py-2 px-4 text-base shadow-lg transition-colors duration-200"
              style={{ minHeight: '44px', minWidth: '120px' }}
            >
              {/* Icono WhatsApp moderno */}
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M20.52 3.48A12.07 12.07 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 6.01L0 24l6.09-1.59A12.04 12.04 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.62.95.97-3.53-.23-.37A9.97 9.97 0 012 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.8c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.34-.26.27-1 1-.97 2.43.03 1.43 1.03 2.81 1.18 3 .15.19 2.03 3.1 5.01 4.23.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" fill="#fff"/></svg>
              WhatsApp
            </a>
          </div>
          {/* Botón Clínica */}
          <div className="flex justify-center mt-6 mb-4">
            <button
              className="flex items-center gap-2 px-6 py-2 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-base shadow-lg transition-colors duration-200"
              onClick={() => router.push(`/patients/${patient.id}/clinica`)}
              style={{ minWidth: '140px' }}
            >
              {/* Icono caduceo médico */}
              <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="white" strokeWidth="2" fill="none">
                  <path d="M32 2v60"/>
                  <path d="M32 12c-8 0-8 8-8 8s0 8 8 8 8-8 8-8-0-8-8-8z"/>
                  <path d="M32 28c-8 0-8 8-8 8s0 8 8 8 8-8 8-8-0-8-8-8z"/>
                  <path d="M32 44c-8 0-8 8-8 8s0 8 8 8 8-8 8-8-0-8-8-8z"/>
                  <path d="M24 8l-8-6"/>
                  <path d="M40 8l8-6"/>
                </g>
              </svg>
              Clínica
            </button>
          </div>
          <div className="text-left w-full text-sm text-white/90">
            <div className="mb-1"><b>{patient.docType || 'CI'}:</b> {patient.docNumber || patient.nif}</div>
            <div className="mb-1"><b>N° Historial Clínico:</b> {patient.hc || patient.history}</div>
            <div className="mb-1"><b>Fecha nacimiento:</b> {patient.birth ? new Date(patient.birth).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}</div>
            <div className="mb-1"><b>Celular:</b> {patient.phone1 ? (patient.phone1.startsWith('+') ? patient.phone1 : `+${patient.phone1}`) : ''}</div>
            <div className="mb-1"><b>Email:</b> {patient.email}</div>
            <div className="mb-1"><b>Dirección:</b> {patient.address}</div>
            <div className="mb-1"><b>Fuente de captación:</b> {patient.fuente}</div>
            <div className="mb-1"><b>Aseguradora:</b> {patient.aseguradora}</div>
          </div>
        </div>
        {/* Panel derecho */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-white">Plan de Tratamiento</h2>
            {/* Menú desplegable de tratamientos */}
            <div className="mb-6">
              <select
                className="bg-gray-900 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={tratamiento}
                onChange={e => setTratamiento(e.target.value)}
              >
                <option>Profilaxis</option>
                <option>Terapia</option>
                <option>Prostodoncia</option>
                <option>Cirugía</option>
                <option>Orto</option>
              </select>
            </div>
            {/* Línea de tiempo */}
            <div className="flex flex-col items-center">
              <div className="flex items-center w-full justify-between mb-4">
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <span className="mt-2 text-xs text-white">Diagnóstico</span>
                </div>
                <div className="flex-1 h-1 bg-blue-300 mx-2" />
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <span className="mt-2 text-xs text-white">Tratamiento</span>
                </div>
                <div className="flex-1 h-1 bg-blue-300 mx-2" />
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <span className="mt-2 text-xs text-white">Contención</span>
                </div>
                <div className="flex-1 h-1 bg-blue-300 mx-2" />
                <div className="flex flex-col items-center">
                  <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                  <span className="mt-2 text-xs text-white">Post-Contención</span>
                </div>
              </div>
              <div className="flex w-full justify-between mt-2">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white text-xs">F. Inicio</span>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="bg-gray-900 text-white rounded px-2 py-1 mt-1 text-xs w-24 text-center"
                    placeholderText="Seleccionar"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white text-xs">Secciones necesarias</span>
                  <input
                    type="number"
                    min="1"
                    value={sections}
                    onChange={e => setSections(Number(e.target.value))}
                    className="bg-gray-900 text-white rounded px-2 py-1 mt-1 text-xs w-16 text-center border border-gray-700"
                    placeholder="0"
                  />
                  {sections >= 2 && (
                    <button
                      className="mt-2 text-xs text-blue-300 underline hover:text-blue-500 transition-colors"
                      onClick={() => router.push('/appointments')}
                    >
                      ¿Quieres agendar las citas?
                    </button>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white text-xs">F. Fin</span>
                  <span className="text-xs text-gray-300">-</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white text-xs">Retraso</span>
                  <span className="text-xs text-gray-300">meses</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-white text-xs">Nueva F. Fin</span>
                  <span className="text-xs text-gray-300">-</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-white">Próximas visitas</h2>
            <table className="min-w-full text-sm text-white">
              <thead>
                <tr>
                  <th className="p-2 text-left">Fecha</th>
                  <th className="p-2 text-left">Profesional</th>
                  <th className="p-2 text-left">Tipo visita</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2">29/10/2024 09:00</td>
                  <td className="p-2">Alfonso Ríos</td>
                  <td className="p-2">Consulta</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-bold mb-4 text-white">Notas</h2>
            <div className="text-gray-300">{patient.notes}</div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 flex flex-col items-center">
              <div className="text-gray-900 font-bold mb-2">¿Cuántas secciones vas a añadir ahora?</div>
              <select
                className="mb-4 px-4 py-2 rounded border border-gray-300"
                value={sectionsToAdd}
                onChange={e => setSectionsToAdd(Number(e.target.value))}
              >
                {Array.from({ length: sections }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mb-2"
                onClick={() => {
                  setShowModal(false);
                  // Aquí podrías redirigir a la pestaña de citas si lo deseas
                  // router.push('/appointments');
                }}
              >
                Confirmar
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 text-xs"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </AppointmentsProvider>
  );
}