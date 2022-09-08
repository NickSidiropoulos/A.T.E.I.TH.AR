// implementation of AR-Experience (aka "World")
var World = {
	// you may request new data from server periodically, however: in this sample data is only requested once
	isRequestingData: false,

	// true once data was fetched
	initiallyLoadedData: false,

	// different POI-Marker assets
	markerDrawable_idle: null,
	markerDrawable_selected: null,
	markerDrawable_directionIndicator: null,

	// list of AR.GeoObjects that are currently shown in the scene / World
	markerList: [],

	// The last selected marker
	currentMarker: null,

    selectedCategory: 0,

    //method to take properties from java code
    categorySelector: function(cat){
	    World.selectedCategory = cat;
	},

	// called to inject new POI data
	loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {
		// empty list of visible markers
		World.markerList = [];

		// Start loading marker assets:
		// Create an AR.ImageResource for the marker idle-image
		World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");
		// Create an AR.ImageResource for the marker selected-image
		World.markerDrawable_selected = new AR.ImageResource("assets/marker_selected.png");
		// Create an AR.ImageResource referencing the image that should be displayed for a direction indicator. 
		World.markerDrawable_directionIndicator = new AR.ImageResource("assets/indi.png");

		// loop through POI-information and create an AR.GeoObject (=Marker) per POI
		for (var currentPlaceNr = 0; currentPlaceNr < poiData.length; currentPlaceNr++) {
			var singlePoi = {
				"id": poiData[currentPlaceNr].id,
				"latitude": parseFloat(poiData[currentPlaceNr].latitude),
				"longitude": parseFloat(poiData[currentPlaceNr].longitude),
				"altitude": parseFloat(poiData[currentPlaceNr].altitude),
				"title": poiData[currentPlaceNr].name,
				"description": poiData[currentPlaceNr].description
			};

			/*
				To be able to deselect a marker while the user taps on the empty screen, 
				the World object holds an array that contains each marker.
			*/
			World.markerList.push(new Marker(singlePoi));
		}

		World.updateStatusMessage(currentPlaceNr + ' τοποθεσίες φορτώθηκαν');
	},

	// updates status message shon in small "i"-button aligned bottom center
	updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

		var themeToUse = isWarning ? "e" : "c";
		var iconToUse = isWarning ? "alert" : "info";

		$("#status-message").html(message);
		$("#popupInfoButton").buttonMarkup({
			theme: themeToUse
		});
		$("#popupInfoButton").buttonMarkup({
			icon: iconToUse
		});
	},

	// location updates, fired every time you call architectView.setLocation() in native environment
	locationChanged: function locationChangedFn(lat, lon, alt, acc) {

		/*
			The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
		*/
		    AR.context.destroyAll();
			World.requestDataFromLocal(lat, lon, alt, acc);
			World.initiallyLoadedData = true;

	},

	// fired when user pressed maker in cam
	onMarkerSelected: function onMarkerSelectedFn(marker) {

		//poi panel sto plai
		if (World.currentMarker) {
        			World.currentMarker.setDeselected(World.currentMarker);
        		}
		World.currentMarker = marker;

            // update panel values
            $("#poi-detail-title").html(marker.poiData.name);
            $("#poi-detail-description").html(marker.poiData.description);

            var geoLoc = new AR.GeoLocation(marker.poiData.latitude,marker.poiData.longitude);
            var distance = geoLoc.distanceToUser();
            var distanceKmM = (distance > 999) ? ((distance / 1000).toFixed(2) + " km") : (Math.round(distance) + " m");

           $("#poi-detail-distance").html(distanceKmM);

            // show panel
            $("#panel-poidetail").panel("open", 123);



	},

	// screen was clicked but no geo-object was hit
	onScreenClick: function onScreenClickFn() {
		if (World.currentMarker) {
			World.currentMarker.setDeselected(World.currentMarker);
		}
	},

	// request POI data
	requestDataFromLocal: function requestDataFromLocalFn(lat, lon, alt, acc) {

        var poisNearby;


	    switch (World.selectedCategory) {
            case 0:
                poisNearby= Helper.bringPlacesToUser(all, lat, lon, alt);
                break;
            case 1:
                poisNearby= Helper.bringPlacesToUser(dioik, lat, lon, alt);
                break;
            case 2:
                poisNearby= Helper.bringPlacesToUser(sdo, lat, lon, alt);
                break;
            case 3:
                poisNearby= Helper.bringPlacesToUser(seyp, lat, lon, alt);
                break;
            case 4:
                poisNearby= Helper.bringPlacesToUser(steg, lat, lon, alt);
                break;
            case 5:
                poisNearby= Helper.bringPlacesToUser(stef, lat, lon, alt);
                break;
        }


        World.loadPoisFromJsonData(poisNearby);
	}

};

