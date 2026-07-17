import api from './api';

const getExpenses = (params = {}) => api.get('/expenses', { params }).then((res) => res.data);
const getExpenseById = (id) => api.get(`/expenses/${id}`).then((res) => res.data);
const createExpense = (data) => api.post('/expenses', data).then((res) => res.data);
const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then((res) => res.data);
const deleteExpense = (id) => api.delete(`/expenses/${id}`).then((res) => res.data);

export default { getExpenses, getExpenseById, createExpense, updateExpense, deleteExpense };
