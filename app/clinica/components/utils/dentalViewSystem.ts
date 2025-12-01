const mirrorMapping = {
  horizontal: {
    11: 21, 12: 22, 13: 23, 14: 24, 15: 25, 16: 26, 17: 27, 18: 28,
    21: 11, 22: 12, 23: 13, 24: 14, 25: 15, 26: 16, 27: 17, 28: 18
  },
  vertical: {
    41: 31, 42: 32, 43: 33, 44: 34, 45: 35, 46: 36, 47: 37, 48: 38,
    31: 41, 32: 42, 33: 43, 34: 44, 35: 45, 36: 46, 37: 47, 38: 48
  }
};

export const getMirrorToothId = (toothId: number): number => {
  if ((mirrorMapping.horizontal as any)[toothId]) {
    return (mirrorMapping.horizontal as any)[toothId];
  }
  
  if ((mirrorMapping.vertical as any)[toothId]) {
    return (mirrorMapping.vertical as any)[toothId];
  }
  
  return toothId;
};

export const needsMirroring = (toothId: number): boolean => {
  return (toothId >= 21 && toothId <= 28) || (toothId >= 31 && toothId <= 38);
};

export const cargarVista = (toothId: number, vista: string, estado = 'tooth', forceReload = true): string => {
  const basePath = `/images/teeth/`;
  const imageToothId = needsMirroring(toothId) ? getMirrorToothId(toothId) : toothId;
  let imagePath = `${basePath}${vista}/`;
  const timestamp = forceReload ? `?t=${Date.now()}` : '';
  
  console.log(`Cargando imagen para diente ${toothId}, estado: ${estado}, vista: ${vista}`);
  
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

export default {
  cargarVista,
  getMirrorToothId,
  needsMirroring
};