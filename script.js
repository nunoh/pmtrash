var map;
var directionDisplay;
var directionsService;

var totalDistance = 0;

// TODO
var centerPoint = [ 55.862743, 9.836143 ];

var markers = [];

var infoWindow = null;

var DEFAULT_ZOOM = 12;

function requestDirections(start, end) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK)
            renderDirections(result);
        else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            setTimeout(function() { requestDirections(start, end); }, 1000);
            console.log("waiting one second, before next request");
        }
        else {
            console.log("some other unknown error");
        }
    });
}


function renderDirections(result) {
    var directionsRenderer = new google.maps.DirectionsRenderer({ 
        supressMarkers: true, 
        supressInfoWindows: true,
        map: map,
        directions: result
    });
    // directionsRenderer.setMap(map);
    // directionsRenderer.setDirections(result);
}

function initialize() {

    // initializing google maps stuff
    directionsService = new google.maps.DirectionsService();
    //directionsDisplay = new google.maps.DirectionsRenderer({ supressMarkers: true, supressInfoWindows: true });


    var mapOptions = {
        zoom: DEFAULT_ZOOM,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    //directionsDisplay.setMap(map);

    infoWindow = new google.maps.InfoWindow();
    //infoWindow.setContent("loading...");
}

function clearMap() {

    // clear markers
    for (var i = 0; i < markers.length; i++)
        markers[i].setMap(null);

    // clear route
    //directionsDisplay.setMap(null);
}

function show(url) {

    clearMap();

    markers = new Array();

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
            markers[i] = marker;
            markers[i].setMap(map);

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

function showRoute2(){
    requestDirections("Huntsville, AL", "Boston, MA");
    requestDirections("California, CA", "Stanford, CA");
}

function showRoute() {

    clearMap();

    for (i = 0; i < markers.length-1; i++) {
        var marker1 = markers[i];
        var marker2 = markers[i+1];
        requestDirections(marker1.position, marker2.position);
        // window.setTimeout(function() { alert("foo"); }, 5000);
        // console.log("after requesting " + i);
        //window.clearTimeout(handle);
    }
    //requestDirections(markers[markers.length-1], markers[0]);
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

