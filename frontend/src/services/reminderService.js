import API from './api';

export const getReminders = async () => {
  const response = await API.get('/reminders');
  return response.data.data;
};

export const createReminder = async (reminderData) => {
  const response = await API.post('/reminders', reminderData);
  return response.data.data;
};

export const updateReminder = async (id, reminderData) => {
  const response = await API.put(`/reminders/${id}`, reminderData);
  return response.data.data;
};

export const deleteReminder = async (id) => {
  const response = await API.delete(`/reminders/${id}`);
  return response.data;
};
