const IMAGE_COUNT = 280; // Replace with your actual image count!
const IMAGE_EXT = 'jpg'; // Change to 'png' etc. if needed

let current = 0;

function renderSlide(index: number): void {
  const container = document.getElementById('slide-container');
  if (!container) return;
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = `assets/${index}.${IMAGE_EXT}`;
  img.alt = `Project photo ${index + 1}`;
  img.className = 'slide w-full h-auto max-h-[450px] rounded shadow';
  container.appendChild(img);
}

function showPrev(): void {
  current = (current - 1 + IMAGE_COUNT) % IMAGE_COUNT;
  renderSlide(current);
}
function showNext(): void {
  current = (current + 1) % IMAGE_COUNT;
  renderSlide(current);
}

window.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  prev?.addEventListener('click', showPrev);
  next?.addEventListener('click', showNext);

  renderSlide(0);
});
