angular.module('truckApp').directive('truckInfoFlipper', function() {
	return {
		templateUrl: '/../views/truckInfoFlipper.html',
		restrict: 'E',
		link: function(scope, elem, attrs) {

			scope.rotateToBack = function() {
				elem.css('transform', 'rotateY(180deg)');
			}
			scope.rotateToFront = function() {
				elem.css('transform', 'rotateY(0deg)');
			}
		}
	}
})