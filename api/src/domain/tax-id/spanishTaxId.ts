const DNI_CONTROL_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const CIF_CONTROL_LETTERS = 'JABCDEFGHI';

const NUMERIC_CONTROL_CIF_TYPES = new Set(['A', 'B', 'E', 'H']);
const LETTER_CONTROL_CIF_TYPES = new Set(['N', 'P', 'Q', 'R', 'S', 'W']);

function hasValidDniControl(number: string, control: string): boolean {
  return DNI_CONTROL_LETTERS[Number(number) % 23] === control;
}

function isValidDni(taxId: string): boolean {
  const match = /^(\d{8})([A-Z])$/.exec(taxId);

  if (match === null) {
    return false;
  }

  const [, number, control] = match;
  return number !== undefined && control !== undefined && hasValidDniControl(number, control);
}

function isValidNie(taxId: string): boolean {
  const match = /^([XYZ])(\d{7})([A-Z])$/.exec(taxId);

  if (match === null) {
    return false;
  }

  const [, prefix, digits, control] = match;

  if (prefix === undefined || digits === undefined || control === undefined) {
    return false;
  }

  const prefixValue: Readonly<Record<string, string>> = { X: '0', Y: '1', Z: '2' };
  return hasValidDniControl(`${prefixValue[prefix]}${digits}`, control);
}

function calculateCifControl(digits: string): number {
  let sum = 0;

  for (const [index, character] of [...digits].entries()) {
    const digit = Number(character);

    if (index % 2 === 1) {
      sum += digit;
      continue;
    }

    const doubled = digit * 2;
    sum += Math.floor(doubled / 10) + (doubled % 10);
  }

  return (10 - (sum % 10)) % 10;
}

function isValidCif(taxId: string): boolean {
  const match = /^([ABCDEFGHJNPQRSUVW])(\d{7})([0-9A-J])$/.exec(taxId);

  if (match === null) {
    return false;
  }

  const [, organizationType, digits, suppliedControl] = match;

  if (organizationType === undefined || digits === undefined || suppliedControl === undefined) {
    return false;
  }

  const control = calculateCifControl(digits);
  const numericControl = String(control);
  const letterControl = CIF_CONTROL_LETTERS[control];

  if (NUMERIC_CONTROL_CIF_TYPES.has(organizationType)) {
    return suppliedControl === numericControl;
  }

  if (LETTER_CONTROL_CIF_TYPES.has(organizationType)) {
    return suppliedControl === letterControl;
  }

  return suppliedControl === numericControl || suppliedControl === letterControl;
}

export function isValidSpanishTaxId(taxId: string): boolean {
  return isValidDni(taxId) || isValidNie(taxId) || isValidCif(taxId);
}
