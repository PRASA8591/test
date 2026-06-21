import { db, initDefaultAdmin, verifyDB } from '../database/db.js';

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

  try {
    const user = await db.users.where('username').equals(username).first();
    
    if (!user) {
      showMessage('User not found. Use: admin / admin123');
      return;
    }

    if (user.password !== password) {
      showMessage('Incorrect password. Try again.');
      return;
    }

    localStorage.setItem('pos_auth', JSON.stringify({ 
      id: user.id,
      username: user.username, 
      role: user.role,
      timestamp: Date.now()
    }));
    
    if (rememberInput.checked) {
      localStorage.setItem('pos_remember', 'true');
    }

    showMessage('Login successful. Redirecting...', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  } catch (error) {
    console.error('Login error:', error);
    showMessage('Login failed. Check browser console for details.');
  }
}

async function init() {
  try {
    const dbOk = await verifyDB();
    if (!dbOk) {
      showMessage('Database connection failed. Please refresh the page.');
      return;
    }

    await initDefaultAdmin();

    const auth = localStorage.getItem('pos_auth');
    if (auth) {
      window.location.href = 'dashboard.html';
      return;
    }

    loginForm?.addEventListener('submit', handleLogin);
    console.log('✓ Login page ready');
  } catch (error) {
    console.error('Init error:', error);
    showMessage('Failed to initialize. Check console for details.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
