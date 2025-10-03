const express = require('express');
//const session = require('express-session');
const { createServer } = require('http');
const { Server } = require('socket.io');
const dbCon = require('./connectToDB.js').dbCon;
const path = require('path');

const userSockets = new Map(); // for the socket ids


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://13.58.196.73"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware: CORS headers first
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://13.58.196.73');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Middleware: parse JSON and URL encoded body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/{*any}', function (request, response, next) {
	// If request is for a file ending in one of these, then send the file
	//if (request.url.endsWith(".css") || request.url.endsWith(".png") || request.url.endsWith(".ico") || request.url.endsWith(".js") || request.url.endsWith("index.html")) {

  if(request.url.startsWith('/socket.io'))
  {
    return next();
  }

  const url = request.url;

if (url === '/' || url === '/index.html') {
    response.sendFile(__dirname + '/index.html');
  } else if (url === '/styles.css') {
    response.sendFile(__dirname + '/styles.css');
  } else if (url === '/myscripts.js') {
    response.sendFile(__dirname + '/myscripts.js');
  }
    else if(url === "/game.html")
    {
      response.sendFile(__dirname + '/game.html');
    }
  
   else {
    response.status(404).send('<h1>404 - Not Found</h1>');
  }

});




// WebSocket setup
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
socket.on("new-game", (userInput) => {
  console.log("New-game", userInput);

  if (!socket.screenName) {
    socket.emit("alert", "No Screen Name found. Please login.");
    return;
  }

  // Clean up old entries
  dbCon.query("DELETE FROM players WHERE x_player = ? OR o_player = ?", [socket.screenName,socket.screenName], (err) => {
    if (err) return console.log(err);

    // Insert new player
    let choice = userInput.toLowerCase();
    let query;
    if(choice =='x')
    {
     query= "INSERT INTO players (x_player) VALUES (?)";
    }
    else{
      query= "INSERT INTO players (o_player) VALUES (?)";
    }

    dbCon.query(query, [socket.screenName], (err) => {
      if (err) return console.log(err);

      // Notify others
      io.emit("update-gamelist", {
        screenName: socket.screenName,
        position: userInput.toUpperCase()
      });
    });
  });
});

  socket.on('print-players', () => {
    
  const query = `
  SELECT * FROM players
  `;

  dbCon.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching non-playing users:", err);
      socket.emit("alert", "Database error retrieving available users");
      return;
    }

    // Emit to the specific requesting client
    socket.emit("update-gamelist2", rows);
    
    // OR emit to all clients if needed:
    // io.emit("available-users", rows);
  });



  });







  socket.on('update-idle', () => {
    console.log("updating idle")
    
  const query = `
    SELECT user 
    FROM users 
    WHERE user NOT IN (
      SELECT x_player FROM players WHERE x_player IS NOT NULL
      UNION
      SELECT o_player FROM players WHERE o_player IS NOT NULL
    )
  `;

  dbCon.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching non-playing users:", err);
      socket.emit("alert", "Database error retrieving available users");
      return;
    }

    // Emit to the specific requesting client
    io.emit("update-idlelist", rows);
    
    // OR emit to all clients if needed:
    // io.emit("available-users", rows);
  });



  });


  socket.on('join', (data) => {
   let player1 = data.opponent;
   let player2 = socket.screenName;
   let playerX;
   let playerO;

  dbCon.query(
  "SELECT * FROM players WHERE (x_player = ? OR o_player = ?) AND x_player IS NOT NULL AND o_player IS NOT NULL",
  [player2, player2],
  (err, rows) => {
    if (err) {
      console.error("DB error:", err);
      return socket.emit("alert", "Database error.");
    }

    if (rows.length > 0) {
      // Player is already in a full game
      return socket.emit("alert", "You are already in a game with another player.");
    }

    // Player is not in a full game — allow them to start a new one or wait
 
  }
);

dbCon.query(
      'DELETE FROM players WHERE x_player = ? OR o_player = ?',
      [player1, player1],
      (err, result) => {
        if (err) {
          console.error("DB error on disconnect (players):", err);
        } else {
          console.log(`Removed game row for user ${socket.screenName} from players table`);
        }
      }
    );// Remove row from players table where this user is either x_player or o_player



    dbCon.query(
      'DELETE FROM players WHERE x_player = ? OR o_player = ?',
      [player2, player2],
      (err, result) => {
        if (err) {
          console.error("DB error on disconnect (players):", err);
        } else {
          console.log(`Removed game row for user ${socket.screenName} from players table`);
        }
      }
    );// Remove row from players table where this user is either x_player or o_player

    if(data.position=="x")
    {
      playerX= data.opponent;
      playerO= player2;
      
dbCon.query(
        'INSERT INTO players (x_player, o_player) VALUES (?, ?)',
    [playerX, playerO],
      (err, result) => {
        if (err) {
          console.error("DB error on disconnect (players):", err);
        } else {
          console.log(`Created new game row with X=${playerX}, O=${playerO}`);

        }
      }
    );// Remove row from players table where this user is either x_player or o_player
  }
  else
  {
    playerX=player2;
    playerO=player1;

    dbCon.query(
        'INSERT INTO players (x_player, o_player) VALUES (?, ?)',
    [playerX, playerO],
      (err, result) => {
        if (err) {
          console.error("DB error on disconnect (players):", err);
        } else {
          console.log(`Removed game row for user ${socket.screenName} from players table`);
        }
      }
    );// Remove row from players table where this user is either x_player or o_player
  }


  updatePlayer();
  updateidle();

  const opponentSocket = userSockets.get(player1);
  const playerSocket = userSockets.get(player2);

  playerSocket.emit("PLAY", { x_player:playerX,o_player:playerO});    
  opponentSocket.emit("PLAY",{x_player:playerX,o_player:playerO});

  

//here







  });

