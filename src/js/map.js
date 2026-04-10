export function generateMapHTML(restaurant, apiKey) {
  const query = encodeURIComponent(restaurant.name);

  return `
    <iframe
      width="100%"
      height="300"
      style="border:0"
      loading="lazy"
      src="https://www.google.com/maps/embed/v1/search?key=${apiKey}&q=${query}">
    </iframe>
  `;
}