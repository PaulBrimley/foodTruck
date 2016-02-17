angular.module('truckApp').service('userService', function($http, truckService) {

	var self = this;

	this.getCurrentUser = function() {
		return $http({
			method: 'GET',
			url: '/auth/currentUser'
		})
		.then(function(response) {
			self.currentUser = response.data;
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.getAllUsers = function() {
		return $http.get('/admin/getAllUsers')
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.login = function(user) {
		return $http.post('/auth/login', user)
		.then(function(response) {
			return self.getCurrentUser();
		})
		.catch(function(err) {
			return err.data;
		})
		;		
	}

	this.logout = function() {
		return $http({
			method: 'GET',
			url: '/auth/logout'
		}).then(function(response) {
			return response;
		})
	}

	this.addAccount = function(newUser) {
		return $http({
			method: 'POST',
			data: newUser,
			url: '/auth/addAccount'
		}).then(function(response) {
			return response.data;
		}).catch(function(err) {
			return err.data;
		})
	}

	this.deleteUser = function(user) {
		return $http.delete('/admin/deleteUser/' + user._id)
		.then(function(response) {
			console.log(response.data);
			return response.data;
		}).catch(function(response) {
			console.log(response.data);
			return response.data;
		})
	}

	this.makeAdmin = function(userId) {
		return $http.put('/admin/makeAdmin/' + userId)
		.then(function(response) {
			return response.data;
		})
		.catch(function(err) {
			return err.data;
		})
	}


	this.removeAdmin = function(userId) {
		return $http.put('/admin/removeAdmin/' + userId)
		.then(function(response) {
			return response.data;
		})
		.catch(function(err) {
			return err.data;
		})
	}

	this.updateAccount = function(updatedUser) {
		return $http.put('/user/updateProfile', updatedUser)
		.then(function(response) {
			console.log(response.data);
			return response.data;
		}).catch(function(response) {
			console.log(response.data);
			return response.data;
		})
	}

	this.addToFavorites = function(truck) {
		return $http.put('/user/addFavTruck', truck)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.removeFromFavorites = function(truck) {
		return $http.put('/user/removeFavTruck', truck)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.connectTruckToUser = function(truck) {
		return $http.put('/user/connectTruckToUser', truck)
		.then(function(response) {
			return response.data;
		})
		.catch(function(err) {
			return err.data;
		})
	}
})