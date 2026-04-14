export function filterRestaurants(restaurants, state) {
  return restaurants.filter(r => {

    const matchType = state.filters.type
      ? r.name.toLowerCase().includes(state.filters.type.toLowerCase())
      : true;

    const matchRating = state.filters.rating
      ? (r.rating || 5) >= state.filters.rating
      : true;

    return matchType && matchRating;
  });
}