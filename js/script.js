var ViewModel = function() {
  var self = this;
  self.side = ko.observable(false);
  self.toggSlide = function() {
    self.side(!self.side());
  };
  // Build the Google Map object
  self.googleMap = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 26.2182871,
      lng: 78.18283079999999
    },
    zoom: 16
  });

  self.Infowindow = new google.maps.InfoWindow();
  // Build "Place" objects out of raw place data
  self.allPlaces = [];
  locationData.forEach(function(place) {
    self.allPlaces.push(new Place(place));
  });

  var bounds = new google.maps.LatLngBounds();
  // Build Markers via the Maps API and place them on the map.
  self.allPlaces.forEach(function(place) {

    var markerOptions = {
      title: place.locationName,
      map: self.googleMap,
      position: place.latLng,
      animation: google.maps.Animation.DROP,
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };
    place.marker = new google.maps.Marker(markerOptions);
    place.marker.addListener('mouseover', function() {
      this.setIcon('http://maps.google.com/mapfiles/ms/icons/yellow-dot.png');
    });
    place.marker.addListener('mouseout', function() {
      this.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
    });
    // Add listeners onto the marker
    google.maps.event.addListener(place.marker, 'click', function() {
      self.fillInfoWindow(place);
    });

    // Extend the boundaries of the map for each marker
    bounds.extend(place.marker.position);

  });
  self.googleMap.fitBounds(bounds);
  google.maps.event.addDomListener(window, 'resize', function() {
    self.googleMap.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
  });

  // Create array containing only places that should be visible
  self.visiblePlaces = ko.observableArray();

  // All places should be visible at first
  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });

  // Input observavble being aware of any change in search field
  self.userInput = ko.observable('');

  // This filter function is called whenever user types in search field
  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();
    self.visiblePlaces.removeAll();

    // Function to hide all and show only those places in the list and map whose
    // name have characters matching the search input characters
    self.allPlaces.forEach(function(place) {
      place.marker.setVisible(false);
      if (place.locationName.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });


    self.visiblePlaces().forEach(function(place) {
      place.marker.setVisible(true);
    });

  };

  // Foursquare Token and client secret
  self.FSTOKEN = '2N3SA20IBTOBHUSSS0WGZDUVII4Q2432CASD3ILJWPGZEEXT';
  self.CS = '3BTSQWAVCVPJOOHCF5WSPCCORWKV4Z2UJQT0AYC34XICZNDQ';
  self.fillInfoWindow = function(place) {

    // Check to make sure the infowindow is not already opened on this marker
    if (self.Infowindow.marker != place.marker) {
      self.Infowindow.marker = place.marker;
      self.Infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function() {
        place.marker.setAnimation(null);
      }, 1450);
      var foursqURL = 'https://api.foursquare.com/v2/venues/' + place.id + '/photos?v=20170823&group=venue&client_id=' + self.FSTOKEN + '&client_secret=' + self.CS;

      // Condition to send ajax request only if image URL is not stored
      if (place.imgURL === null) {
        $.getJSON(foursqURL).done(function(data) {
          var pref = data.response.photos.items[0].prefix;
          var suff = data.response.photos.items[0].suffix;
          var size = 'width300';

          place.imgURL = pref + size + suff;
          self.Infowindow.setContent(self.Infowindow.getContent() + '<img src="' + place.imgURL + '" alt="Image could not be loaded."/>');
          self.Infowindow.open(self.googleMap, place.marker);
        }).fail(function() {
          alert("There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.");
        });
      }
      self.Infowindow.setContent('<div class="loc-title"><b>' + place.marker.title + '</b></div>' + '<div>' +
        place.marker.position + '</div><div class="address">' + place.address + '</div>');
      if (place.imgURL !== null) {
        self.Infowindow.setContent(self.Infowindow.getContent() + '<img src="' + place.imgURL + '" alt="Image could not be loaded."/>');
      }
      self.Infowindow.open(self.googleMap, place.marker);

      // Clearing marker property if the infowindow is closed
      self.Infowindow.addListener('closeclick', function() {
        self.Infowindow.marker = null;
      });
    }
  };
};

var Place = function(dataObj) {
  this.id = dataObj.id;
  this.locationName = dataObj.locationName;
  this.latLng = dataObj.latLng;
  this.marker = null;
  this.address = dataObj.address;
  this.imgURL = null;
};

window.startApp = function() {
  ko.applyBindings(new ViewModel());
};

function googleErr() {
  alert("Google Maps API failed to load. Please try to refresh the page...");
}
