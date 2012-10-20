var NaviBridge = require("ti.navibridge/ti.navibridge");
var API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
//var API_URL = http://www.google.com/ig/api?movies=poznan&theater=rialto&start=2&date=3&time=1
var HANDLERS = ['success', 'error'];
var MAX_CINEMAS = 10;

var AppModel = require('alloy/backbone').Model.extend({
	loading : false
});
var model = new AppModel;
var handlers = {};

// react to changes in the model state
model.on('change:loading', function(m) {
	if (m.get('loading')) {
		$.loading.setOpacity(1.0);
	} else {
		$.loading.setOpacity(0);
	}
});

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function processCinemaData(data) {
	var cinemas = [];

	// make sure the returned data is valid
	try {
		var items = JSON.parse(data).items;
	} catch (e) {
		alert('Invalid response from server. Try again.');
		return;
	}

	// process each cinema, turning it into a table row
	for (var i = 0; i < Math.min(items.length, MAX_CINEMAS); i++) {
		var info = items[i].volumeInfo;
		if (!info) {
			continue;
		}
		var links = info.imageLinks || {};
		var authors = (info.authors || []).join(', ');
		cinemas.push({
			title : info.title || '',
			authors : authors,
			image : links.smallThumbnail || links.thumbnail || 'none'
		});
	}

	// fire success handler with list of cinemas
	successHandler(cinemas);
}

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function searchForCinemas(e) {
	// validate search data
	var value = encodeURIComponent("movies");
	if (!value) {
		alert('You need to enter search text');
		return;
	}

	// search Google Movie API
	model.set('loading', true);
	var xhr = Ti.Network.createHTTPClient({
		onload : function(e) {
			//if (handlers.success) {
			processCinemaData(this.responseText);
			//}
			model.set('loading', false);
		},
		onerror : function(e) {
			if (handlers.error) {
				handlers.error(e);
			} else {
				alert('There was an error processing your search. Make sure you have a network connection and try again.');
				Ti.API.error('[ERROR] ' + (e.error || JSON.stringify(e)));
			}
			model.set('loading', false);
		},
		timeout : 5000
	});
	xhr.open("GET", API_URL + value);
	xhr.send();
}

function successHandler(cinemas) {
	var data = [];
	_.each(cinemas, function(cinema) {
		var args = {
			title : cinema.title,
			authors : cinema.authors,
			image : cinema.image
		};
		var row = Alloy.createController('listrow', args).getView();
		data.push(row);
	});
	$.tableView.setData(data);
}

searchForCinemas(null);

$.tableView.addEventListener('click', function selectRow(e) {
	NaviBridge.addPOI({
		lat: "37.3861",
		lon: "122.0828"
	});
});
