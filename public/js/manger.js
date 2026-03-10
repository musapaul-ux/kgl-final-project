
document.querySelector(".logout-btn").addEventListener("click", logoutUser)
const API = API_BASE_URL;

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

const name = localStorage.getItem("userName")
const branch = localStorage.getItem("userBranch")

document.getElementById("managerName").textContent += " " + name;
document.getElementById("managerBranch").textContent += "" + branch

const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
};


/* NAVIGATION */

function showSection(id) {

    document.querySelectorAll(".section")
        .forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");

}



/* LOAD PRODUCTS */

async function loadProducts() {

    const res = await fetch(`${API}/products`, { headers });
    const data = await res.json();

    const branchProducts = data.filter(p => p.branch === branch);

    const table = document.getElementById("productTable");

    table.innerHTML = branchProducts.map(p => `

<tr>
<td>${p.name}</td>
<td>${new Date(p.createdAt).toLocaleDateString()}</td>
<td>${p.quantity}</td>
<td>${new Date(p.updatedAt).toLocaleDateString()}</td>
<td>${p.price}</td>
</tr>

`).join("");

}



/* LOAD PROCUREMENT */

async function loadProcurements() {

    const res = await fetch(`${API}/procurement`, { headers });
    const data = await res.json();

    const branchData = data.filter(p => p.branchName === branch);

    const table = document.getElementById("procurementTable");

    table.innerHTML = branchData.map(p => `

<tr>
<td>${p.produceName}</td>
<td>${p.supplierName}</td>
<td>${p.tonnageKgs}</td>
<td>${p.costUgx}</td>
<td>${new Date(p.date).toLocaleDateString()}</td>
<td>
<button class="deleteProcBtn" data-id="${p._id}">Delete</button>
</td>
</tr>

`).join("");

}



/* LOAD CASH SALES */

async function loadCashSales() {

    const res = await fetch(`${API}/sales`, { headers });
    const data = await res.json();

    const branchData = data.filter(s => s.branchName === branch);

    const table = document.getElementById("cashSalesTable");

    table.innerHTML = branchData.map(s => `

<tr>
<td>${s.produceName}</td>
<td>${s.tonnageKgs}</td>
<td>${s.amountPaid}</td>
<td>${s.buyerName}</td>
<td>${new Date(s.date).toLocaleDateString()}</td>

<td>
<button class="deleteSaleBtn" data-id="${s._id}">Delete</button>
</td>

</tr>

`).join("");

}



/* LOAD CREDIT SALES */

async function loadCreditSales() {

    const res = await fetch(`${API}/credit`, { headers });
    const data = await res.json();

    const branchData = data.filter(c => c.branchName === branch);

    const table = document.getElementById("creditSalesTable");

    table.innerHTML = branchData.map(c => `

<tr>
<td>${new Date(c.dispatchDate).toLocaleDateString()}</td>
<td>${c.buyerName}</td>

<td>${c.produceName}</td>

<td>${c.tonnageKgs}</td>

<td>${c.amountDue}</td>

<td>${new Date(c.dueDate).toLocaleDateString()}</td>
<td>${c.salesAgentName}</td>

<td>

<button class="deleteCreditBtn" data-id="${c._id}">Delete</button>

</td>

</tr>

`).join("");

}



/* LOAD USERS */

async function loadUsers() {

    const res = await fetch(`${API}/users`, { headers });
    const data = await res.json();

    const branchUsers = data.filter(u => u.branch === branch);

    const table = document.getElementById("userTable");

    table.innerHTML = branchUsers.map(u => `

<tr>

<td>${u.name}</td>
<td>${u.email}</td>
<td>${u.role}</td>
<td>${new Date(u.createdAt).toLocaleDateString()}</td>
<td>${new Date(u.updatedAt).toLocaleDateString()}</td>
<td>
<button class="editUserBtn" style="background: green;" data-id="${u._id}">Edit</button>
<button class="deleteUserBtn" data-id="${u._id}">Delete</button>
</td>

</tr>

`).join("");

}

/* =============================
FORM MODAL CONTROLS
============================= */

function openForm() {
    document.getElementById("formModal").classList.remove("hidden")
}

function closeForm() {
    document.getElementById("formModal").classList.add("hidden")
}

