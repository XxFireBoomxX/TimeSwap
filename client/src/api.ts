import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // Set to true if you need to send cookies with requests
});

export default api;