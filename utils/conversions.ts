const CM_TO_IN = 0.393701;
const KG_TO_LB = 2.20462;

export function cmToInches(cm: number): number {
  return Math.round(cm * CM_TO_IN * 10) / 10;
}

export function inchesToCm(inches: number): number {
  return Math.round(inches / CM_TO_IN * 10) / 10;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * KG_TO_LB * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round(lbs / KG_TO_LB * 10) / 10;
}

export function convertValue(
  value: number,
  fromUnit: string,
  toSystem: 'metric' | 'imperial'
): number {
  if (toSystem === 'imperial') {
    if (fromUnit === 'cm') return cmToInches(value);
    if (fromUnit === 'kg') return kgToLbs(value);
  }
  return value;
}

export function getDisplayUnit(
  metricUnit: string,
  system: 'metric' | 'imperial'
): string {
  if (system === 'imperial') {
    if (metricUnit === 'cm') return 'in';
    if (metricUnit === 'kg') return 'lbs';
  }
  return metricUnit;
}
