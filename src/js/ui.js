export function renderRestaurants(data, onClick) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  data.forEach((r) => {
    const div = document.createElement("div");
    div.className = "result-card";

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p>${r.type || "Unknown type"}</p>
    `;

    div.addEventListener("click", () => {
      onClick(r);

      document.dispatchEvent(
        new CustomEvent("restaurantSelected", { detail: r })
      );
    });

    container.appendChild(div);
  });
}

export function highlightRestaurant(selected) {
  const cards = document.querySelectorAll("#results .result-card");

  cards.forEach((card) => {
    card.classList.remove("highlight");

    const title = card.querySelector("h3")?.textContent?.trim();
    if (title === selected.name) {
      card.classList.add("highlight");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

import { addFavorite } from "./favorites.js";
document.dispatchEvent(new Event("favoritesUpdated")); // Para actualizar la sección de favoritos al cargar la página

export function showDetails(r) {
  const details = document.getElementById("details");

  details.classList.remove("show");

  details.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0;">${r.name || "Unknown name"}</h2>
      <button id="favBtn">❤️</button>
    </div>

    <p><strong>Type:</strong> ${r.type || "Not available"}</p>
    <p><strong>Rating:</strong> ${r.rating || "Not available"}</p>
    <p><strong>Address:</strong> ${r.address || "Not available"}</p>
    <p><strong>Open/Close:</strong> ${r.hours || "Not available"}</p>

    ${
      r.image
        ? `<img src="${r.image}" alt="${r.name}" style="width:100%; border-radius:8px; margin-top:10px;" />`
        : "<p>No image available</p>"
    }
  `;

  document.getElementById("favBtn").addEventListener("click", () => {
    addFavorite(r);
    alert("Added to favorites")
    renderFavorites();
  });

  setTimeout(() => {
    details.classList.add("show");
  }, 50);

  details.scrollIntoView({ behavior: "smooth" });
}

import { getFavorites, removeFavorite } from "./favorites.js";

export function renderFavorites() {
  const container = document.getElementById("favorites");
  const favs = getFavorites();

  container.innerHTML = "<h3>⭐ Favorites</h3>";

  if (favs.length === 0) {
    container.innerHTML += "<p>No favorites yet</p>";
    return;
  }

  favs.forEach(f => {
    const div = document.createElement("div");
    div.className = "result-card";

    div.innerHTML = `
      <p>${f.name}</p>
      <button data-name="${f.name}">Remove</button>
    `;

    div.querySelector("button").addEventListener("click", (e) => {
      removeFavorite(e.target.dataset.name);
      renderFavorites(); 
    });

    container.appendChild(div);
  });
}