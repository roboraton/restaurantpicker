export function renderResults(data) {
  const container = document.querySelector("#results");

  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  data.forEach((meal) => {
    container.innerHTML += `<p>${meal.name}</p>`;
  });
}