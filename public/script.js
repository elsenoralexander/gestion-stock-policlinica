document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('item-container');

  const form = document.createElement('form');
  form.innerHTML = `
    <label for="nfcInput">Código NFC:</label>
    <input type="text" id="nfcInput" placeholder="Escanea o ingresa el código NFC" required />
    <button type="submit">Buscar</button>
  `;
  container.appendChild(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('nfcInput').value.trim();
    try {
      const res = await fetch(`/api/items/${code}`);
      if (!res.ok) { alert('Artículo no encontrado'); return; }
      const item = await res.json();
      renderItem(item);
    } catch (err) {
      console.error(err);
      alert('Error al obtener el artículo');
    }
  });

  function renderItem(item) {
    container.innerHTML = `
      <div class="item-details">
        <h2>${item.name}</h2>
        <p>Referencia: ${item.reference}</p>
        <div class="quantity-control">
          <button id="decrease">-</button>
          <span id="quantity">${item.quantity}</span>
          <button id="increase">+</button>
        </div>
        <button id="saveBtn">Guardar</button>
      </div>
    `;

    const qtyEl = document.getElementById('quantity');
    let currentQty = item.quantity;

    document.getElementById('increase').addEventListener('click', () => {
      currentQty++;
      qtyEl.textContent = currentQty;
    });

    document.getElementById('decrease').addEventListener('click', () => {
      if (currentQty > 0) {
        currentQty--;
        qtyEl.textContent = currentQty;
      }
    });

    document.getElementById('saveBtn').addEventListener('click', async () => {
      const change = currentQty - item.quantity;
      if (change === 0) { alert('No hay cambios para guardar'); return; }
      try {
        const res = await fetch(`/api/items/${item._id}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ change })
        });
        const result = await res.json();
        if (result.success) {
          alert(`Movimiento guardado. Nueva cantidad: ${result.quantity}`);
        } else {
          alert('Error al guardar movimiento');
        }
      } catch (err) {
        console.error(err);
        alert('Error al guardar movimiento');
      }
    });
  }
});

