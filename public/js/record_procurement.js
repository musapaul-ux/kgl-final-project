document.getElementById("logoutBtn").addEventListener("click", logoutUser);
      // Set today's date as default
      document.getElementById("date").valueAsDate = new Date();

      // Update supplier name placeholder based on supplier type
      function updateSupplierNameOptions() {
        const supplierType = document.getElementById("supplierType").value;
        const supplierNameInput = document.getElementById("supplierName");
        if (supplierType === "Farm") {
          supplierNameInput.placeholder =
            "Must match selected branch (Maganjo or Matugga)";
        } else if (supplierType === "Company") {
          supplierNameInput.placeholder = "e.g., ABC Trading Company";
        } else if (supplierType === "Individual") {
          supplierNameInput.placeholder = "e.g., John Doe (min 1000kg)";
        } else {
          supplierNameInput.placeholder = "Enter supplier name";
        }
      }

      // Submit form
      document
        .getElementById("procurementForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const token = localStorage.getItem("token");

          const data = {
            produceName: document.getElementById("produceName").value,
            produceType: document.getElementById("produceType").value,
            supplierType: document.getElementById("supplierType").value,
            supplierName: document.getElementById("supplierName").value,
            tonnageKgs: parseFloat(document.getElementById("tonnageKgs").value),
            costUgx: parseFloat(document.getElementById("costUgx").value),
            branchName: document.getElementById("branchName").value,
            contact: document.getElementById("contact").value,
            PriceToBeSoldAt: parseFloat(
              document.getElementById("PriceToBeSoldAt").value,
            ),
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
          };

          try {
            const res = await fetch(`${API_BASE_URL}/procurement`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok)
              throw new Error(result.message || "Failed to record procurement");

            document.getElementById("procurementMessage").textContent =
              "✓ Procurement recorded successfully!";
            document.getElementById("procurementMessage").style.color = "green";
            document.getElementById("procurementForm").reset();
            document.getElementById("date").valueAsDate = new Date();

            setTimeout(() => {
              window.location.href = "manager_dashboard.html";
            }, 1500);
          } catch (err) {
            document.getElementById("procurementMessage").textContent =
              "✗ " + err.message;
            document.getElementById("procurementMessage").style.color = "red";
          }
        });