var Helper = {

	bringPlacesToUser: function bringPlacesToUserFn(poiData, latitude, longitude, altitude) {
	var altInc = 0;
		for (var i = 0; i < poiData.length; i++) {

			poiData[i].altitude = altitude + altInc;

            if(altInc== 10){altInc=0}
            else{altInc+2}

		}
		return poiData;
	}
};


/* 
	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received. 
*/
AR.context.onLocationChanged = World.locationChanged;

/*
	To detect clicks where no drawable was hit set a custom function on AR.context.onScreenClick where the currently selected marker is deselected.
*/
AR.context.onScreenClick = World.onScreenClick;

var all = [{
	"id": "1",
	"longitude": "22.803712",
	"latitude": "40.656938",
	"description": "Γραφεία Διοίκησης",
	"altitude": "100.0",
	"name": "Διοίκηση"
},{
	"id": "2",
	"longitude": "22.802337",
	"latitude": "40.657968",
	"description": "Κεντρική Βιβλιοθήκη",
	"altitude": "100.0",
	"name": "Βιβλιοθήκη"
},{
	"id": "3.1",
	"longitude": "22.803404",
	"latitude": "40.657395",
	"description": "Βιβλιοθήκη Σχολής",
	"altitude": "100.0",
	"name": "Βιβλιοθήκη"
},{
	"id": "3.2",
	"longitude": "22.806034",
	"latitude": "40.657532",
	"description": "Βιβλιοθήκη Σχολής",
	"altitude": "100.0",
	"name": "Βιβλιοθήκη"
},{
	"id": "4.1",
	"longitude": "22.802262",
	"latitude": "40.657695",
	"description": "Αμφιθέατρο Σχολής",
	"altitude": "100.0",
	"name": "Αμφιθέατρο"
},{
	"id": "4.2",
	"longitude": "22.802971",
	"latitude": "40.658106",
	"description": "Αμφιθέατρο Σχολής",
	"altitude": "100.0",
	"name": "Αμφιθέατρο"
},{
	"id": "4.3",
	"longitude": "22.804201",
	"latitude": "40.657731",
	"description": "Αμφιθέατρο Σχολής",
	"altitude": "100.0",
	"name": "Αμφιθέατρο"
},{
	"id": "4.4",
	"longitude": "22.806033",
	"latitude": "40.657660",
	"description": "Αμφιθέατρο Σχολής",
	"altitude": "100.0",
	"name": "Αμφιθέατρο"
},{
	"id": "4.5",
	"longitude": "22.805682",
	"latitude": "40.655557",
	"description": "Αμφιθέατρο Σχολής",
	"altitude": "100.0",
	"name": "Αμφιθέατρο"
},{
	"id": "5",
	"longitude": "22.802730",
	"latitude": "40.658174",
	"description": "Κεντρικό Κυλικείο",
	"altitude": "100.0",
	"name": "Κυλικείο"
},{
	"id": "6",
	"longitude": "22.802725",
	"latitude": "40.657903",
	"description": "Εστιατόριο",
	"altitude": "100.0",
	"name": "Εστιατόριο"
},{
	"id": "7",
	"longitude": "22.803179",
	"latitude": "40.657379",
	"description": "Ιατρείο",
	"altitude": "100.0",
	"name": "Ιατρείο"
},{
	"id": "8",
	"longitude": "22.803712",
	"latitude": "40.658979",
	"description": "Τεχνική Υπηρεσία",
	"altitude": "100.0",
	"name": "Υπηρεσία"
},{
	"id": "9",
	"longitude": "22.803853",
	"latitude": "40.658849",
	"description": "Γραφείο Συλλόγου Δ.Π",
	"altitude": "100.0",
	"name": "Γραφείο Συλλόγου Δ.Π"
},{
	"id": "10",
	"longitude": "22.804096",
	"latitude": "40.658837",
	"description": "Χώρος εκθεμάτων και Εκδηλώσεων",
	"altitude": "100.0",
	"name": "Χώρος εκθεμάτων και Εκδηλώσεων"
},{
	"id": "11.1",
	"longitude": "22.804192",
	"latitude": "40.658139",
	"description": "Φοιτητικοί χώροι εστιών",
	"altitude": "100.0",
	"name": "Φοιτητικοί χώροι"
},{
	"id": "11.2",
	"longitude": "22.804803",
	"latitude": "40.657978",
	"description": "Φοιτητικοί χώροι εστιών",
	"altitude": "100.0",
	"name": "Φοιτητικοί χώροι"
},{
	"id": "12.1",
	"longitude": "22.812322",
	"latitude": "40.659135",
	"description": "Γυμναστήριο",
	"altitude": "100.0",
	"name": "Γυμναστήριο"
},{
	"id": "12.2",
	"longitude": "22.811208",
	"latitude": "40.658030",
	"description": "Αγρόκτημα",
	"altitude": "100.0",
	"name": "Αγρόκτημα"
},{
	"id": "13",
	"longitude": "22.803617",
	"latitude": "40.659236",
	"description": "Ιερός Ναός",
	"altitude": "100.0",
	"name": "Εκκλησία"
},{
	"id": "14",
	"longitude": "22.803571",
	"latitude": "40.658852",
	"description": "Γραφείο Επιτροπής Ερευνών",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "15",
	"longitude": "22.803671",
	"latitude": "40.657146",
	"description": "Γραφείο Σίτισης",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "16",
	"longitude": "22.804197",
	"latitude": "40.655582",
	"description": "Γραφείο ΑΜΕΑ",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "17",
	"longitude": "22.804433",
	"latitude": "40.657670",
	"description": "Γραφείο Διασύνδεσης",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "18",
	"longitude": "22.805478",
	"latitude": "40.657393",
	"description": "Γραφείο ERASMUS",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "19",
	"longitude": "22.803855",
	"latitude": "40.655581",
	"description": "Γραφείο Διαχείρησης Δικτύου",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "20",
	"longitude": "22.803006",
	"latitude": "40.655322",
	"description": "Γραφείο Αίθουσας Τηλεκπαίδευσης",
	"altitude": "100.0",
	"name": "Γραφεία"
},{
	"id": "21",
	"longitude": "22.803667",
	"latitude": "40.656818",
	"description": "Γραμματίες Σχολής",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "22",
	"longitude": "22.802323",
	"latitude": "40.657489",
	"description": "Αίθουσες 100",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "23",
	"longitude": "22.803899",
	"latitude": "40.656498",
	"description": "Τμήμα Λογιστικής",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "24",
	"longitude": "22.804249",
	"latitude": "40.656452",
	"description": "Τμήμα Διοίκησης Επιχειρήσεων (Τουριστικών)",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "25",
	"longitude": "22.803487",
	"latitude": "40.657291",
	"description": "Τμήμα Βιβλιοθηκονομίας",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "26",
	"longitude": "22.803483",
	"latitude": "40.657567",
	"description": "Τμήμα Διοίκησης Επιχειρήσεων (Μάρκετινγκ)",
	"altitude": "100.0",
	"name": "ΣΔΟ"
},{
	"id": "27",
	"longitude": "22.804007",
	"latitude": "40.657482",
	"description": "Τμήμα Φυσικοθεραπείας",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "28",
	"longitude": "22.804379",
	"latitude": "40.657310",
	"description": "Τμήμα Αισθητικής και Κοσμητολογίας",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "29",
	"longitude": "22.804811",
	"latitude": "40.657324",
	"description": "Τμήμα Ιατρικών Εργαστηρίων",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "30",
	"longitude": "22.804944",
	"latitude": "40.657641",
	"description": "Τμήμα Νοσηλευτικής",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "31",
	"longitude": "22.805917",
	"latitude": "40.657292",
	"description": "Τμήμα Μαιευτικής",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "32",
	"longitude": "22.805802",
	"latitude": "40.657620",
	"description": "Τμήμα Προσχολικής Αγωγής",
	"altitude": "100.0",
	"name": "ΣΕΥΠ"
},{
	"id": "33",
	"longitude": "22.802545",
	"latitude": "40.658301",
	"description": "Γραμματίες Τμημάτων και Σχολής",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "34",
	"longitude": "22.802316",
	"latitude": "40.657204",
	"description": "Αίθουσες 200 Τεχνολόγων Γεωπόνων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "35",
	"longitude": "22.802481",
	"latitude": "40.656893",
	"description": "Αίθουσες 300 Τεχνολογίας Τροφίμων και Διατροφής (3ος όροφος)",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "36",
	"longitude": "22.806031",
	"latitude": "40.656662",
	"description": "Εργαστήριο Γεωργικών Μηχανημάτων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "37",
	"longitude": "22.802311",
	"latitude": "40.656163",
	"description": "Τμήμα Τεχνολογίας Τροφίμων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "38.1",
	"longitude": "22.803415",
	"latitude": "40.658456",
	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "38.2",
	"longitude": "22.802789",
	"latitude": "40.657620",
	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "38.3",
	"longitude": "22.802786",
	"latitude": "40.656912",
	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "39",
	"longitude": "22.803710",
	"latitude": "40.658175",
	"description": "Τμήμα Διατροφής και Διαιτολογίας",
	"altitude": "100.0",
	"name": "ΣΤΕΓΤΕΤΡΟΔ"
},{
	"id": "40",
	"longitude": "22.802876",
	"latitude": "40.656548",
	"description": "Γραμματίες τμημάτων Αυτοματισμού, Πληροφορικής, Οχημάτων ",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "41.1",
	"longitude": "22.802175",
	"latitude": "40.657707",
	"description": "Εργαστήρια σχολής ΣΤΕΦ",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "41.2",
	"longitude": "22.802887",
	"latitude": "40.657194",
	"description": "Εργαστήρια σχολής ΣΤΕΦ",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "41.3",
	"longitude": "22.803074",
	"latitude": "40.656216",
	"description": "Εργαστήρια Μηχανολόγων Οχημάτων",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "42",
	"longitude": "22.802319",
	"latitude": "40.656892",
	"description": "Αίθουσες 300 Μηχανικών Αυτοματισμού (2ος όροφος)",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "43",
	"longitude": "22.802141",
	"latitude": "40.656892",
	"description": "Αίθουσες 300 Πολιτικών Μηχανικών (1ος όροφος)",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "44",
	"longitude": "22.805758",
	"latitude": "40.655638",
	"description": "Γραμματία Τμήματος Ηλεκτρονικών Μηχανικών",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "45",
	"longitude": "22.803831",
	"latitude": "40.655979",
	"description": "Τμήμα Μηχανικών Αυτοματισμού",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "46.1",
	"longitude": "22.804221",
	"latitude": "40.655967",
	"description": "Τμήμα Μηχανικών Πληροφορικής",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "46.2",
	"longitude": "22.804032",
	"latitude": "40.655576",
	"description": "Τμήμα Μηχανικών Πληροφορικής",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "47",
	"longitude": "22.803126",
	"latitude": "40.655476",
	"description": "Τμήμα Μηχανολόγων Οχημάτων",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
},{
	"id": "48",
	"longitude": "22.805880",
	"latitude": "40.655425",
	"description": "Τμήμα Ηλεκτρονικών Μηχανικών",
	"altitude": "100.0",
	"name": "ΣΤΕΦ"
}];

