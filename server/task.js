var mongoose = require('mongoose');

var taskSchema = {
  name: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completed: { type: Boolean },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  createdDate: { type: Date },
  dueDate: { type: Date },
  completedDate: { type: Date }
};

module.exports = mongoose.Schema(taskSchema);
module.exports.taskSchema = taskSchema;
