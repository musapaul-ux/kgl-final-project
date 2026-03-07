const API_BASE_URL = "http://localhost:5000/api";
let products = [];
let selectedProduct = null;

// Decode JWT
function parseJwt(token) {
    return JSON.parse(atob(token.split('.')[1]));
}

async function init() {
    const token = localStorage.getItem("token");
    const user = parseJwt(token);

    document.getElementById("branchName").value = user.branch;
    document.getElementById("agentName").value = user.name;

    document.getElementById("date").valueAsDate = new Date();

    // Load products for branch
    const res = await fetch(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    products = await res.json();

    const branchProducts = products.filter(p => p.branch === user.branch);

    const select = document.getElementById("produceSelect");
    select.innerHTML = '<option value="">Select Produce</option>';

    branchProducts.forEach(p => {
        select.innerHTML += `<option value="${p._id}">${p.name}</option>`;
    });
}

document.getElementById("produceSelect").addEventListener("change", function() {
    const id = this.value;
    selectedProduct = products.find(p => p._id === id);

    if (selectedProduct) {
        document.getElementById("stockInfo").innerText =
            `Available Stock: ${selectedProduct.quantity} Kg | Price per Kg: UGX ${selectedProduct.sellingPrice.toLocaleString()}`;
    }
});

document.getElementById("tonnageKgs").addEventListener("input", function() {
    if (!selectedProduct) return;

    const qty = parseFloat(this.value) || 0;
    const total = qty * selectedProduct.sellingPrice;

    document.getElementById("totalAmount").innerText =
        total.toLocaleString();
});

document.getElementById("cashForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = parseJwt(token);

    const qty = parseFloat(document.getElementById("tonnageKgs").value);
    const total = qty * selectedProduct.sellingPrice;

    const data = {
        produceName: selectedProduct.name,
        branchName: user.branch,
        tonnageKgs: qty,
        amountPaid: total,
        buyerName: document.getElementById("buyerName").value,
        salesAgentName: user.name,
        date: document.getElementById("date").value,
        time: new Date().toLocaleTimeString()
    };

    const res = await fetch(`${API_BASE_URL}/sales`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (!res.ok) {
        alert(result.message);
        return;
    }

    generateReceipt(data);
});

function generateReceipt(data) {
    const receipt = `
        KGL SALES RECEIPT
        -----------------------------
        Branch: ${data.branchName}
        Agent: ${data.salesAgentName}
        Produce: ${data.produceName}
        Quantity: ${data.tonnageKgs} Kg
        Total Paid: UGX ${data.amountPaid.toLocaleString()}
        Buyer: ${data.buyerName}
        Date: ${data.date}
        -----------------------------
        Thank you for your purchase!
    `;

    const win = window.open('', '', 'width=400,height=600');
    win.document.write(`<pre>${receipt}</pre>`);
    win.print();
    win.close();
}

init();
