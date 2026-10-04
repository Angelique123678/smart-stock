import axiosProvider from 'axios';
export const API_URL = import.meta.env.VITE_API_URL

const api = axiosProvider.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        // 'Content-Type': 'application/json',
        // 'Accept': 'application/json'
    },
    withCredentials: true
});


export default api