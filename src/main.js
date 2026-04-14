import { handleSearch } from "./js/search.js";
import { filterRestaurants } from "./js/filters.js";
import { pickRandom } from "./js/random.js";
import { renderRestaurants, highlightRestaurant, showDetails } from "./js/ui.js";
import { getUserLocation } from "./js/location.js";
import { initMap, updateMarkers, setUserLocation } from "./js/map.js";

let restaurants = [];
let userLocation = null;

let state = {
  search: "",
  filters: {
    type: null,
    rating: null,
  },
};

const input = document.querySelector("#searchInput");
const button = document.querySelector("#searchBtn");
const randomBtn = document.querySelector("#randomBtn");
const typeFilter = document.querySelector("#typeFilter");
const ratingFilter = document.querySelector("#ratingFilter");
const resetFiltersBtn = document.querySelector("#resetFilters");

window.initMap = () => {
  initMap();

  if (userLocation) {
    setUserLocation(userLocation);
  }

  if (restaurants.length > 0) {
    updateMarkers(getVisibleResults());
  }
};

async function init() {
  try {
    userLocation = await getUserLocation();

    if (userLocation) {
      setUserLocation(userLocation);
    }
  } catch (error) {
    console.log("Location not available");
  }
}

init();

function getVisibleResults() {
  return filterRestaurants(restaurants, {
    ...state,
    search: "",
  });
}

button.addEventListener("click", async () => {
  const query = input.value.trim();

  if (!query) return;

  restaurants = await handleSearch(query);
  updateUI();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});

input.addEventListener("input", (e) => {
  state.search = e.target.value;
});

typeFilter.addEventListener("change", (e) => {
  state.filters.type = e.target.value || null;
  updateUI();
});

ratingFilter.addEventListener("change", (e) => {
  state.filters.rating = e.target.value ? parseInt(e.target.value) : null;
  updateUI();
});

resetFiltersBtn.addEventListener("click", () => {
  state.filters.type = null;
  state.filters.rating = null;

  typeFilter.value = "";
  ratingFilter.value = "";

  updateUI();
});

randomBtn.addEventListener("click", () => {
  const visible = getVisibleResults();

  if (visible.length === 0) {
    alert("No results. Try something like 'chicken'");
    return;
  }

  pickRandom(visible, highlightRestaurant, (restaurant) => {
    showDetails(restaurant);
  });
});

function updateUI() {
  const visible = getVisibleResults();

  renderRestaurants(visible, (restaurant) => {
    showDetails(restaurant);
  });

  if (visible.length > 0) {
    updateMarkers(visible);
  }
}

document.addEventListener("restaurantSelected", (e) => {
  showDetails(e.detail);
});