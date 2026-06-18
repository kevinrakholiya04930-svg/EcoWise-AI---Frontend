import api from './axios';

export const getStats = async () => {
  const response = await api.get('/gamification/stats');
  return response.data;
};

export const getChallenges = async () => {
  const response = await api.get('/gamification/challenges');
  return response.data;
};

export const joinChallenge = async (challengeId) => {
  const response = await api.post(`/gamification/challenges/${challengeId}/join`);
  return response.data;
};

export const completeChallenge = async (challengeId) => {
  const response = await api.post(`/gamification/challenges/${challengeId}/complete`);
  return response.data;
};
