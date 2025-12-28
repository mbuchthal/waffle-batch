import { sum, deviation, mean } from 'd3-array';

export type MetricType = 'sum' | 'deviation' | 'trend' | 'default';

/**
 * Calculates the slope of the linear regression line (trend) for an array of numbers.
 * Assumes equal spacing between data points (x = 0, 1, 2, ...).
 */
export function calculateTrend(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = mean(values) ?? 0;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = values[i];
    const xDiff = x - xMean;
    numerator += xDiff * (y - yMean);
    denominator += xDiff * xDiff;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

export function calculateMetric<T>(data: T[], valueKey: keyof T | ((d: T) => number), type: MetricType): number {
  if (type === 'default') return 0;

  const values = data.map(d => (typeof valueKey === 'function' ? valueKey(d) : Number(d[valueKey])));

  switch (type) {
    case 'sum':
      return sum(values);
    case 'deviation':
      return deviation(values) ?? 0;
    case 'trend':
      return calculateTrend(values);
    default:
      return 0;
  }
}
