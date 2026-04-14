// =====================
// IMPORTS
// =====================
import { addFavorite, getFavorites, removeFavorite } from "./favorites.js";
import { getHistory, clearHistory } from "./history.js";

// =====================
// RENDER RESULTS
// =====================
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

// =====================
// HIGHLIGHT (ruleta + ganador)
// =====================
export function highlightRestaurant(selected) {
  const cards = document.querySelectorAll("#results .result-card");

  cards.forEach((card) => {
    card.classList.remove("highlight");
    card.classList.remove("winner");

    const title = card.querySelector("h3")?.textContent?.trim();

    if (title === selected.name) {
      card.classList.add("highlight");
      card.classList.add("winner");

      setTimeout(() => {
        card.classList.remove("winner");
      }, 500);

      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

// =====================
// SHOW DETAILS
// =====================
export function showDetails(r) {
  const details = document.getElementById("details");

  details.classList.remove("show");

  details.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0;">${r.name || "Unknown name"}</h2>
      <button id="favBtn">❤️</button>
    </div>

    <p><strong>Type:</strong> ${r.type || "Not available"}</p>

    ${
      r.image
        ? `<img src="${r.image}" alt="${r.name}" style="width:100%; border-radius:8px; margin-top:10px;" />`
        : "<p>No image available</p>"
    }
  `;

  // FAVORITES
  document.getElementById("favBtn").addEventListener("click", () => {
    addFavorite(r);
    renderFavorites();
  });

  // HISTORY
  document.dispatchEvent(
    new CustomEvent("addToHistory", { detail: r })
  );

  setTimeout(() => {
    details.classList.add("show");
  }, 50);

  details.scrollIntoView({ behavior: "smooth" });
}

// =====================
// FAVORITES LIST
// =====================
export function renderFavorites() {
  const container = document.getElementById("favorites");
  const favs = getFavorites();

  container.innerHTML = "<h3>Favorites</h3>";

  if (favs.length === 0) {
    container.innerHTML += "<p>No favorites yet</p>";
    return;
  }

  favs.forEach((f) => {
    const div = document.createElement("div");
    div.className = "result-card pop-in";

    div.innerHTML = `
      <h4 style="margin:0;">${f.name}</h4>
      <p style="margin:2px 0; font-size:13px; color:#666;">
        ${f.type || "Unknown type"}
      </p>
      <button data-name="${f.name}">Remove</button>
    `;

    div.querySelector("button").addEventListener("click", (e) => {
      e.stopPropagation();

      const name = e.target.dataset.name;
      const card = e.target.closest(".result-card");

      card.classList.add("snap-out");

      let removed = false;

      const removeNow = () => {
        if (removed) return;
        removed = true;

        removeFavorite(name);
        renderFavorites();
      };

      card.addEventListener("animationend", removeNow, { once: true });

      setTimeout(removeNow, 600);
    });

    div.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("restaurantSelected", { detail: f })
      );
    });

    container.appendChild(div);
  });
}

// =====================
// HISTORY LIST
// =====================
export function renderHistory() {
  const container = document.getElementById("history");
  const history = getHistory();

  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>History</h3>
      <button id="clearHistoryBtn">Clear History</button>
    </div>
  `;

  if (history.length === 0) {
    container.innerHTML += "<p>No history yet</p>";
    return;
  }

  history.forEach((item) => {
    const div = document.createElement("div");
    div.className = "result-card pop-in";

    div.innerHTML = `<p>${item.name}</p>`;

    div.addEventListener("click", () => {
      document.dispatchEvent(
        new CustomEvent("restaurantSelected", { detail: item })
      );
    });

    container.appendChild(div);
  });

  document.getElementById("clearHistoryBtn").addEventListener("click", () => {
    const cards = container.querySelectorAll(".result-card");

    cards.forEach((card) => {
      card.classList.add("snap-out");
    });

    setTimeout(() => {
      clearHistory();
      renderHistory();
    }, 400);
  });
}