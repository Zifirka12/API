export const renderAuthForm = () => {
    return `
        <div class="auth-container">
            <div class="auth-message">
                Чтобы добавить комментарий, <a href="#" id="showAuthButton">авторизуйтесь</a>
            </div>
            <div id="authForm" class="auth-form" style="display: none;">
                <h3>Авторизация</h3>
                <input type="text" id="loginInput" class="input" placeholder="Логин"/>
                <input type="password" id="passwordInput" class="input" placeholder="Пароль"/>
                <button id="loginButton" class="add-comment-button">Войти</button>
                <button id="registerButton" class="add-comment-button">Зарегистрироваться</button>
                <div id="authMessage" class="response-message"></div>
            </div>
        </div>
    `;
};