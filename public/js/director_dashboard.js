document.querySelector(".logoutbtn").addEventListener("click", logoutUser)

async function loadDashboard() {

    const token = localStorage.getItem("token");

    const summary = await fetch("/api/director/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const branch = await fetch("/api/director/branch-performance", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const monthly = await fetch("/api/director/monthly-sales", {
        headers: { Authorization: `Bearer ${token}` }
    });

    const summaryData = await summary.json();
    const branchData = await branch.json();
    const monthlyData = await monthly.json();

    displayCards(summaryData);
    createBranchChart(branchData);
    createMonthlyChart(monthlyData);
    createBranchTable(branchData);

}



function displayCards(data) {

    document.getElementById("stock").innerText =
        data.totalStock.toLocaleString() + "Kgs ";

    document.getElementById("revenue").innerText = "Ugx " +
        data.totalRevenue.toLocaleString();

    document.getElementById("credit").innerText = "Ugx " +
        data.outstandingCredits.toLocaleString() ;

}



function createBranchChart(branchData) {

    const labels = branchData.map(b => b._id);

    const revenue = branchData.map(b => b.totalRevenue);

    new Chart(document.getElementById("branchChart"), {

        type: "bar",

        data: {
            labels: labels,
            datasets: [{
                label: "Branch Revenue",
                data: revenue
            }]
        }

    });

}



function createMonthlyChart(monthlyData) {

    const labels = monthlyData.map(m =>
        `${m._id.month}/${m._id.year}`
    );

    const revenue = monthlyData.map(m => m.totalRevenue);

    new Chart(document.getElementById("monthlyChart"), {

        type: "line",

        data: {
            labels: labels,
            datasets: [{
                label: "Monthly Revenue",
                data: revenue
            }]
        }

    });

}



function createBranchTable(branchData) {

    const table = document.getElementById("branchTable");

    const rows = branchData.map(b => `
        <tr>
            <td>${b._id}</td>
            <td>${b.totalQuantitySold}</td>
            <td>${b.totalRevenue}</td>
        </tr>
    `).join("");

    table.innerHTML = rows;
}



loadDashboard();