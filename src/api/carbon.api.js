import api from './axios';

export const logEntry = async (week, profile) => {
  const response = await api.post('/carbon/log', { week, profile });
  return response.data;
};

export const getHistory = async () => {
  const response = await api.get('/carbon/history');
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/carbon/summary');
  return response.data;
};

export const getProjection = async () => {
  const response = await api.get('/carbon/projection');
  return response.data;
};
