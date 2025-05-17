import { COMMENTS_API_URL } from './constants.js';
import { formatCommentDate } from './utils.js';

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

export const addComment = (name, text) => {
  return fetch(COMMENTS_API_URL, {
    method: 'POST',
    body: JSON.stringify({
      name,
      text,
      forceError: true,
    }),
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
