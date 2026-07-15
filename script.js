/**
 * LUMINA GALLERY - MODERN IMAGE GALLERY
 * JavaScript Controller
 * =============================
 */

// ============================================
// CONFIGURATION & DATA
// ============================================

const galleryData = [
    { id: 1, title: "Mountain Sunrise", category: "nature", src: "images/mountain-sunrise.jpg", thumb: "images/mountain-sunrise-thumb.jpg" },
    { id: 2, title: "Urban Architecture", category: "architecture", src: "images/urban-architecture.jpg", thumb: "images/urban-architecture-thumb.jpg" },
    { id: 3, title: "Golden Retriever", category: "animals", src: "images/golden-retriever.jpg", thumb: "images/golden-retriever-thumb.jpg" },
    { id: 4, title: "Tokyo Nights", category: "cities", src: "images/tokyo-nights.jpg", thumb: "images/tokyo-nights-thumb.jpg" },
    { id: 5, title: "Forest Path", category: "nature", src: "images/forest-path.jpg", thumb: "images/forest-path-thumb.jpg" },
    { id: 6, title: "Abstract Circuit", category: "technology", src: "images/abstract-circuit.jpg", thumb: "images/abstract-circuit-thumb.jpg" },
    { id: 7, title: "Lions Pride", category: "animals", src: "images/lions-pride.jpg", thumb: "images/lions-pride-thumb.jpg" },
    { id: 8, title: "Modern Building", category: "architecture", src: "images/modern-building.jpg", thumb: "images/modern-building-thumb.jpg" },
    { id: 9, title: "Northern Lights", category: "nature", src: "images/northern-lights.jpg", thumb: "images/northern-lights-thumb.jpg" },
    { id: 10, title: "Neon City", category: "cities", src: "images/neon-city.jpg", thumb: "images/neon-city-thumb.jpg" },
    { id: 11, title: "Microchip Detail", category: "technology", src: "images/microchip-detail.jpg", thumb: "images/microchip-detail-thumb.jpg" },
    { id: 12, title: "Eiffel Tower", category: "cities", src: "images/eiffel-tower.jpg", thumb: "images/eiffel-tower-thumb.jpg" },
    { id: 13, title: "Ocean Waves", category: "nature", src: "images/ocean-waves.jpg", thumb: "images/ocean-waves-thumb.jpg" },
    { id: 14, title: "Workspace Setup", category: "technology", src: "images/workspace-setup.jpg", thumb: "images/workspace-setup-thumb.jpg" },
    { id: 15, title: "Tropical Beach", category: "nature", src: "images/tropical-beach.jpg", thumb: "images/tropical-beach-thumb.jpg" },
    { id: 16, title: "Glass Facade", category: "architecture", src: "images/glass-facade.jpg", thumb: "images/glass-facade-thumb.jpg" },
    { id: 17, title: "Red Fox", category: "animals", src: "images/red-fox.jpg", thumb: "images/red-fox-thumb.jpg" },
    { id: 18, title: "VR Headset", category: "technology", src: "images/vr-headset.jpg", thumb: "images/vr-headset-thumb.jpg" }
];

// ============================================
// DOM ELEMENTS
// ============================================

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxCounter = document.getElementById('lightboxCounter');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');
const emptyState = document.getElementById('emptyState');
const loading = document.getElementById('loading');
const backToTop = document.getElementById('backToTop');
const themeToggle = document.getElementById('themeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');

// ============================================
// STATE
// ============================================

let currentFilter = 'all';
let currentSearch = '';
let currentImageIndex = 0;
let filteredImages = [...galleryData];
let isDarkTheme = false;

// ============================================
// INITIALIZATION
// ============================================

function init() {
    loadTheme();
    renderGallery();
    setupEventListeners();
    hideLoading();
}

function hideLoading() {
    setTimeout(() => {
        loading.style.display = 'none';
    }, 800);
}

// ============================================
// GALLERY RENDERING
// ============================================

