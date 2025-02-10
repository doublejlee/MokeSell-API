// **server.js - Backend API for MokeSell Race to Sell**
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

// ✅ 1️⃣ **Connect to MongoDB**
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ 2️⃣ **Define Mongoose Models**
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Listing = mongoose.model("Listing", new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
}));

const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    sales: { type: Number, default: 0 }
}));

let countdown = 600; // 10-minute flash sale countdown

// ✅ 3️⃣ **Define Authentication Middleware**
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Please log in first." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        req.user = user;
        next();
    });
};

// ✅ 4️⃣ **User Authentication API**
app.post("/auth/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

app.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ 5️⃣ **Product Listings API**
app.get("/listings", async (req, res) => {
    try {
        const listings = await Listing.find().populate("seller", "username");
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching listings" });
    }
});

app.post("/listings", authenticateToken, async (req, res) => {
    try {
        console.log("📌 Debugging - Received Request Body:", req.body);

        let { title, price } = req.body;
        
        if (!title || title.trim() === "" || isNaN(price) || price <= 0) {
            console.error("📌 Debugging - Validation Failed. Title:", title, "| Price:", price);
            return res.status(400).json({ message: "All fields are required and must be valid." });
        }

        const newListing = new Listing({ 
            title: title.trim(), 
            price: parseFloat(price), 
            seller: req.user.id
        });

        await newListing.save();
        res.status(201).json({ message: "Listing created successfully", newListing });
    } catch (error) {
        console.error("📌 Debugging - Server Error:", error);
        res.status(400).json({ message: "Error creating listing" });
    }
});

// ✅ 6️⃣ **Leaderboard API**
app.get("/leaderboard", async (req, res) => {
    try {
        const rankings = await Leaderboard.find().sort({ sales: -1 });
        res.json(rankings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching leaderboard" });
    }
});

app.post("/leaderboard", authenticateToken, async (req, res) => {
    try {
        const { sales } = req.body;

        if (isNaN(sales) || sales <= 0) {
            return res.status(400).json({ message: "Sales must be a valid number." });
        }

        const user = await Leaderboard.findOneAndUpdate(
            { username: req.user.username },
            { $inc: { sales } }, // Increment sales
            { new: true, upsert: true }
        );

        res.json({ message: "Leaderboard updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating leaderboard" });
    }
});

// ✅ 7️⃣ **Countdown Timer API**
app.get("/timer", (req, res) => {
    res.json({ countdown });
});

// ✅ 8️⃣ **Real-Time Countdown Updates**
setInterval(() => {
    if (countdown > 0) {
        countdown--;
        io.emit("updateTimer", countdown);
    }
}, 1000);

// ✅ 9️⃣ **Start the Server**
const PORT = process.env.PORT || 5008;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ✅ 10️⃣ **Handle Unexpected Errors**
process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

// ✅ Populate Fake Leaderboard Data
async function populateFakeLeaderboard() {
    const fakeUsers = [
        { username: "Alice", sales: 25 },
        { username: "Bob", sales: 20 },
        { username: "Charlie", sales: 18 },
        { username: "David", sales: 15 },
        { username: "Eve", sales: 12 },
        { username: "Frank", sales: 10 },
        { username: "Grace", sales: 8 },
        { username: "Hannah", sales: 6 },
        { username: "Ivy", sales: 5 },
        { username: "Jack", sales: 3 }
    ];

    try {
        const existingData = await Leaderboard.find();
        if (existingData.length === 0) {
            await Leaderboard.insertMany(fakeUsers);
            console.log("✅ Fake leaderboard data inserted.");
        } else {
            console.log("✅ Leaderboard already has data.");
        }
    } catch (error) {
        console.error("❌ Error inserting fake leaderboard data:", error);
    }
}
io.on("connection", (socket) => {
    console.log("🟢 New WebSocket Connection: ", socket.id);
});
app.get("/listings", async (req, res) => {
    try {
        // Fake product data
        const fakeListings = [
            { title: "Gaming Laptop", price: 1200, seller: { username: "Alice" } },
            { title: "Wireless Headphones", price: 150, seller: { username: "Bob" } },
            { title: "Smartphone", price: 900, seller: { username: "Charlie" } },
            { title: "Mechanical Keyboard", price: 75, seller: { username: "David" } },
            { title: "4K Monitor", price: 300, seller: { username: "Eve" } }
        ];

        res.json(fakeListings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching listings" });
    }
});



// Call function on server startup
populateFakeLeaderboard();


