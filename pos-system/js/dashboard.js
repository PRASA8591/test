import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

function requireAuth() {
  const auth = localStorage.getItem('pos_auth');
  if (!auth) {
    window.location.href = 'index.html';
    return null;
  }
  try {
    return JSON.parse(auth);
  } catch (e) {
    localStorage.removeItem('pos_auth');
    window.location.href = 'index.html';
    return null;
  }
}

async function loadMetrics() {
  try {
    const [products, customers, sales, stockLogs] = await Promise.all([
      db.products.count(),
      db.customers.count(),
      db.sales.count(),
      db.stockLogs.count()
    ]);

    document.getElementById('total-products').textContent = products;
    document.getElementById('total-customers').textContent = customers;
    document.getElementById('total-sales').textContent = sales;
    document.getElementById('total-stock-logs').textContent = stockLogs;
  } catch (error) {
    console.error('Failed to load metrics:', error);
  }
}

function init() {
  const user = requireAuth();
  if (!user) return;

  renderNavbar(user);
  renderSidebar();
  loadMetrics();
  console.log('✓ Dashboard loaded for', user.username);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