//opens procurement form
function openProcurementForm() {

    document.getElementById("formTitle").textContent = "Add Procurement"

    document.getElementById("dynamicForm").innerHTML = `

    <div id="feedBack" style="
    display:none;
    background:#ffdede;
    color:#b30000;
    padding:10px;
    margin-bottom:10px;
    border-radius:4px;
    font-size:14px;
"></div>

<label>Produce Name</label>
<select name="produceName">
<option value="Beans">Beans</option>
<option value="Grain Maize">Grain Maize</option>
<option value="Soy beans">Soy beans</option>
<option value="Cow peas">Cow peas</option>
<option value="G-nuts">G-nuts</option>
</select>

<label>Supplier Type</label>
<select name="supplierType">
<option>Individual</option>
<option>Company</option>
<option>Farm</option>
</select>

<label>Supplier Name</label>
<input name="supplierName" required>

<label>Produce Type</label>
<input name="produceType" required>

<label>Date</label>
<input type="date" name="date">

<label>Time</label>
<input type="time" name="time">

<label>Tonnage Kgs</label>
<input type="number" name="tonnageKgs">

<label>Cost (UGX)</label>
<input type="number" name="costUgx">

<label>Contact</label>
<input name="contact">

<label>Price To Sell</label>
<input type="number" name="PriceToBeSoldAt">

<button class="submitBtn" style="background-color: green;" type="submit">Save</button>

`

    document.getElementById("dynamicForm").onsubmit = createProcurement

    openForm()

}


async function createProcurement(e) {

    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.target))
    const msg = document.getElementById("feedBack")
    form.branchName = branch

    try {
        const res = await fetch(`${API}/procurement`, {
            method: "POST",
            headers,
            body: JSON.stringify(form)

        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.message || "failed to record procurement")
        } else {
            msg.textContent = "Procurement record created succesfully."
            msg.style.display = "block"
            closeForm()
            loadProcurements()
            loadProducts()
        }
    } catch (error) {
        msg.textContent = error.message
        msg.style.color = "red"
        msg.style.display = "block"
    }

}

/* 
EDIT PROCUREMENT
*/

// async function editProcurement(id) {

//     const res = await fetch(`${API}/procurement/${id}`, { headers })
//     const data = await res.json()

//     document.getElementById("formTitle").textContent = "Edit Procurement"

//     document.getElementById("dynamicForm").innerHTML = `
//     <div id="feedBack" style="
//     display:none;
//     background:#ffdede;
//     color:#b30000;
//     padding:10px;
//     margin-bottom:10px;
//     border-radius:4px;
//     font-size:14px;
// "></div>

// <label>Produce Name</label>
// <input name="produceName" value="${data.produceName}">

// <label>Supplier Type</label>
// <select name="supplierType">
// <option ${data.supplierType === "Individual" ? "selected" : ""}>Individual</option>
// <option ${data.supplierType === "Company" ? "selected" : ""}>Company</option>
// <option ${data.supplierType === "Farm" ? "selected" : ""}>Farm</option>
// </select>

// <label>Supplier Name</label>
// <input name="supplierName" value="${data.supplierName}">

// <label>Produce Type</label>
// <input name="produceType" value="${data.produceType}">

// <label>Date</label>
// <input type="date" name="date" value="${data.date?.split("T")[0]}">

// <label>Time</label>
// <input type="time" name="time" value="${data.time}">

// <label>Tonnage Kgs</label>
// <input type="number" name="tonnageKgs" value="${data.tonnageKgs}">

// <label>Cost (UGX)</label>
// <input type="number" name="costUgx" value="${data.costUgx}">

// <label>Contact</label>
// <input name="contact" value="${data.contact}">

// <label>Price To Sell</label>
// <input type="number" name="PriceToBeSoldAt" value="${data.PriceToBeSoldAt}">

// <button type="submit" style="background-color: green;">Update</button>
// `

//     document.getElementById("dynamicForm").onsubmit = async function (e) {

//         e.preventDefault()

//         const form = Object.fromEntries(new FormData(e.target))
//         const msg = document.getElementById("feedBack")

//         try {
//             const res = await fetch(`${API}/procurement/${id}`, {
//                 method: "PATCH",
//                 headers,
//                 body: JSON.stringify(form)
//             })

