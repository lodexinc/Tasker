module.exports.MainController = function($scope, $http) {

	// Check in API if user is logged in
	$http.get('/api/user/me').success(function(data) {

		// If user is not logged in, set user to false (for the template check) and
		// provide the login URL (for the template too)
 		if (data.error) {
			$scope.user = false;
			$scope.loginUrl = data.login;
			return;
		}
		// If user is logged in, set the user object in the response to the scope.
		else {
    	$scope.user = data.user;
    	return;
    }
	});
};

module.exports.TaskController = function($scope, $http) {

	// Retrieve all tasks for the user from server
	$http.get('/api/task').success(function(response) {
		if(response.error) {
			return console.log(response.error);
		}
		else {
			return $scope.user.data.tasks = response.tasks;
		}
	});

	$scope.postNewTask = function() {

		var data = {
			task: {
				name: $scope.newTaskName,
				owner: $scope.user._id,
				completed: false
			}
		};

		$http.post('/api/task', data).success(function(response) {
			if(response.error) {
				console.log(response.error);
				$scope.newTaskName = response.error; // Display error in new task input
				return;
			}
			else {
				$scope.user.data.tasks.push(response.task);
				$scope.newTaskName = '';
				return;
			}
		});
	};

	$scope.completeTask = function(task) {
		// Change the task to completed
		task.completed = true;

		// PUT request's payload
		var data = { task: task };

		$http.put('/api/task/id/'+task._id, data).success(function(response) {
			// Check if error
			if (response.error) {
				return console.log(response.error);
			}
			else if (response.tasks) {
				return $scope.user.data.tasks = response.tasks;
			}
			else {
				return console.log(new Error('Update task function failed'));
			}
		});
	}
};

module.exports.CategoryController = function($scope, $http) {
	
	// Retrieve all categories of the user
	$http.get('/api/category').success(function(response) {
		// check for errors
		if(response.error) {
			console.log(response.error);
			return;
		}

		$scope.user.data.categories = response.categories;
	});

	// Create a new category
	$scope.createCategory = function() {
		var data = {
			category: {
				name: $scope.newCategoryName,
				createdBy: $scope.user._id
			}
		}

		$http.post('/api/category', data).success(function(response) {
			if (response.error) {
				return console.log(response.error);
			}

			$scope.user.data.categories.push(response.category);
			$scope.newCategoryName = '';
		});
	};

	// Remove category
	$scope.removeCategory = function(category) {
		$http.delete('/api/category?id='+category._id).success(function(response) {
			if (response.error) {
				return console.log(response.error);
			}

			return $scope.user.data.categories = response.categories;
		});
	};


};