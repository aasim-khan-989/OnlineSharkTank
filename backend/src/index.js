"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config(); // Call this at the top of your file
var pg_1 = require("pg");
console.log(process.env.DATABASE_URL);
var client = new pg_1.Client({
    connectionString: process.env.DATABASE_URL,
});
client.connect()
    .then(function () { return console.log('Connected to the database'); })
    .catch(function (err) { return console.error('Database connection error:', err); });
