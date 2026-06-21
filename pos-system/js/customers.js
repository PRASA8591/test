import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const form = document.getElementById('customer-form');
const nameInput = document.getElementById('customer-name');
const mobileInput = document.getElementById('customer-mobile');
const tableBody = document.getElementById('customer-table-body');
const messageBox = document.getElementById('customer-message');
const refreshButton = document.getElementById('refresh-customers');

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

function showMessage(message, type = 'error') {
  messageBox.textContent = message;
  messageBox.className = `rounded-2xl p-4 text-sm font-medium ${type === 'success' ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`;
  messageBox.classList.remove('hidden');
}

function hideMessage() {
  messageBox.classList.add('hidden');
}

async function renderCustomers() {
  const customers = await db.customers.toArray();
  tableBody.innerHTML = customers.map((customer) => `
    <tr class="border-b border-slate-800/80">
      <td class="py-3">${customer.name}</td>
      <td class="py-3">${customer.mobile}</td>
      <td class="py-3 text-slate-400">-</td>
    </tr>
  `).join('');
}

async function handleSave(event) {
  event.preventDefault();
  hideMessage();

  const name = nameInput.value.trim();
  const mobile = mobileInput.value.trim();

  if (!name || !mobile) {
    showMessage('Please enter both customer name and mobile number.');
    return;
  }

  await db.customers.add({ name, mobile });
  showMessage('Customer added successfully.', 'success');
  form.reset();
  renderCustomers();
}

function init() {
  const user = requireAuth();
  if (!user) return;
  renderNavbar(user);
  renderSidebar();
  form?.addEventListener('submit', handleSave);
  refreshButton?.addEventListener('click', renderCustomers);
  renderCustomers();
  console.log('✓ Customers page loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
