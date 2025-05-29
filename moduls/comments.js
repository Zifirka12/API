// modules/comments.js
import { API_URL, getToken } from './auth.js';

export let userComments = [];
export const updateComments = (newComments) => {
  userComments = newComments;
};

export const getComments = async () => {
  try {
    const response = await fetch(API_URL + 'comments', {
      method: 'GET',
    });

    if (response.status === 500) {
      throw new Error('Сервер сломался');
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
    if (!token) {
      throw new Error('Необходимо авторизоваться');
    }

    const response = await fetch(API_URL + 'comments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (response.status === 400) {
      throw new Error('Имя и комментарий должны быть не короче 3 символов');
    }

    if (response.status === 500) {
      throw new Error('Сервер сломался');
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
