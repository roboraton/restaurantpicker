import { handleSearch } from "./search.js";
import { filterRestaurants } from "./filters.js";
import { pickRandom } from "./random.js";
import { renderRestaurants, highlightRestaurant, showDetails } from "./ui.js";
import { generateMapHTML } from "./map.js";
import { getUserLocation } from "./js/location.js";

let userLocation = null;

async function init() {
  userLocation = await getUserLocation();
}

init();

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

let restaurants = [];

let state = {
  search: "",
  filters: {
    type: null,
    rating: null
  }
};

const input = document.querySelector("#searchInput");
const button = document.querySelector("#searchBtn");
const randomBtn = document.querySelector("#randomBtn");
const manualLocationInput = document.querySelector("#manualLocation");

// SEARCH BASED ON LOCATION PRIORITY: manual > geolocation
button.addEventListener("click", async () => {
  let query = input.value;

  // prioridad: manual > geolocation
  if (manualLocationInput.value) {
    query += ` near ${manualLocationInput.value}`;
  } else if (userLocation) {
    query += ` near ${userLocation.lat},${userLocation.lng}`;
  }

  restaurants = await handleSearch(query);
  updateUI();
});

// INPUT
input.addEventListener("input", (e) => {
  state.search = e.target.value;
  updateUI();
});

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    button.click();
  }
});

// FILTERS
document.getElementById("typeFilter").addEventListener("change", (e) => {
  state.filters.type = e.target.value || null;
  updateUI();
});

document.getElementById("ratingFilter").addEventListener("change", (e) => {
  state.filters.rating = e.target.value ? parseInt(e.target.value) : null;
  updateUI();
});

document.getElementById("resetFilters").addEventListener("click", () => {
  state.filters.type = null;
  state.filters.rating = null;

  document.getElementById("typeFilter").value = "";
  document.getElementById("ratingFilter").value = "";

  updateUI();
});

// RANDOM
randomBtn.addEventListener("click", () => {
  const filtered = filterRestaurants(restaurants, state);
  pickRandom(filtered, highlightRestaurant, (r) => showDetails(r, API_KEY));
});

// UPDATE UI
function updateUI() {
  const filtered = filterRestaurants(restaurants, state);
  renderRestaurants(filtered, (r) => showDetails(r, API_KEY));
}