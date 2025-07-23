import React, { useState, useEffect } from 'react';
import '../styles/ToothDetailView.css';
import PerioDetailPanel from './PerioDetailPanel';

const ToothDetailView = ({ selectedTooth, teethData, onClose }) => {
  // Estados para controlar las secciones expandidas
  const [expandedSections, setExpandedSections] = useState({
    important: true,
    treatments: false,
    periodontal: false,
    endodontic: false,
    observations: false
  });
  
  // Estados para el panel periodontal
  const [showPerioDetailPanel, setShowPerioDetailPanel] = useState(false);
  const [activePerioPoint, setActivePerioPoint] = useState(null);
  
  // Función para manejar clics en puntos periodontales
  const handlePerioPointClick = (point) => {
    setActivePerioPoint(point);
    setShowPerioDetailPanel(true);
  };
  
  // Obtener el diente seleccionado de los datos
  const tooth = selectedTooth ? teethData.find(t => t.id === selectedTooth) : null;

  if (!tooth) return null;
  
  // Función para aplicar acciones al diente
  const applyAction = (action) => {
    // Crear un evento personalizado para aplicar la acción al diente
    document.dispatchEvent(new CustomEvent('applyToTeeth', {
      detail: {
        teeth: [selectedTooth],
        option: action
      }
    }));
  };
  
  // Función para cambiar al diente anterior o siguiente
  const navigateToTooth = (direction) => {
    const toothIds = teethData.map(t => t.id).sort((a, b) => a - b);
    const currentIndex = toothIds.findIndex(id => id === selectedTooth);
    
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'prev') {
      nextIndex = currentIndex === 0 ? toothIds.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex === toothIds.length - 1 ? 0 : currentIndex + 1;
    }
    
    // Disparar evento para seleccionar el nuevo diente
    document.dispatchEvent(new CustomEvent('toothSelect', {
      detail: { toothId: toothIds[nextIndex] }
    }));
  };

  // Función para determinar el estado actual del diente
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
  
  // Función para alternar la expansión de una sección
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Obtener el tipo de diente (molar, premolar, canino, incisivo)
  const getToothType = () => {
    const id = parseInt(selectedTooth);
    // Molares: 1-3, 16-18, 31-33, 46-48
    if ([1, 2, 3, 16, 17, 18, 31, 32, 33, 46, 47, 48].includes(id)) {
      return 'Molar';
    }
    // Premolares: 4-5, 14-15, 34-35, 44-45
    if ([4, 5, 14, 15, 34, 35, 44, 45].includes(id)) {
      return 'Premolar';
    }
    // Caninos: 6, 13, 36, 43
    if ([6, 13, 36, 43].includes(id)) {
      return 'Canino';
    }
    // Incisivos: 7-12, 37-42
    return 'Incisivo';
  };

  return (
    <div className="tooth-detail-view">
      <div className="tooth-detail-header">
        <button className="back-button" onClick={onClose}>
          <span className="back-icon">←</span>
          <span>Volver</span>
        </button>
        <h2>Diente {selectedTooth}</h2>
      </div>

      <div className="tooth-detail-content">
        <div className="content-area">
          <div className="treatment-categories">
            {/* 1. Estado Dental */}
            <div className={`category ${expandedSections.important ? 'expanded' : ''}`} data-category="estado">
              <div 
                className="category-header estado" 
                onClick={() => toggleSection('important')}
              >
                <span>1. Estado Dental</span>
                <span className="expand-icon">{expandedSections.important ? '▼' : '▼'}</span>
              </div>
              {expandedSections.important && (
                <div className="category-content">
                  <div className="treatment-options">
                    <div className="treatment-btn" onClick={() => applyAction('normal')}>Diente sano</div>
                    <div className="treatment-btn" onClick={() => applyAction('caries')}>Caries</div>
                    <div className="treatment-btn" onClick={() => applyAction('fractura')}>Fractura</div>
                    <div className="treatment-btn" onClick={() => applyAction('desgaste')}>Desgaste dental</div>
                    <div className="treatment-btn" onClick={() => applyAction('decoloracion')}>Decoloración</div>
                    <div className="treatment-btn" onClick={() => applyAction('fisura')}>Fisura</div>
                    <div className="treatment-btn" onClick={() => applyAction('remanente')}>Remanente radicular</div>
                    <div className="treatment-btn" onClick={() => applyAction('ausente')}>Ausente</div>
                    <div className="treatment-btn" onClick={() => applyAction('extraccion')}>Para extraer</div>
                    <div className="treatment-btn" onClick={() => applyAction('erupcion')}>Diente en erupción</div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Tratamientos */}
            <div className={`category ${expandedSections.treatments ? 'expanded' : ''}`} data-category="tratamientos">
              <div 
                className="category-header tratamientos" 
                onClick={() => toggleSection('treatments')}
              >
                <span>2. Tratamientos</span>
                <span className="expand-icon">{expandedSections.treatments ? '▼' : '▼'}</span>
              </div>
              {expandedSections.treatments && (
                <div className="category-content">
                  <div className="subcategory">
                    <div className="subcategory-header">Endodoncia</div>
                    <div className="treatment-options">
                      <div className="treatment-btn" onClick={() => applyAction('trat-conductos')}>Trat. conductos</div>
                      <div className="treatment-btn" onClick={() => applyAction('pulpotomia')}>Pulpotomía</div>
                      <div className="treatment-btn" onClick={() => applyAction('pulpectomia')}>Pulpectomía</div>
                    </div>
                  </div>
                  <div className="subcategory">
                    <div className="subcategory-header">Restauración</div>
                    <div className="treatment-options">
                      <div className="treatment-btn" onClick={() => applyAction('empaste')}>Calza/empaste</div>
                      <div className="treatment-btn" onClick={() => applyAction('incrustacion')}>Incrustación</div>
                      <div className="treatment-btn" onClick={() => applyAction('corona-total')}>Corona total</div>
                      <div className="treatment-btn" onClick={() => applyAction('corona-parcial')}>Corona parcial</div>
                      <div className="treatment-btn" onClick={() => applyAction('perno-fibra')}>Perno fibra</div>
                      <div className="treatment-btn" onClick={() => applyAction('perno-metalico')}>Perno metálico</div>
                    </div>
                  </div>
                  <div className="subcategory">
                    <div className="subcategory-header">Prótesis</div>
                    <div className="treatment-options">
                      <div className="treatment-btn" onClick={() => applyAction('protesis-fija')}>Prótesis fija</div>
                      <div className="treatment-btn" onClick={() => applyAction('protesis-removible')}>Prótesis removible</div>
                      <div className="treatment-btn" onClick={() => applyAction('implante-buen-estado')}>Implante (buen estado)</div>
                      <div className="treatment-btn" onClick={() => applyAction('implante-mal-estado')}>Implante (mal estado)</div>
                    </div>
                  </div>
                  <div className="subcategory">
                    <div className="subcategory-header">Ortodoncia</div>
                    <div className="treatment-options">
                      <div className="treatment-btn" onClick={() => applyAction('aparato-fijo')}>Aparato fijo</div>
                      <div className="treatment-btn" onClick={() => applyAction('aparato-removible')}>Aparato removible</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Patologías */}
            <div className={`category ${expandedSections.periodontal ? 'expanded' : ''}`} data-category="patologias">
              <div 
                className="category-header patologias" 
                onClick={() => toggleSection('periodontal')}
              >
                <span>3. Patologías</span>
                <span className="expand-icon">{expandedSections.periodontal ? '▼' : '▼'}</span>
              </div>
              {expandedSections.periodontal && (
                <div className="category-content">
                  <div className="treatment-options">
                    <div className="treatment-btn" onClick={() => applyAction('lesion-apical')}>Lesión apical</div>
                    <div className="treatment-btn" onClick={() => applyAction('gingivitis')}>Gingivitis</div>
                    <div className="treatment-btn" onClick={() => applyAction('periodontitis')}>Periodontitis</div>
                    <div className="treatment-btn" onClick={() => applyAction('desorden-desarrollo')}>Desorden desarrollo</div>
                    <div className="treatment-btn" onClick={() => applyAction('diastema')}>Diastema</div>
                    <div className="treatment-btn" onClick={() => applyAction('impactacion')}>Impactación</div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Otros */}
            <div className={`category ${expandedSections.observations ? 'expanded' : ''}`} data-category="otros">
              <div 
                className="category-header otros" 
                onClick={() => toggleSection('observations')}
              >
                <span>4. Otros</span>
                <span className="expand-icon">{expandedSections.observations ? '▼' : '▼'}</span>
              </div>
              {expandedSections.observations && (
                <div className="category-content">
                  <div className="treatment-options">
                    <div className="treatment-btn" onClick={() => applyAction('diente-temporal')}>Diente temporal</div>
                    <div className="treatment-btn" onClick={() => applyAction('diente-permanente')}>Diente permanente</div>
                    <div className="treatment-btn" onClick={() => applyAction('frenillo-corto')}>Frenillo corto</div>
                    <div className="treatment-btn" onClick={() => applyAction('giroversion')}>Giroversión</div>
                    <div className="treatment-btn" onClick={() => applyAction('carilla')}>Carilla</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel de mediciones periodontales */}
          <div className="periodontal-panel">
            <div className="panel-title">
              Periodontal
              <button className="palpacion-btn" onClick={() => setShowPerioDetailPanel(true)}>
                <span className="icon">+</span> PALPACIÓN
              </button>
            </div>

            <div className="perio-measurements-grid">
              <div className="perio-row">
                <div className="perio-cell" onClick={() => handlePerioPointClick('distopalatal')}>
                  <div className="perio-value">{tooth.perioData?.distopalatal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.distopalatal || 0}</div>
                  </div>
                  <div className="perio-label">Disto Palatal</div>
                </div>
                <div className="perio-cell" onClick={() => handlePerioPointClick('palatal')}>
                  <div className="perio-value">{tooth.perioData?.palatal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.palatal || 0}</div>
                  </div>
                  <div className="perio-label">Palatal</div>
                </div>
                <div className="perio-cell" onClick={() => handlePerioPointClick('mesiopalatal')}>
                  <div className="perio-value">{tooth.perioData?.mesiopalatal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.mesiopalatal || 0}</div>
                  </div>
                  <div className="perio-label">Mesopalatal</div>
                </div>
              </div>

              <div className="perio-row">
                <div className="perio-cell" onClick={() => handlePerioPointClick('distobucal')}>
                  <div className="perio-value">{tooth.perioData?.distobucal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.distobucal || 0}</div>
                  </div>
                  <div className="perio-label">Disto bucal</div>
                </div>
                <div className="perio-cell" onClick={() => handlePerioPointClick('bucal')}>
                  <div className="perio-value">{tooth.perioData?.bucal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.bucal || 0}</div>
                  </div>
                  <div className="perio-label">Bucal</div>
                </div>
                <div className="perio-cell" onClick={() => handlePerioPointClick('mesiobucal')}>
                  <div className="perio-value">{tooth.perioData?.mesiobucal || 0}</div>
                  <div className="perio-slider">
                    <div className="slider-circle">{tooth.perioData?.mesiobucal || 0}</div>
                  </div>
                  <div className="perio-label">Mesobucal</div>
                </div>
              </div>
            </div>

            {/* Panel de detalle periodontal que se muestra al hacer clic en un punto */}
            {showPerioDetailPanel && (
              <PerioDetailPanel 
                selectedTooth={selectedTooth}
                activePoint={activePerioPoint}
                onClose={() => setShowPerioDetailPanel(false)}
                tooth={tooth}
              />
            )}
          </div>
        </div>

        {/* Navegación entre dientes */}
        <div className="tooth-navigation">
          <button className="nav-button prev" onClick={() => navigateToTooth('prev')}>
            <span>←</span> Diente anterior
          </button>
          <button className="nav-button next" onClick={() => navigateToTooth('next')}>
            Diente siguiente <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToothDetailView;
