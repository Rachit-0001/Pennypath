import api from './api';

const getBudget = (month, year) =>
  api.get('/budget', { params: { month, year } }).then((res) => res.data);
const setBudget = (data) => api.post('/budget', data).then((res) => res.data);
const deleteBudget = (id) => api.delete(`/budget/${id}`).then((res) => res.data);
const getBudgetHistory = () => api.get('/budget/history').then((res) => res.data);

export default { getBudget, setBudget, deleteBudget, getBudgetHistory };
