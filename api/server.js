const express = require("express");

const server = express();

const accountsRouter = require("../accountsRouter");

server.get("/", (req, res) => {
  res.send(`<h2>puling from api server!</h2>`);
});

server.use(express.json());

//server.use("/api/accounts");
//server.use(accountsRouter);
module.exports = server;
