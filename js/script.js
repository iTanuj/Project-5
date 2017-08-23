var side=0;

$('#ham').click(function(){
	if(side){
		side=0;
    $('#map').css('left','0px');
		$('.headiv').css('left','0px');
	}
	else{
		side=1;
    $('#map').css('left','270px');
		$('.headiv').css('left','270px');
	}

	//$('.headiv').toggleClass('right');
	$('.sidemenu').toggleClass('left');
});

/*$('#search-box').keyup(function(){
   var valThis = $(this).val().toLowerCase();
    if(valThis == ""){
        $('.places > li').show();
    } else {
        $('.places > li').each(function(){
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
        });
   }
});*/

var locationData = [
  {
    locationName: 'Barista Cafe',// good
    latLng: {lat: 26.1860244,lng: 78.2048169},
		address: "Neo Meridian Mall, Gwalior, Madhya Pradesh, India",
		id: "56c872ce498e18ceae575ecc"
  },

  {
    locationName: 'Gwalior Zoo',//bad pic
    latLng: {lat: 26.2103311, lng: 78.169084},
		address: "Italian Garden Rd, Lashkar, Gwalior, Madhya Pradesh, India",
		id: "51d93197498e03f38353b9e0"
  },

  {
    locationName: 'Jaivilas Palace',//good
    latLng: {lat: 26.200663, lng: 78.1667488},
		address: "Lashkar, Gwalior, Madhya Pradesh, India",
		id: "506ab860e4b012a83da5def9"
  },

	{
    locationName: 'Sun Temple',//good
    latLng: {lat: 26.2364084, lng: 78.2123883},
		address: "Morar, Gwalior, Madhya Pradesh, India",
		id: "4f923bf1e4b01eb7515f8ddd"
  },

	{
		locationName: 'Dindayal City Mall',//good
		latLng: {lat: 26.2093589, lng: 78.1641293},
		address: "Shinde Ki Chhawani, Gwalior, Madhya Pradesh, India",
		id: "4f34cf64e4b0debe1e717d99"
	},

	/*{
		locationName: 'Jodhpur Misthan Bhandar',//good
		latLng: {lat: 26.1939717, lng: 78.1619713},
		address: "Lalitpur Colony, Lashkar, Gwalior, Madhya Pradesh, India"
	},*/

	{
		locationName: 'Gurudwara Shri Data Bandi Chhor',//good
		latLng: {lat: 26.2204196,lng: 78.1646832},
		address: "Gwalior Fort, Gwalior, Madhya Pradesh, India",
		id: "4f7d9182e4b024f467d2c6f1"
	},

	{
		locationName: 'Sahastra Bahu Ka Mandir',//good
		latLng: {lat: 26.2284753, lng: 78.165914},
		address: "Fort Campus, Near Post Office, Gwalior Fort, Gwalior, Madhya Pradesh, India",
		id: "56e03057cd10691b23f64058"
	}
];
var ViewModel = function() {
  var self = this;


  // Build the Google Map object. Store a reference to it.
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
		center: {lat:26.2182871,lng:78.18283079999999},
		zoom: 16
  });

	self.Infowindow = new google.maps.InfoWindow();
  // Build "Place" objects out of raw place data. It is common to receive place
  // data from an API like FourSquare. Place objects are defined by a custom
  // constructor function you write, which takes what you need from the original
  // data and also lets you add on anything else you need for your app, not
  // limited by the original data.
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });

	var bounds = new google.maps.LatLngBounds();
  // Build Markers via the Maps API and place them on the map.
  self.allPlaces.forEach(function(place) {

		var markerOptions = {
			title: place.locationName(),
			map: self.googleMap,
			position: place.latLng(),
			animation: google.maps.Animation.DROP,
			icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
		};
		place.marker(new google.maps.Marker(markerOptions));
		place.marker().addListener('mouseover', function() {
			this.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
		});
		place.marker().addListener('mouseout', function() {
			this.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
		});
    // You might also add listeners onto the marker, such as "click" listeners.
		//place.marker().addListener('click', function()
		google.maps.event.addListener(place.marker(), 'click', function(){
			self.fillInfoWindow(place);
		});


		// Extend the boundaries of the map for each marker
		bounds.extend(place.marker().position);

  });
	self.googleMap.fitBounds(bounds);
  // This array will contain what its name implies: only the markers that should
  // be visible based on user input. My solution does not need to use an
  // observableArray for this purpose, but other solutions may require that.
  self.visiblePlaces = ko.observableArray();


  // All places should be visible at first. We only want to remove them if the
  // user enters some input which would filter some of them out.
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });


  // This, along with the data-bind on the <input> element, lets KO keep
  // constant awareness of what the user has entered. It stores the user's
  // input at all times.
  self.userInput = ko.observable('');


  // The filter will look at the names of the places the Markers are standing
  // for, and look at the user input in the search box. If the user input string
  // can be found in the place name, then the place is allowed to remain
  // visible. All other markers are removed.
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visiblePlaces.removeAll();

    // This looks at the name of each places and then determines if the user
    // input can be found within the place name.
    self.allPlaces.forEach(function(place) {
      place.marker().setVisible(false);

      if (place.locationName().toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });


    self.visiblePlaces().forEach(function(place) {
      place.marker().setVisible(true);
    });

  };
	self.FSTOKEN = '2N3SA20IBTOBHUSSS0WGZDUVII4Q2432CASD3ILJWPGZEEXT';
	self.CS = '3BTSQWAVCVPJOOHCF5WSPCCORWKV4Z2UJQT0AYC34XICZNDQ';
	self.fillInfoWindow = function(place) {
		// Check to make sure the infowindow is not already opened on this marker.
		if (self.Infowindow.marker != place.marker()) {
			self.Infowindow.marker = place.marker();
			self.Infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
        self.Infowindow.marker.setAnimation(null);
    	}, 1500);
			var foursqURL = 'https://api.foursquare.com/v2/venues/'+place.id()+'/photos?v=20170823&group=venue&client_id='+self.FSTOKEN+'&client_secret='+self.CS;
			//var foursqURL = 'https://api.foursquare.com/v2/venues/'+place.id+'/photos?oauth_token=UFY0DJ3O52LPFAJ3NQXHLIEEVY0L5JHIQ33MYB3MKTE1KLIU&v=20170823&group=venue';
			if(place.imgURL() == undefined){
			console.log("before json");
				$.getJSON(foursqURL).done(function(data) {
					console.log("yoooooo")
					var pref = data.response.photos.items[0].prefix;
					var suff = data.response.photos.items[0].suffix;
					var size = 'width300';

					place.imgURL(pref+size+suff);
					self.Infowindow.setContent(self.Infowindow.getContent()+'<img src="'+place.imgURL()+'" alt="Image could not be loaded."/>');

				}).fail(function() {
					alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
				});
			}
			self.Infowindow.setContent('<div class="loc-title"><b>' + place.marker().title + '</b></div>'+'<div>' + place.marker().position + '</div>'
																+ '<div class="address">'+ place.address() +'</div>');
			if(place.imgURL()!=undefined){
				self.Infowindow.setContent(self.Infowindow.getContent()+'<img src="'+place.imgURL()+'" alt="Image could not be loaded."/>');
			}
			self.Infowindow.open(self.googleMap, place.marker());
			// Make sure the marker property is cleared if the infowindow is closed.
			self.Infowindow.addListener('closeclick', function() {
				self.Infowindow.marker = null;
			});
		}
	}


};

var Place = function(dataObj) {
	this.id = ko.observable(dataObj.id);
	this.locationName = ko.observable(dataObj.locationName);
	this.latLng = ko.observable(dataObj.latLng);

	// You will save a reference to the Places' map marker after you build the
	// marker:
	this.marker = ko.observable();
	this.address = ko.observable(dataObj.address);
	this.imgURL = ko.observable();
}

function startApp(){
	ko.applyBindings(new ViewModel());
}
function googleErr(){
	alert("Google Maps API failed to load. Please try to refresh the page...");
}
