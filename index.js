// implement your API here
// require the express npm module, needs to be added to the project using "yarn add" or "npm install"

const express = require("express");
const greeter = require("./greeter.js");
const db = require("./data/db.js");

// creates an express application using the express module
const server = express();

server.use(express.json());

// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get("/", (req, res) => {
  res.json("alive");
});

server.get("/greet", (req, res) => {
  res.json({ hello: "stranger" });
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "we failed you, can't get the users", error: error });
    });
});

server.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: "we failed you, can't get the user", error: error });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db.update(id, changes)
    .then(count => {
      if (count) {
        res.status(200).json({ message: `${count} users updated` });
      } else {
        res.status(404).json({ message: "user not found" });
      }
      // res.status(200).json(count);
    })
    .catch(error => {
      res.status(500).json({ message: "error updating user" });
    });
});

server.delete("/api/users/:id", (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      res.status(200).json(count);
    })
    .catch(error => {
      res.status(500).json({ message: "error deleting user" });
    });
});

server.get("/greet/:person", greeter);

server.post("/api/users", async (req, res) => {
  console.log("body", req.body);
  try {
    const userData = req.body;
    const userId = await db.insert(userData);
    const user = await db.findById(userId.id);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "error creating user", error });
  }
});

server.get("/users", (req, res) => {
  const { id } = req.query;

  if (id) {
    db.findById(id).then(users => res.send(users));
  } else {
    db.find().then(users => res.send(users));
  }
});

// once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
server.listen(8000, () => console.log("API running on port 8000"));
