angular.module('truckApp').controller('mainCtrl', function($scope, userService, $timeout, $state, mapService, truckService) {
	
	var socket = io.connect('http://localhost');

	$scope.onlineTrucks = [];
	$scope.favoriteTrucks = [];
    $scope.specials = [];
	$scope.overlaySwitcher = false;
	$scope.instructionHider = false;
	$scope.createAccountShow = false;
	$scope.editProfileShow = false;
	$scope.currentUser = undefined;
	$scope.signInSwitcher = false;
	$scope.adminShow = false;
	$scope.foodTruckShow = false;
	$scope.userShow = false;
	$scope.guestShow = false;
	$scope.mapLoader = true;
	$scope.errorMessage = '';
	$scope.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDMui7yhysuA28F7b8huOdD36LaPZzoExY&callback=initMap";

	mapService.getUserLocation();
	truckService.getOnlineTrucks().then(function(response) {
        $scope.onlineTrucks = response;
        if($scope.onlineTrucks.length > 0) {
            for (var i = 0; i < $scope.onlineTrucks.length; i++) {
                if ($scope.onlineTrucks[i].specials) {
                    for (var j = 0; j < $scope.onlineTrucks[i].specials.length; j++) {
                        $scope.specials.push(
                        {
                            truckId: $scope.onlineTrucks[i]._id,
                            truckName: $scope.onlineTrucks[i].truckName,
                            special: $scope.onlineTrucks[i].specials[j]
                        })
                    }
                }
            }
        }
		if (mapService.isMapLoaded()) {
			for (var i = 0; i < $scope.onlineTrucks.length; i++) {
				$scope.onlineTrucks[i].markerId = $scope.onlineTrucks[i].currentLocation.lat + '_' + $scope.onlineTrucks[i].currentLocation.lng;
				mapService.addMarker($scope.onlineTrucks[i],i * 400);
			}
		};
		userService.getCurrentUser().then(function(response) {
			$scope.currentUser = response;
			if ($scope.currentUser) {
				for (var i = 0; i < $scope.currentUser.permissions.length; i++) {
					if ($scope.currentUser.permissions[i] === 'Admin') {
						$scope.adminShow = true;
					}
					if ($scope.currentUser.permissions[i] === 'FoodTruck') {
						$scope.foodTruckShow = true;
					}
				}
				if ($scope.currentUser.favoriteTrucks) {
					for (var i = 0; i < $scope.currentUser.favoriteTrucks.length; i++) {
						$scope.favoriteTrucks.push($scope.currentUser.favoriteTrucks[i]);
						for (var j = 0; j < $scope.onlineTrucks.length; j++) {
							if ($scope.currentUser.favoriteTrucks[i]._id === $scope.onlineTrucks[j]._id) {
								mapService.removeMarker($scope.onlineTrucks.markerId);
								$scope.onlineTrucks.splice(j, 1);
							}
						}
						for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
	                        $scope.favoriteTrucks[i].markerId = $scope.favoriteTrucks[i].currentLocation.lat + '_' + $scope.favoriteTrucks[i].currentLocation.lng;
	                        mapService.addMarker($scope.favoriteTrucks[i],i * 300);
	                    }
					}
				}
				$scope.guestShow = true;
				$scope.userShow = true;
			}
		})
    });

	socket.on('truck came online', function(truck) {
		truck._id = truck._id.toString();
		for (var j = 0; j < truck.specials.length; j++) {
            $scope.specials.push(
            {
                truckId: truck._id,
                truckName: truck.truckName,
                special: truck.specials[j]
            })
        }
		if ($scope.currentUser) {
			for (var i = 0; i < $scope.currentUser.favoriteTrucks.length; i++) {
				$scope.currentUser.favoriteTrucks[i]._id = $scope.currentUser.favoriteTrucks[i]._id.toString();
				if (truck._id === $scope.currentUser.favoriteTrucks[i]._id) {
					truck.markerId = truck.currentLocation.lat + '_' + truck.currentLocation.lng;
                    mapService.addMarker(truck,i * 300);
					$scope.favoriteTrucks.push(truck);
					$scope.$apply();
					return;
				}
			}
		}
		truck.markerId = truck.currentLocation.lat + '_' + truck.currentLocation.lng;
        mapService.addMarker(truck,i * 300);
		$scope.onlineTrucks.push(truck);
		$scope.$apply();
	});
	socket.on('truck went offline', function(truck) {
		for (var i = $scope.specials.length - 1; i >= 0; i--) {
			if (truck._id === $scope.specials[i].truckId) {
				$scope.specials.splice(i, 1);
			}
		}
		for (var i = $scope.onlineTrucks.length - 1; i >= 0; i--) {
			if (truck._id === $scope.onlineTrucks[i]._id) {
				mapService.removeMarker($scope.onlineTrucks[i].markerId);
				$scope.onlineTrucks.splice(i, 1);
			}
		}
		for (var i = $scope.favoriteTrucks.length - 1; i >= 0 ; i--) {
			if (truck._id === $scope.favoriteTrucks[i]._id) {
				mapService.removeMarker($scope.favoriteTrucks[i].markerId);
				$scope.favoriteTrucks.splice(i, 1);
			}
		}
		$scope.$apply();
	});

	var truckAnimation = function() {
		$('#rightTruck').delay(4000).animate({left: '100%'}, 10000, 'linear', function(){
			$('#rightTruck').css('left', '-50px');
			$('#leftTruck').delay(4000).animate({left: '-50px'}, 10000, 'linear', function() {
				$('#leftTruck').css('left', '100%')
				truckAnimation();
			})
		})
	};
	truckAnimation();

	$scope.closer = function() {
		$scope.overlaySwitcher = false;
		$scope.createAccountShow = false;
		$scope.editProfileShow = false;
		$scope.signInSwitcher = false;
	};

	$scope.loginClick = function() {
		$scope.overlaySwitcher = true;
		$scope.signInSwitcher = true;
		setTimeout(function() { $('#signinUserNameInput').focus() }, 0);
	};

	$scope.login = function(user) {
		userService.login(user).then(function(response) {
			if(typeof(response) === 'string') {
				if (response.substring(0,response.length-1) === 'User not found') {
					$scope.errorMessage = 'User not found. Please create account.';
					$timeout(function() {
	                    $scope.errorMessage = '';
	                    $scope.$apply();
	                }, 7000);
				} else {
					$scope.errorMessage = 'Password incorrect. Please try again.'
					$timeout(function() {
	                    $scope.errorMessage = '';
	                    $scope.$apply();
	                }, 7000);
				}
			} else {
				$scope.currentUser = response;
				for (var i = 0; i < $scope.currentUser.permissions.length; i++) {
					if ($scope.currentUser.permissions[i] === 'Admin') {
						$scope.adminShow = true;
					}
					if ($scope.currentUser.permissions[i] === 'FoodTruck') {
						$scope.foodTruckShow = true;
					}
				}
				if ($scope.currentUser.favoriteTrucks) {
					for (var i = 0; i < $scope.currentUser.favoriteTrucks.length; i++) {
						$scope.favoriteTrucks.push($scope.currentUser.favoriteTrucks[i]);
						for (var j = 0; j < $scope.onlineTrucks.length; j++) {
							if ($scope.currentUser.favoriteTrucks[i]._id === $scope.onlineTrucks[j]._id) {
								mapService.removeMarker($scope.onlineTrucks.markerId);
								$scope.onlineTrucks.splice(j, 1);
							}
						}
					}
					for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
                        $scope.favoriteTrucks[i].markerId = $scope.favoriteTrucks[i].currentLocation.lat + '_' + $scope.favoriteTrucks[i].currentLocation.lng;
                        mapService.addMarker($scope.favoriteTrucks[i],i * 300);
                    }
				}
				$scope.guestShow = true;
				$scope.userShow = true;
				$scope.user = {};
				$scope.closer();
			}		
		});
	};

	$scope.addAccount = function(newUser) {
		if (newUser.password !== newUser.confirmPassword) {
			$scope.errorMessage = 'Password does not match. Please try again.';
			$timeout(function() {
                $scope.errorMessage = '';
                $scope.$apply();
            }, 7000);

		} else {
			userService.addAccount(newUser).then(function(response) {
				if (typeof response === 'string') {
					$scope.errorMessage = 'Email already exists. Please use a different email.';
					$timeout(function() {
	                    $scope.errorMessage = '';
	                    $scope.$apply();
	                }, 7000);
				} else {
					$scope.currentUser = response;
					$scope.guestShow = true;
					$scope.userShow = true;
					$scope.newUser = {};
					$scope.closer();
				}
			})
		}
	};

	$scope.switchToCreateAccount = function() {
		$scope.signInSwitcher = false;
		$scope.createAccountShow = true;
		setTimeout(function() { $('#createUserNameInput').focus() }, 0);
	};

	$scope.backToSignIn = function() {
		$scope.signInSwitcher = true;
		$scope.createAccountShow = false;
		setTimeout(function() { $('#signinUserNameInput').focus() }, 0);
	};

	$scope.userLogout = function() {
		userService.logout().then(function(response) {
			for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
				$scope.onlineTrucks.push($scope.favoriteTrucks[i]);
			}
			$scope.favoriteTrucks = [];
			$scope.currentUser = undefined;
			$scope.guestShow = false;
			$scope.userShow = false;
			$scope.adminShow = false;
			$scope.foodTruckShow = false;
			$scope.seeSideCont3();
			$state.go('home');
		});
	};

	$scope.seeSideCont1 = function() {
		var position2 = $('.sideContainer2').position();
		var position3 = $('.sideContainer3').position();
		if (position2.left >= 0) {
			if (position3.left >= 0) {
				$('.sideContainer3').animate({left: '-85%'}, 1000);
			}
			$('.sideContainer2').animate({left: '-85%'}, 1000);
		} else {
			return;
		}
	}

	$scope.seeSideCont2 = function() {
		var position2 = $('.sideContainer2').position();
		var position3 = $('.sideContainer3').position();
		if (position2.left >= 0) {
			if (position3.left >= 0) {
				$('.sideContainer3').animate({left: '-85%'}, 1000);	
			} else {
				return;
			}
		} else {
		    $('.sideContainer2').animate({
		    	left: 0}, 1000);
		}
	}

	$scope.seeSideCont3 = function() {
		var position2 = $('.sideContainer2').position();
		var position3 = $('.sideContainer3').position();
		if(position3.left < 0) {
			if (position2.left < 0) {
				$('.sideContainer2').animate({left: 0}, 1000);				
			}
		    $('.sideContainer3').animate({left: 0}, 1000);
		} else {
			return;
		}
	}

	$scope.seeSideCont4 = function() {
	    $('.sideContainer4').animate({left: parseInt($('.sideContainer4').css('left')) == 0 ? '-101%' : 0}, 1000);
	}

	$scope.editProfile = function() {
		$scope.overlaySwitcher = true;
		$scope.editProfileShow = true;
	}

	$scope.updateAccount = function(updatedUser) {
		if (updatedUser.password !== updatedUser.confirmPassword) {
			$scope.errorMessage = 'Password does not match. Please try again.';
			$timeout(function() {
                $scope.errorMessage = '';
                $scope.$apply();
            }, 7000);

		} else {
			userService.updateAccount(updatedUser).then(function(response) {
				$scope.currentUser = response;
				$scope.updatedUser = {};
				$scope.closer();
			});		
		}	
	}	

	mapService.mainControlSubscribe(function() {
		$scope.mapLoader = false;
		$scope.$apply();
	})
	
})