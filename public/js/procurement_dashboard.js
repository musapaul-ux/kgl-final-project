
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

      // Load procurements table
    async function loadProcurements() {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/procurement`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("API_BASE_URL:", API_BASE_URL);
          console.log("Fetched data", res);
          const procurements = await res.json();
          const tbody = document.getElementById("procurementsTableBody");

          if (procurements.length === 0) {
            tbody.innerHTML =
              "<tr><td colspan='8' style='text-align:center;'>No procurements recorded yet.</td></tr>";
            return;
          }

          tbody.innerHTML = procurements
            .map(
              (p) => `
              <tr>
                <td>${new Date(p.date).toLocaleDateString()}</td>
                <td>${p.produceName}</td>
                <td>${p.supplierName}</td>
                <td>${p.supplierType}</td>
                <td>${p.tonnageKgs}</td>
                <td>${p.branchName}</td>
                <td>${p.costUgx.toLocaleString()}</td>
                <td>
                  <button onclick="deleteProcurement('${p._id}')" style="padding:5px 10px; background:#d63384; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
              </tr>
            `,
            )
            .join("");
        } catch (err) {
          document.getElementById("procurementMessage").innerHTML =
            `<p style="color:red;">Error loading procurements: ${err.message}</p>`;
          document.getElementById("procurementsTableBody").innerHTML =
            `<tr><td colspan="8" style="text-align:center; color:red;">${err.message}</td></tr>`;
        }
    }

      // Delete procurement
    async function deleteProcurement(id) {
        if (!confirm("Are you sure you want to delete this procurement?"))
          return;
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(`${API_BASE_URL}/procurement/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.message || "Failed to delete");
          document.getElementById("procurementMessage").textContent =
            "Procurement deleted successfully!";
          document.getElementById("procurementMessage").style.color = "green";
          setTimeout(() => loadProcurements(), 1000);
        } catch (err) {
          document.getElementById("procurementMessage").textContent =
            err.message;
          document.getElementById("procurementMessage").style.color = "red";
        }
    }

      // Load on page load
    loadProcurements();