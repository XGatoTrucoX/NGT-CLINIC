"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, Plus, Archive, LogOut, ChevronDown, MoreHorizontal, Moon, Sun, Bell, X } from 'lucide-react';

// Tipos para los doctores
interface Doctor {
  id: number;
  name: string;
  email?: string;
  avatar: string;
  avatarColor: string;
  pastAppointments: number;
  upcomingAppointments: number;
  dutyDays?: string[];
}

// Tipos para los pacientes y citas
interface Patient {
  id: number;
  name: string;
}

interface Appointment {
  id: number;
  doctorId: number;
  patient: Patient;
  date: string;
  time: string;
  preopNotes: string;
  price: number;
  paid: number;
  currency: string;
}

// Datos de ejemplo para los doctores
const initialDoctorsData: Doctor[] = [
  { id: 1, name: 'Dr. Kevin Jones', avatar: 'D', avatarColor: '#9575cd', pastAppointments: 24, upcomingAppointments: 17 },
  { id: 2, name: 'Dr. Kevin William', avatar: 'D', avatarColor: '#9c27b0', pastAppointments: 16, upcomingAppointments: 14 },
  { id: 3, name: 'Dr. Mark Phillips', avatar: 'D', avatarColor: '#f44336', pastAppointments: 32, upcomingAppointments: 10 },
  { id: 4, name: 'Dr. Mike Robinson', avatar: 'D', avatarColor: '#f44336', pastAppointments: 15, upcomingAppointments: 12 },
  { id: 5, name: 'Dr. Peter Clark', avatar: 'D', avatarColor: '#2196f3', pastAppointments: 29, upcomingAppointments: 16 },
];

// Datos simulados de próximas citas para el doctor
const sampleAppointments: Appointment[] = [
  {
    id: 1,
    doctorId: 1,
    patient: { id: 1, name: 'John Davis' },
    date: 'Vie 09/05/2025',
    time: '10:51',
    preopNotes: 'Remoción de carilla dental.',
    price: 322,
    paid: 0,
    currency: 'USD',
  },
  {
    id: 2,
    doctorId: 1,
    patient: { id: 2, name: 'Stephanie Martínez' },
    date: 'Sáb 10/05/2025',
    time: '14:51',
    preopNotes: 'Colocación de puente dental.',
    price: 322,
    paid: 0,
    currency: 'USD',
  },
];

