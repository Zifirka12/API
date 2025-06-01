export const API_URL = 'https://wedev-api.sky.pro/api/v2/gleb-forkin';
export const API_USER_URL = 'https://wedev-api.sky.pro/api/user';

export let token = null;

export const setToken = (newToken) => {
    if (!newToken) {
        console.error('Попытка установить пустой токен');
        return;
    }
    token = newToken;
    localStorage.setItem('token', newToken);
    console.log('Токен установлен:', newToken); // Для отладки
};

export const getToken = () => {
    if (!token) {
        token = localStorage.getItem('token');
        console.log('Токен получен из localStorage:', token); // Для отладки
    }
    return token;
};

export const login = async (login, password) => {
    try {
        const response = await fetch(API_USER_URL + '/login', {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
            }),
        });

        const data = await response.json();
        console.log('Ответ сервера при входе:', data); // Для отладки

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error(data.error || 'Неверный логин или пароль');
            }
            if (response.status === 500) {
                throw new Error('Сервер сломался');
            }
            throw new Error(data.error || 'Произошла ошибка при входе');
        }

        if (!data.user || !data.user.token) {
            throw new Error('Неверный формат ответа от сервера');
        }

        setToken(data.user.token);
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Проверьте подключение к интернету');
        }
        throw error;
    }
};

export const register = async (login, password, name) => {
    if (!login || login.length < 3) {
        throw new Error('Логин должен быть не короче 3 символов');
    }
    if (!password || password.length < 3) {
        throw new Error('Пароль должен быть не короче 3 символов');
    }
    if (!name || name.length < 3) {
        throw new Error('Имя должно быть не короче 3 символов');
    }

    try {
        const response = await fetch(API_USER_URL, {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
                name,
            }),
        });

        const data = await response.json();
        console.log('Ответ сервера при регистрации:', data); // Для отладки

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error(data.error || 'Пользователь с таким логином уже существует');
            }
            if (response.status === 500) {
                throw new Error('Сервер сломался');
            }
            throw new Error(data.error || 'Произошла ошибка при регистрации');
        }

        if (!data.user || !data.user.token) {
            throw new Error('Неверный формат ответа от сервера');
        }

        setToken(data.user.token);
        return data;
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('Проверьте подключение к интернету');
        }
        throw error;
    }
};

export const logout = () => {
    token = null;
    localStorage.removeItem('token');
    console.log('Токен удален'); // Для отладки
};

// Функция для проверки валидности токена
export const checkToken = async () => {
    const currentToken = getToken();
    if (!currentToken) {
        console.log('Токен не найден'); // Для отладки
        return false;
    }

    try {
        const response = await fetch(API_USER_URL + '/me', {
            headers: {
                Authorization: `Bearer ${currentToken}`,
            },
        });

        if (!response.ok) {
            console.log('Токен недействителен'); // Для отладки
            return false;
        }

        const data = await response.json();
        return !!data.user;
    } catch (error) {
        console.error('Ошибка при проверке токена:', error); // Для отладки
        return false;
    }
};