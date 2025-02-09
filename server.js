// **server.js - Backend API for MokeSell Race to Sell**

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

const users = [];
const listings = [];
const leaderboard = [];
let countdown = 600; // 10-minute flash sale countdown

// 1️⃣ **User Authentication**
app.post("/auth/signup", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
});

app.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
        res.json({ token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// 2️⃣ **Product Listings API**
app.get("/listings", (req, res) => {
    res.json(listings);
});

app.post("/listings", (req, res) => {
    const { title, price, seller } = req.body;
    const listing = { id: listings.length + 1, title, price, seller };
    listings.push(listing);
    res.status(201).json({ message: "Listing created successfully", listing });
});

// 3️⃣ **Leaderboard API**
app.get("/leaderboard", (req, res) => {
    res.json(leaderboard.sort((a, b) => b.sales - a.sales));
});

app.post("/leaderboard", (req, res) => {
    const { username, sales } = req.body;
    const user = leaderboard.find((u) => u.username === username);
    if (user) {
        user.sales += sales;
    } else {
        leaderboard.push({ username, sales });
    }
    io.emit("updateLeaderboard", leaderboard);
    res.json({ message: "Leaderboard updated", leaderboard });
});

// 4️⃣ **Countdown Timer API**
app.get("/timer", (req, res) => {
    res.json({ countdown });
});

setInterval(() => {
    if (countdown > 0) {
        countdown--;
        io.emit("updateTimer", countdown);
    }
}, 1000);

server.listen(5000, () => console.log("Server running on port 5000"));
