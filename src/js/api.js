export async function searchRestaurants(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.meals) return [];

  return data.meals.map(meal => ({
    name: meal.strMeal,
    type: meal.strCategory,
    image: meal.strMealThumb
  }));
}