function renderGallery() {
    // Filter images
    filteredImages = galleryData.filter(image => {
        const matchesFilter = currentFilter === 'all' || image.category === currentFilter;
        const matchesSearch = image.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                             image.category.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Show empty state if no images
    if (filteredImages.length === 0) {
        gallery.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Create gallery items
    gallery.innerHTML = filteredImages.map((image, index) => `
        <div class="gallery-item" 
             data-index="${index}" 
             data-id="${image.id}"
             style="animation-delay: ${index * 0.05}s"
             onclick="openLightbox(${index})">
             <img src="${image.thumb}" 
                  alt="${image.title}" 
                  loading="lazy"
                  onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22><rect fill=%22%23ddd%22 width=%22600%22 height=%22400%22/><text fill=%22%23999%22 x=%22300%22 y=%22200%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2220%22>${encodeURIComponent(image.title)}</text></svg>'">
            <div class="gallery-item-overlay">
                <h3 class="gallery-item-title">${image.title}</h3>
                <span class="gallery-item-category">${image.category}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// LIGHTBOX
// ============================================

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const image = filteredImages[currentImageIndex];
    if (!image) return;

    lightboxImage.src = image.src;
    lightboxImage.alt = image.title;
    lightboxCaption.textContent = image.title;
    lightboxCategory.textContent = image.category;
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${filteredImages.length}`;

    // Preload adjacent images
    preloadAdjacentImages();
}

function preloadAdjacentImages() {
    const prevIndex = currentImageIndex - 1;
    const nextIndex = currentImageIndex + 1;

    if (prevIndex >= 0 && filteredImages[prevIndex]) {
        const img = new Image();
        img.src = filteredImages[prevIndex].src;
    }

    if (nextIndex < filteredImages.length && filteredImages[nextIndex]) {
        const img = new Image();
        img.src = filteredImages[nextIndex].src;
    }
}

function nextImage() {
    if (currentImageIndex < filteredImages.length - 1) {
        currentImageIndex++;
        updateLightboxImage();
        animateLightboxImage();
    }
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxImage();
        animateLightboxImage();
    }
}

function animateLightboxImage() {
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.95)';
    setTimeout(() => {
        lightboxImage.style.transition = 'all 0.3s ease';
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 50);
}

// ============================================
// SEARCH & FILTER
// ============================================

function handleSearch(e) {
    currentSearch = e.target.value.trim();
    searchClear.classList.toggle('visible', currentSearch.length > 0);
    renderGallery();
}

function clearSearch() {
    searchInput.value = '';
    currentSearch = '';
    searchClear.classList.remove('visible');
    renderGallery();
    searchInput.focus();
}

function handleFilter(filter) {
    currentFilter = filter;
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderGallery();
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    localStorage.setItem('lumina-theme', isDarkTheme ? 'dark' : 'light');
    
    const icon = themeToggle.querySelector('.theme-icon');
    icon.textContent = isDarkTheme ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('lumina-theme');
    if (savedTheme === 'dark') {
        isDarkTheme = true;
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.querySelector('.theme-icon').textContent = '☀️';
    }
}

// ============================================
// BACK TO TOP
// ============================================

function handleScroll() {
    const scrollY = window.scrollY;
    backToTop.classList.toggle('visible', scrollY > 500);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);
    searchClear.addEventListener('click', clearSearch);

    // Filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn.dataset.filter));
    });

    // Lightbox
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxNext').addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
    document.getElementById('lightboxPrev').addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    // Close lightbox on backdrop click
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Back to top
    backToTop.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);

    // Touch swipe for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }
}

function handleKeydown(e) {
    // Lightbox keyboard navigation
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowRight':
            nextImage();
            break;
        case 'ArrowLeft':
            prevImage();
            break;
    }

    // Global shortcuts
    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
    }

    if (e.key === 't' && e.ctrlKey) {
        e.preventDefault();
        toggleTheme();
    }
}

// ============================================
// LAZY LOADING ENHANCEMENT
// ============================================

function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px 0px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// PERFORMANCE: IMAGE PRELOADING
// ============================================

function preloadImages() {
    galleryData.forEach(image => {
        const img = new Image();
        img.src = image.src;
    });
}

// ============================================
// START APPLICATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    init();
    preloadImages();
    setupLazyLoading();
});
