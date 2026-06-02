import axios from 'axios';

// This is the phone number to your backend engine!
export const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    timeout: 10000,
});

// This automatically catches any errors and formats them nicely
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        return Promise.reject(new Error(message));
    }
);