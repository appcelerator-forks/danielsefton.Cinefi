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
	customView : 'map',
	image : "images/ic_search.png"
}).getView());

section.add(Alloy.createController('menurow', {
	title : 'List',
	customView : 'list',
	image : "images/ic_search.png"
}).getView());

var data = [section];

// Pass data to widget tableView
$.ds.tableView.data = data;

// Customise look. TODO: Override in tss
$.ds.tableView.backgroundColor = "#D8D8D8";
$.ds.tableView.separatorColor = "transparent"
$.ds.innerwin.title = "CINEFI";
$.ds.innerwin.barColor = "#00549C";

var currentView = Alloy.createController("map").getView();
$.ds.innerwin.add(currentView);

// Swap views on menu item click
$.ds.tableView.addEventListener('click', function selectRow(e) {
	if (currentView.id != e.row.customView) {
		$.ds.innerwin.remove(currentView);
		currentView = Alloy.createController(e.row.customView).getView();
		$.ds.innerwin.add(currentView);
	}
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

if (Ti.Platform.osname === 'iphone')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();