var dioik = [{
             	"id": "1",
             	"longitude": "22.803712",
             	"latitude": "40.656938",
             	"description": "Γραφεία Διοίκησης",
             	"altitude": "100.0",
             	"name": "Διοίκηση"
             },{
             	"id": "2",
             	"longitude": "22.802337",
             	"latitude": "40.657968",
             	"description": "Κεντρική Βιβλιοθήκη",
             	"altitude": "100.0",
             	"name": "Βιβλιοθήκη"
             },{
             	"id": "3.1",
             	"longitude": "22.803404",
             	"latitude": "40.657395",
             	"description": "Βιβλιοθήκη Σχολής",
             	"altitude": "100.0",
             	"name": "Βιβλιοθήκη"
             },{
             	"id": "3.2",
             	"longitude": "22.806034",
             	"latitude": "40.657532",
             	"description": "Βιβλιοθήκη Σχολής",
             	"altitude": "100.0",
             	"name": "Βιβλιοθήκη"
             },{
             	"id": "4.1",
             	"longitude": "22.802262",
             	"latitude": "40.657695",
             	"description": "Αμφιθέατρο Σχολής",
             	"altitude": "100.0",
             	"name": "Αμφιθέατρο"
             },{
             	"id": "4.2",
             	"longitude": "22.802971",
             	"latitude": "40.658106",
             	"description": "Αμφιθέατρο Σχολής",
             	"altitude": "100.0",
             	"name": "Αμφιθέατρο"
             },{
             	"id": "4.3",
             	"longitude": "22.804201",
             	"latitude": "40.657731",
             	"description": "Αμφιθέατρο Σχολής",
             	"altitude": "100.0",
             	"name": "Αμφιθέατρο"
             },{
             	"id": "4.4",
             	"longitude": "22.806033",
             	"latitude": "40.657660",
             	"description": "Αμφιθέατρο Σχολής",
             	"altitude": "100.0",
             	"name": "Αμφιθέατρο"
             },{
             	"id": "4.5",
             	"longitude": "22.805682",
             	"latitude": "40.655557",
             	"description": "Αμφιθέατρο Σχολής",
             	"altitude": "100.0",
             	"name": "Αμφιθέατρο"
             },{
             	"id": "5",
             	"longitude": "22.802730",
             	"latitude": "40.658174",
             	"description": "Κεντρικό Κυλικείο",
             	"altitude": "100.0",
             	"name": "Κυλικείο"
             },{
             	"id": "6",
             	"longitude": "22.802725",
             	"latitude": "40.657903",
             	"description": "Εστιατόριο",
             	"altitude": "100.0",
             	"name": "Εστιατόριο"
             },{
             	"id": "7",
             	"longitude": "22.803179",
             	"latitude": "40.657379",
             	"description": "Ιατρείο",
             	"altitude": "100.0",
             	"name": "Ιατρείο"
             },{
             	"id": "8",
             	"longitude": "22.803712",
             	"latitude": "40.658979",
             	"description": "Τεχνική Υπηρεσία",
             	"altitude": "100.0",
             	"name": "Υπηρεσία"
             },{
             	"id": "9",
             	"longitude": "22.803853",
             	"latitude": "40.658849",
             	"description": "Γραφείο Συλλόγου Δ.Π",
             	"altitude": "100.0",
             	"name": "Γραφείο Συλλόγου Δ.Π"
             },{
             	"id": "10",
             	"longitude": "22.804096",
             	"latitude": "40.658837",
             	"description": "Χώρος εκθεμάτων και Εκδηλώσεων",
             	"altitude": "100.0",
             	"name": "Χώρος εκθεμάτων και Εκδηλώσεων"
             },{
             	"id": "11.1",
             	"longitude": "22.804192",
             	"latitude": "40.658139",
             	"description": "Φοιτητικοί χώροι εστιών",
             	"altitude": "100.0",
             	"name": "Φοιτητικοί χώροι"
             },{
             	"id": "11.2",
             	"longitude": "22.804803",
             	"latitude": "40.657978",
             	"description": "Φοιτητικοί χώροι εστιών",
             	"altitude": "100.0",
             	"name": "Φοιτητικοί χώροι"
             },{
             	"id": "12.1",
             	"longitude": "22.812322",
             	"latitude": "40.659135",
             	"description": "Γυμναστήριο",
             	"altitude": "100.0",
             	"name": "Γυμναστήριο"
             },{
             	"id": "12.2",
             	"longitude": "22.811208",
             	"latitude": "40.658030",
             	"description": "Αγρόκτημα",
             	"altitude": "100.0",
             	"name": "Αγρόκτημα"
             },{
             	"id": "13",
             	"longitude": "22.803617",
             	"latitude": "40.659236",
             	"description": "Ιερός Ναός",
             	"altitude": "100.0",
             	"name": "Εκκλησία"
             },{
             	"id": "14",
             	"longitude": "22.803571",
             	"latitude": "40.658852",
             	"description": "Γραφείο Επιτροπής Ερευνών",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "15",
             	"longitude": "22.803671",
             	"latitude": "40.657146",
             	"description": "Γραφείο Σίτισης",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "16",
             	"longitude": "22.804197",
             	"latitude": "40.655582",
             	"description": "Γραφείο ΑΜΕΑ",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "17",
             	"longitude": "22.804433",
             	"latitude": "40.657670",
             	"description": "Γραφείο Διασύνδεσης",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "18",
             	"longitude": "22.805478",
             	"latitude": "40.657393",
             	"description": "Γραφείο ERASMUS",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "19",
             	"longitude": "22.803855",
             	"latitude": "40.655581",
             	"description": "Γραφείο Διαχείρησης Δικτύου",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             },{
             	"id": "20",
             	"longitude": "22.803006",
             	"latitude": "40.655322",
             	"description": "Γραφείο Αίθουσας Τηλεκπαίδευσης",
             	"altitude": "100.0",
             	"name": "Γραφεία"
             }];

