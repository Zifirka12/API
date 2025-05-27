export const COMMENTS_API_URL = "https://wedev-api.sky.pro/api/v2/YOUR_USER_ID/comments";
export const API_URL = "https://wedev-api.sky.pro/api";

export const domElements = {
  commentsList: document.querySelector('.comments'),
  commentInput: document.querySelector('.add-form-text'),
  submitButton: document.querySelector('.add-form-button'),
  addForm: document.querySelector('.add-form'),
  loader: document.querySelector('.loader'),
  addFormLoader: document.querySelector('.add-form-loader'),
  
  // Элементы для авторизации
  loginForm: document.querySelector('.login-form'),
  loginInput: document.querySelector('.login-form-login'),
  passwordInput: document.querySelector('.login-form-password'),
  loginButton: document.querySelector('.login-form-button'),
  registerButton: document.querySelector('.login-form-register-button'),
  logoutButton: document.querySelector('.logout-button'),
  loginFormContainer: document.querySelector('.login-form-container'),
  addFormContainer: document.querySelector('.add-form-container'),
}; 