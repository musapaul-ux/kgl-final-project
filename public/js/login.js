

const loginForm = document.getElementById("loginForm");
const errorMessageEl = document.getElementById("errorMessage");

loginForm.addEventListener("submit", async (e)=>{
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    errorMessageEl.style.display = "none";
    errorMessageEl.textContent = "";
    try{
        await loginUser(email, password);
        
    } catch (error) {
        errorMessageEl.style.display = "block";
        errorMessageEl.textContent = error.message || "Login failed. Please try again.";
    }

})
