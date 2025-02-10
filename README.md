🚀 MokeSell - Race to Sell | Final Submission
A dynamic sales competition platform where users compete in real-time to boost their sales and rank higher on the leaderboard before the flash sale countdown runs out!


📌 Project Overview
MokeSell is an interactive e-commerce sales competition platform that allows users to:

✅ Sign up and log in securely
✅ Add and browse product listings in real-time
✅ Compete on a leaderboard based on sales performance
✅ Race against a flash sale countdown timer before time runs out!

🚀 The platform is built using MongoDB, Express.js, Node.js, and JavaScript (frontend + backend) for a fully interactive user experience.

📌 Features & Functionality
🔑 User Authentication
Signup (/auth/signup) → Register with a username & password
Login (/auth/login) → JWT authentication for secure user sessions
Token-based authentication → Protects sensitive endpoints
🛒 Product Listings
View all listings (/listings)
Create new listings (/listings - Auth required)
Listings include product name, price & seller information
🏆 Real-Time Leaderboard
Ranks users based on sales (/leaderboard)
Live updates when a user makes a sale
Resets at the end of each flash sale
⏳ Flash Sale Countdown
Timer syncs with the backend (/timer)
Real-time updates every second
Competition ends when timer hits zero
📡 API Integration
RESTful API using Express.js & MongoDB
Frontend interacts with backend using Fetch API
Secure API calls with authentication middleware
📌 Technologies Used
Technology	Purpose
MongoDB	Stores users, product listings, and leaderboard rankings
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
🚀 Your backend server should now be running on http://localhost:5008

5️⃣ Open the Frontend
Open index.html in your browser
Log in or Sign Up
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
│-- 📄 package.json           # Dependencies
│-- 📄 .gitignore             # Prevents sensitive files from being committed
📌 Troubleshooting & Common Issues
🔴 Git & GitHub Issues
Issue	Solution
Cannot push changes to GitHub	Run git pull origin main --rebase before pushing
"fatal: not a git repository" error	Run git init inside the project folder
"rejected - fetch first" error	Run git pull origin main --rebase before git push origin main
🔴 MongoDB & Database Issues
Issue	Solution
MongoDB connection error	Check if your MongoDB URI is correct in .env
"bad auth: authentication failed"	Ensure your MongoDB username & password are correct
Data does not persist after restart	Ensure MongoDB Atlas cluster is set up properly
🔴 Backend Issues (Node.js & Express)
Issue	Solution
"EADDRINUSE: Address already in use" error	Stop the process using CTRL + C and restart
API returning empty response ({} or [])	Check console.log() inside the API handler to debug
"Cannot read properties of undefined" error	Ensure req.body, req.user, or req.params are correctly accessed
🔴 Frontend Issues (HTML, JavaScript, UI/UX)
Issue	Solution
Leaderboard or Listings page is blank	Check if the API call is failing (use console.log())
Button clicks not working	Check if eventListeners are correctly attached in JavaScript
Animations not displaying	Ensure Lottie animations are correctly linked in JavaScript
📌 Credits & Contributors
Developed by:

Jia Jun
Davian
