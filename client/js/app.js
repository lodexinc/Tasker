var angular = require('angular');
var ngRoute = require('angular-route');

// Get controller functions from ./controllers.js
var controllers = require('./controllers'); 
// Get directives functions from .directives.js
var directives = require('./directives');

// Initialize AngularJS application
var app = angular.module('Tasker', ['ng', ngRoute]);

// Setup Controllers
app.controller('MainController', controllers.MainController);
app.controller('TaskController', controllers.TaskController);
app.controller('CategoryController', controllers.CategoryController);


// Setup Directives
app.directive('taskerNavBar', directives.taskerNavBar);

// Setup routes
app.config(function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: '/templates/main.html',
			controller: 'MainController'
		}).
		// Need this dupe one because facebook adds _=_ to the redirect URI
		when('/_=_', { 
			redirectTo: '/'
		}).
		when('/tasks', { 
			templateUrl: '/templates/tasks.html',
			controller: 'TaskController'
		}).
		when('/categories', {
			templateUrl: '/templates/categories.html',
			controller: 'CategoryController'
		});
});