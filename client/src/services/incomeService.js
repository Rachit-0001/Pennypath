import api from './api';

const getIncomes = (params = {}) => api.get('/income', { params }).then((res) => res.data);
const getIncomeById = (id) => api.get(`/income/${id}`).then((res) => res.data);
const createIncome = (data) => api.post('/income', data).then((res) => res.data);
const updateIncome = (id, data) => api.put(`/income/${id}`, data).then((res) => res.data);
const deleteIncome = (id) => api.delete(`/income/${id}`).then((res) => res.data);

export default { getIncomes, getIncomeById, createIncome, updateIncome, deleteIncome };
