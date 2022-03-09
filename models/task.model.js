const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, required: true },
    author: { 
        type: String, required: true },
    description: { 
        type: String, required: true }
});

module.exports.Task = mongoose.model("Task", taskSchema);