//             const data = await res.json();
//             if (!res.ok) {
//                 throw new Error(data.message || "Failed to edit procurement")
//             }
//             msg.textContent = "procurement record editted successfully"
//             msg.style.display = "block"

//         } catch (error) {
//             msg.textContent = error.message
//             msg.style.display = "block"
//             msg.style.color = "red"
//             closeForm()
//             loadProcurements()
//         }
//     }
//     openForm()
// }


/* ================================
CASH SALE
================================ */

function openCashSaleForm() {

    document.getElementById("formTitle").textContent = "Record Cash Sale"

    document.getElementById("dynamicForm").innerHTML = `

<label>Produce Name</label>
<select name="produceName">
<option value="Beans">Beans</option>
<option value="Grain Maize">Grain Maize</option>
<option value="Soy beans">Soy beans</option>
<option value="Cow peas">Cow peas</option>
<option value="G-nuts">G-nuts</option>
</select>

<label>Tonnage Kgs</label>
<input type="number" name="tonnageKgs">

<label>Amount Paid</label>
<input type="number" name="amountPaid">

<label>Buyer Name</label>
<input name="buyerName">

<label>Sales Agent Name</label>
<input name="salesAgentName">

<label>Date</label>
<input type="date" name="date">

<label>Time</label>
<input type="time" name="time">

<button style="background-color: green;" type="submit">Save</button>

<div id="feedBack" style="
    display:none;
    background:#ffdede;
    color:green;
    padding:10px;
    margin-bottom:10px;
    border-radius:4px;
    font-size:14px;
"></div>
`

    document.getElementById("dynamicForm").onsubmit = createCashSale

    openForm()

}


async function createCashSale(e) {

    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.target))
    const msg = document.getElementById("feedBack")
    form.branchName = branch

    try {
        const res = await fetch(`${API}/sales`, {

            method: "POST",
            headers,
            body: JSON.stringify(form)

        })

        const data = res.json()
        if (!res.ok) {
            throw new Error(data.message || "failed to record sale")
        } else {
            msg.textContent = "sale recorded successfully"
            msg.style.display = "block"
            closeForm()
            loadCashSales()
            loadProducts()
        }
    } catch (error) {
        msg.textContent = error.message
        msg.style.display = "block"
        msg.style.color = "red"
    }
}

// handles editing
/* 
EDIT CASH SALE
*/

// async function editSale(id) {

//     const res = await fetch(`${API}/sales/${id}`, { headers })
//     const data = await res.json()

//     document.getElementById("formTitle").textContent = "Edit Cash Sale"

//     document.getElementById("dynamicForm").innerHTML = `
    
//     <div id="feedBack" style="
//     display:none;
//     background:#ffdede;
//     color:#b30000;
//     padding:10px;
//     margin-bottom:10px;
//     border-radius:4px;
//     font-size:14px;
// "></div>

// <label>Produce Name</label>
// <input name="produceName" value="${data.produceName}">

// <label>Tonnage Kgs</label>
// <input type="number" name="tonnageKgs" value="${data.tonnageKgs}">

// <label>Amount Paid</label>
// <input type="number" name="amountPaid" value="${data.amountPaid}">

// <label>Buyer Name</label>
// <input name="buyerName" value="${data.buyerName}">

// <label>Sales Agent Name</label>
// <input name="salesAgentName" value="${data.salesAgentName}">

// <label>Date</label>
// <input type="date" name="date" value="${data.date?.split("T")[0]}">

// <label>Time</label>
// <input type="time" name="time" value="${data.time}">

// <button type="submit" style="background-color: green;">Update</button>
// `

//     document.getElementById("dynamicForm").onsubmit = async function (e) {

//         e.preventDefault()

//         const form = Object.fromEntries(new FormData(e.target))
//         const msg = document.getElementById("feedBack")

//         try {
//             const res = await fetch(`${API}/sales/${id}`, {
//                 method: "PATCH",
//                 headers,
//                 body: JSON.stringify(form)
//             })

//             const data = res.json()

//             if (!res.ok) {
//                 throw new Error(data.message || "failed to edit sale!")
//             } else {
//                 msg.textContent = "sale updated successfully."
//                 msg.style.display = "block"
//                 closeForm()
//                 loadCashSales()
//             }

