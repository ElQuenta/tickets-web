import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL?.trim() || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
