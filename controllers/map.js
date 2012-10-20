var NaviBridge = require("ti.navibridge/ti.navibridge");

// Geolocation settings
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 100;
Ti.Geolocation.purpose = "Geo-Location";

// Add an event listener for geolocation updates
Ti.Geolocation.addEventListener("location", function(_data) {
	// Save the location of the user
	//$.location = _data.coords;
	
	// Re-center the map based on the user location
	$.timap.setLocation({
		latitude: _data.coords.latitude,
		longitude: _data.coords.longitude,
		animate: true
	});
});