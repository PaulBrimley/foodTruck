angular.module('truckApp', ['ui.router', 'ngAnimate'])

.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url: '/home',
			views: {
				'sideContainer': {
					templateUrl: '/views/mainViewTmpl.html',
					resolve: {
						clearMarkers: function(mapService) {
                            mapService.clearAllMarkers();
                        }
					},
					controller: function($scope, mapService, $timeout, userService, truckService) {
                        
                        $scope.menuChanger = false; 
                        if ($scope.currentUser) {
                            if ($scope.onlineTrucks.length > 0) {
                                for (var i = 0; i < $scope.onlineTrucks.length; i++) {
                                    $scope.onlineTrucks[i].markerId = $scope.onlineTrucks[i].currentLocation.lat + '_' + $scope.onlineTrucks[i].currentLocation.lng;
                                    mapService.addMarker($scope.onlineTrucks[i],i * 300);
                                }  
                                for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
                                    $scope.favoriteTrucks[i].markerId = $scope.favoriteTrucks[i].currentLocation.lat + '_' + $scope.favoriteTrucks[i].currentLocation.lng;
                                    mapService.addMarker($scope.favoriteTrucks[i],i * 300);
                                }
                            }
                        }

						$scope.addToFavorites = function(truck) {
							if(!$scope.currentUser) {
								alert('Must be logged in to add a truck to favorites');
								return;
							}
							userService.addToFavorites(truck).then(function(response) {
                                $scope.currentUser.favoriteTrucks.push(response);
                                $scope.favoriteTrucks.push(response);
    							for (var i = 0; i < $scope.onlineTrucks.length; i++) {
    								if (truck._id === $scope.onlineTrucks[i]._id) {
    									$scope.onlineTrucks.splice(i, 1);
    								}
    							}
                            });
						};

						$scope.removeFromFavorites = function(truck) {
                            console.log('truck to remove from favorites', truck);
                            userService.removeFromFavorites(truck).then(function(response) {
    							for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
    								if (response._id === $scope.favoriteTrucks[i]._id) {
    									$scope.favoriteTrucks.splice(i, 1);
                                        console.log('splicing from favorites');
    								}
    							}
    							$scope.onlineTrucks.push(response);
                            });
						};

						$scope.getDirections = function(destination) {
							mapService.getDirections(destination);
							$timeout(function() {$scope.$apply()}, 1000);
							$('.sideContainer4').animate({left: 0}, 1000);
						};

						$scope.removeMarker = function(markerId) {
							mapService.removeMarker(markerId);
						};

						mapService.subscribe(function() {
                            if ($scope.onlineTrucks.length > 0) {
    							for (var i = 0; i < $scope.onlineTrucks.length; i++) {
    								$scope.onlineTrucks[i].markerId = $scope.onlineTrucks[i].currentLocation.lat + '_' + $scope.onlineTrucks[i].currentLocation.lng;
    								mapService.addMarker($scope.onlineTrucks[i],i * 300);
    							}
                                for (var i = 0; i < $scope.favoriteTrucks.length; i++) {
                                    $scope.favoriteTrucks[i].markerId = $scope.favoriteTrucks[i].currentLocation.lat + '_' + $scope.favoriteTrucks[i].currentLocation.lng;
                                    mapService.addMarker($scope.favoriteTrucks[i],i * 300);
                                }	
                            }
						});
					}
                },
                'mapControls': {
                    template: '<span class="insideRightDirections insideMapControls" ng-click="clearDirections()">Clear Directions</span><span class="insideRightDirections insideMapControls" ng-click="seeSideCont4()">Display Route Details</span>',
                    resolve: {
                        clearMarkers: function(mapService) {
                            mapService.clearAllMarkers();
                        }
                    },
                    controller: function($scope, mapService, $timeout) {

                        $scope.clearDirections = function() {
                        	mapService.clearDirections();
                            var position = $('.sideContainer4').position();
                            if (position.left === 0) {
                                $('.sideContainer4').animate({left: '-101%'}, 1000);
                            }
                        }
                    }
                }
		  }
        })
        .state('foodTruck', {
            url: '/foodTruck',
            views: {
                'sideContainer': {
                    templateUrl: '/views/foodTruckTmpl.html',
                    resolve: {
                        clearMarkers: function(mapService) {
                            mapService.clearAllMarkers();
                        },
                        checkAuth: function($state, userService) {
                            return userService.getCurrentUser().then(function(response) {
                                if (!response) {
                                    $state.go('home');
                                }
                                return response;
                            }).catch(function(err) {
                                return err;
                            })
                        }
                    },
                    controller: function($scope, $timeout, mapService, truckService, userService) {
                        
                        var socket = io();
                        $scope.foodTruck = {};
                        $scope.enabledDisabled = '';
                        $scope.message = '';
                        $scope.newMenuItem = {};
                        $scope.currentTruckLocation = mapService.getUserPosition();

                        userService.getCurrentUser().then(function(response) {
                            $scope.foodTruck = response.connectedTruckRef;
                            if ($scope.foodTruck.enabled === false) {
                                $('#onlineButton').attr('disabled', true);
                            } else {
                                $('#onlineButton').attr('disabled', false);
                            }
                            if ($scope.foodTruck) {
                                if ($scope.foodTruck.enabled === true) {
                                    $scope.enabledDisabled = 'Enabled';
                                } else {
                                    $scope.enabledDisabled = 'Disabled. Please contact Administrator.';
                                }
                            }
                            if (mapService.isMapLoaded()) {
                                if ($scope.foodTruck !== undefined) {
                                    if ($scope.foodTruck.pastLocationsAndSales !== undefined) {
                                        for (var i = 0; i < $scope.foodTruck.pastLocationsAndSales.length; i++) {
                                            $scope.foodTruck.pastLocationsAndSales[i].markerId = $scope.foodTruck.pastLocationsAndSales[i].location.lat + '_' + $scope.foodTruck.pastLocationsAndSales[i].location.lng;
                                            mapService.addSaleMarker($scope.foodTruck.pastLocationsAndSales[i].location, $scope.foodTruck.pastLocationsAndSales[i].sales.toString(), $scope.foodTruck.pastLocationsAndSales[i].markerId,i * 400);
                                        }
                                    }
                                }
                            };
                        })

                        $scope.updateFoodTruckProfile = function(foodTruck) {
                            truckService.updateFoodTruckProfile(foodTruck).then(function(response) {
                                $scope.foodTruck = response;
                                $scope.message = 'Truck Profile Successfully Updated';
                                $timeout(function() {
                                    $scope.message = '';
                                    $scope.$apply();
                                }, 4000);
                            });
                        }

                    	$scope.addMenuItem = function(newMenuItem) {
                            truckService.addMenuItem($scope.foodTruck._id, newMenuItem).then(function(response) {
                                if(typeof response === 'string') {
                                    $scope.message = 'Item already in menu.'
                                    $timeout(function() {
                                        $scope.message = '';
                                        $scope.$apply();
                                    }, 4000);
                                    return;
                                } else {
                                    $scope.foodTruck.menu = response.menu;
                                }
                                $scope.newMenuItem = '';
                            });
                        }

                    	$scope.removeMenuItem = function(item) {
                            $scope.itemToRemove = {item: item};
                            truckService.removeMenuItem($scope.foodTruck._id, $scope.itemToRemove).then(function(response) {
                                $scope.foodTruck.menu = response.menu;
                            });
                    	}

                        $scope.addSpecial = function(newSpecial) {
                            truckService.addSpecial($scope.foodTruck._id, newSpecial).then(function(response) {
                                $scope.foodTruck.specials.push(response);
                            });
                            $scope.newSpecial = {};
                        }

                        $scope.removeSpecial = function(special) {
                            truckService.removeSpecial(special).then(function(response) {
                                for (var i = 0; i < $scope.foodTruck.specials.length; i++) {
                                    if (response._id === $scope.foodTruck.specials[i]._id) {
                                        $scope.foodTruck.specials.splice(i, 1);
                                    }
                                }
                            });
                        }

                        $scope.goOnline = function() {
                            if (window.confirm('Are you sure you want to go online?') === true) {
                                var truckObj = {
                                    truckId: $scope.foodTruck._id,
                                    location: $scope.currentTruckLocation.position
                                }
                                socket.emit('truck online', truckObj);
                                socket.on('reply from truck online', function(truck) {
                                    $scope.foodTruck.online = truck.online;
                                    $scope.$apply();
                                });
                            }
                        }

                        $scope.goOffline = function(newSales) {
                            if (window.confirm('Are you sure you want go offline?') === true) {
                                var salesObj = {
                                    sales: newSales,
                                    location: $scope.currentTruckLocation.position,
                                    truckId: $scope.foodTruck._id
                                }
                                socket.emit('truck offline', salesObj);
                                socket.on('reply from truck offline', function(truck) {
                                    console.log('truck went offline', truck)
                                    $scope.foodTruck.online = truck.online;
                                    $scope.salesAtThisLocation = '';
                                    var markerId = $scope.currentTruckLocation.position.lat + '_' + $scope.currentTruckLocation.position.lng;
                                    truck.currentLocation = $scope.currentTruckLocation.position;
                                    truck.markerId = markerId;
                                    mapService.addSaleMarker(truck.currentTruckLocation, newSales, truck.markerId,400);
                                    $scope.$apply();
                                });
                            }
                        }

                        mapService.subscribe(function() {
                        	if ($scope.foodTruck !== undefined) {
                                if ($scope.foodTruck.pastLocationsAndSales !== undefined) {
    	                            for (var i = 0; i < $scope.foodTruck.pastLocationsAndSales.length; i++) {
    	                                $scope.foodTruck.pastLocationsAndSales[i].markerId = $scope.foodTruck.pastLocationsAndSales[i].location.lat + '_' + $scope.foodTruck.pastLocationsAndSales[i].location.lng;
    	                                mapService.addMarker($scope.foodTruck.pastLocationsAndSales[i],i * 400);
    	                            }
                                }
                        	}
                        });
                    }
                }
            }	
        })
		.state('admin', {
            url: '/admin',
            views: {
                'sideContainer': {
                    templateUrl: '/views/adminTmpl.html',
                    resolve: {
                        clearMarkers: function(mapService) {
                            mapService.clearAllMarkers();
                        },
                        checkAuth: function($state, userService) {
                            return userService.getCurrentUser().then(function(response) {
                                if (!response) {
                                    $state.go('home');
                                }
                                return response;
                            }).catch(function(err) {
                                console.log('err',err);
                                return err;
                            })
                        }
                    },
                    controller: function($scope, mapService, userService, truckService, $timeout) {

                        var socket = io();
                        $scope.allTrucks = [];
                        $scope.allUsers = [];
                        $scope.foodTruck = {};
                        $scope.newProductPic = [];

                        truckService.getAllTrucks().then(function(response) {
                            $scope.allTrucks = response;
                        });
                        userService.getAllUsers().then(function(response) {
                            $scope.allUsers = response;
                        });

                        $scope.toggleDisableTruck = function(truck) {
                            if (window.confirm('Are you sure you want to enable/disable ' + truck.truckName) === true) {
                                socket.emit('toggle disable truck', truck);
                                socket.on('reply from toggle disable truck', function(response) {
                                    for (var i = 0; i < $scope.allTrucks.length; i++) {
                                        if (response._id === $scope.allTrucks[i]._id) {
                                            $scope.allTrucks[i].enabled = response.enabled;
                                            $scope.$apply();
                                        }
                                    }
                                })
                            } else return;
                        }

                        $scope.deleteTruck = function(truck) {
                            if (window.confirm('Are you sure you want to delete ' + truck.truckName) === true) {
                                truckService.deleteTruck(truck).then(function(response) {
                                    truckService.getAllTrucks().then(function(response) {
                                        $scope.allTrucks = response;
                                    });
                                    userService.getAllUsers().then(function(response) {
                                        $scope.allUsers = response;
                                    });
                                    /*for (var i = 0; i < $scope.allTrucks.length; i++) {
                                        if (response._id === $scope.allTrucks[i]._id) {
                                            $scope.allTrucks.splice(i, 1);
                                        }
                                    }*/
                                });
                            } else return;
                        }

                        $scope.makeAdmin = function(userId) {
                            if (window.confirm('Are you sure you want to make this user an Administrator?') === true) {
                                userService.makeAdmin(userId).then(function(response) {
                                    for (var i = 0; i < $scope.allUsers.length; i++) {
                                        if (userId === $scope.allUsers[i]._id) {
                                            $scope.allUsers[i].permissions = response.permissions;
                                            $scope.adminShow = false;
                                        }
                                    }
                                })
                            }
                        }

                        $scope.removeAdmin = function(userId) {
                            if (window.confirm('Are you sure you want to remove Administrator privleges from this user?') === true) {
                                userService.removeAdmin(userId).then(function(response) {
                                    for (var i = 0; i < $scope.allUsers.length; i++) {
                                        if (userId === $scope.allUsers[i]._id) {
                                            $scope.allUsers[i].permissions = response.permissions;
                                            $scope.adminShow = false;
                                        }
                                    }
                                })
                            }
                        }

                        $scope.deleteUser = function(user) {
                            console.log('user in deleteUser', user);
                            if (window.confirm('Are you sure you want to delete ' + user.userName) === true) {
                                userService.deleteUser(user).then(function(response) {
                                    console.log('response from deleteUser', response);
                                    response._id = response._id.toString();
                                    for (var i = 0; i < $scope.allUsers.length; i++) {
                                        $scope.allUsers[i]._id = $scope.allUsers[i]._id.toString();
                                        if ($scope.allUsers[i]._id === response._id) {
                                            $scope.allUsers.splice(i, 1);
                                        }
                                    }
                                });
                            } else return;
                        }

                        $scope.makeNewTruck = function(user) {
                            $scope.foodTruck.connectedUserRef = user._id;
                            $scope.userNameHolder = user.userName;
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
                            $('.sideContainer4').animate({left: 0}, 1000);
                        }

                        $scope.cancelCreateTruck = function() {
                            $('.sideContainer4').animate({left: '-101%'}, 1000);
                            $scope.foodTruck = {};
                        }

                        $scope.imageUpload = function(element){
                            $scope.newProductPic = [];
                            var reader = new FileReader();
                            reader.onload = function(e){
                            $scope.$apply(function() {
                                $scope.newProductPic.push(e.target.result);
                            });
                        };
                            reader.readAsDataURL(element.files[0]);
                        };

                        $scope.imageIsLoaded = function(e){
                            $scope.$apply(function() {
                                $scope.newProductPic.push(e.target.result);
                            });
                        };

                        $scope.createFoodTruck = function(foodTruck) {
                            if (!foodTruck.enabled) {
                                foodTruck.enabled = false;
                            }
                            foodTruck.picture = $scope.newProductPic[0];
                            truckService.createFoodTruck(foodTruck).then(function(truck) {
                                userService.connectTruckToUser(truck).then(function(response) {
                                    truckService.getAllTrucks().then(function(response) {
                                        $scope.allTrucks = response;
                                    });
                                    userService.getAllUsers().then(function(response) {
                                        $scope.allUsers = response;
                                    })
                                    $scope.message = 'Truck successfully created.'
                                    $scope.newProductPic = [];
                                    $timeout(function() {
                                        $scope.message = '';
                                        $scope.$apply();
                                        $('.sideContainer4').animate({left: '-101%'}, 1000);
                                        $scope.foodTruck = {};
                                    }, 2000);
                                });
                            });
                        }

                        mapService.subscribe(function() {
                            /*for (var i = 0; i < $scope.onlineTrucks.length; i++) {
                                $scope.onlineTrucks[i].markerId = $scope.onlineTrucks[i].currentLocation.lat + '_' + $scope.onlineTrucks[i].currentLocation.lng;
                                mapService.addMarker($scope.onlineTrucks[i].currentLocation, $scope.onlineTrucks[i].truckName, $scope.onlineTrucks[i].markerId,i * 400);
                            }*/			
                        });
                    }
                }/*,
                'adminControls': {
                    template: '<span class="insideRightDirections insideMapControls" ng-click="seeSideCont4()">Connect User to Truck</span>',
                    controller: function($scope) {

                    }
                }*/
            }	
        })
		
	
	   $urlRouterProvider.otherwise('/home');
})