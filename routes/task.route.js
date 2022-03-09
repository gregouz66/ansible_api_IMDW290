const express = require("express");
const router = express.Router();
const controller = require("../controllers/task.controller");

router
  .route("/")
  .get(controller.getAllTasks)
  .post(controller.createTask);
router
  .route("/:id")
  .get(controller.getTask)
  .put(controller.updateTask)
  .delete(controller.deleteTask);

module.exports = router;