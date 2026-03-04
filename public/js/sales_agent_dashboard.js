
document.getElementById("logout-btn").addEventListener("click", logoutUser)

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// Decode JWT
function parseJwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const user = parseJwt(token);
document.getElementById("branchInfo").innerText =
    "Branch: " + user.branch;

// Fetch Branch Sales
async function loadSales() {

    const cashRes = await fetch(`${API_BASE_URL}/sales`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const creditRes = await fetch(`${API_BASE_URL}/credit`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const cashSales = await cashRes.json();
    const creditSales = await creditRes.json();
    console.log(cashSales)
    console.log(creditSales)

    const table = document.getElementById("salesTable");
    table.innerHTML = "";

    let cashTotal = 0;
    let creditTotal = 0;

    cashSales.forEach(sale => {
        cashTotal += sale.amountPaid;
        table.innerHTML += `
            <tr>
                <td>${new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>${sale.salesAgentName}</td>
                <td>Cash</td>
                <td>${sale.produceName}</td>
                <td>${sale.tonnageKgs}</td>
                <td>${sale.amountPaid}</td>
            </tr>
        `;
    });

    creditSales.forEach(sale => {
        creditTotal += sale.amountDue;
        table.innerHTML += `
            <tr>
                <td>${new Date(sale.createdAt).toLocaleDateString()}</td>
                <td>${sale.salesAgentName}</td>
                <td>Credit</td>
                <td>${sale.produceName}</td>
                <td>${sale.tonnageKgs}</td>
                <td>${sale.amountDue}</td>
            </tr>
        `;
    });

    document.getElementById("cashTotal").innerText = cashTotal;
    document.getElementById("creditTotal").innerText = creditTotal;
    document.getElementById("grandTotal").innerText = cashTotal + creditTotal;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

loadSales();

