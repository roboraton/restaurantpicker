let animationInterval = null;

export function pickRandom(filtered, highlight, showDetails) {
  if (!filtered.length) return alert("No results");

  let count = 0;
  clearInterval(animationInterval);

  animationInterval = setInterval(() => {
    const temp = filtered[Math.floor(Math.random() * filtered.length)];
    highlight(temp);
    count++;

    if (count > 15) {
      clearInterval(animationInterval);
      const selected = filtered[Math.floor(Math.random() * filtered.length)];
      highlight(selected);
      showDetails(selected);
    }
  }, 100);
}