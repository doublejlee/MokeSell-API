// **dashboard.js - Fetch and Display Dashboard Data**

const API_BASE_URL = "http://localhost:5008"; // Ensure correct API port

// ✅ 1️⃣ Fetch User Data and Display Welcome Message
async function fetchUserData() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        const userDisplay = document.getElementById("welcome-message");
        if (userDisplay) userDisplay.innerText = `Welcome, ${data.username}!`;
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// ✅ 2️⃣ Fetch Leaderboard Data and Display
async function fetchLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
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



// ✅ 4️⃣ Fetch Flash Sale Countdown Timer
async function fetchCountdown() {
    try {
        const response = await fetch(`${API_BASE_URL}/timer`);
        if (!response.ok) throw new Error("Failed to fetch countdown");

        const data = await response.json();
        const countdownElement = document.getElementById("countdown-timer");

        if (countdownElement) countdownElement.innerText = `Flash Sale Ends In: ${data.countdown} seconds`;
    } catch (error) {
        console.error("Error fetching countdown:", error);
    }
}

// Automatically refresh countdown every second
setInterval(fetchCountdown, 1000);

// ✅ 5️⃣ Logout Function
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully.");
    window.location.href = "index.html";
}

// Attach logout function to the button
const logoutButton = document.getElementById("logout");
if (logoutButton) logoutButton.addEventListener("click", logout);

// ✅ 6️⃣ Lottie Animations (Optimized)
function loadLottieAnimation(containerId, animationPath) {
    const container = document.getElementById(containerId);
    if (container) {
        lottie.loadAnimation({
            container: container,
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: animationPath
        });
    }
}

// ✅ Load Lottie Animations
if (typeof lottie !== "undefined") {
    loadLottieAnimation("loading-animation", "https://assets10.lottiefiles.com/packages/lf20_j1adxtyb.json");
    loadLottieAnimation("countdown-animation", "https://assets3.lottiefiles.com/packages/lf20_f3gmyxq4.json");
} else {
    console.error("❌ Lottie library not loaded.");
}


function showLoadingAnimation() {
    const loadingContainer = document.getElementById("loading-animation");
    loadingContainer.style.display = "flex";

    lottie.loadAnimation({
        container: document.getElementById("loading-lottie"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets2.lottiefiles.com/packages/lf20_j1adxtyb.json"
    });


    setTimeout(() => {
        loadingContainer.style.display = "none"; // Hide animation after loading
    }, 3000);
}
function startCountdownAnimation() {
    lottie.loadAnimation({
        container: document.getElementById("countdown-lottie"),
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets3.lottiefiles.com/private_files/lf30_f3gmyxq4.json"
    });
}
startCountdownAnimation();
async function fetchFakeListings() {
    // Fake product data
    const fakeListings = [
        { title: "Gaming Laptop", price: 1200, seller: "Alice" },
        { title: "Wireless Headphones", price: 150, seller: "Bob" },
        { title: "Smartphone", price: 900, seller: "Charlie" },
        { title: "Mechanical Keyboard", price: 75, seller: "David" },
        { title: "4K Monitor", price: 300, seller: "Eve" }
    ];

    const listingsContainer = document.getElementById("listings-container");
    listingsContainer.innerHTML = ""; // Clear previous entries

    fakeListings.forEach(listing => {
        const div = document.createElement("div");
        div.classList.add("listing");
        div.innerHTML = `
            <h3>${listing.title}</h3>
            <p>Price: $${listing.price}</p>
            <p>Seller: ${listing.seller}</p>
        `;
        listingsContainer.appendChild(div);
    });
}




window.onload = () => {
    showLoadingAnimation();
    fetchLeaderboard();
    fetchCountdown();
    fetchFakeListings();
};



