var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 20.91528, lng: -100.74389},
    zoom: 17
  });

    for (var item in restaurants) {
        restaurant = restaurants[item];
        marker  = new google.maps.Marker({ 
            position: { lat: parseFloat(restaurant['lat']), lng: parseFloat(restaurant['lng']) },
            map: map,
            title: restaurant['name'],  
        });
    }
}