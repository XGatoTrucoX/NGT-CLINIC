import './globals.css'
import type { Metadata } from 'next'
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { PatientsProvider } from '@/components/PatientsContext'; // Ajusta la ruta si es necesario

export const metadata: Metadata = {
  title: 'NGT Clinic',
  description: 'Sistema de gestión para clínicas médicas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="flex flex-col h-screen bg-gray-900 text-white">
        <PatientsProvider> {/* Envolver con PatientsProvider */}
          {/* Menú superior global */}
          <header className="bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 py-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center mr-2">
                <span className="text-white font-bold">N</span>
              </div>
              <span className="text-gray-400 mr-8">NGT 1.0.0</span>
              
              {/* Menú de navegación horizontal */}
              <nav className="flex-1">
                <ul className="flex space-x-4">
                  <li><Link href="/dashboard" className="px-3 py-2 text-gray-400 hover:text-white">🏠 Panel</Link></li>
                  <li><Link href="/doctors" className="px-3 py-2 text-gray-400 hover:text-white">👨‍⚕️ Doctores</Link></li>
                  <li><Link href="/patients" className="px-3 py-2 text-gray-400 hover:text-white">👥 Pacientes</Link></li>
                  <li><Link href="/appointments" className="px-3 py-2 text-gray-400 hover:text-white">📅 Citas</Link></li>
                  <li><Link href="/laboratorio" className="px-3 py-2 text-gray-400 hover:text-white">🧪 Lab</Link></li>
                  <li><Link href="/gastos" className="px-3 py-2 text-gray-400 hover:text-white">💰 Gastos</Link></li>
                  <li><Link href="/estadisticas" className="px-3 py-2 text-gray-400 hover:text-white">📈 Stats</Link></li>
                  <li><Link href="/configuracion" className="px-3 py-2 text-gray-400 hover:text-white">⚙️ Config</Link></li>
                </ul>
              </nav>
            </div>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center mr-2">
                <span className="text-white">U</span>
              </div>
              <button className="flex items-center text-gray-400 hover:text-white">
                <LogOut size={16} className="mr-1" />
                <span>Salir</span>
              </button>
            </div>
          </header>
          
          {/* Área principal de contenido */}
          <div className="flex-1 flex">
            {children}
          </div>
        </PatientsProvider>
      </body>
    </html>
  )
}