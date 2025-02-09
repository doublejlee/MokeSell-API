// **User Authentication**
document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message);
});

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "dashboard.html";
    } else {
        alert("Login failed: " + data.message);
    }
});

// **Fetch Listings**
async function fetchListings() {
    const response = await fetch("http://localhost:5000/listings");
    const listings = await response.json();
    document.getElementById("listings-container").innerHTML = listings
        .map((l) => `<div><h3>${l.title}</h3><p>$${l.price}</p></div>`)
        .join("");
}

window.onload = fetchListings;

// **Fetch Leaderboard**
async function fetchLeaderboard() {
    const response = await fetch("http://localhost:5000/leaderboard");
    const leaderboard = await response.json();
    document.getElementById("leaderboard-container").innerHTML = leaderboard
        .map((u) => `<p>${u.username} - Sales: ${u.sales}</p>`)
        .join("");
}

window.onload = () => {
    fetchListings();
    fetchLeaderboard();
};

// **Fetch Countdown Timer**
async function fetchCountdown() {
    const response = await fetch("http://localhost:5000/timer");
    const data = await response.json();
    document.getElementById("countdown-timer").innerText = `Flash Sale Ends In: ${data.countdown} seconds`;
}

setInterval(fetchCountdown, 1000);
