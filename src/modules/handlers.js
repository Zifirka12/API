import { domElements } from './constants.js';
import { escapeHTML } from './utils.js';
import { addComment, getComments } from './api.js';
import { renderCommentList } from './render.js';

let commentData = [];

export const initializeHandlers = () => {
  domElements.commentsList.addEventListener('click', handleCommentClick);
  domElements.addForm.addEventListener('submit', handleSubmit);
};

const handleCommentClick = (event) => {
  if (event.target.classList.contains('like-button')) {
    const index = event.target.dataset.index;
    commentData[index].isLiked = !commentData[index].isLiked;
    commentData[index].likes += commentData[index].isLiked ? 1 : -1;
    renderCommentList(commentData);
  } else {
    const commentElement = event.target.closest('.comment');
    if (commentElement) {
      const index = commentElement.dataset.index;
      domElements.commentInput.value = `> ${commentData[index].name}: ${escapeHTML(commentData[index].text)}\n`;
    }
  }
};

const toggleLoader = (show) => {
  domElements.loader.classList.toggle('loader-active', show);
};

const toggleAddFormLoader = (show) => {
  domElements.addForm.style.display = show ? 'none' : 'flex';
  domElements.addFormLoader.classList.toggle('loader-active', show);
  domElements.submitButton.disabled = show;
};

const handleSubmit = (event) => {
  event.preventDefault();
  const name = domElements.nameInput.value.trim();
  const text = domElements.commentInput.value.trim();

  if (name.length < 3 || text.length < 3) {
    alert('Имя и комментарий должны быть не короче 3 символов');
    return;
  }

  toggleAddFormLoader(true);

  addComment(name, text)
    .then(() => getComments())
    .then((newComments) => {
      commentData = newComments;
      renderCommentList(commentData);
      domElements.nameInput.value = '';
      domElements.commentInput.value = '';
    })
    .catch((error) => {
      console.error('Error:', error);
      if (!window.navigator.onLine) {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
      } else {
        alert(error.message);
      }
    })
    .finally(() => {
      toggleAddFormLoader(false);
    });
};

export const initComments = () => {
  toggleLoader(true);
  return getComments()
    .then((newComments) => {
      commentData = newComments;
      renderCommentList(commentData);
    })
    .catch((error) => {
      console.error('Error:', error);
      if (!window.navigator.onLine) {
        alert('Кажется, у вас сломался интернет, попробуйте позже');
      } else {
        alert(error.message);
      }
    })
    .finally(() => {
      toggleLoader(false);
    });
};
