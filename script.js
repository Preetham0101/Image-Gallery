// Enhanced Gallery with Filters JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Gallery with Lightbox initialized!');
    
    // DOM Elements
    const galleries = document.querySelectorAll('.gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Store all gallery images for navigation
    const galleryImages = [];
    let currentImageIndex = 0;
    let visibleGalleries = [];
    
    // Initialize gallery images array
    function initGallery() {
        galleries.forEach(gallery => {
            const img = gallery.querySelector('img');
            const description = gallery.querySelector('.description').textContent;
            const category = gallery.getAttribute('data-category');
            
            galleryImages.push({
                src: img.getAttribute('data-full') || img.src,
                alt: img.alt,
                description: description,
                category: category,
                element: gallery
            });
            
            // Add click event to open lightbox
            gallery.addEventListener('click', function() {
                const imgIndex = galleryImages.findIndex(item => 
                    item.element === gallery
                );
                
                currentImageIndex = imgIndex;
                openLightbox(imgIndex);
            });
        });
        
        // Initialize visible galleries with all galleries
        updateVisibleGalleries('all');
    }
    
    // Update visible galleries based on filter
    function updateVisibleGalleries(filter) {
        visibleGalleries = [];
        
        if (filter === 'all') {
            visibleGalleries = [...galleryImages];
            galleries.forEach(gallery => {
                gallery.style.display = 'block';
                // Add entrance animation
                animateGalleryEntrance(gallery);
            });
        } else {
            galleries.forEach((gallery, index) => {
                const category = gallery.getAttribute('data-category');
                if (category === filter) {
                    gallery.style.display = 'block';
                    visibleGalleries.push(galleryImages[index]);
                    // Add entrance animation
                    animateGalleryEntrance(gallery);
                } else {
                    gallery.style.display = 'none';
                }
            });
        }
    }
    
    // Animate gallery entrance with slight delay
    function animateGalleryEntrance(gallery) {
        gallery.style.opacity = '0';
        gallery.style.transform = 'translateY(20px)';
        setTimeout(() => {
            gallery.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            gallery.style.opacity = '1';
            gallery.style.transform = 'translateY(0)';
        }, Math.random() * 200);
    }
    
    // Open lightbox with specified image
    function openLightbox(index) {
        if (index >= 0 && index < galleryImages.length) {
            const image = galleryImages[index];
            
            // Create a new image to preload and ensure dimensions
            const preloadImg = new Image();
            preloadImg.onload = function() {
                // Set image source and alt text after preloading
                lightboxImg.src = image.src;
                lightboxImg.alt = image.alt;
                lightboxCaption.textContent = image.description;
                
                // Ensure consistent sizing regardless of image dimensions
                lightboxImg.style.width = '80%';
                lightboxImg.style.height = 'auto';
                
                // Display the lightbox with animation
                lightbox.style.display = 'block';
                setTimeout(() => {
                    lightbox.classList.add('show');
                    setTimeout(() => {
                        lightboxImg.classList.add('show');
                        lightboxCaption.classList.add('show');
                    }, 100);
                }, 10);
            };
            preloadImg.src = image.src;
            
            // Update current image index
            currentImageIndex = index;
            
            // Handle keyboard navigation
            document.addEventListener('keydown', handleKeyboardNavigation);
        }
    }
    
    // Close lightbox with animation
    function closeLightbox() {
        lightboxImg.classList.remove('show');
        lightboxCaption.classList.remove('show');
        
        setTimeout(() => {
            lightbox.classList.remove('show');
            setTimeout(() => {
                lightbox.style.display = 'none';
            }, 300);
        }, 100);
        
        document.removeEventListener('keydown', handleKeyboardNavigation);
    }
    
    // Navigate to next image
    function nextImage() {
        // Find next visible image
        let nextIndex = findNextVisibleIndex();
        openLightbox(nextIndex);
    }
    
    // Find next visible image index
    function findNextVisibleIndex() {
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        if (currentFilter === 'all') {
            let nextIndex = currentImageIndex + 1;
            return nextIndex >= galleryImages.length ? 0 : nextIndex;
        }
        
        // Find the next image with matching category
        let index = currentImageIndex;
        do {
            index = (index + 1) % galleryImages.length;
        } while (index !== currentImageIndex && galleryImages[index].category !== currentFilter);
        
        return index;
    }
    
    // Navigate to previous image
    function prevImage() {
        // Find previous visible image
        let prevIndex = findPrevVisibleIndex();
        openLightbox(prevIndex);
    }
    
    // Find previous visible image index
    function findPrevVisibleIndex() {
        const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        if (currentFilter === 'all') {
            let prevIndex = currentImageIndex - 1;
            return prevIndex < 0 ? galleryImages.length - 1 : prevIndex;
        }
        
        // Find the previous image with matching category
        let index = currentImageIndex;
        do {
            index = (index - 1 + galleryImages.length) % galleryImages.length;
        } while (index !== currentImageIndex && galleryImages[index].category !== currentFilter);
        
        return index;
    }
    
    // Handle keyboard navigation
    function handleKeyboardNavigation(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            nextImage();
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            prevImage();
        } else if (e.key === 'Escape' || e.key === 'Esc') {
            closeLightbox();
        }
    }
    
    // Set up filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update gallery based on filter
            const filter = this.getAttribute('data-filter');
            updateVisibleGalleries(filter);
        });
    });
    
    // Event Listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Initial setup: create images folder if it doesn't exist
    checkImagesFolder();
    
    // Initialize gallery
    initGallery();
    
    // Initialize with all galleries visible
    galleries.forEach(gallery => {
        animateGalleryEntrance(gallery);
    });
});

// Function to check if images folder exists and create placeholder images if needed
async function checkImagesFolder() {
    try {
        const categories = ['vegetables', 'soups', 'pizzas'];
        const imageNames = ['salad.jpg', 'soup.jpg', 'pizza.jpg', 'salad2.jpg', 'soup2.jpg', 'pizza2.jpg'];
        
        // For demonstration purposes - in a real app, you'd use actual images
        console.log('Ready to display images from the images/ folder');
        console.log('Make sure to add image files to the images/ folder for proper display');
    } catch (error) {
        console.error('Error checking images folder:', error);
    }
} 