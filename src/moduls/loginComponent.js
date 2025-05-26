import { login } from './api.js';
import { saveToken, saveUserName } from './auth.js';

export function renderLogin({ onLoginSuccess }) {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div class="login-form">
      <h2>Вход</h2>
      <input type="text" class="login-input" placeholder="Логин" />
      <input type="password" class="password-input" placeholder="Пароль" />
      <button class="login-button">Войти</button>
      <div class="login-error" style="color: #ff8080; margin-top: 10px;"></div>
    </div>
  `;

  const loginInput = container.querySelector('.login-input');
  const passwordInput = container.querySelector('.password-input');
  const loginButton = container.querySelector('.login-button');
  const errorDiv = container.querySelector('.login-error');

  loginButton.addEventListener('click', () => {
    const loginValue = loginInput.value.trim();
    const passwordValue = passwordInput.value.trim();
    errorDiv.textContent = '';
    if (!loginValue || !passwordValue) {
      errorDiv.textContent = 'Введите логин и пароль';
      return;
    }
    loginButton.disabled = true;
    login({ login: loginValue, password: passwordValue })
      .then((data) => {
        saveToken(data.user.token);
        saveUserName(data.user.name);
        onLoginSuccess();
      })
      .catch((error) => {
        errorDiv.textContent = error.message;
      })
      .finally(() => {
        loginButton.disabled = false;
      });
  });
} 