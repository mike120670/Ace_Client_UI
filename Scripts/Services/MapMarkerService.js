aceparking.service('MapMarkersService', ['$http', '$q', '$rootScope', '$location', 'dataLayerService',
    function ($http, $q, $rootScope, $location, dataLayerService) {

        console.log('Inside MapMarkersService:  ' + $location.absUrl().split('?')[0]);
        var isDebugging = false;
        var rootPath = '/';

        //Map Marker Array (For deleting etc.)
        var mapMarkers = [];

        //TODO: Determine default bounds (not sure if this is needed)
        var defaultBounds = {};

        //Selected Marker & Theme
        var selectedMarker;
        var selectedInfoBox;
        var selectedLotNumber;
        var defaultIcon = rootPath + 'Content/images/Map-Marker.png';
        var nearbyIcon = rootPath + 'Content/images/Nearby-Map-Marker.png';
        var selectedIcon = rootPath + 'Content/images/Map-Marker-Selected.png';

        //placeholder scripts/content for base map design, can be removed once this page is fully functional
        var uluru = { lat: 32.7157, lng: -117.1611 };
        // var uluru = { lat: 33.4484, lng: -112.0740 };
        var mapTheme = [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "administrative.country", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.locality", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative.neighborhood", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.attraction", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.park", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }, { "visibility": "simplified" }, { "weight": "3.00" }] }, { "featureType": "road", "elementType": "labels.text", "stylers": [{ "weight": "7.44" }, { "gamma": "0.28" }, { "lightness": "37" }, { "saturation": "37" }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.highway", "elementType": "labels.text", "stylers": [{ "visibility": "on" }, { "weight": "2.78" }, { "gamma": "1.02" }, { "lightness": "-2" }] }, { "featureType": "road.highway.controlled_access", "elementType": "all", "stylers": [{ "visibility": "on" }, { "weight": "2.99" }] }, { "featureType": "road.highway.controlled_access", "elementType": "labels.text", "stylers": [{ "weight": "6.78" }, { "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "labels.text", "stylers": [{ "weight": "5.79" }, { "visibility": "on" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "road.local", "elementType": "labels.text", "stylers": [{ "visibility": "on" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#7fd2f4" }, { "visibility": "on" }] }];
        var mapBounds = new google.maps.LatLngBounds();

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            maxZoom: 18,
            minZoom: 12,
            center: uluru,
            styles: mapTheme
        });

        //Map Events
        map.addListener('dragstart', function () {
            if(selectedMarker){
                mapMarkerService.clearSelectedMarker();
            }
        });
        map.addListener('zoom_changed', function () {
            if (selectedMarker)
                map.panTo(selectedMarker.getPosition());
        });

        //infobox creation
        var ibOptions = {
            content: "",
            pixelOffset: new google.maps.Size(-220, -120),
            disableAutoPan: false,
            maxWidth: 0,
            zIndex: null,
            boxStyle: {
                opacity: 1,
                minWidth:"450px",
                width: "auto"
            },
            closeBoxMargin: "7px 7px -25px 2px",
            closeBoxURL: rootPath + "Content/images/Close-Btn.png",
            infoBoxClearance: new google.maps.Size(1, 1),
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: true
        };

        var ib = new InfoBox(ibOptions);
        google.maps.event.addListener(ib, 'closeclick', function (event) {
            if (selectedMarker) {
                mapMarkerService.clearSelectedMarker();
            }
        });

        function createMarker(markerData, markerType) {
            if (isDebugging) console.log('Latitude:  ' + markerData.Latitude);
            if (isDebugging) console.log('Longitude:  ' + markerData.Longitude);

            if (markerType === 'defaultMarker') {
                if (isDebugging) console.log('isDefaultMarker');
                var marker = new google.maps.Marker({
                    map: map,
                    icon: defaultIcon,
                    position: { lat: markerData.Latitude, lng: markerData.Longitude }
                });
                marker.markerType = 'defaultMarker';
            } else if (markerType === 'nearbyMarker') {
                if (isDebugging) console.log('nearbyMarker');
                var marker = new google.maps.Marker({
                    map: map,
                    icon: nearbyIcon,
                    position: { lat: markerData.Latitude, lng: markerData.Longitude }
                });
                marker.markerType = 'nearbyMarker';
            }

            //populate marker array
            mapMarkers.push(marker);

            //Infobox content
            marker.Address = markerData.Address;
            marker.Rate = "Rates Starting At: $10.00 / day";

            //Extend Bounds with Marker Position
            var position = { lat: markerData.Latitude, lng: markerData.Longitude };
            mapMarkerService.populateMapBounds(position);

            //Create Click Event for Marker
            marker.addListener('click', function (e) {
                //update page scroll position
                $('#search-result-wrapper').animate({
                    scrollTop: $("#" + markerData.LotNumber).offset().top - 105
                }, 1000);
                $("#" + markerData.LotNumber + " > #lot-result").toggleClass("background-highlighted");
                //store updated model
                updatedModel = markerData;
                map.setZoom(16);
                map.setCenter(marker.getPosition());

                if (selectedMarker) {
                    selectedMarker.setIcon(defaultIcon);
                    $("#" + selectedLotNumber > "#lot-result").toggleClass("background-highlighted");
                } 

                marker.setIcon(selectedIcon);
                selectedMarker = marker;
                selectedLotNumber = markerData.LotNumber;
            
                //create info window
                var boxText = document.createElement("div");
                boxText.innerHTML += "<div class='display-table infobox-top'><div class='table-cell center-align'>" + this.Address + "</div></div>";
                boxText.innerHTML += "<div class='display-table infobox-bottom'><div class='table-cell center-align'>" + this.Rate + "</div></div>";

                ib.setContent(boxText);
                ib.open(map, this);
                selectedInfoBox = ib;

                if (marker.markerType === 'nearbyMarker') {
                    var currentURL = $location.absUrl().split('?')[0];
                    console.log('currentURL:  ' + currentURL);
                    var queryString = $location.search();
                    //http://localhost:55152/Lot/Details?lot=1&searchType=Hourly&searchTerm=San%20Diego
                    location.href = currentURL + "?lot=" + markerData.LotNumber + "&searchType=" + queryString.searchType + "&searchTerm=" + queryString.searchTerm;
                }
            });
            marker.addListener('mouseover', function () {
                marker.setIcon(selectedIcon);
            });
            marker.addListener('mouseout', function () {
                if(!selectedMarker || selectedMarker !== marker)
                    marker.setIcon(defaultIcon);
            });
        }
    
    var mapMarkerService = {
        getMapTheme: function(){
            var mapTheme = [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }, { "featureType": "landscape", "stylers": [{ "hue": "#FFBB00" }, { "saturation": 43.400000000000006 }, { "lightness": 37.599999999999994 }, { "gamma": 1 }] }, { "featureType": "road.highway", "stylers": [{ "hue": "#FFC200" }, { "saturation": -61.8 }, { "lightness": 45.599999999999994 }, { "gamma": 1 }] }, { "featureType": "road.arterial", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 51.19999999999999 }, { "gamma": 1 }] }, { "featureType": "road.local", "stylers": [{ "hue": "#FF0300" }, { "saturation": -100 }, { "lightness": 52 }, { "gamma": 1 }] }, { "featureType": "water", "stylers": [{ "hue": "#0078FF" }, { "saturation": -13.200000000000003 }, { "lightness": 2.4000000000000057 }, { "gamma": 1 }] }, { "featureType": "poi", "stylers": [{ "hue": "#00FF6A" }, { "saturation": -1.0989010989011234 }, { "lightness": 11.200000000000017 }, { "gamma": 1 }] }];
            return mapTheme;
        },
        getMapMarkers: function (searchType, searchTerm) {
            //reset model & map if already exists
            if ($rootScope.searchResultsModel) {
                $rootScope.searchResultsModel = [];
            }
            mapMarkerService.resetMapBounds();
            mapMarkerService.clearMarkers();

            dataLayerService.getLots(searchType, searchTerm).then(function (response) {
                if (response.data.length !== 0) {
                    $rootScope.searchResultsModel = response.data;
                    mapMarkerService.createMapMarkers($rootScope.searchResultsModel);
                }
                else {
                    //Need message center for errors and general notifications (shared)
                }
            });
        },
        createMapMarkers: function (markerData) {
            //maintain a status if markers are present on the map.
            markersExist = true;
            angular.forEach(markerData, function (marker) {
                createMarker(marker, 'defaultMarker');
            });
            //Set Map Bounds to Marker Content
            mapMarkerService.setMapBounds();
        },
        createNearbyLots: function (markerData) {
            markersExist = true;
            angular.forEach(markerData, function (marker) {
                createMarker(marker, 'nearbyMarker');
            });
            //Set Map Bounds to Marker Content
            //mapMarkerService.setMapBounds();
        },
        createMapDetailsMarker: function (markerData) {
            createMarker(markerData, 'defaultMarker');
            mapMarkerService.setMapBounds();
        },
        clearSelectedMarker: function () {
            if (selectedMarker) {
                selectedMarker.setIcon(defaultIcon);
                selectedMarker = "";

                if (selectedInfoBox) {
                    selectedInfoBox.close();
                    $("#" + selectedLotNumber > "#lot-result").toggleClass("background-highlighted");
                    selectedLotNumber = "";
                }
                    
            }
        },
        nearbyMapMarkers: function (lotID) {
            console.log("Create Nearby Map Markers");
        },
        populateMapBounds: function (marker){
            mapBounds.extend(marker);
        },
        setMapBounds: function () {
            map.fitBounds(mapBounds);
        },
        resetMapBounds: function () {
            mapBounds = new google.maps.LatLngBounds();
        },
        clearMarkers: function (map) {
            if(mapMarkers){
                for (m in mapMarkers) {
                    mapMarkers[m].setMap(null);
                }
                mapMarkers = [];
            }
        }
    }

    return mapMarkerService;
}]);

