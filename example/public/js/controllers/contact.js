

/**
 *  contact.js
 */


function contactController($scope, $http) {

	$http({
		url: '/contact/card',
		method: "GET", 
	}).success(function(data, status, headers, config) {
		$scope.card = data;
	}).error(function(data, status, headers, config) {
		console.log(data);
	});

	$scope.fullName = function(){
		if ($scope.card)
			return $scope.card.name.first + " " + $scope.card.name.last;
		else
			return null;
	}
}