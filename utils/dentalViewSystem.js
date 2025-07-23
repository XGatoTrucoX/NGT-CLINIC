/**
 * Dental View System - Core functionality for dental state management
 * Handles views, states, mirroring, and validation
 */

// Mirror mapping configuration
const mirrorMapping = {
  horizontal: {
    // Upper teeth (11-18 ↔ 21-28)
    11: 21, 12: 22, 13: 23, 14: 24, 15: 25, 16: 26, 17: 27, 18: 28,
    21: 11, 22: 12, 23: 13, 24: 14, 25: 15, 26: 16, 27: 17, 28: 18
  },
  vertical: {
    // Lower teeth (41-48 ↔ 31-38)
    41: 31, 42: 32, 43: 33, 44: 34, 45: 35, 46: 36, 47: 37, 48: 38,
    31: 41, 32: 42, 33: 43, 34: 44, 35: 45, 36: 46, 37: 47, 38: 48
  }
};

// State compatibility matrix
const stateCompatibilityMatrix = {
  faltante: {
    implante: false,
    pontic: false,
    desgaste: false,
    carilla: false,
    implante_endodoncia: false,
    necrosis: false,
    lesion_periapical: false,
    corona: false,
    endodoncia: false
  },
  implante: {
    faltante: false,
    pontic: false,
    desgaste: false,
    carilla: true,
    implante_endodoncia: true,
    necrosis: false,
    lesion_periapical: true,
    corona: true,
    endodoncia: false
  },
  pontic: {
    faltante: false,
    implante: false,
    desgaste: false,
    carilla: false,
    implante_endodoncia: false,
    necrosis: false,
    lesion_periapical: false,
    corona: false,
    endodoncia: false
  },
  desgaste: {
    faltante: false,
    implante: false,
    pontic: false,
    carilla: true,
    implante_endodoncia: false,
    necrosis: true,
    lesion_periapical: true,
    corona: false,
    endodoncia: true
  },
  carilla: {
    faltante: false,
    implante: true,
    pontic: false,
    desgaste: true,
    implante_endodoncia: true,
    necrosis: false,
    lesion_periapical: false,
    corona: false,
    endodoncia: true
  }
};

// Clinical test compatibility
const clinicalTestCompatibility = {
  faltante: {
    frio: false,
    calor: false,
    electricidad: false,
    percusion: false,
    palpacion: false
  },
  implante: {
    frio: false,
    calor: false,
    electricidad: false,
    percusion: true,
    palpacion: true
  },
  pontic: {
    frio: false,
    calor: false,
    electricidad: false,
    percusion: false,
    palpacion: false
  },
  carilla: {
    frio: true,
    calor: true,
    electricidad: true,
    percusion: false,
    palpacion: true
  },
  necrosis: {
    frio: false,
    calor: false,
    electricidad: false,
    percusion: true,
    palpacion: true
  },
  default: {
    frio: true,
    calor: true,
    electricidad: true,
    percusion: true,
    palpacion: true
  }
};

/**
 * Get the mirror tooth ID based on the current tooth ID
 * @param {number} toothId - The current tooth ID
 * @returns {number} - The mirror tooth ID
 */
export const getMirrorToothId = (toothId) => {
  // Check horizontal mirroring (upper teeth)
  if (mirrorMapping.horizontal[toothId]) {
    return mirrorMapping.horizontal[toothId];
  }
  
  // Check vertical mirroring (lower teeth)
  if (mirrorMapping.vertical[toothId]) {
    return mirrorMapping.vertical[toothId];
  }
  
  // Return the same ID if no mirror mapping exists
  return toothId;
};

/**
 * Check if a tooth needs mirroring
 * @param {number} toothId - The tooth ID to check
 * @returns {boolean} - Whether the tooth needs mirroring
 */
export const needsMirroring = (toothId) => {
  // Upper teeth (21-28) or lower teeth (31-38)
  return (toothId >= 21 && toothId <= 28) || (toothId >= 31 && toothId <= 38);
};

/**
 * Generate the image path for a tooth based on its state and view
 * @param {number} toothId - The tooth ID
 * @param {string} view - The view (buccal, lingual, incisal)
 * @param {string} state - The tooth state
 * @param {boolean} forceReload - Whether to force reload the image
 * @returns {string} - The image path
 */
export const cargarVista = (toothId, vista, estado = 'tooth', forceReload = true) => {
  // Base path for tooth images
  const basePath = `/images/teeth/`;
  
  // Determine the tooth ID for the image (considering mirroring)
  const imageToothId = needsMirroring(toothId) ? getMirrorToothId(toothId) : toothId;
  
  // Construct the image path based on the state
  let imagePath = `${basePath}${vista}/`;
  
  // Timestamp to prevent caching
  const timestamp = forceReload ? `?t=${Date.now()}` : '';
  
  // Log para depuración
  console.log(`Cargando imagen para diente ${toothId}, estado: ${estado}, vista: ${vista}`);
  
  // Add the view prefix and state
  switch (estado) {
    case 'faltante':
      return `${imagePath}${vista}.${imageToothId}.png${timestamp}`;
    case 'implante':
      const implantPath = `${imagePath}${vista}.implant.${imageToothId}.png${timestamp}`;
      console.log('Ruta de implante:', implantPath);
      return implantPath;
    case 'pontic':
      return `${imagePath}${vista}.pontics.${imageToothId}.png${timestamp}`;
    case 'desgaste':
      return `${imagePath}${vista}.dental.wear.${imageToothId}.png${timestamp}`;
    case 'carilla':
      return `${imagePath}${vista}.carilla.${imageToothId}.png${timestamp}`;
    case 'implante_endodoncia':
      return `${imagePath}${vista}.implant.endo.${imageToothId}.png${timestamp}`;
    case 'necrosis':
      return `${imagePath}${vista}.necrosis.${imageToothId}.png${timestamp}`;
    case 'lesion_periapical':
      return `${imagePath}${vista}.lesion.periapical.${imageToothId}.png${timestamp}`;
    case 'corona':
      return `${imagePath}${vista}.corona.${imageToothId}.png${timestamp}`;
    case 'endodoncia':
      return `${imagePath}${vista}.endo.${imageToothId}.png${timestamp}`;
    default:
      return `${imagePath}${vista}.tooth.${imageToothId}.png${timestamp}`;
  }
};

