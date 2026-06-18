export const BENCHMARKS = {
  IN: { city: 130, national: 150, global: 333, top10pct: 80, name: 'India' },
  US: { city: 480, national: 500, global: 333, top10pct: 180, name: 'United States' },
  UK: { city: 250, national: 280, global: 333, top10pct: 120, name: 'United Kingdom' },
  DEFAULT: { city: 280, national: 333, global: 333, top10pct: 130, name: 'Global Average' },
};

export const getBenchmarkForCountry = (countryCode) => {
  return BENCHMARKS[countryCode] || BENCHMARKS.DEFAULT;
};
