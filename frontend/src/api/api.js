// Description: Axios instance with base URL and request interceptor for adding auth token
// connection to backend API

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('Token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const getMyVehicles = async () => {
    const res = await api.get('/vehicles');
    return res.data;
}

export default api;