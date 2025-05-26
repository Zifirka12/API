const API_URL = "https://wedev-api.sky.pro/api";

export const login = async (login, password) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      login,
      password,
    }),
  });

  if (response.status === 400) {
    throw new Error("Неверный логин или пароль");
  }

  const data = await response.json();
  return data.user;
};

export const register = async (login, name, password) => {
  const response = await fetch(`${API_URL}/user`, {
    method: "POST",
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  });

  if (response.status === 400) {
    throw new Error("Пользователь с таким логином уже существует");
  }

  const data = await response.json();
  return data.user;
}; 