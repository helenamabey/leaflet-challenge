function createMap(EarthquakeLayer) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var baseMaps = {
        "Street Map": streetmap
      };
    
      // Create an overlayMaps object to hold the bikeStations layer.
      var overlayMaps = {
        "Earthquakes": EarthquakeLayer
      };
    
      // Create the map object with options.
      var map = L.map("map", {
        center: [40, -103.771556],
        zoom: 5,
        layers: [streetmap, EarthquakeLayer]
      });

      var legend = L.control({ position: "bottomright" });
        legend.onAdd = function(map) {
        var div = L.DomUtil.create("div", "legend");
        var limits = [-10, 10, 30, 50, 70, 90];
        var labels = []

  for (var i = 0; i < limits.length; i++) {
    div.innerHTML +=
        '<i style="background-color:' + chooseColor(limits[i+1]) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
        limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
}

return div;
};

legend.addTo(map);
    
}

function createMarkers(response) {

    // Pull the locations and magnitude from the USGS response
    var locations = response.features;
    //var magnitudes = response.features.properties;
  
    // Initialize an array to hold markers.
    var EQMarkers = [];
  
    // Loop through the locations array.
    for (var index = 0; index < locations.length; index++) {
      var location = locations[index];
      //var magnitude = magnitudes[index];
  
      // For each location, create a marker, and bind a popup with the death and magnitude.
      var EQMarker = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]], {
        color: "black",
        opacity: 0.5,
        fillColor: chooseColor(location.geometry.coordinates[2]),
        fillOpacity: 1,
        weight: 1,
        radius: location.properties.mag*10000
      })
        .bindPopup("<h3>Location: " + location.geometry.coordinates[1] + ", " + location.geometry.coordinates[0] + "<h3>Depth: " + location.geometry.coordinates[2] + "<h3>Magnitude: " + location.properties.mag + "</h3>");
  
      // Add the marker to the array.
      EQMarkers.push(EQMarker);
    }
  
    // Create a layer group that's made from the array, and pass it to the createMap function.
    createMap(L.layerGroup(EQMarkers));
}

function chooseColor(magnitude) {
    if (magnitude <= 10) return '#A3F600';
    else if (magnitude <= 30) return '#DCF400';
    else if (magnitude <= 50) return '#F7D811';
    else if (magnitude <= 70) return '#FDB72A';
    else if (magnitude <= 90) return '#FCA35C';
    else return '#FF5F65';
}
 



// Perform an API call to the USGS API to get the earthquake information. Call createMarkers when it completes.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);
