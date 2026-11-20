import API from './api';

export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  if (response.data.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

export const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  if (response.data.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

export const getCurrentUser = async () => {
  const response = await API.get('/auth/me');
  return response.data.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put('/users/profile', profileData);
  return response.data.data;
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};
