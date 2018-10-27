aceparking.controller('SearchController', ['$scope', '$rootScope', '$location', 'MapMarkersService',
    function ($scope, $rootScope, $location, MapMarkersService) {

        var queryString = $location.search();
        var searchType;
        var searchTerm;

        if (queryString.searchType == 'Hourly')
            $scope.searchType = 'Hourly';
        
        if (queryString.searchType == 'Monthly')
            $scope.searchType = 'Monthly';

        if (queryString.searchTerm)
            $scope.searchArea = queryString.searchTerm;

        $scope.search = function () {
            var type = $scope.searchType;
            var term = $scope.searchArea;

            console.log('Type:  ' + type);
            console.log('Term:  ' + term);

            if (term) {
                MapMarkersService.getMapMarkers(type, term);
                $rootScope.$broadcast("search-executed", {
                    searchType: type,
                    searchTerm: term
                });
            }
        }
    }
]);