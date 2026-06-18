export const PERSONAS = {
  'daily-commuter': {
    id: 'daily-commuter',
    name: 'The Daily Commuter',
    emoji: '🚗',
    description: 'Your biggest footprint comes from getting around. Small transport changes = big wins.',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    primaryTip: 'Try carpooling or public transit 2 days/week'
  },
  'digital-nomad': {
    id: 'digital-nomad',
    name: 'The Digital Nomad',
    emoji: '💻',
    description: 'Your digital life has a carbon cost most people overlook.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    primaryTip: 'Enable device power-saving and reduce streaming quality'
  },
  'meat-lover': {
    id: 'meat-lover',
    name: 'The Carnivore',
    emoji: '🥩',
    description: 'Food choices have one of the highest leverage points for reduction.',
    color: 'text-red-400 bg-red-500/10 border-red-500/20',
    primaryTip: 'Try one plant-based day per week — saves ~8.4 kg CO₂/month'
  },
  'energy-consumer': {
    id: 'energy-consumer',
    name: 'The Power User',
    emoji: '⚡',
    description: 'Your home energy use is your biggest opportunity area.',
    color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    primaryTip: 'Switch to LED lighting and optimize AC by 2°C'
  },
  'green-pioneer': {
    id: 'green-pioneer',
    name: 'The Green Pioneer',
    emoji: '🌿',
    description: 'You\'re already ahead of 80% of people. Help others do the same.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    primaryTip: 'You\'re doing great — share your habits to inspire others'
  }
};

export const getPersonaDetails = (personaId) => {
  return PERSONAS[personaId] || PERSONAS['green-pioneer'];
};
