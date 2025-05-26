export const escapeHTML = (text) => text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const formatCommentDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};
