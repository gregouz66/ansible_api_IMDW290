const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const createError = require("http-errors");
const config = require('./config');
const env = process.env.NODE_ENV || 'development';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(config.db[env], config.dbParams);

mongoose.connection.on("error", err => {
    console.log("err", err)
});
  
mongoose.connection.on("connected", () => {
  console.log("mongoose is connected...")
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose is disconnected...")
});

const tasksRouter = require("./routes/task.route");

app.use("/api/tasks", tasksRouter);

app.get('/api/status', (req,res) => {
  res.status(200).json({
    success: true
  });
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.status(err.status || 500);
  res.send(err);
});

app.options('*', cors());

module.exports = app;