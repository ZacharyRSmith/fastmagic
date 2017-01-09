const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: { type: String, required: true }
});

const todoSchema = new Schema({
  done: { type: Boolean, default: false },
  text: { type: String, required: true },
  owner: { type: ownerSchema, required: true }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
