
// js/auth.js

// LOGIN FUNCTION
async function loginUser(email, password) {
    const errorMessageEl = document.getElementById("errorMessage");
    errorMessageEl.style.display = "none";
    errorMessageEl.textContent = "";

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        // Save token
        localStorage.setItem("token", data.token);
        console.log("Login successful, token stored:", data.token);

        // Decode token to get role and branch
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        console.log(payload);
        const role = payload.role;
        const branch = payload.branch;
        const name = payload.name;

        console.log("User role:", role);
        console.log("User branch:", branch);
        console.log("User name:", name);

        // Save user info in localStorage
        localStorage.setItem("userRole", role);
        localStorage.setItem("userBranch", branch);
        localStorage.setItem("userName", name);

        // Role-based redirect
        if (role === "Director") {
            window.location.href = "director_dashboard.html";
        } else if (role === "Manager") {
            window.location.href = "manager.html";
        } else if (role === "SalesAgent") {
            window.location.href = "sales_dashboard.html";
        } else {
            window.location.href = "login.html";
        }

    } catch (error) {
        errorMessageEl.textContent = "❌ " + error.message;
        errorMessageEl.style.display = "block";
        errorMessageEl.style.backgroundColor = "#fde4e6";
        errorMessageEl.style.color = "#d63384";
        errorMessageEl.style.borderLeft = "4px solid #d63384";
        errorMessageEl.style.padding = "10px 12px";
    }
}


// LOGOUT FUNCTION
function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userBranch");
    window.location.href = "login.html";
}