$(function() {

    //Brian Koester
    //November 2013

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
            var diveSites = data.data;
            console.log('diveSites ', diveSites);

            for (i=0; i<diveSites.length; i++) {

                // IIFE (immediately invoked function expression)
                // function passes index(i) as a param(x) 
                // which locks in the correct diveSite for each 'click' handler
                (function(x){
                    var newPoint = new google.maps.LatLng(diveSites[x].lat, diveSites[x].lon);
                    var calledMarker = addMarker(newPoint);

                    google.maps.event.addListener(calledMarker, 'click', function() {

                        searchID = {searchID: diveSites[x]._id};

                        // make an Ajax 'get' request to find the info associated with the 'clicked' marker
                        $.get('/markerSearch', searchID, function(data){
                        
                            // marker info returned from request
                            foundMarker = data.data;

                            // perform 'dateFormat(date)' to return a global-friendly date format
                            formattedDate = dateFormat(foundMarker.date);   

                            editID = foundMarker._id;
                            console.log('editID ', editID);                       

                            var contentString = '<div id="info-window">'+
                                                '<b>Location:</b> '+ foundMarker.location +'<hr>'+
                                                '<b>Dive Site:</b> '+ foundMarker.site +'<br><br>'+
                                                '<b>Dive Date:</b> '+ formattedDate +'<br><br>'+
                                                '<b>Conditions:</b> '+ foundMarker.conditions +'<br><br>'+
                                                '<b>Other Data:</b> '+ foundMarker.other + '<hr>'+
                                                '<a href="/editProfile?id='+ editID +'"><img title="Edit Dive Reference"'+ 
                                                'src="images/edit.png"></a></div>'

                            var infowindow = new google.maps.InfoWindow({
                              content: contentString
                            });

                            // open infowindow
                            infowindow.open(map, calledMarker);
                        });
                    });
                })(i);
            }
        });


        google.maps.event.addListener(map, 'click', function(event) {
            marker = addMarker(event.latLng);


            //add a new marker based on click event
            google.maps.event.addListener(marker, 'click', function() {

                //var markerAnswer = confirm('Do you wish to keep this Dive Marker\n'
                 //                               +'and Create a Dive Reference?');
                    // if (!markerAnswer) {
                    //     console.log('do not add');
                    //     deleteMarker();
                    //     showMarkers();
                    // }
                    // else {
                    //     location.href='/profile?lat='+ event.latLng.lat() +'&lon='+ event.latLng.lng();
                    // }
                  
                //ask if marker was intentionally placed or not
                $('.modal').modal('toggle')
             
                // removes multiple 'click' handlers
                $('.yes').off();

                // keep marker and go to profile.jade to get new reference
                $('.yes').click(function(e) {
                    e.preventDefault();
                    console.log('add');
                    location.href='/profile?lat='+ event.latLng.lat() +'&lon='+ event.latLng.lng();
                });

                // removes multiple 'click' handlers
                $('.no').off();
                
                // remove marker
                $('.no').click(function(e) {
                    e.preventDefault();
                    deleteMarker();
                    showMarkers();
                });   

            });

        });

    }


    // format entered date to a global dive date
    function dateFormat(date) {
      literalMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      var year = date.slice(0, 4);
      var month = date.slice(5, 7);
      var day = date.slice(8, 10);

      return newDate = day+' '+literalMonths[month-1]+' '+year;
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
      console.log('deleteMarker');
    }



    // EVENT HANDLING
    // create map
    google.maps.event.addDomListener(window, 'load', initialize);

    $('#hide').on('click', clearMarkers);
    $('#show').on('click', showMarkers);
    
});