var sdo = [{
           	"id": "21",
           	"longitude": "22.803667",
           	"latitude": "40.656818",
           	"description": "Γραμματίες Σχολής",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           },{
           	"id": "22",
           	"longitude": "22.802323",
           	"latitude": "40.657489",
           	"description": "Αίθουσες 100",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           },{
           	"id": "23",
           	"longitude": "22.803899",
           	"latitude": "40.656498",
           	"description": "Τμήμα Λογιστικής",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           },{
           	"id": "24",
           	"longitude": "22.804249",
           	"latitude": "40.656452",
           	"description": "Τμήμα Διοίκησης Επιχειρήσεων (Τουριστικών)",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           },{
           	"id": "25",
           	"longitude": "22.803487",
           	"latitude": "40.657291",
           	"description": "Τμήμα Βιβλιοθηκονομίας",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           },{
           	"id": "26",
           	"longitude": "22.803483",
           	"latitude": "40.657567",
           	"description": "Τμήμα Διοίκησης Επιχειρήσεων (Μάρκετινγκ)",
           	"altitude": "100.0",
           	"name": "ΣΔΟ"
           }];

var seyp = [{
            	"id": "27",
            	"longitude": "22.804007",
            	"latitude": "40.657482",
            	"description": "Τμήμα Φυσικοθεραπείας",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            },{
            	"id": "28",
            	"longitude": "22.804379",
            	"latitude": "40.657310",
            	"description": "Τμήμα Αισθητικής και Κοσμητολογίας",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            },{
            	"id": "29",
            	"longitude": "22.804811",
            	"latitude": "40.657324",
            	"description": "Τμήμα Ιατρικών Εργαστηρίων",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            },{
            	"id": "30",
            	"longitude": "22.804944",
            	"latitude": "40.657641",
            	"description": "Τμήμα Νοσηλευτικής",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            },{
            	"id": "31",
            	"longitude": "22.805917",
            	"latitude": "40.657292",
            	"description": "Τμήμα Μαιευτικής",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            },{
            	"id": "32",
            	"longitude": "22.805802",
            	"latitude": "40.657620",
            	"description": "Τμήμα Προσχολικής Αγωγής",
            	"altitude": "100.0",
            	"name": "ΣΕΥΠ"
            }];

