// This module provides an express subrouter for the RESTful API v1
var express = require('express');
var bodyparser = require('body-parser');
var HTTPstatus = require('http-status');


module.exports = function(wagner) {
  // Create API subrouter
  var api = express.Router();
  api.use(bodyparser.json());

  // USER RESTful endpoint
  // Retrieve logged-in user data
  api.get('/user/me', wagner.invoke(function(User) {
    return function(req, res) {
      // Check if user is logged in
      if (!req.user) {
        return res.
          json({
            error: 'User is not logged in.',
            login: 'http://localhost:3000/auth/facebook'
          });
      }

      User.findOne({ _id: req.user.id }, function(error, user) {
        if (error) {
          console.log({ error: error });
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        return res.json({ user: user });
      });
    }
  }));



  // CATEGORY RESTful endpoint (CRUD)
  // Create a new category
  api.post('/category', wagner.invoke(function(Category) {
    return function(req, res) {
      // Check if user is logged in
      if (!req.user) {
        return res.
          status(HTTPstatus.UNAUTHORIZED).
          json({
            error: 'User is not logged in.',
            login: 'http://localhost:3000/auth/facebook'
          });
      }

      // Create new category
      var newCategory = req.body.category;
      newCategory.createdBy = req.user.id;
      Category.create(newCategory, function(error, category) {
        if (error) {
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        return res.json({ category: category });
      });
    };
  }));

  // Retrieve all categories created by the user
  api.get('/category', wagner.invoke(function(Category) {
    return function(req, res) {
      // Check if user is logged in
      if (!req.user) {
        return res.
          status(HTTPstatus.UNAUTHORIZED).
          json({ error: 'User is not logged in.' });
      }

      // Find all categories created by User.id
      Category.find({ createdBy: req.user.id }, function(error, categories) {
        if(error) {
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR);
            res.json({ error: error });
        }

        return res.json({ categories: categories });
      });
    };
  }));

  // Delete category
  api.delete('/category', wagner.invoke(function(Category) {
    return function(req, res) {
      Category.remove({ _id: req.query.id }, function(err, removed) {
        if (err) {
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR).
            json({ error: err });
        }

        Category.find({ createdBy: req.user.id }, function(err, categories) {
          return res.json({ categories: categories });
        });
      });
    };
  }));




  // TASK RESTful endpoint (CRUD)
  // Create a new task
  api.post('/task', wagner.invoke(function(Task){
    return function(req, res) {
      // Check if user is logged in
      if (!req.user) {
        return res.
          status(HTTPstatus.UNAUTHORIZED).
          json({
            error: 'User is not logged in.',
            login: 'http://localhost:3000/auth/facebook'
          });
      }

      var newTask = req.body.task;
      newTask.owner = req.user.id;

      Task.create(newTask, function(error, task) {
        if(error) {
          console.log({error: error});
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        return res.json({ task: task });
      });
    }
  }));

  // Retrieve all tasks
  api.get('/task', wagner.invoke(function(Task){
    return function(req, res) {

      Task.find({ owner: req.user.id }, function(error, tasks) {
        if(error) {
          console.log({ error: error });
          return res.
            status(HTTPstatus.INTERNAL_SERVER_ERROR).
            json({ error: error });
        }

        return res.json({ tasks: tasks });
      });
    };
  }));

  // Update a task
  api.put('/task/id/:id', wagner.invoke(function(Task) {
    return function(req, res) {
      // Check if user is logged in
      if (!req.user) {
        return res.
          status(HTTPstatus.UNAUTHORIZED).
          json({
            error: 'User is not logged in.',
            login: 'http://localhost:3000/auth/facebook'
          });
      }

      var taskToBeUpdated = req.body.task;

      Task.findByIdAndUpdate(req.params.id, {
          $set: taskToBeUpdated
        }, function(err, task) {
          if (err) {
            return res
              .status(HTTPstatus.INTERNAL_SERVER_ERROR)
              .json({ error: err });
          }
          // Return updated set of tasks for user
          Task.find({ owner: req.user.id }, function(err, tasks) {
            if(err) {
              return res
                .status(HTTPstatus.INTERNAL_SERVER_ERROR)
                .json({ error: err });
            }

            return res.json({ tasks: tasks });
          });
        });

    };
  }));


  // function(wagner) returns the subrouter
  return api;
};
