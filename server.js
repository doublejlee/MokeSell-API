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
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if connection fails
    });

// ✅ 2️⃣ **Define Mongoose Models**
const User = mongoose.model("User", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Listing = mongoose.model("Listing", new mongoose.Schema({
    title: String,
    price: Number,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
}));

const Leaderboard = mongoose.model("Leaderboard", new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    sales: { type: Number, default: 0 }
}));

let countdown = 600; // 10-minute flash sale countdown

// ✅ 3️⃣ **User Authentication API**
app.post("/auth/signup", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ message: "Username already exists" });
    }
});

app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// ✅ 4️⃣ **Product Listings API**
app.get("/listings", async (req, res) => {
    const listings = await Listing.find().populate("seller", "username");
    res.json(listings);
});

app.post("/listings", async (req, res) => {
    try {
        const { title, price, sellerId } = req.body;
        const newListing = new Listing({ title, price, seller: sellerId });

        await newListing.save();
        res.status(201).json({ message: "Listing created successfully", newListing });
    } catch (error) {
        res.status(400).json({ message: "Error creating listing" });
    }
});

// ✅ 5️⃣ **Leaderboard API**
app.get("/leaderboard", async (req, res) => {
    const rankings = await Leaderboard.find().sort({ sales: -1 });
    res.json(rankings);
});

app.post("/leaderboard", async (req, res) => {
    try {
        const { username, sales } = req.body;
        const user = await Leaderboard.findOneAndUpdate(
            { username },
            { $inc: { sales } },
            { new: true, upsert: true }
        );

        io.emit("updateLeaderboard", await Leaderboard.find().sort({ sales: -1 }));
        res.json({ message: "Leaderboard updated", user });
    } catch (error) {
        res.status(400).json({ message: "Error updating leaderboard" });
    }
});

// ✅ 6️⃣ **Countdown Timer API**
app.get("/timer", (req, res) => {
    res.json({ countdown });
});

// ✅ 7️⃣ **Real-Time Countdown Updates**
setInterval(() => {
    if (countdown > 0) {
        countdown--;
        io.emit("updateTimer", countdown);
    }
}, 1000);

// ✅ 8️⃣ **Start the Server**
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

