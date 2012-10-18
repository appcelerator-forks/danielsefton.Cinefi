var NaviBridge = require("ti.navibridge/ti.navibridge");
NaviBridge.setApplicationId("ICiAV4Ay");

var section = Ti.UI.createTableViewSection();

var customView = Ti.UI.createView({
	height : 'auto',
	backgroundGradient : {
		type : "linear",
		startPoint : {
			x : "0%",
			y : "0%"
		},
		endPoint : {
			x : "0%",
			y : "100%"
		},
		colors : [{
			color : "#0062B7",
			offset : 0.0
		}, {
			color : "#003C72",
			offset : 1.0
		}]
	}
});

var customLabel = Ti.UI.createLabel({
	top : 8,
	bottom : 8,
	left : 10,
	right : 10,
	height : 'auto',
	text : 'Menu',
	font : {
		fontSize : 12,
		fontWeight : 'bold'
	},
	color : '#FFF'
});

customView.add(customLabel);

section.headerView = customView;

section.add(Alloy.createController('menurow', {
	title : 'Map',
	view : 'view1',
	image : "images/ic_search.png"
}).getView());

section.add(Alloy.createController('menurow', {
	title : 'List',
	view : 'view2',
	image : "images/ic_search.png"
}).getView());

var data = [section];

// Pass data to widget tableView
$.ds.tableView.data = data;
$.ds.tableView.backgroundColor = "#D8D8D8";
$.ds.tableView.separatorColor = "transparent"

var view1 = Alloy.createController('map').getView('Window');
var view2 = Alloy.createController('list').getView('Window');

$.ds.innerwin.add(view1);
var currentView = view1;

// Swap views on menu item click
$.ds.tableView.addEventListener('click', function selectRow(e) {
	$.ds.innerwin.remove(currentView);
	if (e.row.customTitle.text === "Map") {
		currentView = view1;
	} else if (e.row.customTitle.text === "List") {
		currentView = view2;
	}
	$.ds.innerwin.add(currentView);
	$.ds.toggleSlider();
});

// Set row title highlight colour
var storedRowTitle = null;
$.ds.tableView.addEventListener('touchstart', function(e) {
	storedRowTitle = e.row.customTitle;
	storedRowTitle.color = "#FFF";
});
$.ds.tableView.addEventListener('touchend', function(e) {
	storedRowTitle.color = "#666";
});
$.ds.tableView.addEventListener('scroll', function(e) {
	if (storedRowTitle != null)
		storedRowTitle.color = "#666";
});

$.ds.innerwin.title = "CINEFI";
$.ds.innerwin.barColor = "#00549C";

if (Ti.Platform.osname === 'iphone')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();
