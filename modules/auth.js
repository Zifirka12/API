export const API_URL = 'https://wedev-api.sky.pro/api/v2/gleb-fokin';
export const API_USER_URL = 'https://wedev-api.sky.pro/api/user';

export let token = null;

export const setToken = (token) => {
    localStorage.setItem("token", token);
    console.log("Токен установлен:", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
};

export const login = async (login, password) => {
    const response = await fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    });

    const data = await response.json();

    if (response.status === 400) {
        throw new Error(data.error);
    }

    if (response.status === 500) {
        throw new Error("Сервер сломался");
    }

    if (data.error) {
        throw new Error(data.error);
    }

    setToken(data.user.token);
    return data;
};

export const register = async (login, password, name) => {
    const response = await fetch("https://wedev-api.sky.pro/api/user", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
            name,
        }),
    });

    const data = await response.json();

    if (response.status === 400) {
        throw new Error(data.error);
    }

    if (response.status === 500) {
        throw new Error("Сервер сломался");
    }

    if (data.error) {
        throw new Error(data.error);
    }

    setToken(data.user.token);
    return data;
};

export const checkToken = async () => {
    const token = getToken();
    if (!token) {
        return false;
    }

    try {
        const response = await fetch(`${API_URL}/comments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            removeToken();
            return false;
        }

        return true;
    } catch (error) {
        console.error("Ошибка при проверке токена:", error);
        removeToken();
        return false;
    }
};


const initAuthHandlers = () => {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const authMessage = document.getElementById('authMessage');
    const loginInput = document.getElementById('loginInput');
    const passwordInput = document.getElementById('passwordInput');

    const handleLogin = async () => {
        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!loginValue || !passwordValue) {
            authMessage.textContent = 'Пожалуйста, заполните все поля';
            authMessage.className = 'auth-message error';
            return;
        }

        try {
            authMessage.textContent = 'Вход...';
            authMessage.className = 'auth-message';
            
            await login(loginValue, passwordValue);
            
            authMessage.textContent = 'Успешный вход! Перенаправление...';
            authMessage.className = 'auth-message success';
            
            setTimeout(() => {
                window.location.href = 'coment.html';
            }, 1000);
        } catch (error) {
            authMessage.textContent = error.message;
            authMessage.className = 'auth-message error';
        }
    };

    const handleRegister = async () => {
        const loginValue = loginInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (!loginValue || !passwordValue) {
            authMessage.textContent = 'Пожалуйста, заполните все поля';
            authMessage.className = 'auth-message error';
            return;
        }

        try {
            authMessage.textContent = 'Регистрация...';
            authMessage.className = 'auth-message';
            
            await register(loginValue, passwordValue, loginValue);
            
            authMessage.textContent = 'Регистрация успешна! Перенаправление...';
            authMessage.className = 'auth-message success';
            
            setTimeout(() => {
                window.location.href = 'coment.html';
            }, 1000);
        } catch (error) {
            authMessage.textContent = error.message;
            authMessage.className = 'auth-message error';
        }
    };

    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }

    if (registerButton) {
        registerButton.addEventListener('click', handleRegister);
    }

    // Обработка нажатия Enter
    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    if (loginInput) {
        loginInput.addEventListener('keypress', handleEnterKey);
    }

    if (passwordInput) {
        passwordInput.addEventListener('keypress', handleEnterKey);
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', initAuthHandlers);