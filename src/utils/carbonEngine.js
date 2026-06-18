export const FACTORS = {
  transport: { car: 0.21, bike: 0.008, public: 0.089, walking: 0.001, wfh: 0 },
  electricity: 0.41,
  food: { vegan: 45, vegetarian: 75, omnivore: 114, 'meat-heavy': 180 },
  digital: 0.036,
};

export const calculateEmissions = (profile) => {
  const transportMode = profile.transportMode || 'walking';
  const dailyTravelKm = Number(profile.dailyTravelKm) || 0;
  const monthlyElectricityKwh = Number(profile.monthlyElectricityKwh) || 0;
  const dietType = profile.dietType || 'vegetarian';
  const dailyDigitalHours = Number(profile.dailyDigitalHours) || 0;

  const transportation = dailyTravelKm * (FACTORS.transport[transportMode] || 0) * 30;
  const electricity = monthlyElectricityKwh * FACTORS.electricity;
  const food = FACTORS.food[dietType] || 75;
  const digital = dailyDigitalHours * FACTORS.digital * 30;
  
  const total = transportation + electricity + food + digital;
  const score = Math.min(100, Math.round((total / 333) * 50));
  const treesRequired = Math.ceil(total / (21.77 / 12));

  return {
    transportation: Math.round(transportation),
    electricity: Math.round(electricity),
    food: Math.round(food),
    digital: Math.round(digital),
    total: Math.round(total),
    score,
    treesRequired
  };
};
