/* ==============================
   SALES AGENT DASHBOARD SCRIPT
   Handles:
   - Token decoding
   - Loading products
   - Recording sales
   - Viewing sales
================================ */

document.querySelector(".logout-btn").addEventListener("click", logoutUser);

/* 
   TOKEN HANDLING
 */

const token = localStorage.getItem("token");

/* Decode JWT token */

function parseJwt(token) {

    try {

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

        return JSON.parse(jsonPayload);

    } catch (err) {

        console.error("Invalid token");
        return null;

    }

}

const user = parseJwt(token);
const userName = localStorage.getItem("userName");

/* Agent info from token */

const agentName = user?.name;
const agentBranch = user?.branch;

/* ==============================
   INITIAL PAGE LOAD
================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* Display welcome message */

    document.getElementById("welcome").innerText =
        `Welcome ${userName || agentName} | Branch: ${agentBranch}`;

    /* Load initial data */

    loadProducts();
    loadSales();
    loadCreditSales();

});

/* ==============================
   SECTION TOGGLING
================================ */

function showSection(section) {

    document.querySelectorAll(".section")
        .forEach(sec => sec.classList.remove("active"));

    document.getElementById(section).classList.add("active");

}

/* ==============================
   LOAD PRODUCTS
================================ */

async function loadProducts() {

    const res = await fetch(API_BASE_URL + "/products", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    const table = document.querySelector("#productsTable tbody");

    table.innerHTML = "";

    const cashSelect = document.getElementById("produceName");
    const creditSelect = document.getElementById("cProduce");

    cashSelect.innerHTML = "";
    creditSelect.innerHTML = "";

    /* Filter products belonging to agent branch */

    data.filter(p => p.branch === agentBranch)
        .forEach(p => {

            table.innerHTML += `
<tr>
<td>${p.name}</td>
<td>${p.quantity}</td>
<td>${p.price}</td>
</tr>
`;

            cashSelect.innerHTML += `<option value="${p.name}">${p.name}</option>`;
            creditSelect.innerHTML += `<option value="${p.name}">${p.name}</option>`;

        });

}

/* ==============================
   LOAD CASH SALES
================================ */

async function loadSales() {

    const res = await fetch(API_BASE_URL + "/sales", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const sales = await res.json();

    const table = document.querySelector("#salesTable tbody");

    table.innerHTML = "";

    sales.filter(s => s.branchName === agentBranch)
        .forEach(s => {

            table.innerHTML += `
<tr>
<td>${s.produceName}</td>
<td>${s.tonnageKgs}</td>
<td>${s.amountPaid}</td>
<td>${s.buyerName}</td>
<td>${new Date(s.date).toLocaleDateString()}</td>
<td>${s.salesAgentName}</td>
</tr>
`;

        });

}

/* ==============================
   LOAD CREDIT SALES
================================ */

async function loadCreditSales() {

    const res = await fetch(API_BASE_URL + "/credit", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const credits = await res.json();

    const table = document.querySelector("#creditSalesTable tbody");

    table.innerHTML = "";

    credits.filter(c => c.branchName === agentBranch)
        .forEach(c => {

            table.innerHTML += `
<tr>
<td>${c.buyerName}</td>
<td>${c.nationalId}</td>
<td>${c.produceName}</td>
<td>${c.tonnageKgs}</td>
<td>${c.amountDue}</td>
<td>${new Date(c.dueDate).toLocaleDateString()}</td>
<td>${c.salesAgentName}</td>
</tr>
`;

        });

}

/* ==============================
   RECORD CASH SALE
================================ */

document.getElementById("cashSaleForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        try {

            const body = {

                produceName: produceName.value,
                branchName: agentBranch,
                tonnageKgs: tonnageKgs.value,
                amountPaid: amountPaid.value,
                buyerName: buyerName.value,
                salesAgentName: agentName,
                date: date.value,
                time: time.value

            };

           const res = await fetch(API_BASE_URL + "/sales", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)

            });
            
               if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to record credit sale");
            } else {
                const successMsg = document.getElementById("cashSusMsg");
                successMsg.innerText = "Cash sale recorded successfully!";
                document.getElementById("cashSusMsg").style.display = "block";
                document.getElementById("cashErrorMsg").style.display = "none";
                e.target.reset();
            }
        } catch (error) {
            const errorMsg = document.getElementById("creditErrorMsg");
            errorMsg.innerText = error.message || "Failed to record cash sale";
            document.getElementById("cashErrorMsg").style.display = "block";
            document.getElementById("cashSusMsg").style.display = "none";
        }
        

        loadProducts();
        loadSales();

    });


/* ==============================
   RECORD CREDIT SALE
================================ */

document.getElementById("creditForm")
    .addEventListener("submit", async (e) => {

        e.preventDefault();

        const body = {

            buyerName: cBuyer.value,
            nationalId: cNid.value,
            location: cLocation.value,
            contact: cContact.value,
            amountDue: cAmount.value,
            salesAgentName: agentName,
            dueDate: dueDate.value,
            produceName: cProduce.value,
            produceType: produceType.value,
            tonnageKgs: cTonnage.value,
            dispatchDate: dispatchDate.value,
            branchName: agentBranch

        };
        try {
            const res = await fetch(API_BASE_URL + "/credit", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)

            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to record credit sale");
            } else {
                const successMsg = document.getElementById("creditSusMsg");
                successMsg.innerText = "Credit sale recorded successfully!";
                document.getElementById("creditSusMsg").style.display = "block";
                document.getElementById("creditErrorMsg").style.display = "none";
                e.target.reset();
            }
        } catch (error) {
            const errorMsg = document.getElementById("creditErrorMsg");
            errorMsg.innerText = error.message || "Failed to record credit sale";
            document.getElementById("creditErrorMsg").style.display = "block";
            document.getElementById("creditSusMsg").style.display = "none";
        }
        // alert("Credit sale recorded");
        // e.target.reset();

        loadProducts();
        loadCreditSales();

    });

document.querySelector(".viewPdtBtn").addEventListener("click", () => showSection("products"));
document.querySelector(".addCashBtn").addEventListener("click", () => showSection("cashSale"));
document.querySelector(".addCreditBtn").addEventListener("click", () => showSection("creditSale"));
document.querySelector(".viewCashSalesBtn").addEventListener("click", () => showSection("sales"));
document.querySelector(".viewCreditSalesBtn").addEventListener("click", () => showSection("creditSales"));  