
document.getElementById("logoutBtn").addEventListener("click", logoutUser);

// Load procurements table
async function loadUsers() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    const users = await res.json();
    const tbody = document.getElementById("usersTableBody");

    if (users.length === 0) {
      tbody.innerHTML =
        "<tr><td colspan='8' style='text-align:center;'>No procurements recorded yet.</td></tr>";
      return;
    }

    tbody.innerHTML = users
      .map(
        (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${p.email}</td>
                <td>${p.role}</td>
                <td>${p.branch}</td>
                <td>
                  <button class='editBtn' data-id="${p._id}" style="padding:5px 10px; background:green; color:white; border:none; border-radius:4px; cursor:pointer;">Edit</button>
                  <button class='deleteBtn' data-id="${p._id}" style="padding:5px 10px; background:#d63384; color:white; border:none; border-radius:4px; cursor:pointer;">Delete</button>
                </td>
              
              </tr>
            `,
      )
      .join("");
  } catch (err) {
    document.getElementById("userMessage").innerHTML =
      `<p style="color:red;">Error loading users: ${err.message}</p>`;
    document.getElementById("usersTableBody").innerHTML =
      `<tr><td colspan="8" style="text-align:center; color:red;">${err.message}</td></tr>`;
  }
}

// Delete user
async function deleteUser(id) {
  if (!confirm("Are you sure you want to delete this user?"))
    return;
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete");
    document.getElementById("userMessage").textContent =
      "User deleted successfully!";
    document.getElementById("userMessage").style.color = "green";
    setTimeout(() => loadUsers(), 1000);
  } catch (err) {
    document.getElementById("userMessage").textContent =
      err.message;
    document.getElementById("userMessage").style.color = "red";
  }
}

async function editUser(id) {

  try {

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();
    console.log("Fetched user for editing:", user);
    document.getElementById("editUserId").value = user._id;
    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editRole").value = user.role;
    document.getElementById("editBranch").value = user.branch;

    document.getElementById("editUserModal").style.display = "block";

  } catch (err) {
    console.error(err);
  }
}

async function updateUser() {

    const id = document.getElementById("editUserId").value;

    const updatedUser = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        role: document.getElementById("editRole").value,
        branch: document.getElementById("editBranch").value
    };

    try {

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(updatedUser)
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.message);

        document.getElementById("userMessage").textContent = "User updated successfully!";
        document.getElementById("userMessage").style.color = "green";

        document.getElementById("editUserModal").style.display = "none";

        loadUsers();

    } catch (err) {

        document.getElementById("userMessage").textContent = err.message;
        document.getElementById("userMessage").style.color = "red";

    }

}

function closeEdit(){
    document.getElementById("editUserModal").style.display = "none";
}



// Load on page load
document.addEventListener("DOMContentLoaded", () => {
  loadUsers();

  const tableBody = document.getElementById("usersTableBody");

  tableBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("deleteBtn")) {
      const userId = e.target.getAttribute("data-id");
      console.log("Deleting user with ID:", userId);
      deleteUser(userId);
    }
    if (e.target.classList.contains("editBtn")) {

      const saveBtn = document.querySelector(".saveBtn");
      const cancelBtn = document.querySelector(".cancelBtn");
      const closeBtn = document.querySelector(".closeBtn");

      const userId = e.target.getAttribute("data-id");
      console.log("Editing user with ID:", userId);
      editUser(userId);

      saveBtn.onclick = function() {
        updateUser();
      }

      cancelBtn.onclick = function() {
        closeEdit();
      }

      closeBtn.onclick = function() {
        closeEdit();
      }

    }
     
  });
});

