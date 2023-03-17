//function to view the map
let map, infoWindow, mapMarker;//, marker;
let mapMarkers = [];
function initMap(){
   var options = {
    zoom: 15,
    center:{ lat: -33.8688, lng: 151.2195 },
    styles: setStyle("lightMode"),
    //style map(may add night mode sometime)
    disableDefaultUI: true,
  }
  map = new google.maps.Map(document.getElementById('map'), options);
  generalSetup(map);

}

function generalSetup(map){
  initAutocomplete(map, "pac-input");
  initAutocomplete(map, "pac-input2");
  infoWindow = new google.maps.InfoWindow();
  const geocoder = new google.maps.Geocoder();

   //add tags
   google.maps.event.addListener(map, 'click', 
   function(event){
    addMarker({coords: event.latLng})
    geocodeLatLng(geocoder, map, event.latLng);
    //checkTag(map, event.latLng);
   });

   //get user current location
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        map.setCenter(pos);
        
        //marker for current user location
        new google.maps.Marker({
          position: pos,
          map,
        });
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

}

//get location name from latlng coordinates
function geocodeLatLng(geocoder, map, position) {

  geocoder
    .geocode({ location: position })
    .then((response) => {
      if (response.results[0]) {
        //map.setZoom(11);
        document.getElementById("location-name").innerHTML = response.results[0].address_components[2].short_name;

      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

//function for searchbox and search autocomplete
function initAutocomplete(map, id) {
  
    // Create the search box and link it to the UI element.
    const input = document.getElementById(id);
    const searchBox = new google.maps.places.SearchBox(input);
  
   //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
  
    let markers = [];
  
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
  
      // Clear out the old markers.
      markers.forEach((searchMarker) => {
        searchMarker.setMap(null);
      });
      markers = [];
  
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
  
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
  
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25),
        };
  
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
  }

  //checks if geolocation is enabled for a user
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    initAutocomplete(map);
    map.setZoom(2);
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

  //add a marker to the map
function addMarker(props){
  if(mapMarker == null || mapMarker.getTitle() != null){
    mapMarker = new google.maps.Marker({
      position: props.coords,
      map,
    });
  } else {
    mapMarker.setPosition(props.coords);
  }

  //mapMarker.setPosition(props.coords);

  mapMarkers.push(mapMarker);

  //pop up box operations
  const modal = document.getElementById('modal');
  const closeButton = document.getElementById('close');
  modal.classList.add('active');
  document.getElementById('close').addEventListener("click", e => {
    e.preventDefault();
    modal.classList.remove('active');
  });

  //check if tag has been applied
  checkTag(map, props.coords, mapMarkers);
  
}

//function to determine tags for locations
function checkTag(map, location, pins){
  document.getElementById('favorite').addEventListener("click", e => {
    e.preventDefault();
    const image = "https://img.icons8.com/tiny-color/25/hearts.png";
    pins[pins.length-1].setIcon(image);
    pins[pins.length-1].setTitle("favorite");
    //marker.setStyle({});
    //var tag = new Tag(map, location);
   // setTag("favorite");
  });

  document.getElementById('been').addEventListener("click", e => {
    e.preventDefault();
    const image = "https://img.icons8.com/fluency/25/checkmark.png";
    pins[pins.length-1].setIcon(image);
    pins[pins.length-1].setTitle("been");
    //marker.setStyle({});
    //var tag = new Tag(map, location);
    //setTag("been");
  });

  document.getElementById('want-to').addEventListener("click", e => {
    e.preventDefault();
    const image = "https://img.icons8.com/fluency/25/star.png";
    pins[pins.length-1].setIcon(image);
    pins[pins.length-1].setTitle("want-to");
    //marker.setStyle({});
    //var tag = new Tag(map, location);
    //setTag("want-to");
  });
}

//this fuction selects a KML file from a user's local computer
function getFile(){
  let input = document.createElement('input');
  input.type = 'file';
  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
    let files =   Array.from(input.files);
    let reader = new FileReader();
    reader.onload = async (e)=>{
      let result = e.target.result;//await this.extractGoogleCoords(e.target.result);
      extractGoogleCoords(result);
      console.log(result);
    }
    reader.readAsText(files[0]);
            
  };
  input.click();
 }


 //this function extracts the tagged coordinates as well as the tag from the KML file
 function extractGoogleCoords(text){
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(text, "text/xml");
  let googleMarkers = [];
  let tags = [];
  let locations = [];

  if(xmlDoc.documentElement.nodeName == "kml"){
    for (const item of xmlDoc.getElementsByTagName('Placemark')){
      let placeMarkName = item.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim();
      let markers = item.getElementsByTagName('Point');
      let extendedData = item.getElementsByTagName('ExtendedData')[0].getElementsByTagName('Data');
      //console.log(extendedData);
      
      for (const marker of markers) {
        var coords = marker.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim();
        let coord = coords.split(",");
        googleMarkers.push({ lat: +coord[1], lng: +coord[0] });
       // console.log(googleMarkers);
      }

      
      for (const data of extendedData) {
        var exData = data.getElementsByTagName('value')[0].childNodes[0].nodeValue.trim();
        var tag = data.attributes[0].nodeValue;
        if(tag == 'flags'){
          tags.push(exData);
        }
       // console.log(tags)
      }
    }
    locations = combineArrays(googleMarkers, tags);
    setKMLMap(locations);
    console.log(locations);
  }
}

//this function sets up the new map loaded from the KML file
function setKMLMap(locations){
  var options = {
    zoom: 10,
    center:{ lat: 43.64381, lng: -79.38554 },
    //style map(may add night mode sometime)
    disableDefaultUI: true,
  }
  map = new google.maps.Map(document.getElementById('map'), options);
  for (var i = 0; i < locations.length; i++) {  
    marker = new google.maps.Marker({
      position: locations[i][0],
      map: map
    });

    if(locations[i][1] == "want"){
      marker.setIcon("https://img.icons8.com/fluency/25/star.png");
    };
    if(locations[i][1] == "been"){
      marker.setIcon("https://img.icons8.com/fluency/25/checkmark.png");
    };
    if(locations[i][1] == "favorite"){
      marker.setIcon("https://img.icons8.com/tiny-color/25/hearts.png");
    };
  }
  generalSetup(map);
}


//for some button clicking events
document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = document.getElementById('main-menu');
  const tagsMenu = document.getElementById('tags');
  const settingsMenu = document.getElementById('settings');
  const btnHamburger = document.querySelector('#btnHamburger'); 
  const hamburger = document.querySelector('.hamburger');
  const fadeElems = document.querySelectorAll('.has-fade');


  document.getElementById('tag').addEventListener("click", e => {
      e.preventDefault();
      sideMenu.classList.add("menu--hidden");
      tagsMenu.classList.remove("menu--hidden");
      currentMenu = tagsMenu;
  });

  document.getElementById('home').addEventListener("click", e => {
      e.preventDefault();
      sideMenu.classList.remove("menu--hidden");
      tagsMenu.classList.add("menu--hidden");
      currentMenu = sideMenu;
  });

  document.getElementById('setting').addEventListener("click", e => {
    e.preventDefault();
    settingsMenu.classList.remove("menu--hidden");
    sideMenu.classList.add("menu--hidden");
    currentMenu = settingsMenu;
  });

  document.getElementById('close').addEventListener("click", e => {
    e.preventDefault();
    //if(sideMenu.classList.contains("menu--hidden") && !tagsMenu.classList.contains("menu--hidden")){
    tagsMenu.classList.add("menu--hidden");
    sideMenu.classList.remove("menu--hidden");
  });

  var backElements = document.getElementsByClassName("back");
  for (var i = 0; i < backElements.length; i++) {
    backElements[i].addEventListener("click", e => {
      e.preventDefault();
      //if(sideMenu.classList.contains("menu--hidden") && !tagsMenu.classList.contains("menu--hidden")){
      tagsMenu.classList.add("menu--hidden");
      settingsMenu.classList.add("menu--hidden");
      sideMenu.classList.remove("menu--hidden");
    });
  }

  btnHamburger.addEventListener('click', function(){
    if(hamburger.classList.contains('open')){// close menu
        hamburger.classList.remove('open');
        fadeElems.forEach(function(element){
          element.classList.add('fade-out');
          element.classList.remove('fade-in');
        });
    }
    else{//open menu
        hamburger.classList.add('open');
        fadeElems.forEach(function(element){
          element.classList.add('fade-in');
          element.classList.remove('fade-out');
      });
    }
});
/*
  loginForm.addEventListener("submit", e => {
      e.preventDefault();
  });*/
});

function combineArrays(arr1, arr2){
  let combinedArray = [];
  for(let i = 0; i < arr1.length; i++){
    for(let j = 0; j < arr2.length; j++){
      if(i==j){
        //console.log(i, j)
        combinedArray.push([arr1[i], arr2[j]]);
      }
    }
  }
  return combinedArray;
}



//customize the style of the map
function setStyle(type){
  let lightMode = [
    {
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    /*{
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },*/
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [{ color: "#bdbdbd" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [{ color: "#757575" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#dadada" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [{ color: "#e5e5e5" }],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [{ color: "#eeeeee" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#c9c9c9" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }],
    },
  ]
  if (type == "lightMode"){
    return lightMode;
  }
}

  window.initMap = initMap;
