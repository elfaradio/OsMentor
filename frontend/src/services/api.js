import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 120000, // Increased to 120 seconds to allow heavy AI generations to finish
});

export default api;