//         } catch (error) {
//             msg.textContent = error.message
//             msg.style.display = "block"
//             msg.style.color = "red"
//         }

//     }
// }


/* 
CREDIT SALE
*/

function openCreditSaleForm() {

    document.getElementById("formTitle").textContent = "Record Credit Sale"

    document.getElementById("dynamicForm").innerHTML = `
        <div id="feedBack" style="
    display:none;
    background:#ffdede;
    color:green;
    padding:10px;
    margin-bottom:10px;
    border-radius:4px;
    font-size:14px;
"></div>

<label>Buyer Name</label>
<input name="buyerName">

<label>National ID</label>
<input name="nationalId">

<label>Location</label>
<input name="location">

<label>Contact</label>
<input name="contact">

<label>Amount Due</label>
<input type="number" name="amountDue">

<label>Sales Agent Name</label>
<input name="salesAgentName">

<label>Due Date</label>
<input type="date" name="dueDate">

<label>Produce Name</label>
<select name="produceName">
<option value="Beans">Beans</option>
<option value="G-nuts">G-nuts</option>
<option value="Grain Maize">Grain Maize</option>
<option value="Soy beans">Soy beans</option>
<option value="Cow peas">Cow peas</option>
</select>

<label>Produce Type</label>
<input name="produceType">

<label>Tonnage</label>
<input type="number" name="tonnageKgs">

<label>Dispatch Date</label>
<input type="date" name="dispatchDate">

<button type="submit" style="background-color: green;">Save</button>

`

    document.getElementById("dynamicForm").onsubmit = createCreditSale

    openForm()

}


async function createCreditSale(e) {

    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.target))
    const msg = document.getElementById("feedBack")
    form.branchName = branch

    try {
        const res = await fetch(`${API}/credit`, {
            method: "POST",
            headers,
            body: JSON.stringify(form)
        })

        const data = res.json()

        if (!res.ok) {
            console.log(data.message)
            throw new Error(data.message || "Failed to record credit sale")
        }
        else {
            msg.textContent = "Credit sale recorded successfully."
            msg.style.display = "block"
            closeForm()
            loadCreditSales()
            loadProducts()
        }
    } catch (error) {
        msg.textContent = error.message
        msg.style.color = "red"
        msg.style.display = "block"
    }

}


/* 
USER FORM
*/

function openUserForm() {

    document.getElementById("formTitle").textContent = "Create User"

    document.getElementById("dynamicForm").innerHTML = `
     <div id="feedBack" style="
    display:none;
    background:#ffdede;
    color:green;
    padding:10px;
    margin-bottom:10px;
    border-radius:4px;
    font-size:14px;
"></div>

<label>Name</label>
<input name="name">

<label>Email</label>
<input name="email">

<label>Password</label>
<input type="password" name="password">

<label>Role</label>
<select name="role">
<option>SalesAgent</option>
<option>Manager</option>
<option>Director</option>
</select>

<button type="submit" style="background-color: green;">Save</button>

`

    document.getElementById("dynamicForm").onsubmit = createUser

    openForm()

}


async function createUser(e) {

    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.target))
    const msg = document.getElementById("feedBack")
    form.branch = branch

    try {
        const res = await fetch(`${API}/users`, {
            method: "POST",
            headers,
            body: JSON.stringify(form)
        })

        const data = res.json()

        if (!res.ok) {
            throw new Error(data.message || "Failed to create user")
        }
        else {
            msg.textContent = "User created successfully."
            msg.style.display = "block"
            closeForm()
            loadUsers()
        }


    } catch (error) {
        msg.textContent = error.message
        msg.style.color = "red"
        msg.style.display = "block"
    }

}

/* 
EDIT USER
 */

