import axios from 'axios';

const backendBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';

const api = axios.create({
  baseURL: backendBase ? `${backendBase.replace(/\/+$/, '')}/api/v1` : '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization header if token is in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kareem_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== PUBLIC APIS ====================
export const getPublicContent = () => api.get('/public/content');
export const sayAameen = (duaId) => api.post(`/public/duas/${duaId}/aameen`);
export const getPublicPhotos = () => api.get('/public/photos');
export const getPublicDuas = () => api.get('/public/duas');
export const getPublicAudio = () => api.get('/public/audio');
export const getPublicVideos = () => api.get('/public/videos');

// ==================== AUTH APIS ====================
export const loginAdmin = (username, password) => api.post('/auth/login', { username, password });
export const logoutAdmin = () => api.post('/auth/logout');
export const getSession = () => api.get('/auth/session');
export const changePassword = (currentPassword, newPassword) =>
  api.post('/auth/change-password', { currentPassword, newPassword });
export const changeUsername = (newUsername) =>
  api.post('/auth/change-username', { newUsername });

// ==================== ADMIN SETTINGS & STATS ====================
export const getDashboardStats = () => api.get('/admin/dashboard');
export const getSettings = () => api.get('/admin/settings');
export const updateSettings = (data) => api.patch('/admin/settings', data);

// ==================== LETTER ====================
export const getLetter = () => api.get('/admin/letter');
export const updateLetter = (data) => api.patch('/admin/letter', data);

// ==================== PHOTOS ====================
export const getPhotos = (params) => api.get('/admin/photos', { params });
export const uploadPhotos = (formData, onUploadProgress) =>
  api.post('/admin/photos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress
  });
export const updatePhoto = (id, data) => api.patch(`/admin/photos/${id}`, data);
export const replacePhoto = (id, formData) =>
  api.post(`/admin/photos/${id}/replace`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
export const reorderPhotos = (orderedIds) => api.post('/admin/photos/reorder', { orderedIds });
export const deletePhoto = (id) => api.delete(`/admin/photos/${id}`);

// ==================== DUAS ====================
export const getDuas = () => api.get('/admin/duas');
export const createDua = (data) => api.post('/admin/duas', data);
export const updateDua = (id, data) => api.patch(`/admin/duas/${id}`, data);
export const reorderDuas = (orderedIds) => api.post('/admin/duas/reorder', { orderedIds });
export const deleteDua = (id) => api.delete(`/admin/duas/${id}`);

// ==================== MEMORIES ====================
export const getMemories = () => api.get('/admin/memories');
export const createMemory = (data) => api.post('/admin/memories', data);
export const updateMemory = (id, data) => api.patch(`/admin/memories/${id}`, data);
export const reorderMemories = (orderedIds) => api.post('/admin/memories/reorder', { orderedIds });
export const deleteMemory = (id) => api.delete(`/admin/memories/${id}`);

// ==================== AUDIO ====================
export const getAudioTracks = () => api.get('/admin/audio');
export const uploadAudio = (formData, onUploadProgress) =>
  api.post('/admin/audio/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0, // No timeout for mobile uploads
    onUploadProgress
  });
export const setActiveAudio = (id) => api.patch(`/admin/audio/${id}/activate`);
export const updateAudio = (id, data) => api.patch(`/admin/audio/${id}`, data);
export const deleteAudio = (id) => api.delete(`/admin/audio/${id}`);

// ==================== VIDEOS ====================
export const getVideos = () => api.get('/admin/videos');
export const createVideo = (formData, onUploadProgress) =>
  api.post('/admin/videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0, // No timeout for large video uploads from mobile
    onUploadProgress
  });
export const updateVideo = (id, data) => api.patch(`/admin/videos/${id}`, data);
export const deleteVideo = (id) => api.delete(`/admin/videos/${id}`);

export default api;
