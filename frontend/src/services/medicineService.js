import API from './api';

export const getMedicines = async () => {
  const response = await API.get('/medicines');
  return response.data.data;
};

export const createMedicine = async (medicineData) => {
  const response = await API.post('/medicines', medicineData);
  return response.data.data;
};

export const updateMedicine = async (id, medicineData) => {
  const response = await API.put(`/medicines/${id}`, medicineData);
  return response.data.data;
};

export const deleteMedicine = async (id) => {
  const response = await API.delete(`/medicines/${id}`);
  return response.data;
};
