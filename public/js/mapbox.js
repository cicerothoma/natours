const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2ljZXJvdGhvbWEiLCJhIjoiY2tmMzZsbTEwMDA5MjJybGZwaWM2YnRkeiJ9.Ph2iTxWF2xwIQTIYOc0Yuw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/cicerothoma/ckf3c2jz10jge19mwfigotd7a',
});