// Componente principal
export default function DoctorsPage() {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedTab, setSelectedTab] = useState<'all' | 'past' | 'upcoming'>('all');
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctorsData);
  const [archivedDoctors, setArchivedDoctors] = useState<Doctor[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(initialDoctorsData);
  const [darkMode, setDarkMode] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [newDoctor, setNewDoctor] = useState<{ name: string; email: string; dutyDays: string[] }>({ name: '', email: '', dutyDays: [] });
  const [showArchived, setShowArchived] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: 'John Davis' },
    { id: 2, name: 'Stephanie Martínez' },
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentDoctor, setAppointmentDoctor] = useState<Doctor | null>(null);
  
  // Ordenar doctores por nombre
  const sortDoctors = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    
    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
      return newDirection === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    });
    
    setFilteredDoctors(sortedDoctors);
  };
  
  // Manejar selección de doctores
  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Manejar selección de todos los doctores
  const handleSelectAll = () => {
    if (selectedItems.length === filteredDoctors.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredDoctors.map(doctor => doctor.id));
    }
  };
  
  // Función para buscar doctores
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const sourceList = showArchived ? archivedDoctors : doctors;
    
    if (term.trim() === '') {
      setFilteredDoctors(sourceList);
    } else {
      const results = sourceList.filter(doctor => 
        doctor.name.toLowerCase().includes(term)
      );
      setFilteredDoctors(results);
    }
  };
  
  // Filtrar por tipo de citas
  const filterByAppointments = (type: 'all' | 'past' | 'upcoming') => {
    setSelectedTab(type);
    let filtered = showArchived ? [...archivedDoctors] : [...doctors];
    
    // Si hay término de búsqueda, mantener ese filtro
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Aplicar filtro adicional basado en citas
    if (type === 'past') {
      filtered = filtered.sort((a, b) => b.pastAppointments - a.pastAppointments);
    } else if (type === 'upcoming') {
      filtered = filtered.sort((a, b) => b.upcomingAppointments - a.upcomingAppointments);
    }
    
    setFilteredDoctors(filtered);
  };
  
  // Cambiar modo oscuro/claro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Manejar días de servicio
  const toggleDutyDay = (day: string) => {
    if (newDoctor.dutyDays.includes(day)) {
      setNewDoctor({
        ...newDoctor,
        dutyDays: newDoctor.dutyDays.filter(d => d !== day)
      });
    } else {
      setNewDoctor({
        ...newDoctor,
        dutyDays: [...newDoctor.dutyDays, day]
      });
    }
  };
  
  // Guardar nuevo doctor
  const saveDoctor = () => {
    if (!newDoctor.name.trim()) return;
    
    const newDoctorObj: Doctor = {
      id: doctors.length + archivedDoctors.length + 1,
      name: newDoctor.name,
      email: newDoctor.email,
      avatar: 'D',
      avatarColor: '#' + Math.floor(Math.random()*16777215).toString(16),
      pastAppointments: 0,
      upcomingAppointments: 0,
      dutyDays: newDoctor.dutyDays
    };
    
    const updatedDoctors = [...doctors, newDoctorObj];
    setDoctors(updatedDoctors);
    if (!showArchived) {
      setFilteredDoctors(updatedDoctors);
    }
    
    // Resetear el formulario y cerrar modal
    setNewDoctor({ name: '', email: '', dutyDays: [] });
    setShowAddModal(false);
  };

  // Archivar doctores seleccionados
  const archiveSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (!showArchived) {
      // Archivo los doctores seleccionados
      const toArchive = doctors.filter(doc => selectedItems.includes(doc.id));
      const remaining = doctors.filter(doc => !selectedItems.includes(doc.id));
      
      setArchivedDoctors([...archivedDoctors, ...toArchive]);
      setDoctors(remaining);
      setFilteredDoctors(remaining);
    } else {
      // Restaurar los doctores seleccionados
      const toRestore = archivedDoctors.filter(doc => selectedItems.includes(doc.id));
      const remaining = archivedDoctors.filter(doc => !selectedItems.includes(doc.id));
      
      setDoctors([...doctors, ...toRestore]);
      setArchivedDoctors(remaining);
      setFilteredDoctors(remaining);
    }
    
    setSelectedItems([]);
  };

  // Cambiar entre doctores activos y archivados
  const toggleArchivedView = () => {
    setShowArchived(!showArchived);
    setFilteredDoctors(!showArchived ? archivedDoctors : doctors);
    setSelectedItems([]);
  };

  // Abrir menú contextual
  const openMenu = (id: number) => {
    setShowMenu(showMenu === id ? null : id);
  };

  // Archivar/Restaurar un solo doctor
  const toggleArchiveDoctor = (id: number) => {
    if (!showArchived) {
      // Archivar este doctor
      const doctorToArchive = doctors.find(doc => doc.id === id);
      if (!doctorToArchive) return;
      setArchivedDoctors([...archivedDoctors, doctorToArchive]);
      setDoctors(doctors.filter(doc => doc.id !== id));
      setFilteredDoctors(filteredDoctors.filter(doc => doc.id !== id));
    } else {
      // Restaurar este doctor
      const doctorToRestore = archivedDoctors.find(doc => doc.id === id);
      if (!doctorToRestore) return;
      setDoctors([...doctors, doctorToRestore]);
      setArchivedDoctors(archivedDoctors.filter(doc => doc.id !== id));
      setFilteredDoctors(filteredDoctors.filter(doc => doc.id !== id));
    }
    setShowMenu(null);
  };

  // Función para abrir el modal de detalles del doctor
  const openDoctorModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(true);
  };

  // Funciones para añadir paciente y cita
  const addPatient = (patient: Patient) => {
    setPatients(prev => [...prev, patient]);
  };
  const addAppointment = (appt: Appointment) => {
    setAppointments(prev => [...prev, appt]);
  };

  // Clases basadas en el modo (oscuro/claro)
  const themeClasses = {
    background: darkMode ? 'bg-gray-900' : 'bg-gray-100',
    sidebar: darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-800',
    secondaryText: darkMode ? 'text-gray-400' : 'text-gray-600',
    hover: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    border: darkMode ? 'border-gray-800' : 'border-gray-200',
    input: darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
    button: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600',
    modalBg: darkMode ? 'bg-gray-900/80' : 'bg-gray-800/80',
    modalContent: darkMode ? 'bg-gray-800' : 'bg-white',
    menu: darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800',
    menuHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
  };

  return (
    <div className={`flex flex-col w-full min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      {/* Top Header */}
      <header className={`h-14 border-b ${themeClasses.border} flex items-center justify-between px-4`}>
        <div className="flex items-center">
          <button className={themeClasses.secondaryText}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium ml-2">Doctores</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className={`${themeClasses.secondaryText}`}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button className={`${themeClasses.secondaryText}`}>
              <Bell size={20} />
            </button>
            <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full text-xs flex items-center justify-center">1</span>
          </div>
        </div>
      </header>
      
      {/* Toolbar */}
      <div className={`flex items-center justify-between p-4 border-b ${themeClasses.border}`}>
        <div className="flex items-center">
          <button 
            className={`${themeClasses.secondaryText} mr-4`}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
            <span className="ml-1">Añadir</span>
          </button>
          <button 
            onClick={archiveSelected}
            className={`${themeClasses.secondaryText} mr-4`}
          >
            <Archive size={20} />
            <span className="ml-1">
              {showArchived ? "Restaurar Seleccionados" : "Archivar Seleccionados"}
            </span>
          </button>
          <button 
            onClick={toggleArchivedView}
            className={`${themeClasses.secondaryText}`}
          >
            {showArchived ? "Ver Activos" : "Ver Archivados"}
          </button>
        </div>
        
        <div className="relative">
          <Search size={16} className={`absolute left-3 top-2.5 ${themeClasses.secondaryText}`} />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className={`pl-10 pr-4 py-2 ${themeClasses.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      
      {/* Filter and Count */}
      <div className={`flex items-center px-4 py-2 border-b ${themeClasses.border} text-sm`}>
        <span className={`${themeClasses.secondaryText} mr-6`}>
          Mostrando {filteredDoctors.length}/{showArchived ? archivedDoctors.length : doctors.length}
          {showArchived && " (Archivados)"}
        </span>
        
        <div className="flex space-x-2">
          <button 
            onClick={sortDoctors}
            className={`px-4 py-1 rounded ${selectedTab === 'all' ? themeClasses.button : 'bg-transparent'}`}
          >
            Por Título {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
          <button 
            onClick={() => filterByAppointments('past')}
            className={`px-4 py-1 rounded ${selectedTab === 'past' ? themeClasses.button : 'bg-transparent'}`}
          >
            Citas pasadas
          </button>
          <button 
            onClick={() => filterByAppointments('upcoming')}
            className={`px-4 py-1 rounded ${selectedTab === 'upcoming' ? themeClasses.button : 'bg-transparent'}`}
          >
            Próximas citas
          </button>
        </div>
        
        <div className="ml-auto flex items-center">
          <span>Por Título</span>
          <ChevronDown size={16} className="ml-1" />
        </div>
      </div>
      
      {/* Doctors List */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  className={`w-5 h-5 rounded ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}
                  checked={selectedItems.length === filteredDoctors.length && filteredDoctors.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4 text-left"></th>
              <th className="p-4 text-left"></th>
              <th className="p-4 text-left"></th>
              <th className="p-4 text-left"></th>
              <th className="p-4 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className={`border-b ${themeClasses.border} ${themeClasses.hover}`}>
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className={`w-5 h-5 rounded ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'}`}
                      checked={selectedItems.includes(doctor.id)}
                      onChange={() => handleSelect(doctor.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center" 
                      style={{ backgroundColor: doctor.avatarColor }}
                    >
                      {doctor.avatar}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium cursor-pointer underline" onClick={() => openDoctorModal(doctor)}>{doctor.name}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-orange-500 text-xs">Citas pasadas</span>
                      <span className="font-medium">{doctor.pastAppointments}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-green-500 text-xs">Próximas citas</span>
                      <span className="font-medium">{doctor.upcomingAppointments}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right relative">
                    <button 
                      className={`${themeClasses.secondaryText}`}
                      onClick={() => openMenu(doctor.id)}
                    >
                      <MoreHorizontal size={20} />
                    </button>
                    
                    {/* Menú contextual */}
                    {showMenu === doctor.id && (
                      <div className={`absolute right-4 mt-2 w-48 rounded-md shadow-lg ${themeClasses.menu} z-10`}>
                        <div className="py-1">
                          <button onClick={() => { setAppointmentDoctor(doctor); setShowAppointmentModal(true); }} className={`block px-4 py-2 ${themeClasses.menuHover}`}>Añadir Cita</button>
                          <a href="#" className={`block px-4 py-2 ${themeClasses.menuHover}`}>Enviar Email</a>
                          <a href="#" className={`block px-4 py-2 ${themeClasses.menuHover}`}>Editar</a>
                          <a 
                            href="#" 
                            className={`block px-4 py-2 ${themeClasses.menuHover}`}
                            onClick={() => toggleArchiveDoctor(doctor.id)}
                          >
                            {showArchived ? "Restaurar" : "Archivar"}
                          </a>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={`p-4 text-center ${themeClasses.secondaryText}`}>
                  {showArchived 
                    ? "No hay doctores archivados" 
                    : "No se encontraron doctores"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal para añadir nuevo doctor */}
      {showAddModal && (
        <div className={`fixed inset-0 ${themeClasses.modalBg} flex items-center justify-center z-50`}>
          <div className={`${themeClasses.modalContent} rounded-lg shadow-lg w-full max-w-md overflow-hidden`}>
            <div className="flex items-center justify-between p-4 bg-purple-600 text-white">
              <div className="flex items-center">
                <Plus size={20} className="mr-2" />
                <h2 className="text-lg font-medium">Nuevo Doctor</h2>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">Detalles del Doctor</span>
                <div className="flex items-center px-3 py-1 bg-gray-200 rounded-lg">
                  <span className="text-sm text-gray-700">Doctor</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className={themeClasses.text}>Nombre del doctor:</label>
                <input
                  type="text"
                  placeholder="Nombre del doctor..."
                  className={`w-full p-2 rounded border ${themeClasses.border} ${themeClasses.input}`}
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className={themeClasses.text}>Correo del doctor:</label>
                <input
                  type="email"
                  placeholder="Correo del doctor..."
                  className={`w-full p-2 rounded border ${themeClasses.border} ${themeClasses.input}`}
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className={themeClasses.text}>Días de servicio:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                    <div 
                      key={day}
                      onClick={() => toggleDutyDay(day)}
                      className={`flex items-center justify-between px-2 py-1 rounded ${
                        newDoctor.dutyDays.includes(day) 
                          ? 'bg-gray-700 text-white' 
                          : `${themeClasses.input} ${themeClasses.hover}`
                      } cursor-pointer`}
                    >
                      <span className="text-sm">{day.substring(0, 3)}</span>
                      {newDoctor.dutyDays.includes(day) && (
                        <button className="text-xs">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`flex justify-end space-x-2 p-4 border-t ${themeClasses.border}`}>
              <button
                onClick={saveDoctor}
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del doctor */}
      {showDoctorModal && selectedDoctor && (
        <div className={`fixed inset-0 ${themeClasses.modalBg} flex items-center justify-center z-50`}>
          <div className={`${themeClasses.modalContent} rounded-lg shadow-lg w-full max-w-lg overflow-hidden`}>
            <div className="flex items-center justify-between p-4 bg-purple-600 text-white">
              <div className="flex items-center">
                <span className="font-bold text-lg mr-2">{selectedDoctor.name}</span>
                <span className="bg-gray-700 px-2 py-1 rounded text-xs">Doctor</span>
              </div>
              <button onClick={() => setShowDoctorModal(false)} className="text-white hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <DoctorModalTabs doctor={selectedDoctor} onAddAppointment={(doctor) => { setAppointmentDoctor(doctor); setShowAppointmentModal(true); }} appointments={appointments} />
          </div>
        </div>
      )}

      {showAppointmentModal && appointmentDoctor && (
        <AppointmentFormModal
          open={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          doctor={appointmentDoctor}
          patients={patients}
          addPatient={addPatient}
          addAppointment={addAppointment}
        />
      )}
    </div>
  );
}

// Componente para los items de navegación
function NavItem({ icon, label, href = "#", active = false, darkMode = true }: { icon: string; label: string; href?: string; active?: boolean; darkMode?: boolean }) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    'user-plus': '👨‍⚕️',
    users: '👥',
    calendar: '📅',
    activity: '📊',
    'dollar-sign': '💰',
    'bar-chart-2': '📈',
    settings: '⚙️',
  };
  
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center px-4 py-3 ${
          active 
            ? darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900' 
            : darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <span className="w-6 mr-2">{iconMap[icon]}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
}

// Componente para las pestañas del modal de doctor
interface DoctorModalTabsProps {
  doctor: Doctor;
  onAddAppointment: (doctor: Doctor) => void;
  appointments: Appointment[];
}

function DoctorModalTabs({ doctor, onAddAppointment, appointments }: DoctorModalTabsProps) {
  const [tab, setTab] = useState('details');
  // Filtrar las citas de este doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === doctor.id);
  return (
    <div>
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 ${tab === 'details' ? 'border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setTab('details')}
        >
          Detalles del Doctor
        </button>
        <button
          className={`flex-1 py-2 ${tab === 'appointments' ? 'border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setTab('appointments')}
        >
          Próximas Citas
        </button>
      </div>
      {tab === 'details' && (
        <div className="p-6 space-y-4">
          <div>
            <label className="block font-medium">Nombre:</label>
            <div>{doctor.name}</div>
          </div>
          <div>
            <label className="block font-medium">Correo:</label>
            <div>{doctor.email || 'No especificado'}</div>
          </div>
          <div>
            <label className="block font-medium">Días de servicio:</label>
            <div>{doctor.dutyDays ? doctor.dutyDays.join(', ') : 'No especificado'}</div>
          </div>
        </div>
      )}
      {tab === 'appointments' && (
        <div className="p-6 space-y-4">
          <div className="font-medium mb-2">Próximas citas:</div>
          {doctorAppointments.length === 0 && (
            <div className="text-gray-400">No hay próximas citas para este doctor.</div>
          )}
          {doctorAppointments.map((appt, idx) => (
            <div key={appt.id} className="mb-4 rounded-lg shadow p-4 bg-gray-700 text-white relative border-l-4 border-cyan-400">
              <div className="flex items-center mb-2">
                <span className="font-bold text-cyan-300 mr-2">Cita {idx + 1}:</span>
                <span className="text-xs bg-cyan-900 px-2 py-1 rounded mr-2">{appt.date} - {appt.time} hrs</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-semibold">Paciente:</span>
                <span className="ml-2">{appt.patient.name}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Notas preoperatorias:</span>
                <span className="ml-2">{appt.preopNotes}</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-semibold">Pago:</span>
                <span className="ml-2">Bs. {appt.price}</span>
                <span className="ml-4 font-semibold">Pagado:</span>
                <span className="ml-2">{appt.paid}</span>
                <span className="ml-4 font-semibold text-orange-400">Pendiente:</span>
                <span className="ml-2 text-orange-400">{appt.price - appt.paid}</span>
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6 gap-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex-1" onClick={() => onAddAppointment(doctor)}>Añadir Cita</button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded flex-1">Archivar Doctor</button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex-1">Guardar</button>
            <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex-1">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- NUEVO COMPONENTE: MODAL DE FORMULARIO DE CITA ---
interface AppointmentFormModalProps {
  open: boolean;
  onClose: () => void;
  doctor: Doctor;
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  addAppointment: (appt: Appointment) => void;
}

function AppointmentFormModal({
  open,
  onClose,
  doctor,
  patients,
  addPatient,
  addAppointment,
}: AppointmentFormModalProps) {
  const [patientInput, setPatientInput] = useState('');
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [preopNotes, setPreopNotes] = useState('');
  const [price, setPrice] = useState(0);
  const [paid, setPaid] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open) {
      setPatientInput('');
      setFilteredPatients([]);
      setSelectedPatient(null);
      setDate('');
      setTime('');
      setPreopNotes('');
      setPrice(0);
      setPaid(0);
      setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 100);
    }
  }, [open]);

  React.useEffect(() => {
    if (patientInput.trim() === '') {
      setFilteredPatients([]);
      return;
    }
    setFilteredPatients(
      patients.filter((p: Patient) => p.name.toLowerCase().includes(patientInput.toLowerCase()))
    );
  }, [patientInput, patients]);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientInput(patient.name);
    setFilteredPatients([]);
  };

  const handleCreatePatient = () => {
    if (!patientInput.trim()) return;
    const newPatient: Patient = { id: Date.now(), name: patientInput };
    addPatient(newPatient);
    setSelectedPatient(newPatient);
    setFilteredPatients([]);
  };

  const handleSave = () => {
    if (!selectedPatient || !date || !time) return;
    addAppointment({
      id: Date.now(),
      doctorId: doctor.id,
      patient: selectedPatient,
      date,
      time,
      preopNotes,
      price: Number(price),
      paid: Number(paid),
      currency: 'Bs.',
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-purple-600 text-white">
          <h2 className="text-lg font-medium">Añadir Cita para {doctor.name}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block mb-1">Paciente:</label>
            <input
              ref={inputRef}
              type="text"
              className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
              value={patientInput}
              onChange={e => {
                setPatientInput(e.target.value);
                setSelectedPatient(null);
              }}
              placeholder="Buscar o escribir nombre..."
            />
            {filteredPatients.length > 0 && (
              <div className="bg-gray-700 rounded mt-1 max-h-32 overflow-y-auto">
                {filteredPatients.map(p => (
                  <div
                    key={p.id}
                    className="px-3 py-2 hover:bg-purple-600 cursor-pointer"
                    onClick={() => handleSelectPatient(p)}
                  >
                    {p.name}
                  </div>
                ))}
              </div>
            )}
            {patientInput && !selectedPatient && filteredPatients.length === 0 && (
              <div className="mt-1">
                <button
                  className="text-blue-400 underline text-sm"
                  onClick={handleCreatePatient}
                >
                  Crear nuevo paciente: "{patientInput}"
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">Fecha:</label>
            <input
              type="date"
              className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Hora:</label>
            <input
              type="time"
              className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Notas preoperatorias:</label>
            <textarea
              className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
              value={preopNotes}
              onChange={e => setPreopNotes(e.target.value)}
              placeholder="Notas..."
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block mb-1">Pago total (Bs.):</label>
              <input
                type="number"
                className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Pagado:</label>
              <input
                type="number"
                className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={paid}
                onChange={e => setPaid(Number(e.target.value))}
                min={0}
                max={price}
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Pendiente:</label>
              <input
                type="number"
                className="w-full p-2 rounded border border-gray-700 bg-gray-900 text-white"
                value={Math.max(0, price - paid)}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-700">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            disabled={!selectedPatient || !date || !time}
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
} 