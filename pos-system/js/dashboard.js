import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

function requireAuth() {
  const auth = localStorage.getItem('pos_auth');
  if (!auth) {
    window.location.href = 'index.html';
  }
}

async function loadMetrics() {
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
}

function init() {
  requireAuth();
  renderNavbar();
  renderSidebar();
  loadMetrics();
}

init();
