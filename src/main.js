// =====================
// IMPORTS
// =====================
import { handleSearch } from "./js/search.js";
import { filterRestaurants } from "./js/filters.js";
import { pickRandom } from "./js/random.js";
import {
  renderRestaurants,
  highlightRestaurant,
  showDetails,
  renderFavorites,
  renderHistory,
} from "./js/ui.js";
import { getUserLocation } from "./js/location.js";
import { initMap, updateMarkers, setUserLocation } from "./js/map.js";
import { addToHistory } from "./js/history.js";

// =====================
// STATE
// =====================
let restaurants = [];
let userLocation = null;

let state = {
  filters: {
    type: null,
    rating: null,
  },
};

// =====================
// DOM
// =====================
const randomBtn = document.querySelector("#randomBtn");
const typeFilter = document.querySelector("#typeFilter");
const ratingFilter = document.querySelector("#ratingFilter");
const resetFiltersBtn = document.querySelector("#resetFilters");

// =====================
// MAP INIT
// =====================
window.initMap = () => {
  initMap();

  if (userLocation) {
    setUserLocation(userLocation);
  }

  if (restaurants.length > 0) {
    updateMarkers(getVisibleResults());
  }
};

// =====================
// APP INIT
// =====================
async function init() {
  try {
    userLocation = await getUserLocation();

    if (userLocation) {
      setUserLocation(userLocation);
    }
  } catch (error) {
    console.log("Location not available");
  }

  renderFavorites();
  renderHistory();
}

init();

// =====================
// HELPERS
// =====================
function getVisibleResults() {
  return filterRestaurants(restaurants, state);
}

// =====================
// TYPE → SEARCH
// =====================
typeFilter.addEventListener("change", async (e) => {
  const query = e.target.value;

  state.filters.type = query || null;

  if (!query) {
    restaurants = [];
    updateUI();
    return;
  }

  restaurants = await handleSearch(query);
  updateUI();
});

// =====================
// RATING FILTER
// =====================
ratingFilter.addEventListener("change", (e) => {
  state.filters.rating = e.target.value
    ? parseInt(e.target.value)
    : null;

  updateUI();
});

// =====================
// RESET
// =====================
resetFiltersBtn.addEventListener("click", () => {
  state.filters.type = null;
  state.filters.rating = null;

  typeFilter.value = "";
  ratingFilter.value = "";

  restaurants = [];
  updateUI();
});

// =====================
// RANDOM
// =====================
randomBtn.addEventListener("click", () => {
  const visible = getVisibleResults();

  if (visible.length === 0) {
    alert("Pick a food type first!");
    return;
  }

  pickRandom(visible, highlightRestaurant, (restaurant) => {
    showDetails(restaurant);
  });
});

// =====================
// UPDATE UI
// =====================
function updateUI() {
  const visible = getVisibleResults();

  renderRestaurants(visible, (restaurant) => {
    showDetails(restaurant);
  });

  if (visible.length > 0) {
    updateMarkers(visible);
  }
}

// =====================
// EVENTS
// =====================

// click desde mapa / favorites / history
document.addEventListener("restaurantSelected", (e) => {
  showDetails(e.detail);
});

// favoritos (por si decides usar evento después)
document.addEventListener("favoritesUpdated", () => {
  renderFavorites();
});

// 🔥 HISTORY REAL (esto es lo que faltaba)
document.addEventListener("addToHistory", (e) => {
  addToHistory(e.detail);
  renderHistory();
});