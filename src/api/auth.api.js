import api from './axios';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.put('/auth/password', { currentPassword, newPassword });
  return response.data;
};

export const onboarding = async (profileData) => {
  const response = await api.post('/user/onboarding', profileData);
  return response.data;
};

export const getOnboardingProgress = async () => {
  const response = await api.get('/onboarding');
  return response.data;
};

export const saveOnboardingProgress = async (profileData) => {
  const response = await api.put('/onboarding', profileData);
  return response.data;
};

export const completeOnboardingProgress = async (profileData) => {
  const response = await api.post('/onboarding/complete', profileData);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/user/profile', profileData);
  return response.data;
};
