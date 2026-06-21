import { db, initDefaultAdmin } from '../database/db.js';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const messageBox = document.getElementById('login-message');

function showMessage(message, type = 'error') {
  messageBox.textContent = message;
  messageBox.className = `rounded-2xl p-4 text-sm font-medium ${type === 'success' ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`;
  messageBox.classList.remove('hidden');
}

function hideMessage() {
  messageBox.classList.add('hidden');
}

async function handleLogin(event) {
  event.preventDefault();
  hideMessage();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showMessage('Please enter both username and password.');
    return;
  }

  const user = await db.users.where('username').equals(username).first();
  if (!user) {
    showMessage('User not found. Please use the default admin credentials.');
    return;
  }

  if (user.password !== password) {
    showMessage('Incorrect credentials.');
    return;
  }

  localStorage.setItem('pos_auth', JSON.stringify({ username: user.username, role: user.role }));
  if (rememberInput.checked) {
    localStorage.setItem('pos_remember', 'true');
  }

  showMessage('Login successful. Redirecting...', 'success');
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 600);
}

async function init() {
  await initDefaultAdmin();

  const auth = localStorage.getItem('pos_auth');
  if (auth) {
    window.location.href = 'dashboard.html';
    return;
  }

  loginForm?.addEventListener('submit', handleLogin);
}

init();
