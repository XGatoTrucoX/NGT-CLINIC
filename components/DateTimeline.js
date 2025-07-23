import React, { useState } from 'react';
import '../styles/DateTimeline.css';

const DateTimeline = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Estado actual');
  
  // Lista de fechas disponibles
  const dates = [
    'Estado actual',
    'Marzo 22, 2023',
    'Abril 15, 2023',
    'Marzo 10, 2023',
    'Febrero 5, 2023'
  ];
  
  // Función para formatear la fecha actual
  const formatCurrentDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('es-ES', options);
  };
  
  // Función para manejar el clic en el botón de fecha
  const handleDateClick = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Función para seleccionar una fecha
  const selectDate = (date) => {
    setSelectedDate(date);
    setIsExpanded(false);
  };
  
  // Función para cerrar el panel de fechas
  const closePanel = () => {
    setIsExpanded(false);
  };

  return (
    <div className="date-timeline" data-component-name="DateTimeline">
      {!isExpanded ? (
        <button className="date-button" onClick={handleDateClick}>
          <div className="date-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M3 10H21" stroke="white" strokeWidth="2"/>
              <path d="M8 2L8 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 2L16 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="8" cy="14" r="1" fill="white"/>
              <circle cx="12" cy="14" r="1" fill="white"/>
              <circle cx="16" cy="14" r="1" fill="white"/>
              <circle cx="8" cy="18" r="1" fill="white"/>
              <circle cx="12" cy="18" r="1" fill="white"/>
              <circle cx="16" cy="18" r="1" fill="white"/>
            </svg>
          </div>
          <span>{selectedDate === 'Estado actual' ? 'Estado actual' : selectedDate}</span>
        </button>
      ) : (
        <div className="date-panel">
          <div className="date-panel-header">
            <span>Seleccionar fecha</span>
            <button className="close-button" onClick={closePanel}>×</button>
          </div>
          <div className="date-options">
            {dates.map((date, index) => (
              <button 
                key={index} 
                className={`date-option ${selectedDate === date ? 'active' : ''}`}
                onClick={() => selectDate(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeline;