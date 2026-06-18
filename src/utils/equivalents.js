export const getEquivalents = (totalKg) => {
  const flightHours = (totalKg / 250).toFixed(1); // 250kg CO2 per passenger for short flights
  const drivingKm = Math.round(totalKg / 0.21); // Avg car emissions (0.21 kg/km)
  const smartphoneCharges = Math.round(totalKg / 0.007); // ~7.3g per charge
  const treesOffsetMonthly = Math.ceil(totalKg / (21.77 / 12)); // Trees needed for 1 month

  return [
    {
      id: 'flights',
      label: 'Flights',
      value: `${flightHours} hrs`,
      description: 'Flight time from Delhi to Mumbai',
      icon: '✈️',
      color: 'from-blue-500/20 to-blue-600/5'
    },
    {
      id: 'driving',
      label: 'Driving',
      value: `${drivingKm.toLocaleString()} km`,
      description: 'Driving in a standard petrol car',
      icon: '🚗',
      color: 'from-amber-500/20 to-amber-600/5'
    },
    {
      id: 'phones',
      label: 'Smartphones',
      value: smartphoneCharges.toLocaleString(),
      description: 'Smartphones charged from 0% to 100%',
      icon: '📱',
      color: 'from-indigo-500/20 to-indigo-600/5'
    },
    {
      id: 'trees',
      label: 'Trees Needed',
      value: `${treesOffsetMonthly} trees`,
      description: 'Offsetting emissions for one month',
      icon: '🌳',
      color: 'from-emerald-500/20 to-emerald-600/5'
    }
  ];
};
