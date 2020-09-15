const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2ljZXJvdGhvbWEiLCJhIjoiY2tmMzZsbTEwMDA5MjJybGZwaWM2YnRkeiJ9.Ph2iTxWF2xwIQTIYOc0Yuw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  scrollZoom: false,
  //   center: [-118.113491, 34.111745],
  //   zoom: 10,
  //   interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

// Loops through the location array and adds a marker for each location
locations.forEach((loc) => {
  // 1) Creates the marker html element
  const el = document.createElement('div');
  // 2) Adds the class "marker" for CSS styling
  el.className = 'marker';
  // 3) Adds the marker element we created and style to mapbox
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // 4) Adds pop-up to describe our marker
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // 5) Extends the bounds of map to include current location
  bounds.extend(loc.coordinates);
});

// Ensures our map fit every marked location
map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
