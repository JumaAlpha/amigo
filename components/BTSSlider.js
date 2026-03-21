const BTSSlider = {
    // Cache storage key
    CACHE_KEY: 'bts_videos_cache',
    // Track which videos are being loaded/loaded
    videoLoadStatus: {},
    // Queue for videos to load
    loadQueue: [],
    activeDownloads: 0,
    maxConcurrentDownloads: 2, // Load 2 videos at a time
    
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
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },
    
    renderSlides() {
        // Define columns/slides with video references
        const slides = [
            { width: 'normal', videos: [{ height: '60' }, { height: '40' }] },
            { width: 'wide', videos: [{ height: '70' }, { height: '30' }] },
            { width: 'normal', videos: [{ height: '55' }, { height: '45' }] },
            { width: 'narrow', videos: [{ height: '65' }, { height: '35' }] },
            { width: 'normal', videos: [{ height: '50' }, { height: '50' }] },
            { width: 'wide', videos: [{ height: '75' }, { height: '25' }] },
            { width: 'normal', videos: [{ height: '40' }, { height: '60' }] },
            { width: 'narrow', videos: [{ height: '55' }, { height: '45' }] }
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
                                <div class="video-loading-animation">
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                    <span class="dot"></span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    },
    
    getRandomRotation() {
        const rotations = [-8, -6, -4, -2, 2, 4, 6, 8];
        return rotations[Math.floor(Math.random() * rotations.length)];
    },
    
    async checkCache() {
        if (!('caches' in window)) return false;
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
            const cached = await cache.match(videoUrl);
            if (cached) {
                console.log(`Video ${videoId} already in cache`);
                return;
            }
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
            videoElement.src = videoUrl;
            videoElement.load();
            return false;
        }
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const cachedResponse = await cache.match(videoUrl);
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                videoElement.src = blobUrl;
                videoElement.load();
                console.log(`Loaded video ${videoId} from cache`);
                return true;
            } else {
                videoElement.src = videoUrl;
                videoElement.load();
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
    
    // Add a video to the loading queue
    queueVideoLoad(videoElement, videoUrl, videoId) {
        if (this.videoLoadStatus[videoId] === 'loaded' || this.videoLoadStatus[videoId] === 'loading') {
            return;
        }
        this.videoLoadStatus[videoId] = 'pending';
        this.loadQueue.push({ videoElement, videoUrl, videoId });
        
        // Show loading animation
        const parent = videoElement.closest('.bts-slide-item');
        if (parent) parent.classList.add('video-loading');
        
        this.processQueue();
    },
    
    // Process the queue, loading up to maxConcurrentDownloads at once
    processQueue() {
        while (this.activeDownloads < this.maxConcurrentDownloads && this.loadQueue.length > 0) {
            const { videoElement, videoUrl, videoId } = this.loadQueue.shift();
            if (this.videoLoadStatus[videoId] !== 'pending') continue;
            
            this.activeDownloads++;
            this.videoLoadStatus[videoId] = 'loading';
            
            this.loadVideoFromCache(videoElement, videoUrl, videoId)
                .finally(() => {
                    this.activeDownloads--;
                    this.videoLoadStatus[videoId] = 'loaded';
                    
                    // Remove loading animation
                    const parent = videoElement.closest('.bts-slide-item');
                    if (parent) parent.classList.remove('video-loading');
                    
                    // If this video was being hovered when loading completed, play it
                    if (parent && parent.dataset.hovering === 'true') {
                        videoElement.play().catch(e => console.log('Auto-play after load failed:', e));
                    }
                    
                    this.processQueue(); // Continue with next in queue
                });
        }
    },
    
    // Start loading all videos gradually
    loadAllVideosGradually() {
        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
        videoItems.forEach(item => {
            const video = item.querySelector('.bts-video');
            const videoSrc = item.dataset.videoSrc;
            const videoId = item.dataset.videoId;
            if (video && videoSrc) {
                this.queueVideoLoad(video, videoSrc, videoId);
            }
        });
    },
    
    init() {
        // Initialize Swiper
        const btsSwiper = new Swiper('.bts-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
            loop: true,
            speed: 800,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            freeMode: {
                enabled: true,
                momentum: true,
                momentumRatio: 0.5,
                momentumVelocityRatio: 0.5,
            },
            breakpoints: {
                320: { spaceBetween: 15, slidesPerView: 'auto' },
                768: { spaceBetween: 20, slidesPerView: 'auto' },
                1024: { spaceBetween: 30, slidesPerView: 'auto' }
            },
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
                releaseOnEdges: true,
            },
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            touchRatio: 1.5,
            touchAngle: 45,
            grabCursor: true,
            effect: 'slide',
            on: {
                init: () => {
                    console.log('BTS Swiper initialized');
                    // Start loading all videos gradually after a short delay
                    setTimeout(() => {
                        this.loadAllVideosGradually();
                    }, 500);
                }
            }
        });
        
        window.BTSSliderInstance = this;
        
        // Add hover rotation effect and hover load behavior
        const videoItems = document.querySelectorAll('.bts-slide-item.video-item');
        videoItems.forEach((item) => {
            const rotation = item.dataset.rotation;
            const video = item.querySelector('.bts-video');
            const videoId = item.dataset.videoId;
            
            // Set hover flag on data attribute
            item.addEventListener('mouseenter', () => {
                item.dataset.hovering = 'true';
                item.style.transform = `rotate(${rotation}deg) scale(1.05)`;
                
                // If video not loaded yet, ensure it's queued and will play when ready
                if (this.videoLoadStatus[videoId] !== 'loaded') {
                    // Already in queue or will be queued; the queue processor will play it when loaded
                    // But we also need to make sure it gets into the queue if not already
                    if (!this.videoLoadStatus[videoId] || this.videoLoadStatus[videoId] === 'pending') {
                        // It's already pending or not yet queued; the queue will handle it
                    } else if (this.videoLoadStatus[videoId] === 'loading') {
                        // It's currently loading, will play when done
                    } else {
                        // Not queued yet, queue it now
                        const videoSrc = item.dataset.videoSrc;
                        if (video && videoSrc) {
                            this.queueVideoLoad(video, videoSrc, videoId);
                        }
                    }
                } else {
                    if (video && video.readyState >= 2) {
                        video.play().catch(e => console.log('Video play failed:', e));
                    }
                }
            });
            
            item.addEventListener('mouseleave', () => {
                delete item.dataset.hovering;
                item.style.transform = 'rotate(0deg) scale(1)';
                const video = item.querySelector('.bts-video');
                if (video && !video.paused) {
                    video.pause();
                }
            });
        });
        
        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.querySelectorAll('.bts-video').forEach(v => v.pause());
            } else {
                document.querySelectorAll('.bts-video').forEach(v => {
                    const parent = v.closest('.bts-slide-item');
                    if (parent && parent.dataset.hovering === 'true') {
                        v.play().catch(e => console.log('Video resume failed:', e));
                    }
                });
            }
        });
        
        console.log('BTS Slider initialized with progressive video loading and loading animation');
    }
};
