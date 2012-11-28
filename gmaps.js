var map;
var directionsService;
var infoWindow;

var markers = [];
var displays = [];

var totalDistance = 0;
var iContainer = 0;
var iStep = 0;

var ICON_NUMBER = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=!|ADDE63|000000"; // the '!' should be changed by the number of the container
var ICON_HOME = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|ADDE63";
var ICON_LAST = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63";

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
            alert("unknown error querying Google Maps API");
        }
    });
}

function renderDirections(result) {

    var directionsDisplay = new google.maps.DirectionsRenderer({ 
        suppressMarkers: true, // make sure not to show the default google maps markers
        map: map,
        directions: result
    });    

    // store on the displays array the current route    
    displays.push(directionsDisplay);
    
    // show the steps on the directions div panel
    showSteps(result);
}

function initialize() {

    // initializing the service for the directions request
    directionsService = new google.maps.DirectionsService();

    // map options
    var mapOptions = {
        zoom: 12,
        streetViewControl: false,
        // scaleControl: true,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
    }

    // creating a map
    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    // creating a info window instance
    infoWindow = new google.maps.InfoWindow();
}

function clearMap() {

    // remove container markers from map
    for (i = 0; i < markers.length; i++) 
        markers[i].setMap(null);

    // reinitalize the markers arrays
    markers = [];

    // clear route
    for (i = 0; i < displays.length; i++)
        displays[i].setDirections({routes: []});

    // reset global variables
    totalDistance = 0;
    iContainer = 0;
    iStep = 0;
}

function loadMarkers(url, show) {

    // make sure that map isn't populated with any data from a previous request
    clearMap();

    // get containers information from a JSON array from a URL webpage
    $.get(url, function(data) {
        
        var json = jQuery.parseJSON(data);
        
        for (var i = 0; i < json.length; i++) {
            
            // parsing json fields
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

    // since this is an asynchronous function, once it's complete run this method
    .complete(function() {

        // if it's a show option (either full or all) make sure to show the markers
        if (show) {
            showMarkers();
        }

        // otherwise, it's because it's a route, so draw it
        else {

            // make a request for each pair of containers
            for (i = 0; i < markers.length-1; i++) {
                var m1 = markers[i];
                var m2 = markers[i+1];
                drawRoute(m1.position, m2.position);
            }

            // add route for coming back to base
            var m1 = markers[markers.length-1];
            var m2 = markers[0];
            drawRoute(m1.position, m2.position);
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
    document.getElementById("directions_panel").innerHTML == "";
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
        var from = "C" + markers[iContainer].title;
        if (iContainer == 0) from = 'Base';
        
        // write next container text
        var to = "C" + markers[iContainer+1].title;
        if (iContainer+1 == markers.length-1) to = 'Base';

        directionsPanel.innerHTML += "<h3>" + from + " to " + to + "</h3>";

        // write directions to div
        for (var i = 0; i < route.steps.length; i++) {

            // get current step
            var step = route.steps[i].instructions;

            // make sure to replace the "destination will be on your left" step with "the container will be"            
            step = step.replace("Destination will be", "Container will be");
            
            // update the directions panel
            directionsPanel.innerHTML += "<p>" + (iStep+1) + ". " + step + "</p>";
            
            iStep++;
        }
    }    

    // get icon string for container
    var icon = ICON_NUMBER.replace("!", iContainer);

    // if is the first containers use the home icon
    if (iContainer == 0)
        icon = ICON_HOME;
    
    // if it is the last container, not counting with coming back to base
    else if (iContainer == markers.length-2)
        icon = ICON_LAST;
    
    // show icon on map
    markers[iContainer].setIcon(icon);
    markers[iContainer].setMap(map);

    iContainer++;

    // if it's the last one, then show the total distance
    if (iContainer >= markers.length-1) {
        directionsPanel.innerHTML += "<h1>" + totalDistance.toFixed(1) + " km </h1>"    
    }
}