/**
 * Check if two states are compatible
 * @param {string} state1 - First state
 * @param {string} state2 - Second state
 * @returns {boolean} - Whether the states are compatible
 */
export const areStatesCompatible = (state1, state2) => {
  if (state1 === state2) return true;
  if (!stateCompatibilityMatrix[state1]) return false;
  return stateCompatibilityMatrix[state1][state2] === true;
};

/**
 * Check if a clinical test is compatible with a tooth state
 * @param {string} state - The tooth state
 * @param {string} test - The clinical test
 * @returns {boolean} - Whether the test is compatible with the state
 */
export const isTestCompatibleWithState = (state, test) => {
  if (clinicalTestCompatibility[state]) {
    return clinicalTestCompatibility[state][test] === true;
  }
  return clinicalTestCompatibility.default[test] === true;
};

/**
 * Apply a state to a tooth and handle automatic mirroring
 * @param {Array} teethData - The current teeth data
 * @param {number} toothId - The tooth ID to update
 * @param {string} state - The state to apply
 * @param {boolean} applyMirroring - Whether to apply mirroring
 * @returns {Array} - The updated teeth data
 */
export const applyStateToTooth = (teethData, toothId, state, applyMirroring = true) => {
  let updatedTeethData = [...teethData];
  
  // Find the tooth to update
  const toothIndex = updatedTeethData.findIndex(tooth => tooth.id === toothId);
  if (toothIndex === -1) return updatedTeethData;
  
  // Update the tooth state
  updatedTeethData[toothIndex] = updateToothState(updatedTeethData[toothIndex], state);
  
  // Apply mirroring if enabled
  if (applyMirroring) {
    const mirrorToothId = getMirrorToothId(toothId);
    if (mirrorToothId !== toothId) {
      const mirrorToothIndex = updatedTeethData.findIndex(tooth => tooth.id === mirrorToothId);
      if (mirrorToothIndex !== -1) {
        updatedTeethData[mirrorToothIndex] = updateToothState(updatedTeethData[mirrorToothIndex], state);
      }
    }
  }
  
  return updatedTeethData;
};

/**
 * Update a tooth's state based on the provided state
 * @param {Object} tooth - The tooth object to update
 * @param {string} state - The state to apply
 * @returns {Object} - The updated tooth object
 */
const updateToothState = (tooth, state) => {
  // Create a clean tooth object
  const cleanTooth = {
    ...tooth,
    isAbsent: false,
    isImplant: false,
    isPontic: false,
    hasWear: false,
    hasCarilla: false,
    hasImplantEndo: false,
    hasNecrosis: false,
    hasLesionPeriapical: false,
    conditions: []
  };
  
  // Apply the new state
  switch (state) {
    case 'faltante':
      cleanTooth.isAbsent = true;
      break;
    case 'implante':
      cleanTooth.isImplant = true;
      break;
    case 'pontic':
      cleanTooth.isPontic = true;
      break;
    case 'desgaste':
      cleanTooth.hasWear = true;
      break;
    case 'carilla':
      cleanTooth.hasCarilla = true;
      cleanTooth.conditions.push({ type: 'carilla' });
      break;
    case 'implante_endodoncia':
      cleanTooth.isImplant = true;
      cleanTooth.hasImplantEndo = true;
      cleanTooth.conditions.push({ type: 'implante_endodoncia' });
      break;
    case 'necrosis':
      cleanTooth.hasNecrosis = true;
      cleanTooth.conditions.push({ type: 'necrosis' });
      break;
    case 'lesion_periapical':
      cleanTooth.hasLesionPeriapical = true;
      cleanTooth.conditions.push({ type: 'lesion_periapical' });
      break;
    case 'corona':
      cleanTooth.conditions.push({ type: 'corona' });
      break;
    case 'endodoncia':
      cleanTooth.conditions.push({ type: 'endodoncia' });
      break;
    default:
      break;
  }
  
  return cleanTooth;
};

/**
 * Get a list of redundant files that can be eliminated
 * @returns {Array} - List of redundant files with justification
 */
export const getRedundantFiles = () => {
  return [
    {
      pattern: "*.mirror.*.png",
      justification: "Mirror images are not needed as mirroring is handled programmatically"
    },
    {
      pattern: "duplicate tooth images with different orientations",
      justification: "Original orientation should be preserved, no need for rotated versions"
    }
  ];
};

export default {
  cargarVista,
  getMirrorToothId,
  needsMirroring,
  areStatesCompatible,
  isTestCompatibleWithState,
  applyStateToTooth,
  getRedundantFiles
};
