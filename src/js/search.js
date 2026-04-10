import { searchRestaurants } from "./api.js";

export async function handleSearch(query) {
  return await searchRestaurants(query);
}