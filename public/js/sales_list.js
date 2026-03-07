
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

      // Load procurements table
    async function loadProcurements() {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/sales`, {
            headers: { Authorization: `Bearer ${token}` },
          });

         
          const sales = await res.json();
          console.log("Fetched sales data", sales);
          const tbody = document.getElementById("salesTableBody");

          if (sales.length === 0) {
            tbody.innerHTML =
              "<tr><td colspan='8' style='text-align:center;'>No sales recorded yet.</td></tr>";
            return;
          }

          tbody.innerHTML = sales   
            .map(
              (s) => `
              <tr>
                <td>${new Date(s.date).toLocaleDateString()}</td>
                <td>${s.produceName}</td>
                <td>${s.salesAgentName}</td>
                <td>${s.buyerName}</td>
                <td>${s.tonnageKgs}</td>
                <td>${s.branchName}</td>
                <td>${s.amountPaid.toLocaleString()}</td>
                <td>
                  <button class='deleteBtn' data-id="${s._id}" style="padding:5px 10px; background:#d63384; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
              </tr>
            `,
            )
            .join("");
        } catch (err) {
          document.getElementById("salesMessage").innerHTML =
            `<p style="color:red;">Error loading sales: ${err.message}</p>`;
          document.getElementById("salesTableBody").innerHTML =
            `<tr><td colspan="8" style="text-align:center; color:red;">${err.message}</td></tr>`;
        }
    }

      // Delete sale
    async function deleteSale(id) {
        if (!confirm("Are you sure you want to delete this sale?"))
          return;
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/sales/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to delete");
          document.getElementById("salesMessage").textContent =
            "Sale deleted successfully!";
          document.getElementById("salesMessage").style.color = "green";
          setTimeout(() => loadProcurements(), 1000);
        } catch (err) {
          document.getElementById("salesMessage").textContent =
            err.message;
          document.getElementById("salesMessage").style.color = "red";
        }
    }

      // Load on page load
    document.addEventListener("DOMContentLoaded", () => {
    loadProcurements();

    const tableBody = document.getElementById("salesTableBody");

    tableBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("deleteBtn")) {
            const saleId = e.target.getAttribute("data-id");
            console.log("Deleting sale with ID:", saleId);
            deleteSale(saleId);
        }
    });
});