var steg = [{
            	"id": "33",
            	"longitude": "22.802545",
            	"latitude": "40.658301",
            	"description": "Γραμματίες Τμημάτων και Σχολής",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "34",
            	"longitude": "22.802316",
            	"latitude": "40.657204",
            	"description": "Αίθουσες 200 Τεχνολόγων Γεωπόνων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "35",
            	"longitude": "22.802481",
            	"latitude": "40.656893",
            	"description": "Αίθουσες 300 Τεχνολογίας Τροφίμων και Διατροφής (3ος όροφος)",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "36",
            	"longitude": "22.806031",
            	"latitude": "40.656662",
            	"description": "Εργαστήριο Γεωργικών Μηχανημάτων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "37",
            	"longitude": "22.802311",
            	"latitude": "40.656163",
            	"description": "Τμήμα Τεχνολογίας Τροφίμων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "38.1",
            	"longitude": "22.803415",
            	"latitude": "40.658456",
            	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "38.2",
            	"longitude": "22.802789",
            	"latitude": "40.657620",
            	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "38.3",
            	"longitude": "22.802786",
            	"latitude": "40.656912",
            	"description": "Τμήμα Τεχνολόγων Γεωπόνων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            },{
            	"id": "39",
            	"longitude": "22.803710",
            	"latitude": "40.658175",
            	"description": "Τμήμα Διατροφής και Διαιτολογίας",
            	"altitude": "100.0",
            	"name": "ΣΤΕΓΤΕΤΡΟΔ"
            }];

