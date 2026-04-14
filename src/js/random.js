let animationInterval = null;

export function pickRandom(restaurants, highlightRestaurant, onSelected) {
  if (!restaurants || restaurants.length === 0) {
    return;
  }

  clearInterval(animationInterval);

  let currentIndex = 0;
  const sequence = [...restaurants];

  // mezcla simple para que la ruleta no siempre recorra igual
  for (let i = sequence.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
  }

  const finalRestaurant =
    sequence[Math.floor(Math.random() * sequence.length)];

  let steps = 0;
  const maxSteps = Math.min(18, Math.max(8, sequence.length * 2));

  animationInterval = setInterval(() => {
    const currentRestaurant = sequence[currentIndex % sequence.length];
    highlightRestaurant(currentRestaurant);

    currentIndex++;
    steps++;

    if (steps >= maxSteps) {
      clearInterval(animationInterval);
      highlightRestaurant(finalRestaurant);
      onSelected(finalRestaurant);
    }
  }, 120);
}