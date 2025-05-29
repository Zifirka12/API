import { getToken } from './auth.js';

export const renderComments = (comments) => {
  const commentsContainer = document.getElementById('commentsContainer');
  const commentForm = document.getElementById('commentForm');
  const token = getToken();

  const commentsHtml = comments
    .map((comment) => {
      return `
        <li class="comment">
          <div class="comment-header">
            <div>${comment.author.name}</div>
            <div>${new Date(comment.date).toLocaleString()}</div>
          </div>
          <div class="comment-body">
            ${comment.text}
          </div>
        </li>
      `;
    })
    .join('');

  commentsContainer.innerHTML = commentsHtml;

  if (token) {
    if (commentForm) {
      commentForm.style.display = 'block';
    }
    const existingLoginLink = document.querySelector('.login-link');
    if (existingLoginLink) {
        existingLoginLink.remove();
    }
  } else {
    if (commentForm) {
      commentForm.style.display = 'none';
    }
    const existingLoginLink = document.querySelector('.login-link');
    if (!existingLoginLink) {
      const loginLink = document.createElement('div');
      loginLink.innerHTML = `
        <div class="login-link">
          <a href="#" id="loginLink">Чтобы добавить комментарий, авторизуйтесь</a>
        </div>
      `;
      commentsContainer.after(loginLink);
    }
  }
};

export const renderLoginForm = () => {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="login-form">
      <h2>Форма входа</h2>
      <div class="form-group">
        <input type="text" id="loginInput" placeholder="Логин" />
      </div>
      <div class="form-group">
        <input type="password" id="passwordInput" placeholder="Пароль" />
      </div>
      <div class="form-group">
        <button id="loginButton">Войти</button>
      </div>
      <div class="form-group">
        <button id="registerButton">Зарегистрироваться</button>
      </div>
      <div id="loginError" class="error-message"></div>
    </div>
  `;
};
