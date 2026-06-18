import api from './axios';

export const sendChatMessage = async (message) => {
  const response = await api.post('/coach/chat', { message });
  return response.data;
};

export const getWeeklyReport = async () => {
  const response = await api.get('/coach/report');
  return response.data;
};
