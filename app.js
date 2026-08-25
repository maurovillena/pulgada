document.addEventListener('DOMContentLoaded', () => {
    const addRowBtn = document.getElementById('addRowBtn');
    const clearTableBtn = document.getElementById('clearTableBtn');
    const tableBody = document.querySelector('#lumberTable tbody');
    
    const supplierSelect = document.getElementById('supplierSelect');
    const woodTypeSelect = document.getElementById('woodType');
    const pricePerInchInput = document.getElementById('pricePerInch');

    const totalInchesEl = document.getElementById('totalInches');
    const grandTotalPriceEl = document.getElementById('grandTotalPrice');

    // Base de datos local actualizada con precios vigentes de Maderas Tranapuente
    const suppliersData = {
        "tranapuente": {
            name: "Maderas Tranapuente",
            divisor: 3650, // Divisor estándar para maderas nativas y finas
            woods: [
                { name: "Lenga Com. (Cepillado 2C)", price: 14280 },
                { name: "Lenga Custom (Cepillado 2C)", price: 16660 },
                { name: "Lenga Cabinet (Cepillado 2C)", price: 18445 },
                { name: "Lenga Selecta (Cepillado 2C)", price: 29750 },
                { name: "Red Oak / Roble Americano (Bruto)", price: 36890 },
                { name: "Fresno Color (Fast) (Bruto)", price: 42840 },
                { name: "Fresno Premium (Fast)", price: 48790 },
                { name: "Abedul Calidad FAS (Birch) (Bruto)", price: 48790 },
                { name: "Maple Soft Calidad FAS (Arce) (Bruto)", price: 49980 },
                { name: "Tilo Calidad FAS (Basswood) (Bruto)", price: 38080 },
                { name: "Hickory Calidad FAS (Nogal Americano) (Bruto)", price: 42840 }
            ]
        },
        "general": {
            name: "Genérico / Otra Barraca",
            divisor: 3200,
            woods: [
                { name: "Pino Dimensionado Estándar", price: 1500 },
                { name: "Pino Verde Barraca", price: 1200 }
            ]
        }
    };

    // Rellenar selector de maderas al cambiar de proveedor
    function updateWoods() {
        const selectedSupplierKey = supplierSelect.value;
        const supplier = suppliersData[selectedSupplierKey];
        
        woodTypeSelect.innerHTML = '';
        
        supplier.woods.forEach(wood => {
            const option = document.createElement('option');
            option.value = wood.price;
            option.dataset.divisor = supplier.divisor;
            option.textContent = `${wood.name} - $${wood.price.toLocaleString('es-CL')} /pulg`;
            woodTypeSelect.appendChild(option);
        });

        updatePriceField();
    }

    // Actualizar campo de precio automáticamente según la madera seleccionada
    function updatePriceField() {
        const selectedOption = woodTypeSelect.options[woodTypeSelect.selectedIndex];
        if (selectedOption) {
            pricePerInchInput.value = selectedOption.value;
        }
    }

    supplierSelect.addEventListener('change', updateWoods);
    woodTypeSelect.addEventListener('change', updatePriceField);

    // Inicializar al cargar la página
    updateWoods();

    let items = [];

    addRowBtn.addEventListener('click', () => {
        const selectedOption = woodTypeSelect.options[woodTypeSelect.selectedIndex];
        const divisor = parseFloat(selectedOption.dataset.divisor);
        
        const thickness = parseFloat(document.getElementById('thickness').value);
        const width = parseFloat(document.getElementById('width').value);
        const length = parseFloat(document.getElementById('length').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const pricePerInch = parseFloat(pricePerInchInput.value) || 0;

        if (!thickness || !width || !length || !quantity) {
            alert('Por favor completa las medidas y la cantidad de palos.');
            return;
        }

        // Fórmula de Pulgadas Madereras: (Espesor x Ancho x Largo x Cantidad) / Divisor
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