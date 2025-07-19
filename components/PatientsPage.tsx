'use client';
import React, { useState } from 'react';
import { Search, MoreHorizontal, User, LogOut, Moon, Sun, Bell, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Patient {
  id: number;
  name: string;
  avatar: string;
  age: number;
  gender: 'M' | 'F';
  lastVisit: string; // fecha en formato ISO
  totalPayments: number;
  condition: string;
}

const examplePatients: Patient[] = [
  {
    id: 1,
    name: 'Alice Scott',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    age: 52,
    gender: 'F',
    lastVisit: '2024-05-10',
    totalPayments: 3297,
    condition: 'Cardiópata',
  },
  {
    id: 2,
    name: 'Alice Williams',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    age: 46,
    gender: 'M',
    lastVisit: '2024-04-14',
    totalPayments: 3047,
    condition: 'Hipertenso',
  },
  {
    id: 3,
    name: 'Amanda Adams',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    age: 57,
    gender: 'F',
    lastVisit: '2024-04-19',
    totalPayments: 1736,
    condition: 'Conservador',
  },
  {
    id: 4,
    name: 'Amanda Hill',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    age: 26,
    gender: 'M',
    lastVisit: '2024-04-21',
    totalPayments: 3686,
    condition: 'Conservador',
  },
  {
    id: 5,
    name: 'Amber Thomas',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    age: 59,
    gender: 'F',
    lastVisit: '2024-05-15',
    totalPayments: 5645,
    condition: 'Alerta',
  },
];

function daysAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

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

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>(examplePatients);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

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

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col w-full min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      {/* Top Header */}
      <header className={`h-14 border-b ${themeClasses.border} flex items-center justify-between px-4`}>
        <div className="flex items-center">
          <button className={themeClasses.secondaryText}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium ml-2">Pacientes</h1>
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
      {/* Main Table Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className={`pl-10 pr-4 py-2 rounded-lg ${themeClasses.input} border ${themeClasses.border} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 && (
            <div className="col-span-full text-center text-gray-500 p-6">No se encontraron pacientes.</div>
          )}
          {filtered.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl shadow-lg p-6 flex flex-col items-center ${themeClasses.card} border ${themeClasses.border} cursor-pointer hover:scale-105 transition-transform`}
              onClick={() => router.push(`/patients/${p.id}`)}
            >
              <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full border-4 border-blue-500 mb-4" />
              <div className="font-bold text-lg mb-1">{p.name}</div>
              <div className="mb-2">
                <span className="bg-orange-700 text-orange-200 px-3 py-1 rounded-full text-xs font-bold">Edad {p.age}</span>
              </div>
              <div className="mb-2">
                {p.gender === 'M' ? (
                  <span className="flex items-center gap-1 text-blue-300">♂️ Masculino</span>
                ) : (
                  <span className="flex items-center gap-1 text-pink-300">♀️ Femenino</span>
                )}
              </div>
              <div className="mb-2">
                <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs">Hace {daysAgo(p.lastVisit)} días</span>
              </div>
              <div className="mb-2">
                <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs">Bs. {p.totalPayments}</span>
              </div>
              <div className="mb-2">
                <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-xs">{p.condition}</span>
              </div>
              <button className="mt-2 p-2 rounded hover:bg-gray-600 transition" onClick={e => e.stopPropagation()}><MoreHorizontal size={20} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 