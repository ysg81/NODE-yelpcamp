mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  center: a_campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8 // starting zoom
  });

new mapboxgl.Marker()
  .setLngLat(a_campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset: 25})
      .setHTML(
        `<h3>${a_campground.title}</h3><p>${a_campground.location}</p>`
      )
  )
  .addTo(map)
