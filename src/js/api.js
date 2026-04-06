async function searchRestaurants(query) {
  const response = await fetch("API_URL");
  const data = await response.json();
  return data;
}