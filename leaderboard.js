const socket = io("http://localhost:5008");




async function fetchLeaderboard() {
    try {
        const response = await fetch("http://localhost:5008/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");

        const leaderboard = await response.json();
        const leaderboardTable = document.getElementById("leaderboard");

        leaderboardTable.innerHTML = ""; // Clear previous entries

        leaderboard.forEach((user, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.username}</td>
                <td>${user.sales}</td>
            `;
            leaderboardTable.appendChild(row);
        });
    } catch (error) {
        alert("Error loading leaderboard: " + error.message);
    }
}

// ✅ Run on Page Load
window.onload = fetchLeaderboard;



// ✅ 2️⃣ **Listen for Real-Time Leaderboard Updates**
socket.on("updateLeaderboard", (leaderboard) => {
    fetchLeaderboard();
});
