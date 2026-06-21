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
const refreshBtn = document.getElementById('refresh-products');

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

async function renderProducts() {
  try {
    const products = await db.products.toArray();
    tableBody.innerHTML = products.map((product) => `
      <tr class="border-b border-slate-800/80">
        <td class="py-3">${product.barcode}</td>
        <td class="py-3">${product.name}</td>
        <td class="py-3">${product.category}</td>
        <td class="py-3">${product.stock || 0}</td>
        <td class="py-3">$${Number(product.price || 0).toFixed(2)}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Failed to render products:', error);
    tableBody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-400">Error loading products</td></tr>';
  }
}

async function handleSave(event) {
  event.preventDefault();
  hideMessage();

  const barcode = barcodeInput.value.trim();
  const name = nameInput.value.trim();
  const category = categoryInput.value.trim();
  const stock = Number(stockInput.value) || 0;
  const price = Number(priceInput.value) || 0;

  if (!barcode || !name || !category) {
    showMessage('Please complete all required fields.');
    return;
  }

  try {
    const existing = await db.products.where('barcode').equals(barcode).first();
    if (existing) {
      showMessage('A product with this barcode already exists.');
      return;
    }

    await db.products.add({ barcode, name, category, stock, price });
    showMessage('Product added successfully.', 'success');
    form.reset();
    renderProducts();
  } catch (error) {
    console.error('Save error:', error);
    showMessage('Failed to save product. Check console.');
  }
}

function init() {
  const user = requireAuth();
  if (!user) return;
  renderNavbar(user);
  renderSidebar();
  form?.addEventListener('submit', handleSave);
  refreshBtn?.addEventListener('click', renderProducts);
  renderProducts();
  console.log('✓ Products page loaded');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
