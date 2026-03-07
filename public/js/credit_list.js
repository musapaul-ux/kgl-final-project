
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

      // Load procurements table
    async function loadProcurements() {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/credit`, {
            headers: { Authorization: `Bearer ${token}` },
          });

         
          const credits = await res.json();
          console.log("Fetched credit data", credits);
          const tbody = document.getElementById("salesTableBody");

          if (credits.length === 0) {
            tbody.innerHTML =
              "<tr><td colspan='8' style='text-align:center;'>No credit sales recorded yet.</td></tr>";
            return;
          }

          tbody.innerHTML = credits   
            .map(
              (c) => `
              <tr>
                <td>${new Date(c.dispatchDate).toLocaleDateString()}</td>
                <td>${new Date(c.dueDate).toLocaleDateString()}</td>
                <td>${c.produceName}</td>
                <td>${c.salesAgentName}</td>
                <td>${c.buyerName}</td>
                <td>${c.tonnageKgs}</td>
                <td>${c.branchName}</td>
                <td>${c.amountDue.toLocaleString()}</td>
                <td >
                  <button class='deleteBtn' data-id="${c._id}" style="padding:5px 10px; background:#d63384; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
              </tr>
            `,
            )
            .join("");
        } catch (err) {
          document.getElementById("salesMessage").innerHTML =
            `<p style="color:red;">Error loading credit sales: ${err.message}</p>`;
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
          const res = await fetch(`${API_BASE_URL}/credit/${id}`, {
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