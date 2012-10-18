var API_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
var HANDLERS = ['success','error'];
var MAX_BOOKS = 10; // for demo purposes, set a max for the number of books

var AppModel = require('alloy/backbone').Model.extend({ loading: false });
var model = new AppModel;
var handlers = {};

// react to changes in the model state
model.on('change:loading', function(m) {
	if (m.get('loading')) {
		//$.searchView.touchEnabled = false;
		//$.search.opacity = 0;
		$.loading.setOpacity(1.0);	
	} else {
		$.loading.setOpacity(0);
		//$.search.opacity = 1;
		//$.searchView.touchEnabled = true;
	}
});

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function processBookData(data) {
	var books = [];

	// make sure the returned data is valid
	try {
		var items = JSON.parse(data).items;
	} catch (e) {
		alert('Invalid response from server. Try again.');
		return;
	}

	// process each book, turning it into a table row
	for (var i = 0; i < Math.min(items.length,MAX_BOOKS); i++) {
		var info = items[i].volumeInfo;
		if (!info) { continue; }
		var links = info.imageLinks || {};
		var authors = (info.authors || []).join(', ');
		books.push({
			title: info.title || '',
			authors: authors,
			image: links.smallThumbnail || links.thumbnail || 'none'
		});
	}
	Ti.API.info("BEFORE SUCCESS HANDLER");
	// fire success handler with list of books
	successHandler(books);
}

////////////////////////////////////
////////// event handlers //////////
////////////////////////////////////
function searchForBooks(e) {
	// validate search data
	var value = encodeURIComponent("harry potter");
	if (!value) {
		alert('You need to enter search text');
		return;
	}
	Ti.API.info("SEARCHING");
	// search Google Book API
	model.set('loading', true);
	var xhr = Ti.Network.createHTTPClient({
		onload: function(e) {
			if (handlers.success) {
				processBookData(this.responseText);	
			}
			model.set('loading', false);
		},
		onerror: function(e) {	
			if (handlers.error) {
				handlers.error(e);
			} else {
				alert('There was an error processing your search. Make sure you have a network connection and try again.');
				Ti.API.error('[ERROR] ' + (e.error || JSON.stringify(e)));
			}
			model.set('loading', false);
		},
		timeout: 5000
	});
	xhr.open("GET", API_URL + value);
	xhr.send();
}

function successHandler(books) {
    var data = [];
    _.each(books, function(book) {
      var args = {
        title: book.title,
        authors: book.authors,
        image: book.image
      };
      var row = Alloy.createController('listrow', args).getView();
      data.push(row);
    });
    Ti.API.info("TABLE SET DATA");
    $.tableView.setData(data);
}

searchForBooks(null);
