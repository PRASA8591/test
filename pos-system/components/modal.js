export function renderDialog(message, actionText = 'Close') {
  const dialog = document.createElement('dialog');
  dialog.className = 'rounded-3xl border border-slate-700 bg-slate-950/95 p-6 text-slate-100 shadow-2xl shadow-slate-950/50';
  dialog.innerHTML = `
    <p class="mb-6 text-sm text-slate-300">${message}</p>
    <div class="flex justify-end">
      <button class="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">${actionText}</button>
    </div>
  `;

  dialog.querySelector('button')?.addEventListener('click', () => dialog.close());
  document.body.appendChild(dialog);
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    alert(message);
  }
  dialog.addEventListener('close', () => dialog.remove());
}
