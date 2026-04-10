export function filterRestaurants(restaurants, state) {
  return restaurants.filter(r => {
    return (
      r.name.toLowerCase().includes(state.search.toLowerCase()) &&
      (!state.filters.type || r.type === state.filters.type) &&
      (!state.filters.rating || r.rating >= state.filters.rating)
    );
  });
}