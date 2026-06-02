/** Mapeo de las 14 clases del modelo CNN a nombres en español para el agricultor. */
export const CLASES_ENFERMEDAD_ES: Record<string, string> = {
  Tomato_Bacterial_spot: 'Mancha bacteriana',
  Tomato_Early_blight: 'Tizón temprano',
  Tomato_healthy: 'Tomate sano',
  Tomato_Late_blight: 'Tizón tardío',
  Tomato_Leaf_Mold: 'Moho foliar',
  Tomato_Septoria_leaf_spot: 'Mancha séptica',
  Tomato_Spider_mites_Two_spotted_spider_mite: 'Ácaro de dos manchas',
  Tomato__Target_Spot: 'Mancha diana',
  Tomato__Tomato_mosaic_virus: 'Virus del mosaico',
  Tomato__Tomato_YellowLeaf__Curl_Virus: 'Virus del rizado amarillo',
  greenhouse_dried_leaves: 'Hojas secas',
  greenhouse_healthy_leaves: 'Hojas sanas',
  greenhouse_leaves_with_stains: 'Hojas con manchas',
  greenhouse_leaves_yellow_stains: 'Hojas con manchas amarillas',
  // Alias usados en datos simulados / API abreviada
  healthy: 'Tomate sano',
  early_blight: 'Tizón temprano',
  late_blight: 'Tizón tardío',
  leaf_mold: 'Moho foliar',
  septoria: 'Mancha séptica',
  bacterial_spot: 'Mancha bacteriana',
  spider_mites: 'Ácaro de dos manchas',
  target_spot: 'Mancha diana',
  mosaic_virus: 'Virus del mosaico',
  yellow_leaf_curl: 'Virus del rizado amarillo',
  'Tomato Healthy': 'Tomate sano',
};

export function traducirDiagnostico(diagnostico: string): string {
  if (!diagnostico) {
    return 'Sin diagnóstico';
  }

  const normalizado = diagnostico.trim();
  if (CLASES_ENFERMEDAD_ES[normalizado]) {
    return CLASES_ENFERMEDAD_ES[normalizado];
  }

  const claveSnake = normalizado
    .replace(/^Tomato\s+/i, '')
    .replace(/\s+/g, '_')
    .toLowerCase();

  if (CLASES_ENFERMEDAD_ES[claveSnake]) {
    return CLASES_ENFERMEDAD_ES[claveSnake];
  }

  return normalizado;
}
