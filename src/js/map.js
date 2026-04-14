let map;
let restaurantMarkers = [];
let userMarker = null;
let markerCluster = null;
let currentUserLocation = null;

export function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 19.4326, lng: -99.1332 },
    zoom: 13,
  });

  if (currentUserLocation) {
    drawUserLocation();
  }
}

export function setUserLocation(coords) {
  if (!coords) return;

  currentUserLocation = {
    lat: coords.lat,
    lng: coords.lng,
  };

  if (map) {
    drawUserLocation();
  }
}

function drawUserLocation() {
  if (!map || !currentUserLocation) return;

  map.setCenter(currentUserLocation);

  if (userMarker) {
    userMarker.setMap(null);
  }

  userMarker = new google.maps.Marker({
    position: currentUserLocation,
    map,
    title: "You are here",
    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  });
}

function clearRestaurantMarkers() {
  restaurantMarkers.forEach((marker) => marker.setMap(null));
  restaurantMarkers = [];

  if (markerCluster) {
    markerCluster.clearMarkers();
    markerCluster = null;
  }
}

function getFakeNearbyPosition(base, index) {
  const angle = (index / 8) * Math.PI * 2;
  const radius = 0.01 + (index % 3) * 0.003;

  return {
    lat: base.lat + Math.cos(angle) * radius,
    lng: base.lng + Math.sin(angle) * radius,
  };
}

export function updateMarkers(restaurants) {
  if (!map || !restaurants || restaurants.length === 0) return;

  clearRestaurantMarkers();

  const base = currentUserLocation || map.getCenter().toJSON();

  restaurants.forEach((restaurant, index) => {
    const position = getFakeNearbyPosition(base, index);

    const marker = new google.maps.Marker({
      position,
      map,
      title: restaurant.name,
    });

    marker.addListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("restaurantSelected", { detail: restaurant })
      );
    });

    restaurantMarkers.push(marker);
  });

  if (
    window.markerClusterer &&
    window.markerClusterer.MarkerClusterer &&
    restaurantMarkers.length > 0
  ) {
    markerCluster = new window.markerClusterer.MarkerClusterer({
      map,
      markers: restaurantMarkers,
    });
  }
}