
    document.getElementById("logout-btn").addEventListener("click", logoutUser);
     
     document
        .getElementById("creditForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const token = localStorage.getItem("token");

          const data = {
            buyerName: document.getElementById("buyerName").value,
            nationalId: document.getElementById("nationalId").value,
            location: document.getElementById("location").value,
            contact: document.getElementById("contact").value,
            produceName: document.getElementById("produceName").value,
            produceType: document.getElementById("produceType").value,
            tonnageKgs: parseFloat(document.getElementById("tonnageKgs").value),
            amountDue: parseFloat(document.getElementById("amountDue").value),
            branchName: document.getElementById("branchName").value,
            salesAgentName: document.getElementById("salesAgentName").value,
            dispatchDate: document.getElementById("dispatchDate").value,
            dueDate: document.getElementById("dueDate").value,
          };

          try {
            const res = await fetch(`${API_BASE_URL}/credit`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message);

            document.getElementById("message").textContent =
              "✓ Credit sale recorded successfully!";
            document.getElementById("message").style.color = "green";

            document.getElementById("creditForm").reset();
          } catch (err) {
            document.getElementById("message").textContent = "✗ " + err.message;
            document.getElementById("message").style.color = "red";
          }
        });
    