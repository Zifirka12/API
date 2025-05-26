export function saveToken(token) {
  localStorage.setItem('token', token);
}
export function getToken() {
  return localStorage.getItem('token');
}
export function saveUserName(name) {
  localStorage.setItem('userName', name);
}
export function getUserName() {
  return localStorage.getItem('userName');
}
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userName');
} 