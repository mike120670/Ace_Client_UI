aceparking.controller('SearchResultsController', ['$scope', '$rootScope', '$location', 'dataLayerService', 'MapMarkersService',
    function ($scope, $rootScope, $location, dataLayerService, MapMarkersService) {
        $scope.clearMarkers = function () {
            MapMarkersService.clearMarkers();
        }
        //grab querystring params (sample: #?searchType=Hourly&searchTerm=San+Diego) (Angular $location module needs hash before ?  i.e. #?param=val
        var queryString = $location.search();
        var searchType;
        var searchTerm;

        if (queryString.searchType ==='Hourly')
            $scope.searchType = 'Hourly';

        if (queryString.searchType ==='Monthly')
            $scope.searchType = 'Monthly';

        if (queryString.searchTerm)
            $scope.searchArea = queryString.searchTerm;


        if (queryString.searchTerm) {
            searchType = $location.search()['searchType'];
            searchTerm = $location.search()['searchTerm'];
            console.log('Preparing to get lots...');

            //execute search need promise
            dataLayerService.getLots(searchType, searchTerm).then(function (response) {
                if (response.data) {
                    console.log('Service call successful...');
                    $scope.searchResultsModel = response.data;
                    MapMarkersService.createMapMarkers($scope.searchResultsModel);
                }
                else {
                    console.log('--> Error occurred while retrieving lots...');
                    console.log(response);
                    //Need message center for errors and notifications
                }
            });

        } else {
            //Display notification to user about null searches and how baby jesus cries when this happens.
        }

        $rootScope.$on('search-executed', function (event, args) {
            if ($scope.searchResultsModel) {
                //empty model to show loader (ng-if in doc model)
                $scope.searchResultsModel = "";
                var type = args.searchType;
                var term = args.searchTerm;

                dataLayerService.getLots(type, term).then(function (response) {
                    if (response.data) {
                        $scope.searchResultsModel = response.data;
                        MapMarkersService.setMapBounds();
                    }
                    else {
                        //Need message center for errors and notifications
                    }
                });
            }
        });
    }
]);