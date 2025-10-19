// Simple category filter for the video grid
// how it works: toggles .is-active on the button and shows items by data-cat
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#filters button');
  const items = document.querySelectorAll('#video-grid .video-card');

  function applyFilter(filter) {
    items.forEach(card => {
      const cat = card.getAttribute('data-cat');
      const show = filter === 'all' || filter === cat;
      card.hidden = !show; // native hidden attribute
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  });

  // default
  applyFilter('all');
});