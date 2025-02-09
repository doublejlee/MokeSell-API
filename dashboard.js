// dashboard.js - Fetch and Display Dashboard Data

// 1️⃣ Fetch User Data and Display Welcome Message
async function fetchUserData() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    const response = await fetch("http://localhost:5000/user/profile", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });
    const data = await response.json();
    document.getElementById("welcome-message").innerText = `Welcome, ${data.username}!`;
}

// 2️⃣ Fetch Leaderboard Data and Display
async function fetchLeaderboard() {
    const response = await fetch("http://localhost:5000/leaderboard");
    const leaderboard = await response.json();
    
    const leaderboardContainer = document.getElementById("leaderboard-container");
    leaderboardContainer.innerHTML = "";
    leaderboard.forEach(user => {
        const div = document.createElement("div");
        div.classList.add("leaderboard-entry");
        div.innerHTML = `<p>${user.username} - Sales: ${user.sales}</p>`;
        leaderboardContainer.appendChild(div);
    });
}

// 3️⃣ Fetch User Listings and Display
async function fetchListings() {
    const response = await fetch("http://localhost:5000/listings");
    const listings = await response.json();
    
    const listingsContainer = document.getElementById("listings-container");
    listingsContainer.innerHTML = "";
    listings.forEach(listing => {
        const div = document.createElement("div");
        div.classList.add("listing");
        div.innerHTML = `<h3>${listing.title}</h3><p>Price: $${listing.price}</p>`;
        listingsContainer.appendChild(div);
    });
}

// 4️⃣ Fetch Flash Sale Countdown Timer
async function fetchCountdown() {
    const response = await fetch("http://localhost:5000/timer");
    const data = await response.json();
    document.getElementById("countdown-timer").innerText = `Flash Sale Ends In: ${data.countdown} seconds`;
}
setInterval(fetchCountdown, 1000);

// 5️⃣ Logout Function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Call functions on page load
window.onload = () => {
    fetchUserData();
    fetchLeaderboard();
    fetchListings();
    fetchCountdown();
};
