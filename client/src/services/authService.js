import api from './api';

const register = (data) => api.post('/auth/register', data).then((res) => res.data);
const login = (data) => api.post('/auth/login', data).then((res) => res.data);
const getMe = () => api.get('/auth/me').then((res) => res.data);

const updateProfile = (data) => api.put('/users/profile', data).then((res) => res.data);
const changePassword = (data) => api.put('/users/password', data).then((res) => res.data);
const addCategory = (data) => api.post('/users/categories', data).then((res) => res.data);
const deleteCategory = (type, name) =>
  api.delete(`/users/categories/${type}/${encodeURIComponent(name)}`).then((res) => res.data);
const setMonthlyBudgetDefault = (monthlyBudget) =>
  api.put('/users/budget', { monthlyBudget }).then((res) => res.data);

export default {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addCategory,
  deleteCategory,
  setMonthlyBudgetDefault,
};
