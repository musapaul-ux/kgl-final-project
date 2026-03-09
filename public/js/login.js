

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

// handling nabkground slides show
const body = document.body;
        const classes = [
            'slideshow-1','slideshow-2','slideshow-3',
            'slideshow-4','slideshow-5','slideshow-6'
        ];
        let index = 0;

        function nextSlide() {
            body.className = classes[index];
            index = (index + 1) % classes.length;
        }

        // Start with first image visible
        nextSlide();

        // Change every 7 seconds
        setInterval(nextSlide, 6000);
