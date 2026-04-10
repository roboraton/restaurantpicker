// This module handles API calls to TheMealDB to search for restaurants (meals) based on a query.
export async function searchRestaurants(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.meals) return [];

  //  normalize the data to only include necessary fields
  return data.meals.map(meal => ({
    name: meal.strMeal,
    type: meal.strCategory,
    image: meal.strMealThumb
  }));
}

import { handleSearch } from "./search.js";
import { filterRestaurants } from "./filters.js";
import { pickRandom } from "./random.js";
import { renderRestaurants, highlightRestaurant, showDetails } from "./ui.js";

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

// SEARCH
button.addEventListener("click", async () => {
  restaurants = await handleSearch(input.value);
  updateUI();
});

// INPUT
input.addEventListener("input", (e) => {
  state.search = e.target.value;
  updateUI();
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