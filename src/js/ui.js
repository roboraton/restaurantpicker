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

export function showDetails(r) {
  const details = document.getElementById("details");

  details.classList.remove("show");

  details.innerHTML = `
    <h2>${r.name || "Unknown name"}</h2>

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

  setTimeout(() => {
    details.classList.add("show");
  }, 50);

  details.scrollIntoView({ behavior: "smooth" });
}