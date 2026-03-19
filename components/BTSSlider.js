const BTSSlider = {
    render() {
        return `
            <section class="section bts-section">
                <div class="section-header">· behind the scenes</div>
                
                <!-- Swiper Container -->
                <div class="swiper bts-swiper">
                    <div class="swiper-wrapper">
                        ${this.renderSlides()}
                    </div>
                    
                    <!-- Swiper Navigation -->
                    <div class="swiper-button-prev bts-swiper-button"></div>
                    <div class="swiper-button-next bts-swiper-button"></div>
                    
                    <!-- Swiper Pagination -->
                    <div class="swiper-pagination bts-swiper-pagination"></div>
                </div>
            </section>
        `;
    },
    
    renderSlides() {
        // Define columns/slides with varying heights but consistent widths
        const slides = [
            {
                width: 'normal',
                images: [
                    { src: 'https://picsum.photos/600/800?random=1', text: 'CRANE SHOT', height: '60' },
                    { src: 'https://picsum.photos/600/400?random=2', text: 'DRONE OP', height: '40' }
                ]
            },
            {
                width: 'wide',
                images: [
                    { src: 'https://picsum.photos/600/900?random=3', text: 'LIVE RECORDING', height: '70' },
                    { src: 'https://picsum.photos/600/500?random=4', text: 'RHEMA FEAST', height: '30' }
                ]
            },
            {
                width: 'normal',
                images: [
                    { src: 'https://picsum.photos/600/700?random=5', text: 'CAMERA OP', height: '55' },
                    { src: 'https://picsum.photos/600/600?random=6', text: 'DIRECTOR', height: '45' }
                ]
            },
            {
                width: 'narrow',
                images: [
                    { src: 'https://picsum.photos/500/700?random=7', text: 'LIGHTING', height: '65' },
                    { src: 'https://picsum.photos/500/500?random=8', text: 'SOUND', height: '35' }
                ]
            },
            {
                width: 'normal',
                images: [
                    { src: 'https://picsum.photos/600/750?random=9', text: 'CAMERA DOLLY', height: '50' },
                    { src: 'https://picsum.photos/600/550?random=10', text: 'DRONE SHOT', height: '50' }
                ]
            },
            {
                width: 'wide',
                images: [
                    { src: 'https://picsum.photos/600/850?random=11', text: 'CHOIR', height: '75' },
                    { src: 'https://picsum.photos/600/450?random=12', text: 'STAGE', height: '25' }
                ]
            },
            {
                width: 'normal',
                images: [
                    { src: 'https://picsum.photos/600/720?random=13', text: 'BTS', height: '40' },
                    { src: 'https://picsum.photos/600/580?random=14', text: 'PRODUCTION', height: '60' }
                ]
            },
            {
                width: 'narrow',
                images: [
                    { src: 'https://picsum.photos/500/680?random=15', text: 'LIGHT DESIGN', height: '55' },
                    { src: 'https://picsum.photos/500/520?random=16', text: 'AUDIO MIX', height: '45' }
                ]
            }
        ];
        
        return slides.map((slide, index) => `
            <div class="swiper-slide">
                <div class="bts-slide-content ${slide.width}">
                    ${slide.images.map((img, imgIndex) => `
                        <div class="bts-slide-item" 
                             data-rotation="${this.getRandomRotation()}"
                             data-height="${img.height}"
                             style="flex: 0 0 ${img.height}%; height: ${img.height}%;">
                            <img src="${img.src}" alt="${img.text}" loading="lazy">
                            <div class="bts-slide-overlay">
                                <span class="bts-slide-caption">${img.text}</span>
                                <span class="bts-slide-number">${String(index + 1).padStart(2, '0')}.${String(imgIndex + 1).padStart(2, '0')}</span>
                            </div>
                            <div class="bts-slide-pattern"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    },
    
    getRandomRotation() {
        // Generate random rotation between -8 and 8 degrees
        const rotations = [-8, -6, -4, -2, 2, 4, 6, 8];
        return rotations[Math.floor(Math.random() * rotations.length)];
    },
    
    init() {
        // Initialize Swiper
        const btsSwiper = new Swiper('.bts-swiper', {
            // Core settings
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
            loop: true,
            speed: 800,
            
            // Auto-scroll settings
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            
            // Navigation
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // Pagination
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Free mode for smooth scrolling
            freeMode: {
                enabled: true,
                momentum: true,
                momentumRatio: 0.5,
                momentumVelocityRatio: 0.5,
            },
            
            // Responsive breakpoints
            breakpoints: {
                320: {
                    spaceBetween: 15,
                    slidesPerView: 'auto',
                },
                768: {
                    spaceBetween: 20,
                    slidesPerView: 'auto',
                },
                1024: {
                    spaceBetween: 30,
                    slidesPerView: 'auto',
                }
            },
            
            // Mousewheel control
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
            },
            
            // Keyboard control
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Touch settings
            touchRatio: 1.5,
            touchAngle: 45,
            grabCursor: true,
            
            // Effect
            effect: 'slide',
            
            // Callbacks
            on: {
                init: function() {
                },
                slideChange: function() {
                    // Optional: Add any effects on slide change
                }
            }
        });
        
        // Add hover rotation effect
        const slides = document.querySelectorAll('.bts-slide-item');
        slides.forEach((slide) => {
            // Get the pre-generated rotation value
            const rotation = slide.dataset.rotation;
            
            slide.addEventListener('mouseenter', () => {
                // Apply the rotation on hover
                slide.style.transform = `rotate(${rotation}deg) scale(1.05)`;
            });
            
            slide.addEventListener('mouseleave', () => {
                // Reset rotation when hover ends
                slide.style.transform = 'rotate(0deg) scale(1)';
            });
            
            // Add click handler for slides
            slide.addEventListener('click', () => {
            });
        });
        
    }
};