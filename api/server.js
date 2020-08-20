const express = require("express");

const server = express();

const accountsRouter = require("../accountsRouter");
const db = require("../data/dbConfig.js");

server.use(express.json());

server.use("/api/accounts", accountsRouter);

module.exports = server;
