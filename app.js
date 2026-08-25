document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('addRowBtn');
    const clearTableBtn = document.getElementById('clearTableBtn');
    const tableBody = document.querySelector('#lumberTable tbody');
    
    const totalInchesEl = document.getElementById('totalInches');
    const grandTotalPriceEl = document.getElementById('grandTotalPrice');

    let items = [];

    addRowBtn.addEventListener('click', () => {
        const divisor = parseFloat(document.getElementById('woodType').value);
        const thickness = parseFloat(document.getElementById('thickness').value);
        const width = parseFloat(document.getElementById('width').value);
        const length = parseFloat(document.getElementById('length').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const pricePerInch = parseFloat(document.getElementById('pricePerInch').value) || 0;

        if (!thickness || !width || !length || !quantity) {
            alert('Por favor completa todos los campos numéricos correctamente.');
            return;
        }

        // Fórmula: (Espesor" x Ancho" x Largo cm x Cantidad) / Divisor
        const totalInches = (thickness * width * length * quantity) / divisor;
        const totalPrice = totalInches * pricePerInch;

        const newItem = {
            id: Date.now(),
            description: `${quantity}u [${thickness}"x${width}"] x ${length}cm`,
            inches: totalInches,
            price: totalPrice
        };

        items.push(newItem);
        renderTable();
    });

    window.deleteItem = function(id) {
        items = items.filter(item => item.id !== id);
        renderTable();
    };

    clearTableBtn.addEventListener('click', () => {
        items = [];
        renderTable();
    });

    function renderTable() {
        tableBody.innerHTML = '';
        let sumInches = 0;
        let sumPrice = 0;

        items.forEach(item => {
            sumInches += item.inches;
            sumPrice += item.price;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.description}</td>
                <td>${item.inches.toFixed(2)}</td>
                <td>$${Math.round(item.price).toLocaleString('es-CL')}</td>
                <td><button class="btn-delete" onclick="deleteItem(${item.id})">X</button></td>
            `;
            tableBody.appendChild(tr);
        });

        totalInchesEl.textContent = sumInches.toFixed(2);
        grandTotalPriceEl.textContent = Math.round(sumPrice).toLocaleString('es-CL');
    }
});