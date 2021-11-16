const mongoose = require("mongoose");
const { Todo } = require("../models/todo.model");

module.exports.getAllTodos = async (req, res) => {
  let todos = await Todo.find({});
  return res.send(todos);
};

module.exports.getTodo = async (req, res) => {
  let todoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(todoId))
    return res.status(400).send("Invalid object id");
  let todo = await Todo.findById(todoId);
  if (!todo) return res.status(404).send("Todo not found");
  return res.send(todo);
};

module.exports.createTodo = async (req, res) => {
  console.log(req.body);
  let todo = new Todo({
    title: req.body.title,
    author: req.body.author,
    status: req.body.status,
    content: req.body.content
  });
  await todo.save();
  return res.send(todo);
};

module.exports.updateTodo = async (req, res) => {
  let todoId = req.params.id;
  Todo.findOneAndUpdate(todoId, req.body, { new: true })
    .then(todo => {
      return res.send(todo);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};

module.exports.deleteTodo = async (req, res) => {
  let todoId = req.params.id;
  await Todo.findByIdAndRemove(todoId);
  return res.send("Todo deleted");
};