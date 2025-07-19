'use client';
import React, { useState } from 'react';
import { Search, MoreHorizontal, User, LogOut, Moon, Sun, Bell, ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';

const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const hours = Array.from({ length: 21 }, (_, i) => {
  const h = 8 + Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  return `${h.toString().padStart(2, '0')}:${m}`;
});
const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const fullDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const exampleDoctors = [
  { id: 1, name: 'Dr. Kevin Jones' },
  { id: 2, name: 'Dr. Peter Clark' },
  { id: 3, name: 'Dr. Mark Phillips' },
];

const exampleAppointments = [
  {
    id: 1,
    doctorId: 1,
    patient: 'Lauren Campbell',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: '2025-05-09',
    time: '08:00',
    endTime: '08:30',
    status: 'Por llegar',
    notes: 'Blanqueamiento dental.'
  },
  {
    id: 2,
    doctorId: 1,
    patient: 'Christine Campbell',
    avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    date: '2025-05-09',
    time: '09:00',
    endTime: '10:00',
    status: 'En consulta',
    notes: 'Remoción de brackets.'
  },
  {
    id: 3,
    doctorId: 2,
    patient: 'Christine Lee',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    date: '2025-05-09',
    time: '10:30',
    endTime: '11:00',
    status: 'Finalizado',
    notes: 'Remoción de onlay.'
  },
  {
    id: 4,
    doctorId: 3,
    patient: 'John Davis',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg',
    date: '2025-05-09',
    time: '11:00',
    endTime: '11:30',
    status: 'No asistió',
    notes: 'Remoción de carilla dental.'
  },
];

const statusColors: Record<string, string> = {
  'Por llegar': 'bg-green-700 text-green-100',
  'Esperando': 'bg-yellow-400 text-yellow-900',
  'En consulta': 'bg-red-500 text-white',
  'Finalizado': 'bg-blue-600 text-white',
  'No asistió': 'bg-gray-400 text-gray-900',
};
const statusOptions = [
  { value: 'Por llegar', label: 'Por llegar', color: 'bg-green-700 text-green-100' },
  { value: 'Esperando', label: 'Esperando', color: 'bg-yellow-400 text-yellow-900' },
  { value: 'En consulta', label: 'En consulta', color: 'bg-red-500 text-white' },
  { value: 'Finalizado', label: 'Finalizado', color: 'bg-blue-600 text-white' },
  { value: 'No asistió', label: 'No asistió', color: 'bg-gray-400 text-gray-900' },
];

interface NavItemProps {
  icon: string;
  label: string;
  href?: string;
  active?: boolean;
  darkMode?: boolean;
}

function NavItem({ icon, label, href = "#", active = false, darkMode = true }: NavItemProps) {
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

function StatusLegend() {
  return (
    <div className="flex gap-4 items-center mb-4">
      {statusOptions.map(opt => (
        <span key={opt.value} className={`flex items-center gap-1 text-xs ${opt.color} px-2 py-1 rounded-full`}>
          ● {opt.label}
        </span>
      ))}
    </div>
  );
}

interface Appointment {
  id: number;
  doctorId: number;
  patient: string;
  avatar?: string;
  date: string;
  time: string;
  endTime: string;
  status: string;
  notes: string;
  type?: string;
  reminder?: string;
}

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: Partial<Appointment> | null;
  onSave: (appt: Appointment) => void;
  doctors: { id: number; name: string }[];
  isNew?: boolean;
  appointments: Appointment[];
}

function AppointmentModal({ open, onClose, appointment, onSave, doctors, isNew = false, appointments }: AppointmentModalProps) {
  const [form, setForm] = useState<Partial<Appointment>>({ ...appointment });
  const [error, setError] = useState('');
  React.useEffect(() => {
    setForm({ ...appointment });
    setError('');
  }, [appointment]);
  React.useEffect(() => {
    if (form.time && (!form.endTime || form.endTime <= form.time)) {
      const [h, m] = form.time.split(':').map(Number);
      let endH = h, endM = m + 30;
      if (endM >= 60) { endH += 1; endM -= 60; }
      const end = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
      setForm(f => ({ ...f, endTime: end }));
    }
  }, [form.time]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-blue-700">
          <h2 className="text-lg font-bold">{isNew ? 'Nueva Cita' : 'Editar Cita'}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">×</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Doctor</label>
              <select
                className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                value={form.doctorId || doctors[0]?.id}
                onChange={e => setForm(f => ({ ...f, doctorId: Number(e.target.value) }))}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Tipo de cita</label>
              <input
                className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                value={form.type || ''}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                placeholder="Consulta, Control, etc."
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Fecha</label>
              <input
                type="date"
                className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                value={form.date || ''}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">Hora inicio</label>
                <input
                  type="time"
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                  value={form.time || ''}
                  onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                  step="1800"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Hora fin</label>
                <input
                  type="time"
                  className="w-full p-2 rounded bg-gray-900 border border-gray-700"
                  value={form.endTime || ''}
                  onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                  step="1800"
                  min={form.time || ''}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Paciente</label>
            <input
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.patient || ''}
              onChange={e => setForm(f => ({ ...f, patient: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Observaciones</label>
            <textarea
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.notes || ''}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Estado</label>
            <select
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.status || statusOptions[0].value}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Recordatorio</label>
            <select
              className="w-full p-2 rounded bg-gray-900 border border-gray-700"
              value={form.reminder || '30'}
              onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))}
            >
              <option value="5">5 minutos antes</option>
              <option value="10">10 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
              <option value="1440">1 día antes</option>
            </select>
          </div>
          {error && <div className="text-red-400 text-sm font-semibold">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-700 bg-gray-900">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded">Cancelar</button>
          <button
            onClick={() => {
              if (!form.patient || !form.date || !form.time || !form.endTime) return;
              const start = form.time;
              const end = form.endTime;
              const overlap = appointments.some(a =>
                a.date === form.date &&
                a.doctorId === form.doctorId &&
                ((start >= a.time && start < nextBlock(a.endTime)) || (end > a.time && end <= nextBlock(a.endTime)) || (start <= a.time && end >= nextBlock(a.endTime))) &&
                (!isNew ? a.id !== form.id : true)
              );
              if (overlap) {
                setError('Ya existe una cita en ese horario para este doctor.');
                return;
              }
              onSave({
                ...form,
                id: isNew ? Date.now() : form.id,
                avatar: form.avatar || '',
                status: form.status || 'Por llegar',
                notes: form.notes || '',
                type: form.type || '',
                reminder: form.reminder || '30',
                doctorId: Number(form.doctorId) || doctors[0]?.id,
              } as Appointment);
            }}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function nextBlock(time: string) {
  const [h, m] = time.split(':').map(Number);
  let nh = h, nm = m + 30;
  if (nm >= 60) { nh += 1; nm -= 60; }
  return `${nh.toString().padStart(2, '0')}:${nm.toString().padStart(2, '0')}`;
}

export default function AppointmentsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<number | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAppt, setModalAppt] = useState<Appointment | Partial<Appointment> | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(exampleAppointments as Appointment[]);
  const [modalIsNew, setModalIsNew] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [openCells, setOpenCells] = useState<{ [key: string]: boolean }>({});

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
    menuHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  React.useEffect(() => {
    if (!weekDates.some(d => isSameDay(d, selectedDay))) {
      setSelectedDay(weekDates[0]);
    }
  }, [weekStart]);

  const selectedDayKey = selectedDay.toISOString().slice(0, 10);
  const weekDateKeys = weekDates.map(d => d.toISOString().slice(0, 10));
  const filteredAppointments = appointments.filter(
    a => weekDateKeys.includes(a.date) && 
         (selectedDoctor === 'all' || a.doctorId === selectedDoctor) &&
         (a.patient.toLowerCase().includes(search.toLowerCase()) ||
          exampleDoctors.find(d => d.id === a.doctorId)?.name.toLowerCase().includes(search.toLowerCase()))
  );

  const hours24 = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${h.toString().padStart(2, '0')}:${m}`;
  });

  const calendarMap: Record<string, Appointment | null> = {};
  for (const h of hours24) {
    calendarMap[h] = filteredAppointments.find(a => a.time === h) || null;
  }

  const firstHourWithAppt = (() => {
    for (let i = 0; i < hours24.length; i++) {
      if (calendarMap[hours24[i]]) return i;
    }
    return 0;
  })();
  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);
  React.useEffect(() => {
    if (tableBodyRef.current) {
      const row = tableBodyRef.current.children[firstHourWithAppt] as HTMLElement;
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [firstHourWithAppt, selectedDayKey]);

  const handlePrevWeek = () => setWeekStart(ws => subWeeks(ws, 1));
  const handleNextWeek = () => setWeekStart(ws => addWeeks(ws, 1));
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    setWeekStart(startOfWeek(date, { weekStartsOn: 1 }));
    setSelectedDay(date);
  };

  const handleOpenModal = (appt: Appointment | Partial<Appointment>, isNew = false) => {
    setModalAppt(appt);
    setModalIsNew(isNew);
    setModalOpen(true);
  };
  const handleSaveModal = (form: Appointment) => {
    const safeForm: Appointment = {
      ...form,
      avatar: form.avatar ?? '',
    };
    if (modalIsNew) {
      setAppointments(appts => [...appts, safeForm]);
    } else {
      setAppointments(appts => appts.map(a => a.id === safeForm.id ? { ...a, ...safeForm } : a));
    }
    setModalOpen(false);
  };

  const toggleCell = (key: string) => setOpenCells(cells => ({ ...cells, [key]: !cells[key] }));

  return (
    <div className={`flex flex-col w-full min-h-screen bg-gray-900 text-white`}>
      <header className={`h-14 border-b ${themeClasses.border} flex items-center justify-between px-4`}>
        <div className="flex items-center">
          <button className={themeClasses.secondaryText}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium ml-2">Citas</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className={`${themeClasses.secondaryText}`} onClick={() => setDarkMode(!darkMode)}>
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
      <div className="flex items-center justify-between px-6 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <button onClick={handlePrevWeek} className="p-2 rounded hover:bg-gray-700"><ChevronLeft size={20} /></button>
          <input
            type="date"
            value={format(selectedDay, 'yyyy-MM-dd')}
            onChange={handleDateChange}
            className="px-2 py-1 rounded border border-gray-600 bg-transparent text-sm"
          />
          <button onClick={handleNextWeek} className="p-2 rounded hover:bg-gray-700"><span className="rotate-180 inline-block"><ChevronLeft size={20} /></span></button>
        </div>
        <div className="flex gap-2">
          {weekDates.slice(0, 7).map((d, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(d)}
              className={`flex flex-col items-center px-3 py-2 rounded-lg border ${isSameDay(d, selectedDay) ? 'bg-blue-600 text-white border-blue-700' : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-blue-900'} transition-all`}
            >
              <span className="text-xs font-semibold">{d.getDate()}</span>
              <span className="text-xs">{diasSemana[d.getDay()]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-6 pt-2">
        <StatusLegend />
      </div>
      <div className="flex items-center justify-between px-6 py-4">
        <button className={`flex items-center ${themeClasses.button} text-white px-4 py-2 rounded`} onClick={() => handleOpenModal({ doctorId: selectedDoctor === 'all' ? exampleDoctors[0].id : selectedDoctor, date: selectedDayKey, time: '', endTime: '', status: 'Por llegar' }, true)}>
          <Plus size={18} className="mr-2" /> Añadir
        </button>
        <div className="flex items-center gap-2">
          <select
            className={`px-3 py-2 rounded border ${themeClasses.border} ${themeClasses.input}`}
            value={selectedDoctor}
            onChange={e => setSelectedDoctor(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Todos los doctores</option>
            {exampleDoctors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <div className="relative">
            <Search size={16} className={`absolute left-3 top-2.5 ${themeClasses.secondaryText}`} />
            <input
              type="text"
              placeholder="Buscar paciente o doctor..."
              className={`pl-10 pr-4 py-2 rounded-lg ${themeClasses.input} border ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className={`rounded-lg shadow ${themeClasses.card} p-4`}>
          <div className="mb-4 text-lg font-semibold">
            Semana del {weekDates[0].getDate()} de {meses[weekDates[0].getMonth()]} de {weekDates[0].getFullYear()} al {weekDates[6].getDate()} de {meses[weekDates[6].getMonth()]} de {weekDates[6].getFullYear()}
          </div>
          <table className="min-w-full border-collapse table-fixed">
            <thead className="sticky top-0 z-10" style={{ background: darkMode ? '#1a202c' : '#fff' }}>
              <tr>
                <th className="w-20 p-2 sticky left-0 z-20" style={{ background: darkMode ? '#1a202c' : '#fff' }}></th>
                {weekDates.slice(0, 7).map((d, idx) => (
                  <th key={idx} className={`p-2 text-center font-semibold sticky top-0 z-10 ${isSameDay(d, selectedDay) ? 'bg-blue-600 text-white' : ''}`} style={{ background: darkMode ? '#1a202c' : '#fff' }}>
                    <div>{diasSemana[d.getDay()]}</div>
                    <div className="text-xs opacity-70">{`${d.getDate()}/${d.getMonth() + 1}`}</div>
                    {isSameDay(d, new Date()) && (
                      <div className="text-xs text-green-400 font-bold">(hoy)</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody ref={tableBodyRef}>
              {hours24.map((h, rowIdx) => (
                <tr key={h}>
                  <td className="p-2 text-xs text-right align-top opacity-60">{h}</td>
                  {weekDates.slice(0, 7).map((d, idx) => {
                    if (idx > 6) return null;
                    const key = d.toISOString().slice(0, 10);
                    const cellAppointments = filteredAppointments.filter(a => a.date === key && a.time === h);
                    if (cellAppointments.length > 0) {
                      return (
                        <td key={idx} className="p-0 align-top min-w-[140px] w-1/7 h-16" style={{ verticalAlign: 'top' }}>
                          <div className="relative w-full h-full">
                            {cellAppointments.length > 1 && (
                              <button
                                className="absolute top-1 right-1 bg-blue-600 text-white rounded-full px-2 py-0.5 text-xs z-10 flex items-center gap-1"
                                onClick={() => toggleCell(`${key}-${h}`)}
                                title="Ver todas las citas de este horario"
                              >
                                {cellAppointments.length} <span>{openCells[`${key}-${h}`] ? '▲' : '▼'}</span>
                              </button>
                            )}
                            {openCells[`${key}-${h}`] && (
                              <div className="absolute top-7 right-0 bg-gray-900 border border-gray-700 rounded shadow-lg z-20 w-64 p-2">
                                <div className="font-bold text-xs mb-2">Citas en este horario:</div>
                                {cellAppointments.map((appt, i) => (
                                  <div key={appt.id} className={`mb-2 p-2 rounded ${statusColors[appt.status]}`}> 
                                    <div className="font-bold text-xs">{appt.patient}</div>
                                    <div className="text-xs">{exampleDoctors.find(d => d.id === appt.doctorId)?.name}</div>
                                    <div className="text-xs">{appt.time} - {appt.endTime}</div>
                                    <div className="text-xs">{appt.status}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div
                              className={`w-full h-full rounded border border-white/40 shadow-sm cursor-pointer flex flex-col justify-between px-2 py-1 ${statusColors[cellAppointments[0].status]}`}
                              style={{ minHeight: `48px` }}
                              onClick={() => handleOpenModal(cellAppointments[0], false)}
                            >
                              <div>
                                <div className="font-bold text-xs truncate">{cellAppointments[0].patient}</div>
                                {cellAppointments[0].type && <div className="text-xs opacity-80 truncate">{cellAppointments[0].type}</div>}
                                {exampleDoctors.length > 1 && (
                                  <div className="text-xs opacity-70 truncate">{exampleDoctors.find(d => d.id === cellAppointments[0].doctorId)?.name}</div>
                                )}
                                <div className="text-xs opacity-80 truncate">{cellAppointments[0].notes}</div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[11px] font-semibold">{cellAppointments[0].time} - {cellAppointments[0].endTime}</span>
                                <span className="text-[10px] opacity-80">{cellAppointments[0].status}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td key={idx} className="p-1 align-top min-w-[140px] w-1/7 h-16">
                          <div
                            className="w-full h-12 cursor-pointer hover:bg-blue-100/10 rounded-lg flex items-center justify-center opacity-30"
                            onClick={() => handleOpenModal({
                              doctorId: selectedDoctor === 'all' ? exampleDoctors[0].id : selectedDoctor,
                              date: key,
                              time: h,
                              endTime: hours24[hours24.indexOf(h) + 1] || h,
                              status: 'Por llegar',
                            }, true)}
                            title="Crear nueva cita"
                          >
                            <Plus size={16} />
                          </div>
                        </td>
                      );
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          appointment={modalAppt}
          onSave={handleSaveModal}
          doctors={exampleDoctors}
          isNew={modalIsNew}
          appointments={appointments}
        />
      )}
    </div>
  );
} 