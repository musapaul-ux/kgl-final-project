document.getElementById("logoutBtn").addEventListener("click", logoutUser);

      document
        .getElementById("createUserForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();
          const token = localStorage.getItem("token");
          const data = {
            name: document.getElementById("userName").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value,
            role: document.getElementById("userRole").value,
            branch: document.getElementById("userBranch").value,
          };

          try {
            const res = await fetch(`${API_BASE_URL}/users`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed");
            document.getElementById("userMessage").textContent = "User created";
          } catch (err) {
            document.getElementById("userMessage").textContent = err.message;
          }
        });