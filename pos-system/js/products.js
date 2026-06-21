import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const form = document.getElementById('product-form');
const barcodeInput = document.getElementById('product-barcode');
const nameInput = document.getElementById('product-name');
const categoryInput = document.getElementById('product-category');
const stockInput = document.getElementById('product-stock');
const priceInput = document.getElementById('product-price');
const tableBody = document.getElementById('product-table-body');
const messageBox = document.getElementById('product-message');

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

async function renderProducts() {
  const products = await db.products.toArray();
  tableBody.innerHTML = products.map((product) => `
    <tr class="border-b border-slate-800/80">
      <td class="py-3">${product.barcode}</td>
      <td class="py-3">${product.name}</td>
      <td class="py-3">${product.category}</td>
      <td class="py-3">${product.stock}</td>
      <td class="py-3">$${Number(product.price).toFixed(2)}</td>
    </tr>
  `).join('');
}

async function handleSave(event) {
  event.preventDefault();
  hideMessage();

  const barcode = barcodeInput.value.trim();
  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();
  const stock = Number(stockInput.value);
  const price = Number(priceInput.value);

  if (!barcode || !name || !category || stock < 0 || price < 0) {
    showMessage('Please complete all fields with valid product information.');
    return;
  }

  const existing = await db.products.where('barcode').equals(barcode).first();
  if (existing) {
    showMessage('A product with this barcode already exists.');
    return;
  }

  await db.products.add({ barcode, name, category, stock, price });
  showMessage('Product added successfully.', 'success');
  form.reset();
  renderProducts();
}

function init() {
  requireAuth();
  renderNavbar();
  renderSidebar();
  form?.addEventListener('submit', handleSave);
  renderProducts();
}

init();
