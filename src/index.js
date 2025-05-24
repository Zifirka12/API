import { getToken, getUserName, logout } from './modules/auth.js';
import { renderLogin } from './modules/loginComponent.js';
import { getComments, addComment } from './modules/api.js';
import { renderCommentList } from './modules/render.js';

const container = document.querySelector('.container');

function renderApp() {
  getComments().then((comments) => {
    renderCommentList(comments);
    if (!getToken()) {
      renderLoginLink();
    } else {
      renderAddForm();
    }
  });
}

function renderLoginLink() {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = 'Чтобы добавить комментарий, авторизуйтесь';
  link.style.display = 'block';
  link.style.margin = '30px auto';
  link.style.textAlign = 'center';
  link.addEventListener('click', (e) => {
    e.preventDefault();
    renderLogin({ onLoginSuccess: renderApp });
  });
  container.appendChild(link);
}

function renderAddForm() {
  const formHtml = `
    <form class="add-form">
      <label>
        <input type="text" class="add-form-name" value="${getUserName()}" readonly />
      </label>
      <textarea class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
      <div class="add-form-row">
        <button class="add-form-button" type="submit">Написать</button>
        <div class="add-form-loader">
          <div class="loader-text">Комментарий добавляется...</div>
        </div>
      </div>
      <button type="button" class="logout-button" style="margin-top:10px;">Выйти</button>
    </form>
  `;
  container.insertAdjacentHTML('beforeend', formHtml);
  const form = container.querySelector('.add-form');
  const textarea = form.querySelector('.add-form-text');
  const button = form.querySelector('.add-form-button');
  const loader = form.querySelector('.add-form-loader');
  const logoutBtn = form.querySelector('.logout-button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (text.length < 3) {
      alert('Комментарий должен быть не короче 3 символов');
      return;
    }
    button.disabled = true;
    loader.classList.add('loader-active');
    addComment(text)
      .then(() => {
        textarea.value = '';
        renderApp();
      })
      .catch((error) => {
        alert(error.message);
      })
      .finally(() => {
        button.disabled = false;
        loader.classList.remove('loader-active');
      });
  });
  logoutBtn.addEventListener('click', () => {
    logout();
    renderApp();
  });
}

renderApp();
