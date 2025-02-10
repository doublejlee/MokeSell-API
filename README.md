# MokeSell-API
MokeSell - Race to Sell 
Final Submission - Frontend & Backend Implementation

 Project Overview
MokeSell is an interactive sales competition platform where users:
✅ Sign up and log in to their accounts
✅ Add and browse product listings
✅ Compete in a leaderboard based on sales performance
✅ Race against a flash sale countdown timer

The platform uses MongoDB, Express.js, Node.js, and JavaScript (frontend + backend) for a fully functional web experience.

*Features & Functionality
User Authentication
Signup (/auth/signup) → Users register with a username & password
Login (/auth/login) → JWT authentication for secure user sessions
Token-based authentication → Protects sensitive endpoints
🛒 Product Listings
View all listings (/listings)
Create new listings (/listings - Auth required)
Listings include product name, price & seller info
🏆 Leaderboard (Live Rankings)
Leaderboard ranks users based on sales (/leaderboard)
Real-time updates when a user makes a sale
Leaderboard resets at the end of each flash sale
⏳ Flash Sale Countdown
Timer syncs with the backend (/timer)
Real-time updates every second
Sales competition ends when timer hits zero
📡 API Integration
Fully RESTful API using Express.js & MongoDB
Frontend interacts with backend using fetch() requests
📌 Technologies Used
Technology	Purpose
MongoDB	Database for storing users, listings, leaderboard
Express.js	Backend framework for handling API requests
Node.js	Server-side runtime environment
JWT (jsonwebtoken)	Secure user authentication
Bcrypt.js	Password hashing for security
Socket.io	Real-time leaderboard & countdown updates
Lottie Animations	Enhances user experience
Fetch API	Handles client-server communication
📌 Installation & Setup
1️⃣ Clone the Repository
sh
Copy
git clone https://github.com/YOUR_GITHUB/MokeSell.git
cd MokeSell
2️⃣ Install Dependencies
sh
Copy
npm install
3️⃣ Set Up Environment Variables
Create a .env file in the root directory and add:

sh
Copy
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
PORT=5008
4️⃣ Start the Server
sh
Copy
node server.js
🚀 Server should now be running on http://localhost:5008

5️⃣ Open the Frontend
Open index.html in a browser
Login or Sign Up
Test all functionalities (Listings, Leaderboard, Timer)
📌 API Documentation
Endpoint	Method	Description	Auth Required
/auth/signup	POST	Register a new user	❌ No
/auth/login	POST	Authenticate user & return JWT token	❌ No
/listings	GET	Retrieve all product listings	❌ No
/listings	POST	Add a new product listing	✅ Yes
/leaderboard	GET	Get leaderboard rankings	❌ No
/leaderboard	POST	Update user sales & rank	✅ Yes
/timer	GET	Get current countdown timer value	❌ No
📌 File Structure
bash
Copy
📁 MokeSell/
│-- 📄 server.js              # Backend (Node.js + Express API)
│-- 📄 index.html             # Login & signup page
│-- 📄 dashboard.html         # Main user dashboard
│-- 📄 leaderboard.html       # Leaderboard display page
│-- 📄 listings.html          # Product listings page
│-- 📄 style.css              # Styles & UI elements
│-- 📄 script.js              # Frontend JavaScript logic
│-- 📄 leaderboard.js         # Leaderboard functionality
│-- 📄 listings.js            # Product listings functionality
│-- 📄 README.md              # Documentation
│-- 📄 .env                   # Environment variables (Not committed to Git)

*Git & GitHub Issues
Issue	Solution
Cannot push changes to GitHub	Run git pull origin main --rebase before pushing
"fatal: not a git repository" error	Run git init inside the project folder
"rejected - fetch first" error when pushing	Run git pull origin main --rebase before git push origin main
Accidentally committed sensitive .env file	Remove from Git using git rm --cached .env and update .gitignore
*MongoDB & Database Challenges
Issue	Solution
MongoDB connection error	Check if your MongoDB URI is correct in .env
"bad auth: authentication failed" error	Ensure your MongoDB username & password are correct
"collection not found" error	Make sure you're inserting data correctly using insertMany()
Data does not persist after restart	Ensure MongoDB Atlas cluster is set up properly and not using local memory
📌 Known Issues & Fixes
Issue	Solution
Leaderboard not displaying	Ensure MongoDB has data (Leaderboard.find())
Listings not appearing	Check console logs for API request failures
Login session expired quickly	Extend JWT expiration in server.js
Port 5000 already in use	Kill process using `netstat -ano
*Backend Issues (Node.js & Express)
Issue	Solution
"EADDRINUSE: Address already in use" error	Stop the process using CTRL + C and restart
API returning empty response ({} or [])	Check console.log() inside the API handler to debug
"Cannot read properties of undefined" error	Ensure req.body, req.user, or req.params are correctly accessed
CORS policy error when fetching API	Make sure app.use(cors()) is enabled in server.js
*Frontend Issues (HTML, JavaScript, UI/UX)
Issue	Solution
Leaderboard or Listings page is blank	Check if the API call is failing (use console.log())
Button clicks not working	Check if eventListeners are correctly attached in JavaScript
Page layout is broken	Inspect using F12 > Console and check CSS rules
Animations not displaying	Ensure Lottie animations are correctly linked in JavaScript
📌 Credits & Contributors
Developed by:

Jia Jun
Davian
