const STORAGE_KEY = "favorites";

export function getFavorites() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

export function addFavorite(restaurant) {
  const favs = getFavorites();

  const exists = favs.some(f => f.name === restaurant.name);
  if (exists) return;

  favs.push(restaurant);
  saveFavorites(favs);
}

export function removeFavorite(name) {
  const favs = getFavorites().filter(f => f.name !== name);
  saveFavorites(favs);
}