// Asocia nombre de malla (nombre del nodo) con zona ID
export const zonaMap = {
  'Object_4': 104,
  'Object_6': 105,
  'Object_8': 106,
  'Object_10': 107,
  'Object_12': 108,
  'Object_14': 109,
  'Object_16': 110,
  'Object_18': 111,
  'Object_20': 112,
};

// Diccionario de nombres amigables para mostrar al usuario
export const zonaDisplayNames = {
  'Object_4': 'Lengüeta',
  'Object_6': 'Linea lateral',
  'Object_8': 'Suela Exterior',
  'Object_10': 'Entresuela',
  'Object_12': 'Logo',
  'Object_14': 'Cordones',
  'Object_16': 'Laterales',
  'Object_18': 'Quarter',
  'Object_20': 'Revestimiento trasero',
};

export function getZonaIdFromName(name) {
  return zonaMap[name] || null;
}

export function getColorHexFromStore(zonaId, colores, personalizacion) {
  const colorId = personalizacion[zonaId]?.colorId;
  return colores.find((c) => c.id_color === colorId)?.codigo_hax || null;
}
