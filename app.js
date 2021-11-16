const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const config = require('./config');
const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.db[env], config.dbParams);

mongoose.connection.on("error", err => {
    console.log("err", err)
});
  
mongoose.connection.on("connected", () => {
  console.log("DB is connected...")
});

mongoose.connection.on("disconnected", () => {
  console.log("DB is disconnected...")
});

module.exports = app;