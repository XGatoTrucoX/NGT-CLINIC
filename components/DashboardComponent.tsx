"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, LogOut, Moon, Sun, Bell } from "lucide-react";

const initialData = {
  totalPatients: 150,
  totalDoctors: 8,
  totalAppointments: 45,
  recentAppointments: [
    { id: 1, patient: "Juan Pérez", doctor: "Dr. Smith", time: "09:00", status: "Confirmada" },
    { id: 2, patient: "María García", doctor: "Dr. Johnson", time: "10:30", status: "Pendiente" },
    { id: 3, patient: "Carlos López", doctor: "Dr. Williams", time: "11:15", status: "Confirmada" },
  ],
};

export default function DashboardComponent() {
  const [darkMode, setDarkMode] = useState(true);

  const themeClasses = {
    background: darkMode ? "bg-gray-900" : "bg-gray-100",
    sidebar: darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
    card: darkMode ? "bg-gray-800" : "bg-white",
    text: darkMode ? "text-white" : "text-gray-800",
    secondaryText: darkMode ? "text-gray-400" : "text-gray-600",
    hover: darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
    border: darkMode ? "border-gray-800" : "border-gray-200",
  };

  return (
    <div className={`flex flex-col w-full min-h-screen ${themeClasses.background} ${themeClasses.text}`}>
      {/* Top Header */}
      <header className={`h-14 border-b ${themeClasses.border} flex items-center justify-between px-4`}>
        <div className="flex items-center">
          <button className={themeClasses.secondaryText}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium ml-2">Panel Principal</h1>
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
      {/* Dashboard Content */}
      <div className="flex-1 p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard title="Total de Pacientes" value={initialData.totalPatients} icon="users" darkMode={darkMode} />
          <StatCard title="Total de Doctores" value={initialData.totalDoctors} icon="user-plus" darkMode={darkMode} />
          <StatCard title="Citas del Día" value={initialData.totalAppointments} icon="calendar" darkMode={darkMode} />
        </div>
        {/* Recent Appointments */}
        <div className={`${themeClasses.card} rounded-lg shadow-lg p-6`}>
          <h2 className="text-lg font-medium mb-4">Citas Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${themeClasses.border}`}>
                  <th className="text-left py-2">Paciente</th>
                  <th className="text-left py-2">Doctor</th>
                  <th className="text-left py-2">Hora</th>
                  <th className="text-left py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {initialData.recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className={`border-b ${themeClasses.border}`}>
                    <td className="py-2">{appointment.patient}</td>
                    <td className="py-2">{appointment.doctor}</td>
                    <td className="py-2">{appointment.time}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        appointment.status === "Confirmada"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

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

function StatCard({ title, value, icon, darkMode }: { title: string; value: number; icon: string; darkMode: boolean }) {
  const iconMap: Record<string, string> = {
    users: "👥",
    "user-plus": "👨‍⚕️",
    calendar: "📅",
  };
  return (
    <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-lg shadow-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}>{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl">{iconMap[icon]}</div>
      </div>
    </div>
  );
} 