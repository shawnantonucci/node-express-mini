// implement your API here
// require the express npm module, needs to be added to the project using "yarn add" or "npm install"

console.log('\nHello FSW14\n');

const express = require("express");
const greeter = require("./greeter.js");
const db = require('./data/db.js');

// creates an express application using the express module
const server = express();

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get("/", (req, res) => {
  res.json('alive');
});

server.get("/hobbits", (req, res) => {
  // route handler code here
  const hobbits = [
    {
      id: 1,
      name: "Samwise Gamgee"
    },
    {
      id: 2,
      name: "Frodo Baggins"
    }
  ];

  res.status(200).json(hobbits);
});

server.get('/greet', (req, res) => {
  res.json({ hello: 'stranger' });
})

server.get("/api/users", (req, res) => {
  db.find().then(users => {
    res.json(users);
  }).catch(error => {
    res.status(500).json({ message: "we failed you, can't get the users", error: error });
  });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
  .then(user => {
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'user not found' });
    }
  }).catch(error => {
    res.status(500).json({ message: "we failed you, can't get the user", error: error });
  })
});

server.get('/greet/:person', greeter);

server.get("/users", (req, res) => {
    // route handler code here
    const users = [
      {
        id: 1,
        name: "Shawn"
      },
      {
        id: 2,
        name: "Crystal"
      }
    ];
  
    res.status(200).json(users);
  });

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log("API running on port 8000"));
