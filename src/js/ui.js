import { generateMapHTML } from "./map.js";

export function renderRestaurants(data, showDetails) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  data.forEach(r => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${r.name}</h3>
      <p>${r.type} ⭐ ${r.rating}</p>
    `;

    div.addEventListener("click", () => showDetails(r));
    container.appendChild(div);
  });
}

export function highlightRestaurant(selected) {
  document.querySelectorAll("#results div").forEach(el => {
    el.classList.remove("highlight");
    if (el.innerText.includes(selected.name)) {
      el.classList.add("highlight");
    }
  });
}

export function showDetails(r, apiKey) {
  const details = document.getElementById("details");

  details.innerHTML = `
    <h2>${r.name}</h2>
    <p>${r.type}</p>

    <img src="${r.image}" style="width:100%; border-radius:8px;" />

    ${generateMapHTML(r, apiKey)}
  `;

  details.scrollIntoView({ behavior: "smooth" });
}