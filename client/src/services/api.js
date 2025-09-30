import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function createApiClient(token) {
    const instance = axios.create({
        baseURL: API,
        headers: { Authorization: token ? `Bearer ${token}` : '' }
    });

    instance.interceptors.response.use(
        res => res,
        err => {
            if (err.response && err.response.status === 401) {
                // let caller handle logout
            }
            return Promise.reject(err);
        }
    );

    return instance;
}
