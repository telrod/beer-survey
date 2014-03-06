var beerSurvey = angular.module('beerSurvey', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all beers for survey
	$http.get('/api/survey')
		.success(function(data) {
            $scope.results = data[0].tally;
			$scope.survey = data[1].beers;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

    $scope.vote = function(id) {
        console.log('voting for id: ' + id);
        var json = '{"id":' + id + '}';
        $http.post('/api/vote/', json)
            .success(function(data) {
                $('input').val('');
                $scope.results = data[0].tally;
                $scope.survey = data[1].beers;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}