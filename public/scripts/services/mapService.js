angular.module('truckApp').service('mapService', function($http, $q, $timeout) {

	var mapObj = {};
	var userPosition = {
		position: undefined,
		marker: undefined,
		mapLabel: undefined
	};
	mapObj.drivingDirectionsDisplay = new google.maps.DirectionsRenderer;
	mapObj.drivingDirectionsService = new google.maps.DirectionsService;
	var observer;
	var secondObserver;
	mapObj.markers = [];
	mapObj.mapLabels = [];
	mapObj.infoWindows = [];
	var mapLoaded;
	var self = this;

	this.getUserLocation = function() {
		navigator.geolocation.getCurrentPosition(this.setUserPosition);
	};

	this.isMapLoaded = function() {
		return mapLoaded;
	}

	this.setUserPosition = function(position) {
		mapLoaded = true;
		userPosition.position = {lat: position.coords.latitude, lng: position.coords.longitude};
		mapObj.map = new google.maps.Map(document.getElementById('map'), {
			center: userPosition.position,
			zoom: 9,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		userPosition.mapLabel = new MapLabel({
           	text: 'You are here!',
           	position: new google.maps.LatLng(userPosition.position.lat, userPosition.position.lng),
           	map: mapObj.map,
           	fontSize: 17,
           	align: 'center'
         });
		userPosition.marker = new google.maps.Marker({
	        position: userPosition.position,
	        title: 'You are here!',
	        map: mapObj.map,
	        animation: google.maps.Animation.DROP
	    });
		observer();
		secondObserver();
	}

	this.getUserPosition = function() {
		return userPosition;
	}

	this.getDirections = function(destination) {
		for (var i = 0; i < mapObj.markers.length; i++) {
			mapObj.markers[i].setMap(null);
		}
		for (var i = 0; i < mapObj.mapLabels.length; i++) {
			mapObj.mapLabels[i].setMap(null);
		}	
		mapObj.drivingDirectionsDisplay.setMap(mapObj.map);
		mapObj.drivingDirectionsDisplay.setPanel(document.getElementById('routeDetails'));
		function calcRouteAndDisplay(directionService, directionDisplay) {
			directionService.route({
				origin: userPosition.position,
				destination: destination,
				travelMode: google.maps.TravelMode.DRIVING
			}, function(response, status) {
				if(status === google.maps.DirectionsStatus.OK) {
					mapObj.drivingDirectionsDisplay.setDirections(response);
				} else {
					console.log('Directions request failed due to ' + status);
				}
			});
		}
		calcRouteAndDisplay(mapObj.drivingDirectionsService, mapObj.drivingDirectionsDisplay);
		return true;
	};

	this.subscribe = function(callback) {
		observer = callback;
	};

	this.mainControlSubscribe = function(callback) {
		secondObserver = callback;
	}

	this.addMarker = function(truck, timeout) {
		var newPosition = new google.maps.LatLng(truck.currentLocation.lat, truck.currentLocation.lng)
		window.setTimeout(function() {
			var mapLabel = new MapLabel({
	           	text: truck.truckName,
	           	position: newPosition,
	           	fontSize: 14,
	           	align: 'center',
	           	id: truck.markerId
	         });
			var marker = new google.maps.Marker({
		        position: newPosition,
		        title: truck.truckName,
		        id: truck.markerId,
		        animation: google.maps.Animation.DROP
		    });
		    var contentString = '<div>Truck Name: ' + truck.truckName + '</div><div>Type of Food: ' + truck.typeOfFood + '</div><div  style="width: 100px; height: auto; background: url({{ ' + truck.picture + '}}) no-repeat; background-size: contain"></div>';
		    var infoWindow = new google.maps.InfoWindow({
		    	content: contentString,
		    	id: truck.markerId
		    })
		    mapLabel.setMap(mapObj.map);
		    marker.setMap(mapObj.map);
		    marker.addListener('click', function() {
		    	for (var i = 0; i < mapObj.infoWindows.length; i++) {
		    		if (marker.id === mapObj.infoWindows[i].id) {
						mapObj.infoWindows[i].open(mapObj.map, marker);
		    		}
		    	}
			});
			mapObj.markers.push(marker);
			mapObj.mapLabels.push(mapLabel);
			mapObj.infoWindows.push(infoWindow);
		}, timeout);
	}

	this.addSaleMarker = function(position, sale, markerId, timeout) {
		var newPosition = new google.maps.LatLng(position.lat, position.lng)
		window.setTimeout(function() {
			var mapLabel = new MapLabel({
	           	text: '$' + sale,
	           	position: newPosition,
	           	fontSize: 14,
	           	align: 'center',
	           	id: markerId
	         });
			var marker = new google.maps.Marker({
		        position: newPosition,
		        title: '$' + sale,
		        id: markerId,
		        animation: google.maps.Animation.DROP
		    });
		    var contentString = '<div>Sale: $' + sale + '</div>';
		    var infoWindow = new google.maps.InfoWindow({
		    	content: contentString,
		    	id: markerId
		    })
		    mapLabel.setMap(mapObj.map);
		    marker.setMap(mapObj.map);
		    marker.addListener('click', function() {
		    	for (var i = 0; i < mapObj.infoWindows.length; i++) {
		    		if (marker.id === mapObj.infoWindows[i].id) {
						mapObj.infoWindows[i].open(mapObj.map, marker);
		    		}
		    	}
			});
			mapObj.markers.push(marker);
			mapObj.mapLabels.push(mapLabel);
			mapObj.infoWindows.push(infoWindow);
		}, timeout);
	}

	this.removeMarker = function(markerId) {
		for (var i = 0; i < mapObj.markers.length; i++) {
			if (markerId === mapObj.markers[i].id) {
				mapObj.markers[i].setMap(null);
				mapObj.markers.splice(i, 1);
			}	
		}
		for (var i = 0; i < mapObj.mapLabels.length; i++) {
			if (markerId === mapObj.mapLabels[i].id) {
				mapObj.mapLabels[i].setMap(null);
				mapObj.mapLabels.splice(i, 1);
			}	
		}
		for (var i = 0; i < mapObj.infoWindows.length; i++) {
			if (markerId = mapObj.infoWindows[i].id) {
				mapObj.infoWindows.splice(i, 1);
			}
		}	
	};

	this.clearAllMarkers = function() {
		for (var i = 0; i < mapObj.markers.length; i++) {
			mapObj.markers[i].setMap(null);
		}
		mapObj.markers = [];
		for (var i = 0; i < mapObj.mapLabels.length; i++) {
			mapObj.mapLabels[i].setMap(null);
		}	
		mapObj.mapLabels = [];
		mapObj.infoWindows = [];
	}

	this.clearDirections = function() {
		for (var i = 0; i < mapObj.markers.length; i++) {
			mapObj.markers[i].setMap(mapObj.map);
		}
		for (var i = 0; i < mapObj.mapLabels.length; i++) {
			mapObj.mapLabels[i].setMap(mapObj.map);
		}	
		mapObj.drivingDirectionsDisplay.setMap(null);
		mapObj.drivingDirectionsDisplay.setPanel(null);
		return false;
	}
})