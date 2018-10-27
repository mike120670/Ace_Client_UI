aceparking.controller('SearchResultDetailController', ['$scope', '$rootScope', '$location', 'dataLayerService', 'MapMarkersService',
    function ($scope, $rootScope, $location, dataLayerService, MapMarkersService) {
        $scope.clearMarkers = function () {
            MapMarkersService.clearMarkers();
        }
        //grab querystring params (sample: #?searchType=Hourly&searchTerm=San+Diego) (Angular $location module needs hash before ?  i.e. #?param=val
        var queryString = $location.search();
        var searchType;
        var searchTerm;
        var lotID;

        if (queryString.searchType === 'Hourly')
            $scope.searchType = 'Hourly';

        if (queryString.searchType === 'Monthly')
            $scope.searchType = 'Monthly';

        if (queryString.searchTerm)
            $scope.searchArea = queryString.searchTerm;

        if (queryString.lot)
            lotID = queryString.lot;

        if (queryString.searchTerm) {
            searchType = $location.search()['searchType'];
            searchTerm = $location.search()['searchTerm'];
            //execute search need promise
            dataLayerService.getLotDetails(searchType, lotID).then(function (response) {
                if (response.data) {
                    $scope.lotDetailsModel = response.data.Details;
                    $scope.nearbyLots = response.data.NearbyLots;
                    // TODO: bind response.data.NearbyLots
                    MapMarkersService.createMapDetailsMarker($scope.lotDetailsModel);
                    MapMarkersService.createNearbyLots($scope.nearbyLots);
                }
                else {
                    //Need message center for errors and notifications
                }
            });

        } else {
            //Display notification to user about null searches.
        }
    }

]);