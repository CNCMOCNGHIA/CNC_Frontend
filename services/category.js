import api from './api.js'

export const getCategories = async (name) => {
    try {
        const url = `/categories/name?categoryName=${name}`;

        const response = await api(url);

        return await response.data;

    } catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }
};