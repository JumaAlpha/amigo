const BTSSlider = {
    // Cache storage key
    CACHE_KEY: 'bts_videos_cache',
    
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
        // Define columns/slides with video references (no descriptions)
        const slides = [
            {
                width: 'normal',
                videos: [
                    { height: '60' },
                    { height: '40' }
                ]
            },
            {
                width: 'wide',
                videos: [
                    { height: '70' },
                    { height: '30' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { height: '55' },
                    { height: '45' }
                ]
            },
            {
                width: 'narrow',
                videos: [
                    { height: '65' },
                    { height: '35' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { height: '50' },
                    { height: '50' }
                ]
            },
            {
                width: 'wide',
                videos: [
                    { height: '75' },
                    { height: '25' }
                ]
            },
            {
                width: 'normal',
                videos: [
                    { height: '40' },
                    { height: '60' }
                ]
            },
            {
                width: 'narrow',
                videos: [
                    { height: '55' },
                    { height: '45' }
                ]
            }
        ];
        
        let videoCounter = 0;
        
        return slides.map((slide, index) => `
            <div class="swiper-slide">
                <div class="bts-slide-content ${slide.width}">
                    ${slide.videos.map((video, imgIndex) => {
                        const videoPath = this.getVideoPath(videoCounter);
                        const videoId = `video_${videoCounter}`;
                        videoCounter++;
                        
                        return `
                            <div class="bts-slide-item video-item" 
                                 data-rotation="${this.getRandomRotation()}"
                                 data-height="${video.height}"
                                 data-video-src="${videoPath}"
                                 data-video-id="${videoId}"
                                 style="flex: 0 0 ${video.height}%; height: ${video.height}%;">
                                <video class="bts-video" 
                                       data-src="${videoPath}"
                                       muted
                                       loop
                                       playsinline
                                       preload="none"
                                       poster="assets/bts/poster${String(videoCounter).padStart(2, '0')}.jpg">
                                    Your browser does not support the video tag.
                                </video>
                                <div class="bts-slide-pattern"></div>
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
    
    async checkAndLoadCache() {
        // Check if Cache API is available
        if (!('caches' in window)) {
            console.log('Cache API not supported, falling back to regular loading');
            return false;
        }
        
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const cachedResponse = await cache.match('/bts-videos-manifest');
            
            if (cachedResponse) {
                const cachedData = await cachedResponse.json();
                console.log('Found cached video data', cachedData);
                return cachedData;
            }
        } catch (error) {
            console.log('Error checking cache:', error);
        }
        
        return false;
    },
    
    async cacheVideo(videoUrl, videoId) {
        if (!('caches' in window)) return;
        
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            
            // Check if already cached
            const cached = await cache.match(videoUrl);
            if (cached) {
                console.log(`Video ${videoId} already in cache`);
                return;
            }
            
            // Fetch and cache the video
            const response = await fetch(videoUrl);
            if (response.ok) {
                await cache.put(videoUrl, response.clone());
                console.log(`Cached video: ${videoId}`);
            }
        } catch (error) {
            console.log(`Error caching video ${videoId}:`, error);
        }
    },
    
    async loadVideoFromCache(videoElement, videoUrl, videoId) {
        if (!('caches' in window)) {
            // Fallback: load normally
            videoElement.src = videoUrl;
            videoElement.load();
            return false;
        }
        
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const cachedResponse = await cache.match(videoUrl);
            
            if (cachedResponse) {
                // Create blob URL from cached response
                const blob = await cachedResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                videoElement.src = blobUrl;
                videoElement.load();
                console.log(`Loaded video ${videoId} from cache`);
                return true;
            } else {
                // Not in cache, load normally and cache
                videoElement.src = videoUrl;
                videoElement.load();
                
                // Cache for next time
                videoElement.addEventListener('canplaythrough', () => {
                    this.cacheVideo(videoUrl, videoId);
                }, { once: true });
                
                console.log(`Loading video ${videoId} from network`);
                return false;
            }
        } catch (error) {
            console.log(`Error loading video ${videoId} from cache:`, error);
            videoElement.src = videoUrl;
            videoElement.load();
            return false;
        }
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
                    
                    // Start loading videos with cache
                    setTimeout(() => {
                        const videoElements = document.querySelectorAll('.bts-video');
                        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
                        
                        videoItems.forEach((item, index) => {
                            const video = item.querySelector('.bts-video');
                            const videoSrc = item.dataset.videoSrc;
                            const videoId = item.dataset.videoId || `video_${index}`;
                            
                            if (video && videoSrc) {
                                // Load video with cache support
                                window.BTSSliderInstance.loadVideoFromCache(video, videoSrc, videoId);
                            }
                        });
                    }, 100);
                },
                slideChange: function() {
                    // Optional: Add any effects on slide change
                }
            }
        });
        
        // Store instance for callbacks
        window.BTSSliderInstance = this;
        
        // Add hover rotation effect (no modal)
        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
        videoItems.forEach((item) => {
            const rotation = item.dataset.rotation;
            
            // Hover rotation
            item.addEventListener('mouseenter', () => {
                item.style.transform = `rotate(${rotation}deg) scale(1.05)`;
                
                // Play video on hover if it's loaded
                const video = item.querySelector('.bts-video');
                if (video && video.readyState >= 2) {
                    video.play().catch(e => console.log('Video play failed:', e));
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'rotate(0deg) scale(1)';
                
                // Pause video when not hovering
                const video = item.querySelector('.bts-video');
                if (video && !video.paused) {
                    video.pause();
                }
            });
        });
        
        // Add visibility change handler to pause videos when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Tab is hidden, pause all videos
                const videos = document.querySelectorAll('.bts-video');
                videos.forEach(video => {
                    video.pause();
                });
            } else {
                // Tab is visible again, resume playing visible videos
                const visibleVideos = document.querySelectorAll('.bts-video');
                visibleVideos.forEach(video => {
                    const parent = video.closest('.bts-slide-item');
                    if (parent && parent.matches(':hover')) {
                        video.play().catch(e => console.log('Video resume failed:', e));
                    }
                });
            }
        });
        
        // Setup preload strategy
        this.setupPreloadStrategy();
        
        console.log('BTS Slider initialized with persistent video cache - descriptions and modal removed');
    },
    
    setupPreloadStrategy() {
        // Preload videos when user is about to scroll to them
        const swiperContainer = document.querySelector('.bts-swiper');
        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
        
        if (!swiperContainer) return;
        
        // Create intersection observer for preloading videos near viewport
        const preloadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const video = item.querySelector('.bts-video');
                    const videoSrc = item.dataset.videoSrc;
                    const videoId = item.dataset.videoId;
                    
                    // Preload video when it's 500px from viewport
                    if (video && videoSrc && !video.src) {
                        this.loadVideoFromCache(video, videoSrc, videoId);
                    }
                }
            });
        }, {
            root: swiperContainer,
            rootMargin: '500px',
            threshold: 0
        });
        
        videoItems.forEach(item => {
            preloadObserver.observe(item);
        });
    }
};
