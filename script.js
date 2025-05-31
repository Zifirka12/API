import {addComment} from "./modules/comments.js";
import {login, register, getToken} from "./modules/auth.js";
import {getDataUserComments} from "./modules/functions.js";
import {renderCommentsFunction} from "./modules/render.js";

// Получаем элементы формы авторизации
const showAuthButton = document.getElementById('showAuthButton');
const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const authMessage = document.getElementById('authMessage');
const commentForm = document.getElementById('commentForm');
const authForm = document.getElementById('authForm');

// Обработчик показа формы авторизации
showAuthButton.addEventListener('click', () => {
    authForm.style.display = authForm.style.display === 'none' ? 'block' : 'none';
});

// Функция для проверки авторизации
const checkAuth = () => {
    const token = getToken();
    if (token) {
        showAuthButton.style.display = 'none';
        authForm.style.display = 'none';
        commentForm.style.display = 'block';
    } else {
        showAuthButton.style.display = 'block';
        authForm.style.display = 'none';
        commentForm.style.display = 'none';
    }
};

// Обработчик входа
loginButton.addEventListener('click', async () => {
    try {
        const data = await login(loginInput.value, passwordInput.value);
        authMessage.textContent = 'Вход выполнен успешно';
        authMessage.style.color = 'green';
        checkAuth();
    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.style.color = 'red';
    }
});

// Обработчик регистрации
registerButton.addEventListener('click', async () => {
    try {
        const data = await register(loginInput.value, passwordInput.value, loginInput.value);
        authMessage.textContent = 'Регистрация прошла успешно';
        authMessage.style.color = 'green';
        checkAuth();
    } catch (error) {
        authMessage.textContent = error.message;
        authMessage.style.color = 'red';
    }
});

// Обработчик отправки комментария
document.getElementById('submitComment').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();
    const responseMessage = document.getElementById('responseMessage');

    if (!text) {
        responseMessage.textContent = 'Пожалуйста, введите комментарий';
        responseMessage.style.color = 'red';
        return;
    }

    try {
        responseMessage.textContent = 'Отправка комментария...';
        responseMessage.style.color = 'blue';
        
        await addComment(text);
        
        textInput.value = '';
        responseMessage.textContent = 'Комментарий добавлен';
        responseMessage.style.color = 'green';
        
        // Обновляем список комментариев
        await getDataUserComments();
    } catch (error) {
        responseMessage.textContent = error.message;
        responseMessage.style.color = 'red';
        console.error('Ошибка при отправке комментария:', error);
    }
});

// Основная функция
async function main() {
    // Загружаем комментарии
    try {
        await getDataUserComments();
        renderCommentsFunction();
    } catch (error) {
        console.error('Ошибка при загрузке комментариев:', error.message);
    }

    // Проверяем авторизацию
    checkAuth();
}

// Запускаем основную функцию
main();
