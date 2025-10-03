const dbCon = require('./connectToDB.js').dbCon;
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');

app.use(session({
  secret: 'pwd50',  // Change this to something secure
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

 //app use makes it  global and allows all headers the option isthe preflight before the fetch is sent
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // respond to preflight
  }

  next(); // continue to your POST route
});



app.post('/login', (request, response) => {
  try {
  

    const screenName = request.body.screenName;

    if (!screenName) {
      return response.status(400).send("screenName is required");
    }

    const query = 'SELECT * FROM users WHERE user = ?';
    dbCon.query(query, [screenName], function (error, data, fields) {
      if (error) {
        console.log(error);
        return response.send("DB access error");
      }

      if (data.length < 1) {
        // User not found, insert
        const sql = "INSERT INTO users (user) VALUES (?)";
        dbCon.query(sql, [screenName], (error, result) => {
          if (error) {
            console.log(error);
            return response.send("Insert error");
          }
           

          request.session.user = screenName;

          response.send({
            success: true,
            message: 'User added successfully',
            user: screenName
          });
        });
      } else {
        // User already exists
        response.send({
          success: false,
          message: 'User already exists',
          user: screenName
        });
      }
    });

  } catch (error) {
    response.send(error.toString());
  }
});
//to access the  the session name
app.get('/session', (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});


// Start server
app.listen(8080, '0.0.0.0', () => {
  console.log("Server running and listening on all interfaces (0.0.0.0:8080)");
});
