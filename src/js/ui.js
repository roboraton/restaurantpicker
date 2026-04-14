// =====================
// IMPORTS
// =====================
import { addFavorite, getFavorites, removeFavorite } from "./favorites.js";
import { getHistory, clearHistory } from "./history.js";
import { getMealDetails } from "./api.js";

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

      <p style="font-size:12px; color:#666; margin:2px 0;">
        ${r.type || "Unknown type"}
      </p>

      <p style="font-size:12px; color:#999; margin:0;">
        ⭐ ${r.rating ?? "-"} | ${"$".repeat(r.price ?? 1)}
      </p>
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
// HIGHLIGHT
// =====================
export function highlightRestaurant(selected) {
  const cards = document.querySelectorAll("#results .result-card");

  cards.forEach((card) => {
    card.classList.remove("highlight", "winner");

    const title = card.querySelector("h3")?.textContent?.trim();

    if (title === selected.name) {
      card.classList.add("highlight", "winner");

      setTimeout(() => {
        card.classList.remove("winner");
      }, 500);

      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

// =====================
// SHOW DETAILS (CON FLIP)
// =====================
export async function showDetails(r) {
  const details = document.getElementById("details");

  details.classList.remove("show");

  const full = await getMealDetails(r.id);

  details.innerHTML = `
    <div class="card-flip">
      <div class="card-inner">

        <!-- FRONT -->
        <div class="card-front">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0;">${r.name}</h2>
            <button id="favBtn">❤️</button>
          </div>

          <p><strong>Type:</strong> ${r.type || "Not available"}</p>

          ${
            r.image
              ? `<img src="${r.image}" style="width:100%; border-radius:8px; margin-top:10px;" />`
              : ""
          }
        </div>

        <!-- BACK -->
        <div class="card-back">
          ${
            full?.strInstructions
              ? `<p style="font-size:13px; color:#555;">
                  ${full.strInstructions.substring(0, 200)}...
                 </p>`
              : "<p>No details available</p>"
          }
        </div>

      </div>
    </div>
  `;

  // FAVORITES
  const favBtn = document.getElementById("favBtn");
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      addFavorite(r);
      renderFavorites();
    });
  }

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
// FAVORITES
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
      <h4>${f.name}</h4>
      <p style="font-size:13px; color:#666;">${f.type || ""}</p>
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
// HISTORY
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

  const btn = document.getElementById("clearHistoryBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      const cards = container.querySelectorAll(".result-card");

      cards.forEach((card) => card.classList.add("snap-out"));

      setTimeout(() => {
        clearHistory();
        renderHistory();
      }, 400);
    });
  }
}