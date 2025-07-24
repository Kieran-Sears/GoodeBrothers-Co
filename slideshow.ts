// No hardcoded imageUrls

let imageUrls: string[] = [];
let current = 0;

function renderSlide(index: number): void {
  const container = document.getElementById('slide-container');
  if (!container) return;
  container.innerHTML = '';
  const img = document.createElement('img');
  img.src = imageUrls[index];
  img.alt = `Project photo ${index + 1}`;
  img.className = 'slide w-full h-auto max-h-[450px] rounded shadow';
  container.appendChild(img);
}

function showPrev(): void {
  current = (current - 1 + imageUrls.length) % imageUrls.length;
  renderSlide(current);
}
function showNext(): void {
  current = (current + 1) % imageUrls.length;
  renderSlide(current);
}

window.addEventListener('DOMContentLoaded', () => {
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  prev?.addEventListener('click', showPrev);
  next?.addEventListener('click', showNext);

  // Load URLs from urls.json
  fetch('./urls.json')
    .then(response => response.json())
    .then((data: string[]) => {
      imageUrls = data;
      if (imageUrls.length) renderSlide(0);
    })
    .catch(err => {
      // fallback or error handling
      console.error("Failed to load urls.json", err);
    });
});
