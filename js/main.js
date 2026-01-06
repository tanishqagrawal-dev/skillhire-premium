
document.querySelectorAll('.counter').forEach(counter => {
  const target = +counter.dataset.target;
  let current = 0;
  const increment = target / 40;

  const update = () => {
    current += increment;
    if (current < target) {
      counter.innerText = Math.ceil(current);
      requestAnimationFrame(update);
    } else {
      counter.innerText = target;
    }
  };

  update();
});
