import axios from 'axios';

const API_URL = 'http://localhost:8989/api/stock'; // change to your backend base URL

export const addStock = (data) => axios.post(`${API_URL}/add-stock`, data);

export const getStocks = () => axios.get(`${API_URL}/get-stock`);

export const updateStock = (id, data) => axios.put(`${API_URL}/update-stock/${id}`, data);

export const deleteStock = (id) => axios.delete(`${API_URL}/delete-stock/${id}`);
