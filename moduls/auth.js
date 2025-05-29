export const API_URL = 'https://wedev-api.sky.pro/api/v2/';
export const API_USER_URL = 'https://wedev-api.sky.pro/api/user';

export let token = null;

export const setToken = (newToken) => {
  token = newToken;
};

export const getToken = () => {
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

    if (response.status === 400) {
      throw new Error('Неверный логин или пароль');
    }

    if (response.status === 500) {
      throw new Error('Сервер сломался');
    }

    const data = await response.json();
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
  try {
    const response = await fetch(API_USER_URL, {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
        name,
      }),
    });

    if (response.status === 400) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    if (response.status === 500) {
      throw new Error('Сервер сломался');
    }

    const data = await response.json();
    setToken(data.user.token);
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Проверьте подключение к интернету');
    }
    throw error;
  }
}; 