const filters = document.querySelectorAll('[data-filter]');
const papers = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  papers.forEach(paper => {
    paper.hidden = category !== 'all' && paper.dataset.category !== category;
    if (!paper.hidden) count++;
  });
  document.querySelector('#filter-status').textContent = `Showing ${count} ${count === 1 ? 'paper' : 'papers'}`;
}));
