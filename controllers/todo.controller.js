const mongoose = require("mongoose");
const { Todo } = require("../models/todo.model");
const ApiResponse = require("../models/response.model");


// function Response(args){
//   this.response = args;
// }

// function ResponseBuilder(){
  
// }

// ResponseBuilder.prototype.setStatus = function(status){
//   if(status){
//     this.status = status;
//   }
// }

// ResponseBuilder.prototype.setMessage = function(msg){
//   if(msg){
//     this.msg = msg;
//   }
// }


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
  
  const filter = { _id: todoId };
  const update = { title: req.body.title, author: req.body.author, content: req.body.content, status: req.body.status };

  await Todo.findOneAndUpdate(filter, update, {
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

module.exports.deleteTodo = async (req, res) => {
  let todoId = req.params.id;
  Todo.findByIdAndRemove(todoId)
    .then(it => {
      return res.send(new ApiResponse('200', 'Deleted'));
    })
    .catch(err => {
      return res.status(500).send(err);
    });

  //return res.json({"foo": "bar"});

};