import api from './api.js'

export const login = async (email, password) => {
    try {
        const response = await api.get(`/aths`, {
            params: { email, password }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
    }
};