async function editUser(id) {

    const res = await fetch(`${API}/users/${id}`, { headers })
    const data = await res.json()

    if (!res.ok) {
        alert(data.message || "Failed to load user")
        return
    }

    document.getElementById("formTitle").textContent = "Edit User"

    document.getElementById("dynamicForm").innerHTML = `

    <div id="feedBack" style="
    display:none;
    background:#e6ffed;
    color:#0a7a28;
    padding:10px;
    margin-bottom:10px;
    border-radius:4px;
    font-size:14px;
    "></div>

<label>Name</label>
<input name="name" value="${data.name || ""}" required>

<label>Email</label>
<input name="email" value="${data.email || ""}" required>

<label>Role</label>
<select name="role">
<option ${data.role === "SalesAgent" ? "selected" : ""}>SalesAgent</option>
<option ${data.role === "Manager" ? "selected" : ""}>Manager</option>
<option ${data.role === "Director" ? "selected" : ""}>Director</option>
</select>

<button type="submit" style="background-color: green;">Update</button>

`

    document.getElementById("dynamicForm").onsubmit = async function (e) {

        e.preventDefault()

        const form = Object.fromEntries(new FormData(e.target))
        const msg = document.getElementById("feedBack")

        try {

            const res = await fetch(`${API}/users/${id}`, {
                method: "PATCH",
                headers,
                body: JSON.stringify(form)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to edit user")
            }

            msg.textContent = "User edited successfully"
            msg.style.display = "block"

            setTimeout(() => {
                closeForm()
                loadUsers()
            }, 1200)

        } catch (error) {

            msg.textContent = error.message || "Failed to edit user"
            msg.style.color = "red"
            msg.style.display = "block"

        }
    }

    openForm()
}



/* DELETE FUNCTIONS */

async function deleteProcurement(id) {
    if (!confirm("Are you sure you want to delete procurement?")) {
        return;
    }
    try {
        await fetch(`${API}/procurement/${id}`, {
            method: "DELETE",
            headers
        });

        loadProcurements();

    } catch (e) {
        console.log(e.message)
    }
}
async function deleteSale(id) {
    if (!confirm("Are you sure you want to delete sale?")) {
        return;
    }

    try {
        await fetch(`${API}/sales/${id}`, {
            method: "DELETE",
            headers
        });

        loadCashSales();
    } catch (e) {
        console.log(e.message)
    }

}


async function deleteCredit(id) {
    if (!confirm("Are you sure you want to delete sale?"))
        return;
    try {
        await fetch(`${API}/credit/${id}`, {
            method: "DELETE",
            headers
        });

        loadCreditSales();
    } catch (e) {
        console.log(e.message)
    }
}



async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete user?"))
        return;
    try {
        await fetch(`${API}/users/${id}`, {
            method: "DELETE",
            headers
        });

        loadUsers();

    } catch (e) {
        console.log(e.message);
    }
}



/* INIT */

loadProducts();
loadProcurements();
loadCashSales();
loadCreditSales();
loadUsers();

document.querySelector(".viewPdts").addEventListener("click", () => showSection("products"));
document.querySelector(".viewCash").addEventListener("click", () => showSection("cashSales"));
document.querySelector(".viewCredits").addEventListener("click", () => showSection("creditSales"))
document.querySelector(".viewUsers").addEventListener("click", () => showSection("users"))
document.querySelector(".viewProc").addEventListener("click", () => showSection("procurement"))



/* =============================
BUTTON LISTENERS
============================= */

document.getElementById("addProcurementBtn")
    .addEventListener("click", openProcurementForm)

document.getElementById("addCashSaleBtn")
    .addEventListener("click", openCashSaleForm)

document.getElementById("addCreditSaleBtn")
    .addEventListener("click", openCreditSaleForm)

document.getElementById("addUserBtn")
    .addEventListener("click", openUserForm)

document.getElementById("cancelBtn")
    .addEventListener("click", closeForm)
/* =============================
TABLE ACTION EVENTS
============================= */

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("deleteProcBtn")) {
        deleteProcurement(e.target.dataset.id)
    }

    if (e.target.classList.contains("deleteSaleBtn")) {
        deleteSale(e.target.dataset.id)
    }

    if (e.target.classList.contains("deleteCreditBtn")) {
        deleteCredit(e.target.dataset.id)
    }

    if (e.target.classList.contains("deleteUserBtn")) {
        deleteUser(e.target.dataset.id)
    }

    // if (e.target.classList.contains("editSaleBtn")) {
    //     editSale(e.target.dataset.id)
    // }

    if (e.target.classList.contains("editUserBtn")) {
        editUser(e.target.dataset.id)
    }

    // if (e.target.classList.contains("editSaleBtn")) {
    //     editSale(e.target.dataset.id)
    // }

    // if (e.target.classList.contains("editProcBtn")) {
    //     editProcurement(e.target.dataset.id)
    // }
})