var locations = [
    { 
        'name': 'The Restaurant',
        'lat':  20.913377,
        'lng': -100.742783,
    },
    {
        'name': 'Los Milagros',
        'lat': 20.915380,
        'lng':  -100.743010,
    },
    {
        'name': 'La Azotea',
        'lat':20.914314, 
        'lng': -100.744346,
    },
    {
        'name': 'La Sirena Gorda',
        'lat': 20.914183, 
        'lng': -100.745357,
    },
    {
        'name': 'La Posadita',
        'lat': 20.913242, 
        'lng': -100.744181,
    },
];

var map;

var Location = function(data){
    var self = this;

    // Info I already have
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);

    // Info I'll get from Yelp
    this.url = "";
    this.address = "";
    this.phone = "";
    this.review = "";

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        title: data.name
    });

    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    this.marker.setMap(map);


    this.marker.addListener('click', function(){
		self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>";
        self.infoWindow.setContent(self.contentString);
		self.infoWindow.open(map, this);
	});

}

function AppViewModel(){
    var self = this;

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 20.91528, lng: -100.74389},
        zoom: 17
    });

    this.locationList = ko.observableArray([]);

    locations.forEach(function(locationItem){
        self.locationList.push(new Location(locationItem));
    });
}

function initApp(){
    ko.applyBindings(new AppViewModel());
}
