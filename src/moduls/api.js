import { COMMENTS_API_URL } from './constants.js';
import { formatCommentDate } from './utils.js';
import { getToken } from './auth.js';

export const getComments = () => {
  return fetch(COMMENTS_API_URL)
    .then((response) => {
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error('Сервер сломался, попробуй позже');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data.comments.map((comment) => ({
        name: comment.author.name,
        date: formatCommentDate(comment.date),
        text: comment.text,
        likes: 0,
        isLiked: false,
      }));
    });
};

export const addComment = (text) => {
  return fetch(COMMENTS_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ text }),
  }).then((response) => {
    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error('Сервер сломался, попробуй позже');
      }
      return response.json().then((error) => {
        throw new Error(error.error || 'Некорректные данные');
      });
    }
    return response.json();
  });
};

export const login = ({ login, password }) => {
  return fetch('https://wedev-api.sky.pro/api/user/login', {
    method: 'POST',
    body: JSON.stringify({ login, password }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(error.error || 'Неверные данные');
      });
    }
    return response.json();
  });
};
