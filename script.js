// ✅ Load Lottie Animations
function loadLottieAnimation(containerId, animationPath) {
    const container = document.getElementById(containerId);
    if (container) {
        lottie.loadAnimation({
            container: container,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: animationPath
        });
    }
}

// ✅ Show Success Animation
function playSuccessAnimation(message, redirectUrl = null) {
    const animationContainer = document.getElementById("success-animation");
    animationContainer.classList.remove("hidden");
    animationContainer.querySelector("p").innerText = message;

    loadLottieAnimation("success-lottie", "https://assets3.lottiefiles.com/private_files/lf30_kqshlcsx.json");

    setTimeout(() => {
        animationContainer.classList.add("hidden");
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, 3000);
}

// ❌ Show Error Animation
function playErrorAnimation(message) {
    const animationContainer = document.getElementById("error-animation");
    animationContainer.classList.remove("hidden");
    animationContainer.querySelector("p").innerText = message;

    loadLottieAnimation("error-lottie", "https://assets5.lottiefiles.com/private_files/lf30_ychj9qcr.json");

    setTimeout(() => {
        animationContainer.classList.add("hidden");
    }, 3000);
}

// ✅ Login Form Submission
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:5005/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        playSuccessAnimation("Login Successful! Redirecting...", "dashboard.html");
    } else {
        playErrorAnimation("Invalid credentials! Try again.");
    }
});

// ✅ Signup Form Submission
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch("http://localhost:5005/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (response.ok) {
        playSuccessAnimation("Signup Successful! Redirecting to login...", "index.html");
    } else {
        playErrorAnimation("Username already exists! Try again.");
    }
});

// ✅ Fetch Product Listings
async function fetchListings() {
    try {
        const response = await fetch("http://localhost:5005/listings");
        if (!response.ok) throw new Error("Failed to fetch listings");

        const listings = await response.json();
        const listingsContainer = document.getElementById("listings-container");

        if (listingsContainer) {
            listingsContainer.innerHTML = "";
            listings.forEach(listing => {
                const div = document.createElement("div");
                div.classList.add("listing");
                div.innerHTML = `<h3>${listing.title}</h3><p>Price: $${listing.price}</p>`;
                listingsContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// ✅ Fetch Leaderboard Data
async function fetchLeaderboard() {
    try {
        const response = await fetch("http://localhost:5005/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const leaderboard = await response.json();
        const leaderboardContainer = document.getElementById("leaderboard-container");

        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = "";
            leaderboard.forEach(user => {
                const div = document.createElement("div");
                div.classList.add("leaderboard-entry");
                div.innerHTML = `<p>${user.username} - Sales: ${user.sales}</p>`;
                leaderboardContainer.appendChild(div);
            });
        }
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}

// ✅ Flash Sale Countdown Timer
async function fetchCountdown() {
    try {
        const response = await fetch("http://localhost:5005/timer");
        if (!response.ok) throw new Error("Failed to fetch countdown");

        const data = await response.json();
        const countdownElement = document.getElementById("countdown-timer");

        if (countdownElement) countdownElement.innerText = `Flash Sale Ends In: ${data.countdown} seconds`;
    } catch (error) {
        console.error("Error fetching countdown:", error);
    }
}

// ✅ Load Countdown Timer Animation
function startCountdownAnimation() {
    lottie.loadAnimation({
        container: document.getElementById("countdown-lottie"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets3.lottiefiles.com/private_files/lf30_f3gmyxq4.json"
    });
}

// ✅ Show Loading Animation Before Content Loads
function showLoadingAnimation() {
    const loadingContainer = document.getElementById("loading-animation");
    if (loadingContainer) {
        loadingContainer.style.display = "flex";

        lottie.loadAnimation({
            container: document.getElementById("loading-lottie"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "https://assets2.lottiefiles.com/packages/lf20_j1adxtyb.json"
        });

        setTimeout(() => {
            loadingContainer.style.display = "none";
        }, 3000);
    }
}

// ✅ Logout Function
function logout() {
    localStorage.removeItem("token");
    playSuccessAnimation("Logged out successfully!", "index.html");
}

// ✅ Attach Logout Function to Button
document.getElementById("logout")?.addEventListener("click", logout);

// ✅ Run Functions on Page Load
window.onload = () => {
    showLoadingAnimation();
    fetchLeaderboard();
    fetchListings();
    fetchCountdown();
    startCountdownAnimation();
};

