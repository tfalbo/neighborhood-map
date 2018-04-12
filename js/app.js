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
var client_id = "G34I3SSZUGBT3DENL1WWLIGAVEFCFZIC5REQO5ILS0EBCQ1V";
var client_secret = "B3EKDYWCTTMIJRC0PSQN2IJYT5Y0VUT1OUWCLCTPRBTYWA3W";

var Location = function(data){
    var self = this;

    // Info I already have
    this.name = data.name;
    this.lat = data.lat;
    this.lng = data.lng;

    // Info I'll get from Foursquare
    this.category = "";
    this.address = "";
    this.phone = "";
    this.url = "";

    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?' +
                        'll='+ this.lat + ',' + this.lng + 
                        '&client_id=' + client_id + 
                        '&client_secret=' + client_secret + 
                        '&v=20180411' + 
                        '&query=' + this.name +
                        '&limit=1';

    $.ajax({
        type: "GET",
        url: foursquareURL,
        data: data,
        success: function(data){
           this.category = data.response.venues[0].categories[0].name;
           this.address = data.response.venues[0].location.address;
           this.phone = data.response.venues[0].contact.formattedPhone;
           this.url = data.response.venues[0].url;
        }
      });

    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        map: map,
        title: this.name
    });

    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    this.marker.setMap(map);

    console.log(this.address);
    var contentString = `<div class="info-window-content">
                            <b>` + this.name + `</b>
                            ` + this.category + `
                            ` + this.address + `
                            ` + this.phone + `
                            ` + this.url + `
                        </div>`;
    this.marker.addListener('click', function(){
		self.contentString = contentString;
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
