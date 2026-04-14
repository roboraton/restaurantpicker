const STORAGE_KEY = "history";
const MAX_ITEMS = 10; // límite de elementos en el historial

export function getHistory() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addToHistory(restaurant) {
  let history = getHistory();

  //  evitar duplicados (mueve al frente)
  history = history.filter(item => item.name !== restaurant.name);

  history.unshift(restaurant);

  //  limitar tamaño
  if (history.length > MAX_ITEMS) {
    history = history.slice(0, MAX_ITEMS);
  }

  saveHistory(history);
}

export function clearHistory() {
  localStorage.removeItem("history");
}