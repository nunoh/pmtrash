// var bdPoints = [
//   [ 55.862743, 9.836143 ], // horsens train station
//   [ 55.858575, 9.852081 ], // bilka
//   [ 55.870948, 9.855557 ], // casa arena
//   [ 55.873855, 9.836234 ], // horsens prison
//   [ 55.872989, 9.885088 ]  // via university
// ];

var map;
var directionDisplay;
var directionsService;
var stepDisplay;

var centerPoint = [ 55.862743, 9.836143 ];

var points = [];
var markers = [];
var bdPoints = [];

function initialize() {

    // initializing google maps stuff
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    stepDisplay = new google.maps.InfoWindow();

    var mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    directionsDisplay.setMap(map);
}

function clearMap() {

    // clear markers
    for (var i = 0; i < markers.length; i++)
        markers[i].setMap(null);

    // clear route
    directionsDisplay.setMap(null);
}

function show(url) {

    points = new Array();

    $.get(url, function(data) {
        var tmp = jQuery.parseJSON(data);
        for (var i = 0; i < tmp.length; i++) {
            var lat = tmp[i].Latitude;
            var lng = tmp[i].Longitude;
            //alert(lat + " " + lng);
            points[i] = new google.maps.LatLng(lat, lng);
        }
    })

    .complete(function() {
        
        clearMap();

        // create a marker for each point in array points
        for (var i = 0; i < points.length; i++) {
            markers[i] = new google.maps.Marker( { position: points[i] } );          
            markers[i].setMap(map);
        }

    });   
}

function showAll() {
    show("php/all.php");
}

function showFull() {
    show("php/pathfinder.php");
}

function showRoute() {

    clearMap();

    directionsDisplay.setMap(map);

    var start = points[0]
    //var end = points[points.length-1];

    // var waypts = [
    //   { location: points[1], stopover: true },
    //   { location: points[2], stopover: true },
    //   { location: points[3], stopover: true }
    // ];

    var waypts = new Array();

    for (i = 1; i < points.length; i++) {
        waypts[i-1] = { location: points[i], stopover: true };
    }

    var request = {
        origin: start,
        destination: start,
        waypoints: waypts,
        optimizeWaypoints: true,
        unitSystem: google.maps.UnitSystem.METRIC,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            showSteps(response);
        }
    });
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
        directionsPanel.innerHTML += "<h3>" + myRoute.start_address + " - " + myRoute.end_address + "</h3>";
        for (var i = 0; i < myRoute.steps.length; i++) {          
            var inst = myRoute.steps[i].instructions;
            directionsPanel.innerHTML += "<p>" + (i+1) + ". " + inst + "</p>";
            // attachInstructionText(marker, myRoute.steps[i].instructions);
        }
    }
}