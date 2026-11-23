export interface Country {
  code: string;
  name: string;
}

export const COUNTRIES = [
  { code: 'DE', name: 'Alemania' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CY', name: 'Chipre' },
  { code: 'HR', name: 'Croacia' },
  { code: 'DK', name: 'Dinamarca' },
  { code: 'SK', name: 'Eslovaquia' },
  { code: 'SI', name: 'Eslovenia' },
  { code: 'ES', name: 'España' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'FR', name: 'Francia' },
  { code: 'GR', name: 'Grecia' },
  { code: 'HU', name: 'Hungría' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'IT', name: 'Italia' },
  { code: 'LV', name: 'Letonia' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Países Bajos' },
  { code: 'PL', name: 'Polonia' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'CZ', name: 'República Checa' },
  { code: 'RO', name: 'Rumanía' },
  { code: 'SE', name: 'Suecia' },
] as const satisfies readonly Country[];
