const mongoose = require("mongoose");
const { Task } = require("../models/task.model");
const ApiResponse = require("../models/response.model");

module.exports.getAllTasks = async (req, res) => {
  let tasks = await Task.find({});
  return res.send(tasks);
};

module.exports.getTask = async (req, res) => {
  let taskId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(taskId))
    return res.status(400).send("Invalid object id");
  let task = await Task.findById(taskId);
  if (!task) return res.status(404).send("Task not found");
  return res.send(task);
};

module.exports.createTask = async (req, res) => {
  console.log(req.body);
  let task = new Task({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description
  });
  await task.save();
  return res.send(task);
};

module.exports.updateTask = async (req, res) => {
  let taskId = req.params.id;
  
  const filter = { _id: taskId };
  const update = { title: req.body.title, author: req.body.author, description: req.body.description };

  await Task.findOneAndUpdate(filter, update, {
      returnOriginal: false
  })
  .then(it => {
    return res.send(new ApiResponse('200', 'Updated'));
  })
  .catch(err => {
    console.log("err"+err);
    return res.status(500).send(err);
  });
};

module.exports.deleteTask = async (req, res) => {
  let taskId = req.params.id;
  Task.findByIdAndRemove(taskId)
    .then(it => {
      return res.send(new ApiResponse('200', 'Deleted'));
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};