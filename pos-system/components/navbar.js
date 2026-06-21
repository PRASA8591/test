const navItems = [
  { title: 'Dashboard', href: 'dashboard.html' },
  { title: 'POS', href: 'pos.html' },
  { title: 'Products', href: 'products.html' },
  { title: 'Inventory', href: 'inventory.html' },
  { title: 'Customers', href: 'customers.html' },
  { title: 'Reports', href: 'reports.html' }
];

export function renderNavbar() {
  const navbarRoot = document.getElementById('navbar-root');
  if (!navbarRoot) return;

  navbarRoot.innerHTML = `
    <div class="border-b border-slate-800/90 bg-slate-950/90 px-4 py-4 shadow-sm shadow-slate-950/20 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Point of Sale</p>
          <h1 class="text-2xl font-semibold text-white">Offline POS System</h1>
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-400">
          <span id="user-role">Administrator</span>
          <button id="logout-button" class="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-red-500 hover:text-white">Logout</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('pos_auth');
    window.location.href = 'index.html';
  });
}
