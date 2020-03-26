console.log("map");
var API_KEY = "pk.eyJ1IjoiYXJ1YmlvMDE3IiwiYSI6ImNrNjhqdmppajA1dHQzamxqNGpqbmFiNDgifQ.WSoPQzeZaCjvSuEaFWkCeQ";

// Light/Satellite/Dark/Street/Outdoor map first

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 10,
  minZoom:2,
  id: "mapbox.satellite",
  accessToken: API_KEY //from citibike classwork
});

// baseMap to hold my light map layer
var basemap = L.map("map", {
  center: [39.5, -98.35], 
  zoom: 4, // to include Alaska and Hawaii 
  });

satellitemap.addTo(basemap);

// Perform an API call to the earthquake site like CitiBike example in class
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(response) {
  function styleInfo(feature) {
    return {
      opacity:1,
      fillOpacity: .8,
      fillColor: Qcolor(feature.properties.mag), //in geojson file "features" --> properties, and "mag"
      color: "#990000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 1
    };
  }

// color of the cirlces. dont understand switch, so, not doing it.
  function Qcolor(magnitude) {
    if (magnitude >= 5) {
      return "#990000";}  
    else if (magnitude >= 4 && magnitude <5) {
      return "#D60000";}  
    else if (magnitude >= 3 && magnitude <4) {
      return "#FF4848";}  
    else if (magnitude >= 2 && magnitude <3){
      return "#FFB0B0";}  
    else if (magnitude >= 1 && magnitude <2){
        return "#FFCACA"; }  
    else if (magnitude < 1){
        return "#FFE4E4";}  
  }

  function getRadius(mag) {
    if (mag <= 0) {
      return 1;
    }
    return mag*3
  }

  L.geoJson(response, {
    pointToLayer: function(_feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    style: styleInfo,
    // popup
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(basemap);

  // I am Legend 1
  var legend = L.control({
    position: "topright"
  });

  // I am Legend 2
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#FFE4E4",
      "#FFCACA",
      "#FFB0B0",
      "#FF4848",
      "#D60000",
      "#990000"
    ];

    //loops
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(basemap);
});

