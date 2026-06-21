export function renderSidebar() {
  const sidebarRoot = document.getElementById('sidebar-root');
  if (!sidebarRoot) return;

  sidebarRoot.innerHTML = `
    <aside class="border-r border-slate-800/90 bg-slate-950/95 p-6 shadow-xl shadow-slate-950/20">
      <div class="flex items-center gap-3 mb-8">
        <div class="h-12 w-12 rounded-3xl bg-indigo-500/15 text-indigo-300 flex items-center justify-center text-xl font-black">P</div>
        <div>
          <p class="text-sm uppercase tracking-[0.24em] text-slate-500">POS System</p>
          <p class="text-lg font-semibold text-white">Offline Admin</p>
        </div>
      </div>
      <nav class="space-y-2 text-sm text-slate-300">
        <a href="dashboard.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">Dashboard</a>
        <a href="pos.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">POS</a>
        <a href="products.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">Products</a>
        <a href="inventory.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">Inventory</a>
        <a href="customers.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">Customers</a>
        <a href="reports.html" class="block rounded-2xl px-4 py-3 transition hover:bg-slate-900/80 hover:text-white">Reports</a>
      </nav>
    </aside>
  `;
}
