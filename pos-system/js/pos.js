import { db } from '../database/db.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';

const productSearch = document.getElementById('product-search');
const productQty = document.getElementById('product-qty');
const addItemBtn = document.getElementById('add-item');
const loadProductsBtn = document.getElementById('load-products');
const clearCartBtn = document.getElementById('clear-cart');
const completeSaleBtn = document.getElementById('complete-sale');
const cartList = document.getElementById('cart-list');
const cartItemsCount = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const paymentMethod = document.getElementById('payment-method');
const messageBox = document.getElementById('pos-message');

let cart = [];

function requireAuth() {
  const auth = localStorage.getItem('pos_auth');
  if (!auth) {
    window.location.href = 'index.html';
  }
}

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function updateCartUI() {
  cartList.innerHTML = '';
  let subtotal = 0;

  cart.forEach((item, index) => {
    const total = item.price * item.qty;
    subtotal += total;

    const row = document.createElement('tr');
    row.className = 'border-b border-slate-800/70';
    row.innerHTML = `
      <td class="py-3">${item.name}</td>
      <td class="py-3">${item.qty}</td>
      <td class="py-3">${formatCurrency(item.price)}</td>
      <td class="py-3">${formatCurrency(total)}</td>
      <td class="py-3"><button data-index="${index}" class="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:border-rose-500 hover:text-white">Remove</button></td>
    `;
    cartList.appendChild(row);
  });

  cartItemsCount.textContent = cart.length;
  cartSubtotal.textContent = formatCurrency(subtotal);
}

function showMessage(message, type = 'error') {
  messageBox.textContent = message;
  messageBox.className = `rounded-2xl p-4 text-sm font-medium ${type === 'success' ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/10 text-rose-200'}`;
  messageBox.classList.remove('hidden');
}

function hideMessage() {
  messageBox.classList.add('hidden');
}

async function addItem() {
  hideMessage();
  const query = productSearch.value.trim();
  const qty = Number(productQty.value);

  if (!query || qty <= 0) {
    showMessage('Please enter a barcode or item name and a valid quantity.');
    return;
  }

  const product = await db.products.where('barcode').equals(query).or('name').equals(query).first();
  if (!product) {
    showMessage('Product not found. Please add it first in Products.');
    return;
  }

  if (product.stock < qty) {
    showMessage('Not enough stock available for this product.');
    return;
  }

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty });
  }

  updateCartUI();
}

async function completeSale() {
  hideMessage();
  if (!cart.length) {
    showMessage('Cart is empty. Add items before completing sale.');
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const saleId = await db.sales.add({ date: new Date().toISOString(), total, paymentMethod: paymentMethod.value });

  await Promise.all(cart.map((item) => db.saleItems.add({
    saleId,
    productId: item.id,
    qty: item.qty,
    price: item.price
  })));

  await Promise.all(cart.map(async (item) => {
    const product = await db.products.get(item.id);
    await db.products.update(item.id, { stock: product.stock - item.qty });
    await db.stockLogs.add({ productId: item.id, type: 'out', qty: item.qty, date: new Date().toISOString() });
  }));

  cart = [];
  updateCartUI();
  showMessage('Sale completed successfully.', 'success');
}

async function loadProducts() {
  hideMessage();
  const products = await db.products.toArray();
  if (!products.length) {
    showMessage('No products available. Add products on the Products page.');
    return;
  }

  const list = products.map((product) => `${product.barcode} - ${product.name} (${product.stock} in stock)`).join('\n');
  alert(`Available products:\n\n${list}`);
}

function bindEvents() {
  addItemBtn?.addEventListener('click', addItem);
  completeSaleBtn?.addEventListener('click', completeSale);
  loadProductsBtn?.addEventListener('click', loadProducts);
  clearCartBtn?.addEventListener('click', () => { cart = []; updateCartUI(); hideMessage(); });
  cartList?.addEventListener('click', (event) => {
    const target = event.target.closest('button');
    if (!target) return;
    const index = Number(target.dataset.index);
    if (!Number.isNaN(index)) {
      cart.splice(index, 1);
      updateCartUI();
    }
  });
}

function init() {
  requireAuth();
  renderNavbar();
  renderSidebar();
  bindEvents();
  updateCartUI();
}

init();
