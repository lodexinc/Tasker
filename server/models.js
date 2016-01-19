// This module initializes the models and register them as services (dependencies)
// in wagner (dependency injector)

var mongoose = require('mongoose');

module.exports = function(wagner) {
  mongoose.connect('mongodb://localhost:27017/tasker');

  // Initialize models
  User = mongoose.model('User', require('./user'));
  Task = mongoose.model('Task', require('./task'));
  Category = mongoose.model('Category', require('./category'));

  // Register models as services in wagner (dependency injector)
  wagner.factory('User', function() {
    return User;
  });
  wagner.factory('Category', function() {
    return Category;
  });
  wagner.factory('Task', function() {
    return Task;
  });

  // Make the fuction to return someting: An object containing all the models
  var models = {
    Category: Category,
    Task: Task,
    User: User
  };

  return models;
};
