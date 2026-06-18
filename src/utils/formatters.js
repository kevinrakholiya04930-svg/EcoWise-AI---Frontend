import { format, parseISO } from 'date-fns';

export const formatCarbon = (kg) => {
  return `${Math.round(kg)} kg`;
};

export const formatPoints = (pts) => {
  return `${pts.toLocaleString()} pts`;
};

export const formatWeekStr = (weekStr) => {
  if (!weekStr || weekStr === 'Baseline') return weekStr;
  try {
    const parts = weekStr.split('-W');
    return `Wk ${parts[1]}, ${parts[0]}`;
  } catch (e) {
    return weekStr;
  }
};
