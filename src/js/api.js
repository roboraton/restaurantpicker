// This module handles API calls to TheMealDB to search for restaurants (meals) based on a query.
export async function searchRestaurants(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.meals) return [];

  //  normalize the data to only include necessary fields
  return data.meals.map(meal => ({
    name: meal.strMeal,
    category: meal.strCategory,
    image: meal.strMealThumb
  }));
}