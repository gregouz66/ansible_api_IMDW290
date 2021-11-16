const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
    title: { 
        type: String, required: true },
    author: { 
        type: String, required: true },
    status: { 
        type: Boolean, required: true },
    content: { 
        type: String, required: true }
});

module.exports.Todo = mongoose.model("Todo", todoSchema);
