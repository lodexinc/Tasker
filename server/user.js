var mongoose = require('mongoose');

var userSchema = {
  name: {type: String},
  email: {type: String},
  picture: {type: String},
  data: {
    oauth: {
      provider: String,
      id: String,
      token: String
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
  }
};

module.exports = mongoose.Schema(userSchema);
exports.userSchema = userSchema;
