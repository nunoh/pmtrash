var map;
var directionDisplay;
var directionsService;

// TODO
var centerPoint = [ 55.862743, 9.836143 ];

var points = [];
var markers = [];

var infoWindow = null;

function initialize() {

    // initializing google maps stuff
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    directionsDisplay.setMap(map);

    infoWindow = new google.maps.InfoWindow();
    //infoWindow.setContent("loading...");
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
    //clearMap();

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
                map: map,
                title: id,
                html: "<p>" + "Info for container " + id + "</p>"
            });

            // add marker to markers array        
            // markers[i] = marker;

            // add info window to marker
            google.maps.event.addListener(marker, "click", function() {
                infoWindow.setContent(this.html);
                infoWindow.open(map, this);
            });
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

    var start = points[0];

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
        }
    }
}