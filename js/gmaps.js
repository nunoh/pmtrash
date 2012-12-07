// TODO
var centerPoint = [ 55.862743, 9.836143 ];

var map;
var directionsService;
var infoWindow;

var markers = [];
var displays = [];

var totalDistance = 0;
var totalTime = 0;
var iContainer = 0;
var iStep = 0;

var MAP_OPTIONS = {
    zoom: 12,
    // streetViewControl: false,
    // mapTypeControl: false,
    // scaleControl: false,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: new google.maps.LatLng(centerPoint[0], centerPoint[1])
};

var spanDistance;
var spanTime;
var directionsPanel;

var ICON_NUMBER = "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=!|ADDE63|000000"; // the '!' should be changed by the number of the container
var ICON_HOME = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|ADDE63";
var ICON_LAST = "https://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=flag|ADDE63";    

var DEFAULT_DIRECTIONS_TEXT = "<p>No route currently selected. Press the <strong>'Get Route'</strong> button.</p>";
var DEFAULT_TIME_TEXT = "N/A";
var DEFAULT_DISTANCE_TEXT = "N/A";

function initialize() {

    // initializing the service for the directions request
    directionsService = new google.maps.DirectionsService();

    // creating a map
    map = new google.maps.Map(document.getElementById('map_canvas'), MAP_OPTIONS);

    // creating a info window instance
    infoWindow = new google.maps.InfoWindow();

    // load span references
    spanDistance = document.getElementById("distance");
    spanTime = document.getElementById("time");
    directionsPanel = document.getElementById("directions_panel");

    $("#dialog").dialog({ 
        autoOpen: false,
        height: 90,
        modal: true,
        closeOnEscape: false,
        resizable: false,
        draggable: false,
    });    
}

function drawRoute(start, end) {
    
    // request the directions between start and end points
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING    
    }, 

    function(result, status) {

        // if evertything ok, just render the result
        if (status == google.maps.DirectionsStatus.OK)
            renderDirections(result);
        
        // if error because of query limit, wait 200ms and try again
        else if (status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
            setTimeout(function() { drawRoute(start, end); }, 200);
        }

        // other error, show alert message
        else {
            alert("unknown error querying Google Maps API");
        }
    });
}

// convert seconds to hours and minutes string
function convertTime(seconds) {

    var minutes = Math.round(seconds/60);
    var hours = Math.floor(minutes/60);
    minutes = minutes - hours*60;
    
    // add leading zero
    var sHours = hours;
    if (hours < 10) sHours = "0" + hours;

    // add leading zero
    var sMinutes = minutes;
    if (minutes < 10) sMinutes = "0" + minutes;

    var str = sHours + "h" + sMinutes + "m";
    
    return str;
}

function convertDistance(meters) {
    return meters.toFixed(1) + " km";
}

function renderDirections(result) {

    var directionsDisplay = new google.maps.DirectionsRenderer({ 
        suppressMarkers: true, // make sure not to show the default google maps markers
        map: map,
        preserveViewport: true,
        directions: result        
    });    

    // store on the displays array the current route    
    displays.push(directionsDisplay);
    
    // show the steps on the directions div panel
    showSteps(result);
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
    totalTime = 0;
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

        centerMap();

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
    clean();
    loadMarkers("php/get_all.php", true);
}

function showEmpty() {    
    clean();
    loadMarkers("php/get_empty.php", true);
}

function showFull() {
    clean();
    loadMarkers("php/pathfinder.php", true);
}

function showRoute() {

    clearMap();
    
    spanDistance.innerHTML = "Calculating...";
    spanTime.innerHTML = "Calculating...";
    directionsPanel.innerHTML = "";
    
    // show the loading dialog
    $("#dialog").dialog("open");

    loadMarkers("php/pathfinder.php", false);
}

function clean() {
    clearMap();    
    directionsPanel.innerHTML = DEFAULT_DIRECTIONS_TEXT;
    spanDistance.innerHTML = DEFAULT_DISTANCE_TEXT;
    spanTime.innerHTML = DEFAULT_TIME_TEXT;
}

function centerMap() {
    var bounds = new google.maps.LatLngBounds();
    for (i = 0; i < markers.length; i++)
        bounds.extend(markers[i].position);
    map.fitBounds(bounds);
}

function showSteps(directionResult) {
    
    directionsPanel = document.getElementById("directions_panel");
    
    for (var l = 0; l < directionResult.routes[0].legs.length; l++) {
        
        // current route    
        var route = directionResult.routes[0].legs[l];
        
        // get distance in kms
        var dist = route.distance.value / 1000.0;
        var time = route.duration.value; // in seconds
        
        // update total distance so far
        totalDistance += dist;
        totalTime += time;
        
        // write current container text
        var from = "C" + markers[iContainer].title;
        if (iContainer == 0) from = 'Base';
        
        // write next container text
        var to;
        if ( (iContainer+1) == markers.length) to = 'Base';
        else to = "C" + markers[iContainer+1].title;

        directionsPanel.innerHTML += "<h3>" + from + " to " + to + "</h3>";   

        // write directions to div
        directionsPanel.innerHTML += "<p>";
        for (var i = 0; i < route.steps.length; i++) {

            // get current step
            var step = route.steps[i].instructions;

            // make sure to replace the "destination will be on your left" step with "the container will be"            
            step = step.replace("Destination will be", "Container will be");
            
            // but if we are at the last container, make sure to replace "destination will be" with "base will be"
            if (iContainer+1 == markers.length)
                step = step.replace("Container will be", "Base will be");
            
            // update the directions panel
            directionsPanel.innerHTML += "<p>" + (iStep+1) + ". " + step + "</p>";

            // scroll the overflow to the bottom            
            // directionsPanel.scrollTop = directionsPanel.scrollHeight;
            
            iStep++;
        }
        directionsPanel.innerHTML += "</p>";

        spanTime.innerHTML = convertTime(totalTime);
        spanDistance.innerHTML = convertDistance(totalDistance);

        var percentage = Math.round( (iContainer+1) / markers.length * 100 );

        $(".progress span strong").text(percentage + "%");
        $(".progress").progressbar({value: percentage}).children("span").appendTo($(".progress"));
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

    // centerMap();

    // if it's the last one, then show the total distance
    if (iContainer >= markers.length) {

        // update the distance and time
        spanDistance.innerHTML = convertDistance(totalDistance);
        spanTime.innerHTML = convertTime(totalTime);

        $("#dialog").dialog("close");
    }
}