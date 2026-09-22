import axios from 'axios';

// Captura a URL do Render em produção, ou localhost em desenvolvimento
const API_URL = import.meta.env.VITE_API_URL || 'https://ai-generated-creation.onrender.com';

export const api = axios.create({
  baseURL: API_URL,
});

// Helper opcional para setar o token manualmente se preferir
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};