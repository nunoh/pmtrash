<!DOCTYPE html>
<html>
  <head>

    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    
    <!-- CSS Styling -->
    <style type="text/css">
      html { height: 100% }
      body { height: 100%; margin: 0; padding: 0 }
      #map_canvas { height: 100% }
    </style>
    
    <!-- call to google maps api with key -->
    <script type="text/javascript"
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA0bHlB5amUrz5EAEPLFoizXlMoB6N00tM&sensor=false">
    </script>

    <script type="text/javascript">
      
      // function initialize() {

      //   var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
        
      //   var mapOptions = {
      //     zoom: 4,
      //     center: myLatlng,
      //     mapTypeId: google.maps.MapTypeId.ROADMAP,
      //   }
        
      //   var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

      //   var marker = new google.maps.Marker({
      //       position: myLatlng,
      //       title:"Hello World!"
      //   });

      //   var marker2 = new google.maps.Marker({
      //     position: new google.maps.LatLng(-25.363882,132.044922),
      //     title:"Hello World!"
      //   });

      //   marker.setMap(map);
      //   marker2.setMap(map);
        
      // }

      var directionsDisplay;
      var directionsService = new google.maps.DirectionsService();
      var map;

      function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var chicago = new google.maps.LatLng(41.850033, -87.6500523);
        var mapOptions = {
          zoom: 6,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: chicago
        }
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        directionsDisplay.setMap(map);
      }

      function calcRoute() {
        
        var start = new google.maps.LatLng(-25.363882,131.044922);
        var end = new google.maps.LatLng(-25.363882,132.044922);
        
        var waypts = [ 
          { location: new google.maps.LatLng(-24.363882,131.044922), stopover: true },
          { location: new google.maps.LatLng(-23.363882,131.044922), stopover: true }
        ];

        var request = {
          origin: start,
          destination: end,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          var route = response.routes[0];
          alert(route);
          var summaryPanel = document.getElementById("directions_panel");
          summaryPanel.innerHTML = "";
          
          // for each route, display summary information.
          for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i+1;
            summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
            summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
            summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
          }
    }
  });
}


    </script>
  </head>
  
  <body>

    <!--<form action="index.php" method="post">-->
      <input type="button" name="submit" value="Get Route" onclick="initialize()"/>
    <!--</form>-->

    <!-- div with google maps canvas -->
    <div id="map_canvas" style="width:500px; height:300px"></div>
    <div id="directions_panel" style="float:right;width:30%;height 100%">
      asdasda
    </div>
    
  </body>

</html>