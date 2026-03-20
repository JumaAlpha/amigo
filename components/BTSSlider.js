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
    
    getVideoPath(index) {
        // Videos are stored in assets/bts and named alphabetically (video1.mp4, video2.mp4, etc.)
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },
    
    renderSlides() {
        // Define columns/slides with video references
        const slides = [
            {
                width: 'normal',
                videos: [
                    { text: 'CRANE SHOT', height: '60' },
                    { text: 'DRONE OP', height: '40' }
                ]
            },
            {
                width: 'wide',
                videos: [
                    { text: 'LIVE RECORDING', height: '70' },
                    { text: 'RHEMA FEAST', height: '30' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { text: 'CAMERA OP', height: '55' },
                    { text: 'DIRECTOR', height: '45' }
                ]
            },
            {
                width: 'narrow',
                videos: [
                    { text: 'LIGHTING', height: '65' },
                    { text: 'SOUND', height: '35' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { text: 'CAMERA DOLLY', height: '50' },
                    { text: 'DRONE SHOT', height: '50' }
                ]
            },
            {
                width: 'wide',
                videos: [
                    { text: 'CHOIR', height: '75' },
                    { text: 'STAGE', height: '25' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { text: 'BTS', height: '40' },
                    { text: 'PRODUCTION', height: '60' }
                ]
            },
            {
                width: 'narrow',
                videos: [
                    { text: 'LIGHT DESIGN', height: '55' },
                    { text: 'AUDIO MIX', height: '45' }
                ]
            }
        ];
        
        let videoCounter = 0;
        
        return slides.map((slide, index) => `
            <div class="swiper-slide">
                <div class="bts-slide-content ${slide.width}">
                    ${slide.videos.map((video, imgIndex) => {
                        const videoPath = this.getVideoPath(videoCounter);
                        videoCounter++;
                        
                        return `
                            <div class="bts-slide-item video-item" 
                                 data-rotation="${this.getRandomRotation()}"
                                 data-height="${video.height}"
                                 data-video-src="${videoPath}"
                                 style="flex: 0 0 ${video.height}%; height: ${video.height}%;">
                                <video class="bts-video" 
                                       src="${videoPath}"
                                       muted
                                       loop
                                       playsinline
                                       preload="auto"
                                       autoplay>
                                    Your browser does not support the video tag.
                                </video>
                                <div class="bts-slide-overlay">
                                    <span class="bts-slide-caption">${video.text}</span>
                                    <span class="bts-slide-number">${String(index + 1).padStart(2, '0')}.${String(imgIndex + 1).padStart(2, '0')}</span>
                                </div>
                                <div class="bts-slide-pattern"></div>
                                <div class="video-control-hint">
                                    <i class="fas fa-play"></i>
                                </div>
                            </div>
                        `;
                    }).join('')}
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
                    console.log('BTS Swiper initialized');
                    // Ensure all videos are playing
                    setTimeout(() => {
                        const videos = document.querySelectorAll('.bts-video');
                        videos.forEach(video => {
                            video.play().catch(e => console.log('Video autoplay failed:', e));
                        });
                    }, 500);
                },
                slideChange: function() {
                    // Optional: Add any effects on slide change
                }
            }
        });
        
        // Add hover rotation effect (without video control since videos are always playing)
        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
        videoItems.forEach((item) => {
            // Get the pre-generated rotation value
            const rotation = item.dataset.rotation;
            
            // Hover rotation only (no video control)
            item.addEventListener('mouseenter', () => {
                item.style.transform = `rotate(${rotation}deg) scale(1.05)`;
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'rotate(0deg) scale(1)';
            });
            
            // Click handler for slides - open modal with full video
            item.addEventListener('click', () => {
                const videoSrc = item.dataset.videoSrc;
                const caption = item.querySelector('.bts-slide-caption').textContent;
                console.log(`Video slide clicked with rotation ${rotation}°`);
                if (videoSrc) {
                    this.openVideoModal(videoSrc, caption);
                }
            });
        });
        
        console.log('BTS Slider initialized with Swiper - all videos auto-playing');
    },
    
    openVideoModal(videoSrc, caption) {
        // Create modal for full video playback
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal-content">
                <span class="video-modal-close">&times;</span>
                <video class="video-modal-player" src="${videoSrc}" controls autoplay loop></video>
                <div class="video-modal-caption">${caption}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.video-modal-close').addEventListener('click', () => {
            const video = modal.querySelector('video');
            if (video) {
                video.pause();
                video.removeAttribute('src');
                video.load();
            }
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                const video = modal.querySelector('video');
                if (video) {
                    video.pause();
                    video.removeAttribute('src');
                    video.load();
                }
                modal.remove();
            }
        });
        
        // Handle escape key
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                const video = modal.querySelector('video');
                if (video) {
                    video.pause();
                    video.removeAttribute('src');
                    video.load();
                }
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }
};
