const BTSSlider = {
    render() {
        return `
            <section class="section bts-section">
                <div class="section-header">· behind the scenes</div>
                
                <!-- Swiper Container -->
                <div class="swiper bts-swiper">
                    <div class="swiper-wrapper">
                        ${this.renderSliderItems()}
                    </div>
                    
                    <!-- Optional: Add subtle navigation (can be removed if you want pure auto-scroll) -->
                    <div class="swiper-button-next bts-nav"></div>
                    <div class="swiper-button-prev bts-nav"></div>
                </div>
            </section>
        `;
    },
    
    renderSliderItems() {
        const images = [
            { src: 'https://images.pexels.com/photos/16521619/pexels-photo-16521619.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Crane shot on set' },
            { src: 'https://images.pexels.com/photos/16453305/pexels-photo-16453305.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Drone operator' },
            { src: 'https://images.pexels.com/photos/17617336/pexels-photo-17617336.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Live worship recording' },
            { src: 'https://images.pexels.com/photos/17500625/pexels-photo-17500625.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Rhema Feast 2025' },
            { src: 'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Camera operator' },
            // Duplicate images for seamless loop (optional)
            { src: 'https://images.pexels.com/photos/16521619/pexels-photo-16521619.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Crane shot on set' },
            { src: 'https://images.pexels.com/photos/16453305/pexels-photo-16453305.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Drone operator' },
            { src: 'https://images.pexels.com/photos/17617336/pexels-photo-17617336.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Live worship recording' },
        ];
        
        return images.map(img => `
            <div class="swiper-slide">
                <div class="slider-item">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy">
                    <div class="slide-overlay">
                        <span class="slide-caption">${img.alt}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    init() {
        // Initialize Swiper with constant auto-scroll
        const btsSwiper = new Swiper('.bts-swiper', {
            // Auto-scroll settings
            autoplay: {
                delay: 0, // No delay between transitions
                disableOnInteraction: false, // Continue autoplay after user interaction
                pauseOnMouseEnter: false, // Don't pause on hover
                stopOnLastSlide: false, // Continue looping
                waitForTransition: false, // Don't wait for transition to complete
            },
            
            // Speed of transition (controls scroll speed)
            speed: 3000, // 3 seconds per slide transition
            
            // Continuous loop
            loop: true,
            loopAdditionalSlides: 5,
            
            // Number of slides to show
            slidesPerView: 'auto',
            spaceBetween: 20,
            
            // Free mode for smooth continuous scrolling
            freeMode: {
                enabled: true,
                momentum: false, // Disable momentum to maintain constant speed
                sticky: false,
            },
            
            // Disable interaction that could stop autoplay
            allowTouchMove: true, // Allow touch but autoplay continues
            simulateTouch: true,
            
            // No navigation (pure auto-scroll)
            navigation: false,
            pagination: false,
            
            // Responsive breakpoints
            breakpoints: {
                320: {
                    spaceBetween: 10,
                    speed: 2500,
                },
                768: {
                    spaceBetween: 15,
                    speed: 2800,
                },
                1024: {
                    spaceBetween: 20,
                    speed: 3000,
                }
            },
            
            // Ensure continuous flow
            loopedSlides: 10,
            
            // Disable any stopping events
            on: {
                init: function() {
                    // Force autoplay to start
                    this.autoplay.start();
                },
                touchStart: function() {
                    // Keep autoplay running even on touch
                    this.autoplay.start();
                },
                touchEnd: function() {
                    // Ensure autoplay continues
                    this.autoplay.start();
                }
            }
        });

        // Extra insurance: restart autoplay if it ever stops
        setInterval(() => {
            if (btsSwiper && btsSwiper.autoplay) {
                btsSwiper.autoplay.start();
            }
        }, 1000);
    }
};