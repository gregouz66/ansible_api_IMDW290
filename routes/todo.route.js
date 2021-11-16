const express = require("express");
const router = express.Router();
const controller = require("../controllers/todo.controller");

router
  .route("/")
  .get(controller.getAllTodos)
  .post(controller.createTodo);
router
  .route("/:id")
  .get(controller.getTodo)
  .put(controller.updateTodo)
  .delete(controller.deleteTodo);

module.exports = router;