const express = require("express");

const server = express();

const accountsRouter = require("../accountsRouter");

server.get("/", (req, res) => {
  res.send(`<h2>pulling from api server!</h2>`);
});

server.use(express.json());

//server.use("/api/accounts");
//server.use(accountsRouter);
server.use(logger);
server.use("/", accountsRouter);

function logger(req, res, next) {
  console.log(`${req.method} Request ${req.url} [${new Date().toISOString()}]`);
  next();
}

module.exports = server;
