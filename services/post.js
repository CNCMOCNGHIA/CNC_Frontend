import api from './api.js'


export const getPosts = async (pageNumber = 1, pageSize = 5, categoryName) => {
    try {
        const queryParams = new URLSearchParams();
        if (pageNumber !== null) queryParams.append("PageNumber", pageNumber);
        if (pageSize !== null) queryParams.append("PageSize", pageSize);
        if (categoryName !== null) queryParams.append("CategoryName", categoryName);
        const url = `/posts?${queryParams.toString()}`;
        const response = await api(url);

        return await response;

    } catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }
};

export const getPost = async (id) => {
    try {
        const url = `/posts/${id}`;
        const response = await api(url);
        
        return await response; // Trả về dữ liệu JSON
    } catch (error) {
        console.error('Error fetching:', error);
        throw error;
    }

}


export const createPost = async (post) => {
    try {
        const response = await api.post('/posts', post);
        return await response;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

export const updatePost = async (id, post) => {
    try {
        const response = await api.put(`/posts/${id}`, post);
        return await response;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}



export const deletePost = async (id) => {
    try {
        const response = await api.delete(`/posts/${id}`);
        return await response;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

