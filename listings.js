// ✅ Ensure User is Logged In Before Accessing Listings
window.onload = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first!");
        window.location.href = "index.html";
    } else {
        fetchListings();
    }
};

// ✅ 1️⃣ **Fetch Listings from API**
async function fetchListings() {
    const loadingContainer = document.getElementById("loading-animation");
    loadingContainer.innerHTML = "Loading...";

    try {
        const response = await fetch("http://localhost:5008/listings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch listings");

        const listings = await response.json();
        const listingsContainer = document.getElementById("listings");
        listingsContainer.innerHTML = "";

        if (listings.length === 0) {
            listingsContainer.innerHTML = "<p>No listings available.</p>";
        } else {
            listings.forEach(listing => {
                const div = document.createElement("div");
                div.classList.add("listing");
                div.innerHTML = `
                    <h3>${listing.title}</h3>
                    <p>Price: $${listing.price}</p>
                    <p>Seller: ${listing.seller.username}</p>
                `;
                listingsContainer.appendChild(div);
            });
        }
    } catch (error) {
        alert("Error loading listings: " + error.message);
    } finally {
        loadingContainer.innerHTML = ""; // Remove loading animation
    }
}

// ✅ 2️⃣ **Add New Listing**
document.getElementById("listing-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const priceInput = document.getElementById("price").value.trim(); // Read input as a string
    const price = parseFloat(priceInput); 
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first!");
        return;
    }

    console.log("📌 Debugging - Data Sent to API:");
    console.log("Title:", title);
    console.log("Price:", price);
    console.log("JSON Payload:", JSON.stringify({ title, price }));

    if (!token) {
        alert("Please log in first!");
        return;
    }

    if (!title || title.length < 1 || isNaN(price) || price <= 0) {
        alert("All fields are required and must be valid!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/listings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                title, 
                price, 
                description: "Default description",  // Add dummy data for required fields
                category: "General"                  // Change based on your API requirements
            })
            

        });

        const data = await response.json();
        console.log("📌 Debugging - Response from Server:", data);

        if (!response.ok) throw new Error(data.message);

        alert("Listing added successfully!");
        document.getElementById("listing-form").reset();
        fetchListings(); // Refresh listings
    } catch (error) {
        alert("Error adding listing: " + error.message);
        console.error("📌 Debugging - Error details:", error);
    }
});




