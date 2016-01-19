var mongoose = require('mongoose');

var categorySchema = {
  name: { type: String },
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
};

module.exports = mongoose.Schema(categorySchema);
module.exports.categorySchema = categorySchema;
