import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const salesTotal = document.getElementById('report-sales');
const salesCount = document.getElementById('report-transactions');
const averageTotal = document.getElementById('report-average');
const reportBody = document.getElementById('report-table-body');
const refreshButton = document.getElementById('refresh-reports');

function requireAuth() {
  const auth = localStorage.getItem('pos_auth');
  if (!auth) {
    window.location.href = 'index.html';
  }
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

async function renderReports() {
  const sales = await db.sales.toArray();
  const total = sales.reduce((sum, record) => sum + parseFloat(record.total), 0);
  const average = sales.length ? total / sales.length : 0;

  salesTotal.textContent = formatCurrency(total);
  salesCount.textContent = sales.length;
  averageTotal.textContent = formatCurrency(average);

  reportBody.innerHTML = sales.map((record) => `
    <tr class="border-b border-slate-800/80">
      <td class="py-3">${new Date(record.date).toLocaleString()}</td>
      <td class="py-3">${formatCurrency(record.total)}</td>
      <td class="py-3">${record.paymentMethod}</td>
    </tr>
  `).join('');
}

function init() {
  requireAuth();
  renderNavbar();
  renderSidebar();
  refreshButton?.addEventListener('click', renderReports);
  renderReports();
}

init();
