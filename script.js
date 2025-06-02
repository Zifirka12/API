import { addComment } from "./modules/comments.js";
import { login, register, getToken, checkToken } from "./modules/auth.js";
import { getDataUserComments } from "./modules/functions.js";
import { renderCommentsFunction } from "./modules/render.js";
import { renderAuthButton, renderAuthForm } from "./modules/renderAuth.js";

let currentPage = 'comments';

const renderPage = (page) => {
    const container = document.querySelector('.container');
    
    if (!container) {
        console.error('Container element not found!');
        return;
    }

    if (page === 'auth') {
        container.innerHTML = renderAuthForm();
        initAuthHandlers();
    } else {
        container.innerHTML = `
            <div id="authContainer"></div>
            <ul class="comments" id="commentsContainer"></ul>
            <div id="commentForm"></div>
        `;
        renderMainPage();
    }
};

const renderMainPage = async () => {
    try {
        const isAuthenticated = await checkToken();
        console.log('Auth status:', isAuthenticated);

        // Рендерим кнопку входа или форму комментариев
        const authContainer = document.getElementById('authContainer');
        if (authContainer) {
            authContainer.innerHTML = isAuthenticated ? '' : renderAuthButton();
        }

        // Рендерим форму комментариев
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            if (isAuthenticated) {
                commentForm.innerHTML = `
                    <div class="add-comment">
                        <textarea
                            class="add-comment-text"
                            id="textInput"
                            placeholder="Введите ваш комментарий"
                            rows="4"
                        ></textarea>
                        <div class="add-comment-butt">
                            <button class="add-comment-button" id="submitComment">
                                Отправить
                            </button>
                        </div>
                        <div id="responseMessage" class="response-message"></div>
                    </div>
                `;
                commentForm.style.display = 'block';
                initMainPageHandlers();
            } else {
                commentForm.style.display = 'none';
            }
        }

        // Загружаем и отображаем комментарии
        await getDataUserComments();
    } catch (error) {
        console.error('Error in renderMainPage:', error);
    }
};

const initAuthHandlers = () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const authMessage = document.getElementById('authMessage');

    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            const loginInput = document.getElementById('loginInput');
            const passwordInput = document.getElementById('passwordInput');
            
            try {
                authMessage.textContent = 'Вход...';
                authMessage.style.color = 'blue';
                
                await login(loginInput.value.trim(), passwordInput.value.trim());
                
                currentPage = 'comments';
                renderPage('comments');
            } catch (error) {
                authMessage.textContent = error.message;
                authMessage.style.color = 'red';
            }
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', async () => {
            const loginInput = document.getElementById('loginInput');
            const passwordInput = document.getElementById('passwordInput');
            
            try {
                authMessage.textContent = 'Регистрация...';
                authMessage.style.color = 'blue';
                
                await register(loginInput.value.trim(), passwordInput.value.trim(), loginInput.value.trim());
                
                currentPage = 'comments';
                renderPage('comments');
            } catch (error) {
                authMessage.textContent = error.message;
                authMessage.style.color = 'red';
            }
        });
    }
};

const initMainPageHandlers = () => {
    const submitButton = document.getElementById('submitComment');
    if (submitButton) {
        submitButton.addEventListener('click', async () => {
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
                
                await getDataUserComments();
            } catch (error) {
                responseMessage.textContent = error.message;
                responseMessage.style.color = 'red';
            }
        });
    }
};

// Initialize application
const init = async () => {
    try {
        renderPage('comments');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
};

// Start the application
init();