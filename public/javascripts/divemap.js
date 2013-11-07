$(function() {


    // DEFINE VARIABLES
    var map;
    var markers = [];
    var image = 'images/dive-flag.png';



    // DEFINE FUNCTIONS
    // Initialize map with coordinates and Satellite view
      function initialize() {
        var mapOptions = {
            zoom: 2,
            center: new google.maps.LatLng(20, 0),
            mapTypeId: google.maps.MapTypeId.SATELLITE
        };

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        // make an Ajax 'get' request to retrieve divesite data to populate map
        $.get('/loadSites', function(data){
            var diveSites = data;
            console.log('diveSites ', diveSites);

            for (i=0; i<diveSites.length; i++) {

                // IIFE (immediately invoked function expression)
                // function passes index(i) as a param(x) enabling
                // which locks in the correct diveSite for each 'click' handler
                (function(x){
                    var newPoint = new google.maps.LatLng(diveSites[x].lat, diveSites[x].lon);
                    var calledMarker = addMarker(newPoint);

                    google.maps.event.addListener(calledMarker, 'click', function() {
                        // Ajax request
                        
                        var contentString = "testing infobox";
                        var infowindow = new google.maps.InfoWindow({
                          content: contentString
                        });

                        infowindow.open(map, calledMarker);
                        //
                    });
                })(i);
            }
        });


        google.maps.event.addListener(map, 'click', function(event) {
            marker = addMarker(event.latLng);


            //add a new marker based on click event
            google.maps.event.addListener(marker, 'click', function() {
              //ask if marker was intentionally placed or not
              var markerAnswer = confirm('Do you wish to keep this Dive Marker\n'
                +'and create a Dive Reference?');
                if (!markerAnswer) {
                    deleteMarker();
                    showMarkers();
                }
                else {
                    location.href='/profile?lat='+ event.latLng.nb +'&lon='+ event.latLng.ob;
                }
            });

        });

      
    }


    // Add a marker to the map and push to the array.
    function addMarker(location) {
      var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: image
      });

      markers.push(marker);

      return marker;
    }


    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }


    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setAllMap(null);
    }


    // Shows any markers currently in the array.
    function showMarkers() {
      setAllMap(map);
    }


    // Deletes all markers in the array by removing references to them.
    function deleteMarker() {
      clearMarkers();
      markers.pop(marker);
    }

    // Creates an InfoWindow
    // function createInfoWindow() {
    //   var contentString = "testing infobox";

    //   var infowindow = new google.maps.InfoWindow({
    //     content: contentString
    //   });

    //   google.maps.event.addListener(calledMarker, 'click', function() {
    //     infowindow.open(map, marker);
    //   });
    // }


    // EVENT HANDLING
    // create map
    google.maps.event.addDomListener(window, 'load', initialize);

    $('#hide').on('click', clearMarkers);
    $('#show').on('click', showMarkers);
    
});