socket.on("MOVE", ({ screenName, cell }) => {
  const opponentSocket = userSockets.get(screenName); // use screenName ↔ socket map
  if (opponentSocket) {
    opponentSocket.emit("MOVE", { cell });
  }
});

socket.on("END-GAME", ({ winner, screenName,opponentName }) => {
  const opponentSocket =userSockets.get(opponentName);


  // Clear from players table
  dbCon.query(
    "DELETE FROM players WHERE x_player = ? OR o_player = ?",
    [screenName, screenName]
  );

  dbCon.query(
    "DELETE FROM players WHERE x_player = ? OR o_player = ?",
    [opponentName, opponentName]
  );



  // Notify both players
  socket.emit("END-GAME", { winner });
  if (opponentSocket) {
    opponentSocket.emit("END-GAME", { winner });
  }

  updatePlayer();   // updating the idle list and players after the end game
  updateidle()

});


  socket.on('TO-SERVER LOGIN screen-name', (data) => {
    const screenName = data.screenName;
    if (!screenName) return;

    dbCon.query("SELECT * FROM users WHERE user = ?", [screenName], (err, rows) => {
      if (err) return console.log(err);

      if (rows.length < 1) {
        dbCon.query("INSERT INTO users (user) VALUES (?)", [screenName], (err) => {
          if (err) return;
          socket.screenName =screenName;
          userSockets.set(socket.screenName, socket);
          console.log(socket.screenName);
          socket.emit("LOGIN-OK",{screenName});
          
        });
      } else {
        socket.screenName = screenName; 
        console.log("Existing user logged in:", screenName); 
        socket.emit("LOGIN-TAKEN");
      }
    });
  });
 socket.on('disconnect', (reason) => {
  if (socket.screenName) {

    userSockets.delete(socket.screenName);
    
    dbCon.query(
      'DELETE FROM players WHERE x_player = ? OR o_player = ?',
      [socket.screenName, socket.screenName],
      (err, result) => {
        if (err) {
          console.error("DB error on disconnect (players):", err);
        } else {
          console.log(`Removed game row for user ${socket.screenName} from players table`);
        }
      }
    );// Remove row from players table where this user is either x_player or o_player

  dbCon.query('DELETE FROM users WHERE user = ?', [socket.screenName], (err, result) => {
        if (err) {
          console.error("DB error on disconnect:", err);
        } else {
          console.log(`User ${socket.screenName} removed from DB`);
        }
      });
      } else {
      console.log(`Disconnected without screenName: ${socket.id}, reason: ${reason}`);
    }
  });
  
  socket.on('connect_error', (err) => {
    console.log(`Connect error: ${err.message}`);
  });
});

// Start server
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Server (HTTP + WebSocket) listening on port ${PORT}`);
});

//function
function updatePlayer()
{
  const query = `
  SELECT * FROM players
  `;

  dbCon.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching non-playing users:", err);
      socket.emit("alert", "Database error retrieving available users");
      return;
    }

    // Emit to the specific requesting client
    io.emit("update-gamelist2", rows);
    
    // OR emit to all clients if needed:
    // io.emit("available-users", rows);
  });
}



function updateidle()
{

   
  const query = `
    SELECT user 
    FROM users 
    WHERE user NOT IN (
      SELECT x_player FROM players WHERE x_player IS NOT NULL
      UNION
      SELECT o_player FROM players WHERE o_player IS NOT NULL
    )
  `;

  dbCon.query(query, (err, rows) => {
    if (err) {
      console.error("Error fetching non-playing users:", err);
      socket.emit("alert", "Database error retrieving available users");
      return;
    }

    // Emit to the specific requesting client
    io.emit("update-idlelist", rows);
    
    // OR emit to all clients if needed:
    // io.emit("available-users", rows);
  });


}