import { MeasurementUnit } from '../types';

export function formatCurrencyBRL(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatUnitLabel(unit: MeasurementUnit): string {
  switch (unit) {
    case 'kg': return 'kg (quilogramas)';
    case 'g': return 'g (gramas)';
    case 'l': return 'L (litros)';
    case 'ml': return 'ml (mililitros)';
    case 'un': return 'un (unidades)';
    default: return unit;
  }
}

export function formatQuantityWithUnit(quantity: number, unit: MeasurementUnit): string {
  return `${quantity} ${unit}`;
}

export function formatMinutesToHours(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`;
}
