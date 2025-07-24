// No hardcoded imageUrls
let imageUrls = [];
let current = 0;
function renderSlide(index) {
    const container = document.getElementById('slide-container');
    if (!container)
        return;
    container.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageUrls[index];
    img.alt = `Project photo ${index + 1}`;
    img.className = 'slide w-full h-auto max-h-[450px] rounded shadow';
    container.appendChild(img);
}
function showPrev() {
    current = (current - 1 + imageUrls.length) % imageUrls.length;
    renderSlide(current);
}
function showNext() {
    current = (current + 1) % imageUrls.length;
    renderSlide(current);
}
window.addEventListener('DOMContentLoaded', () => {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    prev === null || prev === void 0 ? void 0 : prev.addEventListener('click', showPrev);
    next === null || next === void 0 ? void 0 : next.addEventListener('click', showNext);
    // Load URLs from urls.json
    fetch('./urls.json')
        .then(response => response.json())
        .then((data) => {
        imageUrls = data;
        if (imageUrls.length)
            renderSlide(0);
    })
        .catch(err => {
        // fallback or error handling
        console.error("Failed to load urls.json", err);
    });
});
