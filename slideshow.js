// Enhanced Professional Slideshow
class ProfessionalSlideshow {
  constructor() {
    this.IMAGE_COUNT = 280;
    this.IMAGE_EXT = 'jpg';
    this.current = 0;
    this.isPlaying = false;
    this.playInterval = null;
    this.autoPlayDelay = 4000; // 4 seconds
    this.thumbnailCount = 5; // Number of thumbnails to show
    
    this.init();
  }

  init() {
    this.container = document.getElementById('slide-container');
    this.counter = document.getElementById('slide-counter');
    this.loading = document.getElementById('loading');
    this.prevBtn = document.getElementById('prev');
    this.nextBtn = document.getElementById('next');
    this.playPauseBtn = document.getElementById('play-pause');
    this.playIcon = document.getElementById('play-icon');
    this.pauseIcon = document.getElementById('pause-icon');
    this.thumbnailStrip = document.getElementById('thumbnail-strip');

    if (!this.container) return;

    this.bindEvents();
    this.generateThumbnails();
    this.renderSlide(0);
    this.updateCounter();
    this.hideLoading();
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.showPrev());
    this.nextBtn?.addEventListener('click', () => this.showNext());
    this.playPauseBtn?.addEventListener('click', () => this.togglePlayPause());
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.showPrev();
      if (e.key === 'ArrowRight') this.showNext();
      if (e.key === ' ') {
        e.preventDefault();
        this.togglePlayPause();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    this.container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  handleSwipe(startX, endX) {
    const minSwipeDistance = 50;
    const swipeDistance = startX - endX;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        this.showNext();
      } else {
        this.showPrev();
      }
    }
  }

  renderSlide(index, direction = 'none') {
    if (!this.container) return;
    
    this.showLoading();
    
    // Create new image
    const img = document.createElement('img');
    img.src = `assets/${index}.${this.IMAGE_EXT}`;
    img.alt = `Project photo ${index + 1}`;
    img.className = 'absolute inset-0 w-full h-full object-cover transition-all duration-500';
    
    // Add loading state
    img.style.opacity = '0';
    img.style.transform = direction === 'next' ? 'translateX(100%)' : 
                         direction === 'prev' ? 'translateX(-100%)' : 'scale(1.1)';

    // Handle image load
    img.onload = () => {
      this.hideLoading();
      
      // Animate in
      requestAnimationFrame(() => {
        img.style.opacity = '1';
        img.style.transform = 'translateX(0) scale(1)';
      });
      
      // Remove old images after animation
      setTimeout(() => {
        const oldImages = this.container.querySelectorAll('img');
        oldImages.forEach((oldImg, i) => {
          if (oldImg !== img) {
            oldImg.style.opacity = '0';
            oldImg.style.transform = direction === 'next' ? 'translateX(-100%)' : 
                                   direction === 'prev' ? 'translateX(100%)' : 'scale(0.9)';
            setTimeout(() => oldImg.remove(), 500);
          }
        });
      }, 50);
    };

    img.onerror = () => {
      this.hideLoading();
      // Show placeholder for missing images
      this.showPlaceholder(index);
    };

    this.container.appendChild(img);
    this.updateThumbnails();
  }

  showPlaceholder(index) {
    const placeholder = document.createElement('div');
    placeholder.className = 'absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center';
    placeholder.innerHTML = `
      <div class="text-center text-white">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p class="text-lg font-medium">Project Image ${index + 1}</p>
        <p class="text-sm opacity-75">Image coming soon</p>
      </div>
    `;
    this.container.appendChild(placeholder);
  }

  generateThumbnails() {
    if (!this.thumbnailStrip) return;
    
    // Generate thumbnails around current image
    this.updateThumbnails();
  }

  updateThumbnails() {
    if (!this.thumbnailStrip) return;
    
    this.thumbnailStrip.innerHTML = '';
    
    const start = Math.max(0, this.current - Math.floor(this.thumbnailCount / 2));
    const end = Math.min(this.IMAGE_COUNT, start + this.thumbnailCount);
    
    for (let i = start; i < end; i++) {
      const thumb = document.createElement('div');
      thumb.className = `w-16 h-12 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        i === this.current ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
      }`;
      
      const thumbImg = document.createElement('img');
      thumbImg.src = `assets/${i}.${this.IMAGE_EXT}`;
      thumbImg.alt = `Thumbnail ${i + 1}`;
      thumbImg.className = 'w-full h-full object-cover';
      
      thumbImg.onerror = () => {
        thumb.innerHTML = `
          <div class="w-full h-full bg-gray-600 flex items-center justify-center">
            <span class="text-xs text-white">${i + 1}</span>
          </div>
        `;
      };
      
      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', () => this.goToSlide(i));
      this.thumbnailStrip.appendChild(thumb);
    }
  }

  showPrev() {
    this.current = (this.current - 1 + this.IMAGE_COUNT) % this.IMAGE_COUNT;
    this.renderSlide(this.current, 'prev');
    this.updateCounter();
  }

  showNext() {
    this.current = (this.current + 1) % this.IMAGE_COUNT;
    this.renderSlide(this.current, 'next');
    this.updateCounter();
  }

  goToSlide(index) {
    if (index === this.current) return;
    
    const direction = index > this.current ? 'next' : 'prev';
    this.current = index;
    this.renderSlide(this.current, direction);
    this.updateCounter();
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.isPlaying = true;
    this.playIcon.classList.add('hidden');
    this.pauseIcon.classList.remove('hidden');
    
    this.playInterval = setInterval(() => {
      this.showNext();
    }, this.autoPlayDelay);
  }

  pause() {
    this.isPlaying = false;
    this.pauseIcon.classList.add('hidden');
    this.playIcon.classList.remove('hidden');
    
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }

  updateCounter() {
    if (this.counter) {
      this.counter.textContent = `${this.current + 1} / ${this.IMAGE_COUNT}`;
    }
  }

  showLoading() {
    if (this.loading) {
      this.loading.classList.remove('hidden');
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.classList.add('hidden');
    }
  }
}

// Initialize slideshow when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfessionalSlideshow();
});

// Preload next few images for smoother experience
function preloadImages(currentIndex, count = 3) {
  for (let i = 1; i <= count; i++) {
    const nextIndex = (currentIndex + i) % 280;
    const img = new Image();
    img.src = `assets/${nextIndex}.jpg`;
  }
}

// Add intersection observer for slideshow section
const slideshowObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Preload some images when slideshow comes into view
      preloadImages(0, 5);
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const slideshowSection = document.getElementById('portfolio');
  if (slideshowSection) {
    slideshowObserver.observe(slideshowSection);
  }
});
