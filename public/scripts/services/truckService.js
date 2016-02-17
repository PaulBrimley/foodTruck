angular.module('truckApp').service('truckService', function($http) {

	var self = this;
	var truckIdCounter = 113;

	this.specials = [
		{
			truckId: '100',
			truckName: 'Tacos R Us',
			special: 'All the hamburgers you can eat for $3.00'
		}
	];

	this.foodTrucks = [
		{
			_id: 100,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Tacos R Us',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Provo, Utah',
			pastLocationsAndSales: [
				{
					location: {
						lat: 41.13613,
						lng: -110.134611
					},
					sales: '456.00',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				},
				{
					location: {
						lat: 40.15736046,
						lng: -111.61010742
					},
					sales: '864.43',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				}
			],
			menu: ['Hamburger', 'Hotdog', 'Fries','Hamburger', 'Hotdog', 'Fries','Hamburger', 'Hotdog', 'Fries','Hamburger', 'Hotdog', 'Fries','Hamburger', 'Hotdog', 'Fries','Hamburger', 'Hotdog', 'Fries',],
			typeOfFood: 'Mexican',	
			specials: ['All the hamburgers you can eat for $3.00'],
			online: true,
			currentLocation: {
				lat: 40.2543766,
				lng: -111.69250488
			},
			favorites: 3
		}, 
		{
			_id: 101,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Best Burgers',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [
				{
					location: {
						lat: 40.15736046,
						lng: -111.61010742
					},
					sales: '151.23',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				},
				{
					location: {
						lat: 40.15736046,
						lng: -111.61010742
					},
					sales: '10000.00',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				}
			],
			menu: ['Hamburger', 'Hotdog', 'Fries'],
			typeOfFood: 'Who knows',	
			specials: ['Half off Hot Dogs on Wednesday', 'Who knows what this one does'],
			online: true,
			currentLocation: {
				lat: 40.56389453,
				lng: -111.89025879
			},
			favorites: 6
		}, 
		{
			_id: 102,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Jabba The Pizza Huttt',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Payson, Utah',
			pastLocationsAndSales: [
				{
					location: {
						lat: 41.2435,
						lng: -110.13451
					},
					sales: '12414.41',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				},
				{
					location: {
						lat: 40.2342,
						lng: -112.13512
					},
					sales: '100000000000.01',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				}
			],
			menu: ['Pizza', 'Lando Calzonian', 'Bread Sticks'],
			typeOfFood: 'Italian/American',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.1053867,
				lng: -111.66091919
			},
			favorites: 190
		}, 
		{
			_id: 103,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Romeos',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Moab, Utah',
			pastLocationsAndSales: [],
			menu: ['Cupcakes', 'Twinkies', 'Fried Chicken'],
			typeOfFood: 'Misc',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.15736046,
				lng: -111.61010742
			},
			favorites: 14
		}, 
		{
			_id: 104,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Jumbo Mongo',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Provo, Utah',
			pastLocationsAndSales: [
				{
					location: {
						lat: 39.14351,
						lng: -109.123514
					},
					sales: '1234.97',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				},
				{
					location: {
						lat: 40.1623564,
						lng: -111.4573134
					},
					sales: '0.01',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				},
				{
					location: {
						lat: 40.993571,
						lng: -111.24572
					},
					sales: '58918.01',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				}
			],
			menu: ['Cucumbers', 'Fried Rice'],
			typeOfFood: 'Mongolian',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.05232201,
				lng: -111.67533875
			},
			favorites: 15
		}, 
		{
			_id: 105,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Gushy Sushi',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Salt Lake City, Utah',
			pastLocationsAndSales: [
				{
					location: {
						lat: 40.1556865,
						lng: -111.002613
					},
					sales: '123097.12',
					markerId: ''
					/*timeOfLogoff: {type: ‘Date’, required: true}*/
				}
			],
			menu: ['Sushi'],
			typeOfFood: 'Sushi',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.0372094,
				lng: -111.73387527
			},
			favorites: 1000
		}, 
		{
			_id: 106,
			connectedUserRef: '',
			enabled: true,
			truckName: 'Gourmet Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 107,
			connectedUserRef: '',
			enabled: true,
			truckName: 'adsfasdf Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 108,
			connectedUserRef: '',
			enabled: true,
			truckName: 'qweqewrtqrwet Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 109,
			connectedUserRef: '',
			enabled: true,
			truckName: 'wtwtru Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 110,
			connectedUserRef: '',
			enabled: true,
			truckName: 'ueruwt Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 111,
			connectedUserRef: '',
			enabled: true,
			truckName: 'zcbzxc Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}, 
		{
			_id: 112,
			connectedUserRef: '',
			enabled: true,
			truckName: 'fhkfk Popcorn',
			/*picture: How to store a picture of the truck?,*/
			homeBase: 'Spanish Fork, Utah',
			pastLocationsAndSales: [],
			menu: ['Popcorn'],
			typeOfFood: 'Popcorn',	
			specials: [],
			online: true,
			currentLocation: {
				lat: 40.60561206,
				lng: -111.96853638
			},
			markerId: undefined,
			favorites: 91
		}
	]

	this.getOnlineTrucks = function() {
		return $http.get('/user/getOnlineTrucks').then(function(response) {
			return response.data;
		});
	}

	this.getAllTrucks = function() {
		return $http.get('/admin/getAllTrucks')
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.updateFoodTruckProfile = function(foodTruck) {
		return $http.put('/truck/updateProfile', foodTruck)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.online = function(truckId, location) {
		return $http.put('/truck/online/' + truckId, location)
		.then(function(response) {
			return response.data;
		}).catch(function(err) {
			return err.data;
		})
	}

	this.addSalesAndLocation = function(newSales, truckId, currentLocation) { //through socket.io????
		var newSaleRecord = {
			location: {
				lat: currentLocation.lat,
				lng: currentLocation.lng
			},
			sales: newSales
		}
		return $http.post('/truck/addSalesAndLocation/' + truckId, newSaleRecord)
		.then(function(response) {
			return response.data;
		})
		.catch(function(err){
			return err.data;
		})
	}

	this.addMenuItem = function(truckId, newMenuItem) {
		return $http.put('/truck/addMenuItem/' + truckId, newMenuItem)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.removeMenuItem = function(truckId, item) {
		return $http.put('/truck/deleteMenuItem/' + truckId, item)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})

	}

	this.addSpecial = function(truckId, newSpecial) {
		return $http.post('/truck/addSpecial/' + truckId, newSpecial)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.removeSpecial = function(special) {
		return $http.put('/truck/deleteSpecial/' + special._id, special)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.toggleDisableTruck = function(truck) {
		return $http.put('/admin/toggleDisableTruck', truck)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.createFoodTruck = function(foodTruck) {
		return $http.post('/admin/createTruck', foodTruck)
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

	this.deleteTruck = function(truck) {
		return $http({
			method: 'PUT',
			url: '/admin/deleteTruck',
			data: truck })
		.then(function(response) {
			return response.data;
		}).catch(function(response) {
			return response.data;
		})
	}

})