var map;
var directionsService;
var infoWindow;

var markers = [];
var displays = [];

var movingIcon = new google.maps.MarkerImage('/img/icon_moving.jpg');
var startIcon = new google.maps.MarkerImage('/img/icon_start.png');

var totalDistance = 0;
var iContainer = 0;
var iInstruction = 1;

// TODO
var centerPoint = [ 55.862743, 9.836143 ];
  
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
        suppressMarkers: true,
        map: map,
        directions: result
    });    
    displays.push(directionsDisplay);
    showSteps(result);
    // directionsDisplay = null;
}

function initialize() {

    // initializing google maps stuff
    directionsService = new google.maps.DirectionsService();

    // map options
    var mapOptions = {
        zoom: 12,
        streetViewControl: false,
        // scaleControl: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    // creating a map
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    // creating a info window instance
    infoWindow = new google.maps.InfoWindow();
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
    iInstruction = 1;
    directionsPanel = document.getElementById("directions_panel");
    directionsPanel.innerHTML = "";
}

function showSteps(directionResult) {
    
    directionsPanel = document.getElementById("directions_panel");
    
    for (var l = 0; l < directionResult.routes[0].legs.length; l++) {
        
        // current route    
        var route = directionResult.routes[0].legs[l];
        
        // get distance in kms
        var dist = route.distance.value / 1000.0;
        
        // update total distance so far
        totalDistance += dist;

        // write current container text
        directionsPanel.innerHTML += "<h2>container " + markers[iContainer].title + "</h2>";

        // write directions to div
        for (var i = 0; i < route.steps.length; i++) {
            var inst = route.steps[i].instructions;
            inst = inst.replace("Destination will be", "Container will be");
            directionsPanel.innerHTML += "<p>" + iInstruction + ". " + inst + "</p>";
            iInstruction++;
        }
    }

    // directionsPanel.innerHTML += "<h2>" + totalDistance.toFixed(1) + " km </h2>"    
    iContainer++;

    // it's the last one
    if (iContainer >= markers.length-1) {
        directionsPanel.innerHTML += "<h1>" + totalDistance.toFixed(1) + " km </h1>"    
    }
}

function findContainerId(marker) {
    for (i = 0; i < markers.length; i++) {
        if  (markers[i].position = marker.position)
            return markers[i].title;
    }
}

