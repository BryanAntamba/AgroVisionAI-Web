// Mapeo de las 14 clases del modelo CNN a nombres en español para el agricultor
// Esta es una constante que asocia cada identificador de enfermedad con su nombre legible en español
export const CLASES_ENFERMEDAD_ES: Record<string, string> = {
  // Enfermedades y condiciones del tomate en inglés mapeadas a español
  Tomato_Bacterial_spot: 'Mancha bacteriana', // Enfermedad bacteriana que causa manchas en hojas
  Tomato_Early_blight: 'Tizón temprano', // Enfermedad fúngica que aparece temprano en la temporada
  Tomato_healthy: 'Tomate sano', // Tomate en estado saludable sin enfermedades
  Tomato_Late_blight: 'Tizón tardío', // Enfermedad fúngica que aparece tarde en la temporada
  Tomato_Leaf_Mold: 'Moho foliar', // Enfermedad fúngica que afecta las hojas
  Tomato_Septoria_leaf_spot: 'Mancha séptica', // Enfermedad fúngica que causa manchas sépticas
  Tomato_Spider_mites_Two_spotted_spider_mite: 'Ácaro de dos manchas', // Plaga de ácaros tejedores
  Tomato__Target_Spot: 'Mancha diana', // Enfermedad fúngica con patrón de mancha circular
  Tomato__Tomato_mosaic_virus: 'Virus del mosaico', // Virus que causa patrón de mosaico en hojas
  Tomato__Tomato_YellowLeaf__Curl_Virus: 'Virus del rizado amarillo', // Virus que causa ondulación y amarillamiento
  greenhouse_dried_leaves: 'Hojas secas', // Hojas secadas en invernadero
  greenhouse_healthy_leaves: 'Hojas sanas', // Hojas saludables en invernadero
  greenhouse_leaves_with_stains: 'Hojas con manchas', // Hojas con manchas diversas en invernadero
  greenhouse_leaves_yellow_stains: 'Hojas con manchas amarillas', // Hojas con manchas amarillas específicas
  // Alias usados en datos simulados / API abreviada (versiones simplificadas de los nombres)
  healthy: 'Tomate sano', // Alias simple para tomate saludable
  early_blight: 'Tizón temprano', // Alias simple para tizón temprano
  late_blight: 'Tizón tardío', // Alias simple para tizón tardío
  leaf_mold: 'Moho foliar', // Alias simple para moho foliar
  septoria: 'Mancha séptica', // Alias simple para mancha séptica
  bacterial_spot: 'Mancha bacteriana', // Alias simple para mancha bacteriana
  spider_mites: 'Ácaro de dos manchas', // Alias simple para ácaro de dos manchas
  target_spot: 'Mancha diana', // Alias simple para mancha diana
  mosaic_virus: 'Virus del mosaico', // Alias simple para virus del mosaico
  yellow_leaf_curl: 'Virus del rizado amarillo', // Alias simple para virus del rizado amarillo
  'Tomato Healthy': 'Tomate sano', // Variante con espacios para tomate saludable
};

// Función que traduce un diagnóstico del idioma English/código al español
// Recibe una cadena con el nombre de la enfermedad y retorna su traducción al español
export function traducirDiagnostico(diagnostico: string): string {
  // Si no hay diagnóstico (vacío o null), retorna mensaje por defecto
  if (!diagnostico) {
    return 'Sin diagnóstico';
  }

  // Elimina espacios al inicio y final de la cadena
  const normalizado = diagnostico.trim();
  // Busca el diagnóstico normalizado directamente en el mapeo
  // Si está exactamente igual, retorna la traducción correspondiente
  if (CLASES_ENFERMEDAD_ES[normalizado]) {
    return CLASES_ENFERMEDAD_ES[normalizado];
  }

  // Si no encontró la traducción exacta, intenta con una clave normalizada
  // Reemplaza "Tomato " al inicio (case-insensitive) para buscar una versión simplificada
  // Reemplaza espacios con guiones bajos para que coincida con el patrón de la API
  // Convierte todo a minúsculas para búsqueda flexible
  const claveSnake = normalizado
    .replace(/^Tomato\s+/i, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  // Busca la clave normalizada en el mapeo
  if (CLASES_ENFERMEDAD_ES[claveSnake]) {
    return CLASES_ENFERMEDAD_ES[claveSnake];
  }

  // Si no encuentra ninguna traducción, retorna el diagnóstico original sin traducir
  return normalizado;
}