var stef = [{
            	"id": "40",
            	"longitude": "22.802876",
            	"latitude": "40.656548",
            	"description": "Γραμματίες τμημάτων Αυτοματισμού, Πληροφορικής, Οχημάτων ",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "41.1",
            	"longitude": "22.802175",
            	"latitude": "40.657707",
            	"description": "Εργαστήρια σχολής ΣΤΕΦ",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "41.2",
            	"longitude": "22.802887",
            	"latitude": "40.657194",
            	"description": "Εργαστήρια σχολής ΣΤΕΦ",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "41.3",
            	"longitude": "22.803074",
            	"latitude": "40.656216",
            	"description": "Εργαστήρια Μηχανολόγων Οχημάτων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "42",
            	"longitude": "22.802319",
            	"latitude": "40.656892",
            	"description": "Αίθουσες 300 Μηχανικών Αυτοματισμού (2ος όροφος)",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "43",
            	"longitude": "22.802141",
            	"latitude": "40.656892",
            	"description": "Αίθουσες 300 Πολιτικών Μηχανικών (1ος όροφος)",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "44",
            	"longitude": "22.805758",
            	"latitude": "40.655638",
            	"description": "Γραμματία Τμήματος Ηλεκτρονικών Μηχανικών",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "45",
            	"longitude": "22.803831",
            	"latitude": "40.655979",
            	"description": "Τμήμα Μηχανικών Αυτοματισμού",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "46.1",
            	"longitude": "22.804221",
            	"latitude": "40.655967",
            	"description": "Τμήμα Μηχανικών Πληροφορικής",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "46.2",
            	"longitude": "22.804032",
            	"latitude": "40.655576",
            	"description": "Τμήμα Μηχανικών Πληροφορικής",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "47",
            	"longitude": "22.803126",
            	"latitude": "40.655476",
            	"description": "Τμήμα Μηχανολόγων Οχημάτων",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            },{
            	"id": "48",
            	"longitude": "22.805880",
            	"latitude": "40.655425",
            	"description": "Τμήμα Ηλεκτρονικών Μηχανικών",
            	"altitude": "100.0",
            	"name": "ΣΤΕΦ"
            }];