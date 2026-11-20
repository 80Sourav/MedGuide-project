import API from './api';

export const getMedicalHistory = async () => {
  const response = await API.get('/medical-history');
  return response.data.data;
};

export const updateMedicalHistory = async (historyData) => {
  const response = await API.put('/medical-history', historyData);
  return response.data.data;
};
