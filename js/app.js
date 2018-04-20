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
            self.category = data.response.venues[0].categories[0].name || '';
            self.address = data.response.venues[0].location.address || '' ;
            self.phone = data.response.venues[0].contact.formattedPhone || '';
            self.url = data.response.venues[0].url || ''; 
        }
      }).fail(function() {
		alert("Foursquare data could not be loaded. Please, try reloading the page.");
	});;



    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.lat, this.lng),
        map: map,
        title: this.name
    });

    


    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    this.marker.setMap(map);

    this.marker.addListener('click', function(){
		self.contentString = `<div class="info-window-content">
                                <b>` + self.name + `</b><br />
                                ` + self.category + `<br />
                                ` + self.address + `<br />
                                ` + self.phone + `<br />
                                ` + self.url + `
                            </div>`;
        self.infoWindow.setContent(self.contentString);
        self.infoWindow.open(map, this);
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ self.marker.setAnimation(null); }, 750);});
    
    this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

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

    // Menu Filter
    this.query = ko.observable("")

    this.filteredList = ko.computed( function() {
		var filter = self.query().toLowerCase();
		if (!filter) {
            self.locationList().forEach(function(locationItem){
				locationItem.marker.setVisible(true);
			});
			return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(locationItem) {
                // locationItem.marker.setVisible(true);
                // return locationItem['name'].toLowerCase().indexOf(filter) !== -1;
                var string = locationItem['name'].toLowerCase();
				var result = (string.indexOf(filter) !== -1);
				locationItem.marker.setVisible(result);
				return result;
			});
		}
	}, self);

}

function initApp(){
    ko.applyBindings(new AppViewModel());
}

function googleError(){
    alert("Google Map could not be loaded. Please, try reloading the page.");
  }