import { searchRestaurants } from "./js/api.js";
import { renderResults } from "./js/ui.js";

const button = document.querySelector("#searchBtn");
const input = document.querySelector("#searchInput");

button.addEventListener("click", async () => {
  const data = await searchRestaurants(input.value);
  renderResults(data);
});