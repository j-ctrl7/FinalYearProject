//function to view the map
let map, infoWindow;//, marker;
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
        /*
        const marker = new google.maps.Marker({
          position: latlng,
          map: map,
        });

        infowindow.setContent(response.results[0].formatted_address);
        infowindow.open(map, marker);*/

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
  /*
  marker = new google.maps.Marker({
    position: props.coords,
    map,
  });
  marker.setPosition(props.coords);*/
  let mapMarker;
  mapMarker = new google.maps.Marker({
    position: props.coords,
    map,
  });

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
    var tag = new Tag(map, location);
    setTag("favorite");
  });

  document.getElementById('been').addEventListener("click", e => {
    e.preventDefault();
    const image = "https://img.icons8.com/fluency/25/checkmark.png";
    pins[pins.length-1].setIcon(image);
    pins[pins.length-1].setTitle("been");
    //marker.setStyle({});
    var tag = new Tag(map, location);
    setTag("been");
  });

  document.getElementById('want-to').addEventListener("click", e => {
    e.preventDefault();
    const image = "https://img.icons8.com/fluency/25/star.png";
    pins[pins.length-1].setIcon(image);
    pins[pins.length-1].setTitle("want-to");
    //marker.setStyle({});
    var tag = new Tag(map, location);
    setTag("want-to");
  });
}


//for some button clicking events
document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = document.getElementById('main-menu');
  const tagsMenu = document.getElementById('tags');

  document.getElementById('tag').addEventListener("click", e => {
      e.preventDefault();
      sideMenu.classList.add("menu--hidden");
      tagsMenu.classList.remove("menu--hidden");
  });

  document.getElementById('home').addEventListener("click", e => {
      e.preventDefault();
      sideMenu.classList.remove("menu--hidden");
      tagsMenu.classList.add("menu--hidden");
  });

  document.getElementById('back').addEventListener("click", e => {
    e.preventDefault();
    //if(sideMenu.classList.contains("menu--hidden") && !tagsMenu.classList.contains("menu--hidden")){
    tagsMenu.classList.add("menu--hidden");
    sideMenu.classList.remove("menu--hidden");
});

document.getElementById('close').addEventListener("click", e => {
  e.preventDefault();
  //if(sideMenu.classList.contains("menu--hidden") && !tagsMenu.classList.contains("menu--hidden")){
  tagsMenu.classList.add("menu--hidden");
  sideMenu.classList.remove("menu--hidden");
});

  loginForm.addEventListener("submit", e => {
      e.preventDefault();
  });
});


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
  