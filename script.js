var map;
var directionsService;
var totalDistance = 0;

// TODO
var centerPoint = [ 55.862743, 9.836143 ];

var markers = [];
var displays = [];

var infoWindow = null;

var DEFAULT_ZOOM = 12;

function drawRoute(start, end) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK)
            renderDirections(result);
        else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            setTimeout(function() { drawRoute(start, end); }, 200);
        }
        else {
            console.log("some other unknown error");
        }
    });
}


function renderDirections(result) {
    var directionsDisplay = new google.maps.DirectionsRenderer({ 
        supressMarkers: true, 
        supressInfoWindows: true,
        map: map,
        directions: result
    });    
    displays.push(directionsDisplay);
    // directionsDisplay = null;
}

function initialize() {

    // initializing google maps stuff
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({ supressMarkers: true, supressInfoWindows: true });

    var mapOptions = {
        zoom: DEFAULT_ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    infoWindow = new google.maps.InfoWindow();
    //infoWindow.setContent("loading...");
}

function clearMap() {

    // remove markers from map
    for (var i = 0; i < markers.length; i++)
        markers[i].setMap(null);

    // reinitalize markers array
    markers = [];

    // clear route
    for (i = 0; i < displays.length; i++)
        displays[i].setDirections({routes: []});
}

function loadMarkers(url, show) {

    // make sure that map isn't populated with any data from a previous request
    clearMap();

    $.get(url, function(data) {
        
        var json = jQuery.parseJSON(data);
        
        for (var i = 0; i < json.length; i++) {
            
            // parsing json
            var lat = json[i].Latitude;
            var lng = json[i].Longitude;
            var id = json[i].ID;

            // create new marker
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                title: id,
                html: "<p>" + "Info for container " + id + "</p>"
            });

            // add marker to markers array
            markers.push(marker);

            // add info window to marker
            google.maps.event.addListener(marker, "click", function() {
                infoWindow.setContent(this.html);
                infoWindow.open(map, this);
            });
        }
    })

    // because .$get call is asynchronous call
    .complete(function() {

        // if it's a show option (either full or all) make sure to show the markers
        if (show) {
            showMarkers();
        }

        // otherwise, it's because it's a route, so draw it
        else {
            for (i = 0; i < markers.length-1; i++) {
                var marker1 = markers[i];
                var marker2 = markers[i+1];
                drawRoute(marker1.position, marker2.position);
            }
        }
    });

}

function showMarkers() {
    for (i = 0; i < markers.length; i++)
        markers[i].setMap(map);
}

function showAll() {    
    loadMarkers("php/all.php", true);
}

function showFull() {
    loadMarkers("php/pathfinder.php", true);
}

function showRoute() {    
    loadMarkers("php/pathfinder.php", false);
}

function clean() {
    clearMap();
    directionsPanel = document.getElementById("directions_panel");
    directionsPanel.innerHTML = "";
}

function showSteps(directionResult) {
    directionsPanel = document.getElementById("directions_panel");
    directionsPanel.innerHTML = "";
    for (var l = 0; l < directionResult.routes[0].legs.length; l++) {
        var myRoute = directionResult.routes[0].legs[l];
        var dist = myRoute.distance.value / 1000.0;
        totalDistance += dist;
        directionsPanel.innerHTML += "<h3>" + myRoute.distance.text + " " + myRoute.start_address + " - " + myRoute.end_address + "</h3>";
        for (var i = 0; i < myRoute.steps.length; i++) {          
            var inst = myRoute.steps[i].instructions;
            directionsPanel.innerHTML += "<p>" + (i+1) + ". " + inst + "</p>";
        }
    }

    directionsPanel.innerHTML += "Total <h1>" + totalDistance.toFixed(1) + " km </h1>"
    
}

