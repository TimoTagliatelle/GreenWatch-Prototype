document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('co2-table');
  if (!table) return;
  const tbody = table.tBodies[0];
  const filter = document.getElementById('table-filter');

  // simple filter
  filter.addEventListener('input', () => {
    const q = filter.value.toLowerCase();
    for (const row of tbody.rows) {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    }
  });

  // try to get numeric value, otherwise return string
  const valueOf = cell => {
    const s = (cell.textContent || '').replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(/,/g, '.');
    return s && !isNaN(Number(s)) ? Number(s) : (cell.textContent || '').trim().toLowerCase();
  };

  // sortable headers
  table.querySelectorAll('th[data-sortable="true"]').forEach((th, i) => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const order = th.dataset.order === 'asc' ? 'desc' : 'asc';
      table.querySelectorAll('th').forEach(h => h.removeAttribute('data-order'));
      th.dataset.order = order;

      const rows = Array.from(tbody.rows).filter(r => r.style.display !== 'none');
      rows.sort((a, b) => {
        const A = valueOf(a.cells[i]);
        const B = valueOf(b.cells[i]);
        if (typeof A === 'number' && typeof B === 'number') return order === 'asc' ? A - B : B - A;
        return order === 'asc' ? String(A).localeCompare(String(B)) : String(B).localeCompare(String(A));
      });
      rows.forEach(r => tbody.appendChild(r));
    });
  });
});
