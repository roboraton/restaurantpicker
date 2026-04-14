export async function searchRestaurants(query) {
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.meals) return [];

  //  ============> JSON de la API <=============
  return data.meals.map(meal => ({
    id: meal.idMeal,
    name: meal.strMeal,
    type: meal.strCategory,
    image: meal.strMealThumb,
    area: meal.strArea,
    instructions: meal.strInstructions,
    tags: meal.strTags,

    //  fake pero funcional
    rating: Math.floor(Math.random() * 5) + 1,
    price: Math.floor(Math.random() * 3) + 1
  }));
}

export async function getMealDetails(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.meals ? data.meals[0] : null;
}