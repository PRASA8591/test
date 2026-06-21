export function renderNavbar(user = null) {
  const navbarRoot = document.getElementById('navbar-root');
  if (!navbarRoot) return;

  const username = user?.username || 'Administrator';

  navbarRoot.innerHTML = `
    <div class="border-b border-slate-800/90 bg-slate-950/90 px-4 py-4 shadow-sm shadow-slate-950/20 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.28em] text-slate-500">Point of Sale</p>
          <h1 class="text-2xl font-semibold text-white">Offline POS</h1>
        </div>
        <div class="flex items-center gap-4 text-sm text-slate-400">
          <div class="flex items-center gap-2">
            <div class="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-semibold">${username.charAt(0).toUpperCase()}</div>
            <span>${username}</span>
          </div>
          <button id="logout-button" class="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-200 transition hover:border-red-500 hover:text-red-300 hover:bg-red-500/10">Logout</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('pos_auth');
    localStorage.removeItem('pos_remember');
    window.location.href = 'index.html';
  });
}
