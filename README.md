🌐 Multiplayer Tic-Tac-Toe (Real-Time)
A classic game of Tic-Tac-Toe (Noughts and Crosses) built for the internet. Challenge a friend to a real-time match over WebSockets.

🎯 Overview
This project is a fully functional, multiplayer web application for playing Tic-Tac-Toe. It leverages modern web technologies and a persistent database to manage game state and connections. The core differentiator is the real-time, internet-based gameplay powered by WebSockets, allowing users to compete instantly from anywhere.

✨ Features
Real-Time Multiplayer: Play live against an opponent over the internet.

WebSockets Communication: Instant updates for moves and game state.

Classic 3x3 Grid: Standard game rules.

Persistent Hosting: Deployed on an AWS EC2 instance for continuous availability.

🛠️ Technology Stack
This application is a full-stack project built with the following technologies:

Area

Technologies Used

Frontend

HTML5, CSS3, JavaScript (Vanilla)

Backend/Server

Node.js (for game logic and WebSocket handling)

Real-Time Layer

WebSockets (using a Node.js library)

Database

MySQL (for user and game session management)

Deployment

AWS EC2

🐛 Known Issues
The most critical current issue is with the game reset functionality:

Post-Game Reset Bug: After the first game concludes (either by win, loss, or draw), the underlying game logic (e.g., the board array, player turn state) does not correctly reset. This prevents players from starting a new game immediately without refreshing the page or restarting the server session.

🚀 Installation and Setup
To run this project locally, you will need Node.js and a local MySQL instance.

Clone the repository:

git clone 
cd tic-tac-toe-multiplayer

Install dependencies:

npm install

Database Setup:

Create a MySQL database (e.g., tictactoe_db).

Update the database connection details in your server configuration file (e.g., server.js or .env).

Start the server:

node server.js

Access the game:
Open your browser and navigate to http://localhost:[PORT] (The default port is usually 3000, but check your Node.js configuration). You'll need two separate browser windows or devices to simulate multiplayer connection.

🤝 Contributing
Contributions, especially in tackling the known post-game reset bug, are welcome! Please feel free to open an issue or submit a pull request.
