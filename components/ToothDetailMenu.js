import React, { useState, useEffect } from 'react';
import '../styles/ToothDetailMenu.css';
import PeriodontalPanel from './PeriodontalPanel';

const ToothDetailMenu = ({ selectedTooth, teethData, onApplyAction }) => {
  // Estado para controlar qué categoría está expandida
  const [expandedCategory, setExpandedCategory] = useState(null);
  // Estado para controlar la vista periodontal
  const [showPeriodontalPanel, setShowPeriodontalPanel] = useState(false);
  // Estado para controlar qué punto de medición está activo
  const [activeMeasurement, setActiveMeasurement] = useState(null);
  
  // Obtener el diente seleccionado de los datos
  const tooth = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;

  // Resetear estados cuando cambia el diente seleccionado
  useEffect(() => {
    setExpandedCategory(null);
    setShowPeriodontalPanel(false);
    setActiveMeasurement(null);
  }, [selectedTooth]);

  if (!tooth) return null;
  
  // Función para aplicar acciones al diente
  const applyAction = (category, action) => {
    if (onApplyAction) {
      onApplyAction(category, action);
    }
    
    // Crear un evento personalizado para aplicar la acción al diente
    document.dispatchEvent(new CustomEvent('applyToTeeth', {
      detail: {
        teeth: [selectedTooth],
        option: action,
        category: category
      }
    }));
  };
  
  // Función para expandir/colapsar una categoría
  const toggleCategory = (category) => {
    if (expandedCategory === category) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(category);
    }
  };
  
  // Estructura de las categorías y subcategorías
  const categories = [
    {
      id: 'estado-dental',
      name: '1. Estado Dental',
      color: '#e74c3c',
      items: [
        { id: 'sano', name: 'Diente sano' },
        { id: 'caries', name: 'Caries' },
        { id: 'fractura', name: 'Fractura' },
        { id: 'desgaste', name: 'Desgaste dental' },
        { id: 'decoloracion', name: 'Decoloración' },
        { id: 'fisura', name: 'Fisura' },
        { id: 'remanente', name: 'Remanente radicular' },
        { id: 'ausente', name: 'Ausente' },
        { id: 'para-extraer', name: 'Para extraer' },
        { id: 'erupcion', name: 'Diente en erupción' }
      ]
    },
    {
      id: 'tratamientos',
      name: '2. Tratamientos',
      color: '#27ae60',
      subcategories: [
        {
          id: 'endodoncia',
          name: 'Endodoncia',
          items: [
            { id: 'trat-conductos', name: 'Trat. conductos' },
            { id: 'pulpotomia', name: 'Pulpotomía' },
            { id: 'pulpectomia', name: 'Pulpectomía' }
          ]
        },
        {
          id: 'restauracion',
          name: 'Restauración',
          items: [
            { id: 'empaste', name: 'Calza/empaste' },
            { id: 'incrustacion', name: 'Incrustación' },
            { id: 'corona-total', name: 'Corona total' },
            { id: 'corona-parcial', name: 'Corona parcial' },
            { id: 'perno-fibra', name: 'Perno fibra' },
            { id: 'perno-metalico', name: 'Perno metálico' }
          ]
        },
        {
          id: 'protesis',
          name: 'Prótesis',
          items: [
            { id: 'protesis-fija', name: 'Prótesis fija (pónticos)' },
            { id: 'protesis-removible', name: 'Prótesis removible' },
            { id: 'implante-buen-estado', name: 'Implante (buen estado)' },
            { id: 'implante-mal-estado', name: 'Implante (mal estado)' }
          ]
        },
        {
          id: 'ortodoncia',
          name: 'Ortodoncia',
          items: [
            { id: 'aparato-fijo', name: 'Aparato fijo' },
            { id: 'aparato-removible', name: 'Aparato removible' }
          ]
        }
      ]
    },
    {
      id: 'periodonto',
      name: '3. Periodonto',
      color: '#e67e22',
      items: [
        { id: 'sondaje', name: 'Sondaje (mm)' },
        { id: 'sangrado', name: 'Sangrado' },
        { id: 'placa', name: 'Placa' },
        { id: 'movilidad', name: 'Movilidad (1-3)' },
        { id: 'furcacion', name: 'Furcación (1-3)' },
        { id: 'bolsa-periodontal', name: 'Bolsa periodontal' },
        { id: 'sarro', name: 'Sarro' },
        { id: 'pus', name: 'Pus' },
        { id: 'margen-gingival', name: 'Margen gingival' }
      ]
    },
    {
      id: 'patologias',
      name: '4. Patologías',
      color: '#9b59b6',
      items: [
        { id: 'lesion-apical', name: 'Lesión apical' },
        { id: 'gingivitis', name: 'Gingivitis' },
        { id: 'periodontitis', name: 'Periodontitis' },
        { id: 'desorden-desarrollo', name: 'Desorden desarrollo' },
        { id: 'diastema', name: 'Diastema' },
        { id: 'impactacion', name: 'Impactación' }
      ]
    },
    {
      id: 'otros',
      name: '5. Otros',
      color: '#34495e',
      items: [
        { id: 'diente-temporal', name: 'Diente temporal (leche)' },
        { id: 'diente-permanente', name: 'Diente permanente (adulto)' },
        { id: 'frenillo-corto', name: 'Frenillo corto' },
        { id: 'giroversion', name: 'Giroversión' },
        { id: 'carilla', name: 'Carilla' }
      ]
    }
  ];
  
  // Determinar el estado actual del diente
  const getCurrentState = () => {
    if (tooth.isAbsent) return 'Ausente';
    if (tooth.isImplant) return 'Implante';
    if (tooth.isPontic) return 'Puente';
    if (tooth.hasCarilla) return 'Corona';
    
    // Verificar condiciones
    if (tooth.conditions && tooth.conditions.length > 0) {
      const condition = tooth.conditions[0];
      return condition.type.charAt(0).toUpperCase() + condition.type.slice(1);
    }
    
    return 'Normal';
  };

  // Función para manejar el clic en un punto de medición periodontal
  const handlePeriodontalMeasurementClick = (measurement) => {
    setActiveMeasurement(measurement);
    setShowPeriodontalPanel(true);
  };

  // Función para cerrar el panel periodontal
  const handleClosePeriodontalPanel = () => {
    setShowPeriodontalPanel(false);
    setActiveMeasurement(null);
  };

  return (
    <div className="tooth-detail-menu">
      <div className="tooth-status">
        <span className="status-indicator"></span>
        <span className="status-text">Actualmente no hay tratamientos pendientes</span>
      </div>
      
      {/* Panel de mediciones periodontales */}
      <div className="periodontal-measurements">
        <div className="measurement-row">
          <div className="measurement-label">Sondaje Periodontal (mm)</div>
          <div className="measurement-points">
            <button 
              className={`measurement-point ${activeMeasurement === 'distopalatal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('distopalatal')}
            >
              <div className="point-label">Disto Palatal</div>
              <div className="point-value">{tooth.perioData?.distopalatal || 0}</div>
            </button>
            <button 
              className={`measurement-point ${activeMeasurement === 'palatal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('palatal')}
            >
              <div className="point-label">Palatal</div>
              <div className="point-value">{tooth.perioData?.palatal || 0}</div>
            </button>
            <button 
              className={`measurement-point ${activeMeasurement === 'mesiopalatal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('mesiopalatal')}
            >
              <div className="point-label">Mesiopalatal</div>
              <div className="point-value">{tooth.perioData?.mesiopalatal || 0}</div>
            </button>
          </div>
        </div>
        <div className="measurement-row">
          <div className="measurement-label">Nivel Óseo</div>
          <div className="measurement-points">
            <button 
              className={`measurement-point ${activeMeasurement === 'distobucal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('distobucal')}
            >
              <div className="point-label">Disto Bucal</div>
              <div className="point-value">{tooth.perioData?.distobucal || 0}</div>
            </button>
            <button 
              className={`measurement-point ${activeMeasurement === 'bucal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('bucal')}
            >
              <div className="point-label">Bucal</div>
              <div className="point-value">{tooth.perioData?.bucal || 0}</div>
            </button>
            <button 
              className={`measurement-point ${activeMeasurement === 'mesiobucal' ? 'active' : ''}`}
              onClick={() => handlePeriodontalMeasurementClick('mesiobucal')}
            >
              <div className="point-label">Mesiobucal</div>
              <div className="point-value">{tooth.perioData?.mesiobucal || 0}</div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Panel periodontal */}
      {showPeriodontalPanel && (
        <PeriodontalPanel 
          selectedTooth={selectedTooth}
          activeMeasurement={activeMeasurement}
          onClose={handleClosePeriodontalPanel}
          onNavigate={handlePeriodontalMeasurementClick}
          tooth={tooth}
        />
      )}
      
      {!showPeriodontalPanel && categories.map(category => (
        <div 
          key={category.id} 
          className={`menu-category ${expandedCategory === category.id ? 'expanded' : ''}`}
          style={{ borderColor: category.color }}
        >
          <div 
            className="category-header"
            onClick={() => toggleCategory(category.id)}
            style={{ backgroundColor: category.color }}
          >
            <span className="category-name">{category.name}</span>
            <span className="toggle-icon">{expandedCategory === category.id ? '▼' : '▶'}</span>
          </div>
          
          {expandedCategory === category.id && (
            <div className="category-content">
              {category.subcategories ? (
                // Si tiene subcategorías, mostrarlas
                category.subcategories.map(subcategory => (
                  <div key={subcategory.id} className="subcategory">
                    <div className="subcategory-header">
                      <span className="subcategory-name">{subcategory.name}</span>
                    </div>
                    <div className="subcategory-items">
                      {subcategory.items.map(item => (
                        <button 
                          key={item.id} 
                          className="action-button"
                          onClick={() => applyAction(category.id, item.id)}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Si no tiene subcategorías, mostrar los items directamente
                <div className="category-items">
                  {category.items.map(item => (
                    <button 
                      key={item.id} 
                      className="action-button"
                      onClick={() => applyAction(category.id, item.id)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ToothDetailMenu;
