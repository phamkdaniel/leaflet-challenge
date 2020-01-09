// var centerCoords = [37.0902, -95.7129];
var centerCoords = [33.7465, -39.4629];

// map object
var eqMap = L.map("map", {
    center: centerCoords,
    zoom: 2
});

// add tileLayer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(eqMap);

// function to select color based on earthquake magnitude
function chooseColor(mag) {
    // if (mag < 1){
    //     return "#b6ff00";
    // } else if (mag < 2) {
    //     return "#ffe900";
    // } else if (mag < 3) {
    //     return "#ff7600";
    // } else if (mag < 4) {
    //     return "#ff5100";
    // } else if (mag < 5) {
    //     return "#ff2c00";
    // } else {
    //     return "#ff0800";
    // };
    return mag > 5 ? "#ff0800" :
           mag > 4 ? "#ff2c00" :
           mag > 3 ? "#ff5100" :
           mag > 2 ? "#ff7600" :
           mag > 1 ? "#ffe900" :
                     "#b6ff00"
};

// Load in geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(geoData, function(data) {
    // console.log(data);
    console.log(data.features[0].properties);

    L.geoJson(data, {
        // covert points to circles
        pointToLayer: function (feature, latlng) {

            // circle properties
            var eqMarker = {
                radius: feature.properties.mag *5,
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.75
            };
            
            return L.circleMarker(latlng, eqMarker);
        },

        // add earthquake info on click
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<strong>Magnitude: </strong>${feature.properties.mag} <br><strong>Location: </strong>${feature.properties.place}`)
        }
    }).addTo(eqMap);

    // add legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function (eqMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            categories = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < categories.length; i++) {
            labels.push(
                '<i style="background:' + chooseColor(categories[i] + 1) + '"></i> ' +
                categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+'));
        };
        div.innerHTML += "<strong>Earthquake Magnitudes</strong><br>" + labels.join("")

        return div;
    };
    legend.addTo(eqMap);

});
