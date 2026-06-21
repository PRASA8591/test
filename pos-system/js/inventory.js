import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const form = document.getElementById('stock-form');
const barcodeInput = document.getElementById('stock-barcode');
const typeInput = document.getElementById('stock-type');
const qtyInput = document.getElementById('stock-qty');
const tableBody = document.getElementById('stock-log-body');
const messageBox = document.getElementById('stock-message');
const refreshButton = document.getElementById('refresh-inventory');

function requireAuth() {
  const auth = localStorage.getItem('pos_auth');
  if (!auth) {
    window.location.href = 'index.html';
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

async function renderStockLogs() {
  const logs = await db.stockLogs.orderBy('date').reverse().toArray();
  tableBody.innerHTML = logs.map((log) => `
    <tr class="border-b border-slate-800/80">
      <td class="py-3">${new Date(log.date).toLocaleString()}</td>
      <td class="py-3">${log.productId}</td>
      <td class="py-3">${log.type === 'in' ? 'Stock In' : 'Stock Out'}</td>
      <td class="py-3">${log.qty}</td>
    </tr>
  `).join('');
}

async function handleStockUpdate(event) {
  event.preventDefault();
  hideMessage();

  const barcode = barcodeInput.value.trim();
  const type = typeInput.value;
  const qty = Number(qtyInput.value);

  if (!barcode || qty <= 0) {
    showMessage('Please enter a barcode and a valid quantity.');
    return;
  }

  const product = await db.products.where('barcode').equals(barcode).first();
  if (!product) {
    showMessage('Product not found. Add the item in Products first.');
    return;
  }

  const updatedStock = type === 'in' ? product.stock + qty : product.stock - qty;
  if (updatedStock < 0) {
    showMessage('Stock cannot go below zero.');
    return;
  }

  await db.products.update(product.id, { stock: updatedStock });
  await db.stockLogs.add({ productId: product.id, type, qty, date: new Date().toISOString() });

  showMessage('Inventory updated successfully.', 'success');
  form.reset();
  renderStockLogs();
}

function init() {
  requireAuth();
  renderNavbar();
  renderSidebar();
  form?.addEventListener('submit', handleStockUpdate);
  refreshButton?.addEventListener('click', renderStockLogs);
  renderStockLogs();
}

init();
