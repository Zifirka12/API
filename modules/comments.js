import { API_URL, getToken } from './auth.js';

export let userComments = [];

export const updateComments = (newComments) => {
    userComments = newComments;
};

export const getComments = async () => {
    try {
        const response = await fetch(API_URL + 'comments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            if (response.status === 500) {
                throw new Error('Сервер сломался');
            }
            throw new Error('Ошибка при загрузке комментариев');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Проверьте подключение к интернету');
        }
        throw error;
    }
};

export const addComment = async (text) => {
    try {
        const token = getToken();
        console.log('Токен при добавлении комментария:', token); // Для отладки

        if (!token) {
            throw new Error('Необходимо авторизоваться');
        }

        if (!text || text.trim().length < 3) {
            throw new Error('Комментарий должен быть не короче 3 символов');
        }

        const response = await fetch(API_URL + 'comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                text: text.trim()
            })
        });

        const data = await response.json();
        console.log('Ответ сервера при добавлении комментария:', data); // Для отладки

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error(data.error || 'Комментарий должен быть не короче 3 символов');
            }
            if (response.status === 401) {
                throw new Error('Необходимо авторизоваться');
            }
            if (response.status === 500) {
                throw new Error('Сервер сломался');
            }
            throw new Error(data.error || 'Ошибка при добавлении комментария');
        }

        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Проверьте подключение к интернету');
        }
        throw error;
    }
};