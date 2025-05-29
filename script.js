import { login, register, setToken, getToken } from './modules/auth.js';
import { getComments, addComment } from './modules/comments.js';
import { renderComments, renderLoginForm } from './modules/render.js';

let comments = [];
let formData = {
  text: '',
};

// Загрузка комментариев
const fetchComments = async () => {
  try {
    const response = await getComments();
    comments = response.comments;
    renderComments(comments);
  } catch (error) {
    alert(error.message);
    // При ошибке загрузки комментариев, рендерим пустой список и показываем ссылку авторизации
    renderComments([]);
  }
};

// Обработчик отправки комментария
const handleCommentSubmit = async () => {
  const textInput = document.getElementById('textInput');
  const submitButton = document.getElementById('submitComment');
  const responseMessage = document.getElementById('responseMessage');

  try {
    submitButton.disabled = true;
    responseMessage.textContent = 'Комментарий добавляется...';

    const response = await addComment(textInput.value);
    comments = response.comments;
    renderComments(comments);
    
    textInput.value = '';
    formData.text = '';
    responseMessage.textContent = 'Комментарий добавлен';
  } catch (error) {
    responseMessage.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
};

// Обработчик входа
const handleLogin = async () => {
  const loginInput = document.getElementById('loginInput');
  const passwordInput = document.getElementById('passwordInput');
  const errorElement = document.getElementById('loginError');
  
  try {
    const response = await login(loginInput.value, passwordInput.value);
    setToken(response.user.token);
    // После входа, перерендерить комментарии и форму
    await fetchComments();
  } catch (error) {
    errorElement.textContent = error.message;
  }
};

// Обработчик регистрации
const handleRegister = async () => {
   const loginInput = document.getElementById('loginInput');
  const passwordInput = document.getElementById('passwordInput');
  const errorElement = document.getElementById('loginError');
  try {
    // В задании указано, что имя пользователя получается с сервера после авторизации.
    // При регистрации, пока используем логин как имя.
    const response = await register(loginInput.value, passwordInput.value, loginInput.value);
    setToken(response.user.token);
     // После регистрации, перерендерить комментарии и форму
    await fetchComments();
  } catch (error) {
     errorElement.textContent = error.message;
  }
};

// Аттачим слушатели событий для формы логина
const attachLoginFormListeners = () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }
    if (registerButton) {
        registerButton.addEventListener('click', handleRegister);
    }
};

// Инициализация приложения
const initApp = async () => {
  await fetchComments(); // Всегда пытаемся загрузить комментарии сначала

  const token = getToken();
  if (!token) {
    // Если токена нет, добавляем слушатель клика на ссылку авторизации
    document.addEventListener('click', (event) => {
      if (event.target.id === 'loginLink') {
        event.preventDefault();
        renderLoginForm();
        attachLoginFormListeners(); // Аттачим слушатели после рендеринга формы
      }
    });
  } else {
      // Если токен есть, аттачим слушатель для отправки комментария
      const submitButton = document.getElementById('submitComment');
      if (submitButton) {
          submitButton.addEventListener('click', handleCommentSubmit);
      }
  }

   // Сохранение данных формы при вводе (для формы добавления комментария)
  const textInput = document.getElementById('textInput');
  if (textInput) {
    textInput.addEventListener('input', (event) => {
      formData.text = event.target.value;
    });
  }

};

// Запускаем приложение при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});