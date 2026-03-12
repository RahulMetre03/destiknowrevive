// services/socialApiService.js
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
});

const request = async (endpoint, options = {}) => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'Content-Type': 'application/json', ...getAuthHeaders(), ...options.headers },
            ...options,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

const requestForm = async (endpoint, formData, method = 'POST') => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: { ...getAuthHeaders() }, // no Content-Type — browser sets multipart boundary
            body: formData,
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
};

// ---- Posts ----
export const createPost = (formData) => requestForm('/posts', formData);
export const getPost = (id) => request(`/posts/${id}`);
export const deletePost = (id) => request(`/posts/${id}`, { method: 'DELETE' });

// ---- Feed ----
export const getFeed = (cursor, limit = 12, category = '') =>
    request(`/feed?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}${category ? `&category=${category}` : ''}`);

// ---- Follow ----
export const followUser = (userId) => request(`/follow/${userId}`, { method: 'POST' });
export const unfollowUser = (userId) => request(`/follow/${userId}`, { method: 'DELETE' });
export const getFollowStatus = (userId) => request(`/follow/${userId}/status`);
export const getFollowers = (userId, cursor) =>
    request(`/follow/${userId}/followers${cursor ? `?cursor=${cursor}` : ''}`);
export const getFollowing = (userId, cursor) =>
    request(`/follow/${userId}/following${cursor ? `?cursor=${cursor}` : ''}`);

// ---- Comments ----
export const addComment = (postId, text) =>
    request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) });
export const getComments = (postId, cursor) =>
    request(`/posts/${postId}/comments${cursor ? `?cursor=${cursor}` : ''}`);
export const deleteComment = (postId, commentId) =>
    request(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });

// ---- Likes ----
export const likePost = (postId) => request(`/posts/${postId}/like`, { method: 'POST' });
export const unlikePost = (postId) => request(`/posts/${postId}/like`, { method: 'DELETE' });

// ---- User / Profile ----
export const getProfile = (userId) => request(`/social/users/${userId}`);
export const getMyProfile = () => request('/social/users/me/profile');
export const updateProfile = (formData) => requestForm('/social/users/me/profile', formData, 'PUT');
export const searchUsers = (q) => request(`/social/users/search?q=${encodeURIComponent(q)}`);
export const getUserPosts = (userId, cursor, limit = 12) =>
    request(`/social/users/${userId}/posts?limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`);
