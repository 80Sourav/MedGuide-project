import API from './api';

export const getPrescriptions = async () => {
  const response = await API.get('/prescriptions');
  return response.data.data;
};

export const getPrescriptionById = async (id) => {
  const response = await API.get(`/prescriptions/${id}`);
  return response.data.data;
};

export const uploadPrescription = async (formData) => {
  const response = await API.post('/prescriptions/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const deletePrescription = async (id) => {
  const response = await API.delete(`/prescriptions/${id}`);
  return response.data;
};

export const getPrescriptionChatHistory = async (id) => {
  const response = await API.get(`/prescriptions/${id}/chat`);
  return response.data.data;
};

export const sendPrescriptionChatMessage = async (id, message) => {
  const response = await API.post(`/prescriptions/${id}/chat`, { message });
  return response.data.data;
};
