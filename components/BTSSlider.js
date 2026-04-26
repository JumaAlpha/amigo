const BTSSlider = {
    // Cache storage key
    CACHE_KEY: 'bts_videos_cache',
    
    // Track active video instances for cleanup
    activeVideos: new Map(),
    thumbnailCache: new Map(),
    
    // Configuration for performance
    config: {
        maxConcurrentLoads: 3,
        thumbnailGenerationDelay: 500,
        videoUnloadDelay: 10000,
        preloadAheadDistance: 800,
        lowPowerMode: false
    },
    
    render() {
        return `
            <section class="section am-bts-section" id="am-bts-section">
                <div class="am-bts-header">· behind the scenes</div>
                
                <!-- Swiper Container -->
                <div class="swiper am-bts-swiper">
                    <div class="swiper-wrapper">
                        ${this.renderSlides()}
                    </div>
                    
                    <!-- Navigation -->
                    <div class="am-bts-swiper-button-prev"></div>
                    <div class="am-bts-swiper-button-next"></div>
                    
                </div>
                
                <!-- Pagination -->
                <div class="am-bts-pagination"></div>
            </section>
        `;
    },
    
    getVideoPath(index) {
        // Videos stored as assets/bts/video01.mp4, video02.mp4, ...
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },
    
    renderSlides() {
        // Define slides - each slide now has 3 videos to make 3 rows
        const slides = [
            { width: 'normal', videos: [1, 2, 3] },
            { width: 'wide', videos: [4, 5, 6] },
            { width: 'normal', videos: [7, 8, 9] },
            { width: 'narrow', videos: [10, 11, 12] },
            { width: 'normal', videos: [13, 14, 15] },
            { width: 'wide', videos: [16, 17, 18] }
        ];
        
        let videoCounter = 0;
        
        return slides.map((slide) => `
            <div class="swiper-slide">
                <div class="am-bts-slide-content ${slide.width}">
                    ${slide.videos.map(() => {
                        const videoPath = this.getVideoPath(videoCounter);
                        const videoId = `bts_video_${videoCounter}`;
                        videoCounter++;
                        return `
                            <div class="am-bts-item" 
                                 data-rotation="${this.getRandomRotation()}"
                                 data-video-src="${videoPath}"
                                 data-video-id="${videoId}"
                                 data-loaded="false">
                                <video class="am-bts-video" 
                                       data-src="${videoPath}"
                                       muted
                                       loop
                                       playsinline
                                       preload="metadata"
                                       poster="">
                                    Your browser does not support the video tag.
                                </video>
                                <div class="am-bts-pattern"></div>
                                <div class="am-bts-play-hint">
                                    <i class="fas fa-play"></i>
                                </div>
                                <div class="am-bts-loading">
                                    <div class="am-bts-loading-spinner"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    },
    
    getRandomRotation() {
        const rotations = [-3, -1.5, 0, 1.5, 3];
        return rotations[Math.floor(Math.random() * rotations.length)];
    },
    
    // Performance detection
    detectPerformanceMode() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.charging === false && battery.level < 0.2) {
                    this.config.lowPowerMode = true;
                    console.log('Low power mode detected');
                }
            }).catch(() => {});
        }
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            this.config.lowPowerMode = true;
        }
        if ('connection' in navigator && navigator.connection.saveData) {
            this.config.lowPowerMode = true;
        }
    },
    
    async loadVideoFromCache(videoElement, videoUrl, videoId) {
        if (videoElement.dataset.loaded === 'true' || videoElement.dataset.loading === 'true') {
            return false;
        }
        
        videoElement.dataset.loading = 'true';
        const parent = videoElement.closest('.am-bts-item');
        if (parent) parent.classList.add('loading');
        
        try {
            // Generate thumbnail first
            await this.loadThumbnailFromCache(videoElement, videoUrl, videoId);
            
            if (!('caches' in window)) {
                this.setupVideoElement(videoElement, videoUrl, videoId);
                return false;
            }
            
            const cache = await caches.open('bts-videos-cache-v1');
            const cachedResponse = await cache.match(videoUrl);
            
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                this.setupVideoElement(videoElement, blobUrl, videoId, true);
                return true;
            } else {
                this.setupVideoElement(videoElement, videoUrl, videoId);
                // Background cache after load
                videoElement.addEventListener('canplaythrough', () => {
                    this.cacheVideoInBackground(videoUrl, videoId);
                }, { once: true });
                return false;
            }
        } catch (error) {
            console.log(`Error loading video ${videoId}:`, error);
            this.setupVideoElement(videoElement, videoUrl, videoId);
            return false;
        } finally {
            videoElement.dataset.loading = 'false';
            if (parent) {
                setTimeout(() => parent.classList.remove('loading'), 300);
            }
        }
    },
    
    async loadThumbnailFromCache(videoElement, videoUrl, videoId) {
        if (this.thumbnailCache.has(videoUrl)) {
            videoElement.poster = this.thumbnailCache.get(videoUrl);
            return true;
        }
        
        return new Promise((resolve) => {
            setTimeout(async () => {
                const thumbnail = await this.generateThumbnailEfficient(videoUrl, videoId);
                if (thumbnail) {
                    this.thumbnailCache.set(videoUrl, thumbnail);
                    videoElement.poster = thumbnail;
                    resolve(true);
                }
                resolve(false);
            }, this.config.thumbnailGenerationDelay);
        });
    },
    
    generateThumbnailEfficient(videoUrl, videoId) {
        return new Promise((resolve) => {
            const tempVideo = document.createElement('video');
            tempVideo.muted = true;
            tempVideo.preload = 'metadata';
            tempVideo.crossOrigin = 'Anonymous';
            tempVideo.src = videoUrl;
            
            const timeoutId = setTimeout(() => {
                tempVideo.remove();
                resolve(null);
            }, 3000);
            
            tempVideo.addEventListener('loadedmetadata', () => {
                tempVideo.currentTime = Math.min(0.3, tempVideo.duration * 0.05);
            });
            
            tempVideo.addEventListener('seeked', () => {
                clearTimeout(timeoutId);
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const vw = tempVideo.videoWidth, vh = tempVideo.videoHeight;
                    if (vw === 0 || vh === 0) { tempVideo.remove(); resolve(null); return; }
                    const maxW = 200;
                    let tw = vw, th = vh;
                    if (tw > maxW) { const r = maxW / tw; tw = maxW; th = Math.floor(vh * r); }
                    canvas.width = tw; canvas.height = th;
                    ctx.drawImage(tempVideo, 0, 0, tw, th);
                    const dataURL = canvas.toDataURL('image/jpeg', 0.5);
                    resolve(dataURL);
                } catch(e) { resolve(null); }
                finally { tempVideo.remove(); }
            });
            tempVideo.addEventListener('error', () => { clearTimeout(timeoutId); tempVideo.remove(); resolve(null); });
            tempVideo.load();
        });
    },
    
    setupVideoElement(videoElement, src, videoId, isCached = false) {
        const parent = videoElement.closest('.am-bts-item');
        videoElement.src = src;
        videoElement.load();
        videoElement.dataset.loaded = 'true';
        
        // Store current src for cleanup
        videoElement.dataset.currentSrc = src;
        
        // Play on hover only when ready
        parent.addEventListener('mouseenter', () => {
            if (videoElement.readyState >= 2) {
                videoElement.play().catch(e => console.log('play failed', e));
            }
        });
        parent.addEventListener('mouseleave', () => {
            if (!videoElement.paused) videoElement.pause();
        });
        
        console.log(`Video ${videoId} ready (${isCached ? 'cached' : 'network'})`);
    },
    
    async cacheVideoInBackground(videoUrl, videoId) {
        if (!('caches' in window)) return;
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const response = await fetch(videoUrl);
            if (response.ok) {
                await cache.put(videoUrl, response.clone());
                console.log(`Cached ${videoId}`);
            }
        } catch(e) {}
    },
    
    unloadVideo(videoElement, videoId) {
        if (!videoElement || videoElement.dataset.loaded !== 'true') return;
        if (!videoElement.paused) return;
        videoElement.pause();
        videoElement.src = '';
        videoElement.load();
        videoElement.dataset.loaded = 'false';
        if (videoElement.dataset.currentSrc && videoElement.dataset.currentSrc.startsWith('blob:')) {
            URL.revokeObjectURL(videoElement.dataset.currentSrc);
        }
    },
    
    init() {
        this.detectPerformanceMode();
        
        // Initialize Swiper with continuous loop settings
        const btsSwiper = new Swiper('.am-bts-swiper', {
            slidesPerView: 'auto',
            spaceBetween: this.config.lowPowerMode ? 15 : 25,
            centeredSlides: false,
            loop: true, // Enables continuous loop
            loopAdditionalSlides: 3, // Extra slides for smoother loop
            speed: this.config.lowPowerMode ? 400 : 800,
            autoplay: this.config.lowPowerMode ? false : {
                delay: 0, // Zero delay for continuous movement
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
                stopOnLastSlide: false,
                waitForTransition: false
            },
            navigation: {
                nextEl: '.am-bts-swiper-button-next',
                prevEl: '.am-bts-swiper-button-prev',
            },
            pagination: {
                el: '.am-bts-pagination',
                clickable: true,
                bulletClass: 'am-bts-pagination-bullet',
                bulletActiveClass: 'am-bts-pagination-bullet-active',
            },
            freeMode: { 
                enabled: false // Disable free mode for continuous scroll
            },
            breakpoints: {
                320: { spaceBetween: 10 },
                768: { spaceBetween: 15 },
                1024: { spaceBetween: this.config.lowPowerMode ? 20 : 25 }
            },
            mousewheel: { forceToAxis: true, sensitivity: 1 },
            keyboard: { enabled: true, onlyInViewport: true },
            touchRatio: 1.5,
            grabCursor: true,
            touchMoveStopPropagation: true,
            // For continuous smooth scrolling
            effect: 'slide',
            slidesPerGroup: 1,
            simulateTouch: true,
            allowTouchMove: true,
            on: {
                init: () => {
                    console.log('BTS Swiper ready - Continuous loop mode enabled');
                    this.startLazyLoading();
                    
                    // Start continuous autoplay
                    if (!this.config.lowPowerMode && btsSwiper.autoplay) {
                        btsSwiper.autoplay.start();
                    }
                },
                slideChange: () => this.manageVideoQueue(),
                resize: () => this.manageVideoQueue(),
                autoplayTimeLeft: (s, time, progress) => {
                    // Smooth transition for continuous feel
                    if (progress < 0.1) {
                        s.slideNext();
                    }
                }
            }
        });
        
        // Override autoplay for continuous scrolling effect
        if (!this.config.lowPowerMode && btsSwiper.autoplay) {
            // This creates a continuous smooth scroll effect
            let scrollInterval;
            const startContinuousScroll = () => {
                scrollInterval = setInterval(() => {
                    if (!btsSwiper.autoplay?.paused && !this.config.lowPowerMode) {
                        btsSwiper.slideNext();
                    }
                }, 3000); // Move to next slide every 3 seconds
            };
            
            const stopContinuousScroll = () => {
                if (scrollInterval) clearInterval(scrollInterval);
            };
            
            // Start continuous scroll
            startContinuousScroll();
            
            // Pause on hover
            const swiperContainer = document.querySelector('.am-bts-swiper');
            if (swiperContainer) {
                swiperContainer.addEventListener('mouseenter', () => {
                    stopContinuousScroll();
                });
                swiperContainer.addEventListener('mouseleave', () => {
                    startContinuousScroll();
                });
            }
            
            // Store interval for cleanup
            this.scrollInterval = scrollInterval;
        }
        
        window.BTSSliderInstance = this;
        this.btsSwiper = btsSwiper;
        this.setupVisibilityHandler();
        this.setupMemoryCleanup();
        
        console.log('BTS Slider initialized with continuous carousel loop');
    },
    
    startLazyLoading() {
        this.loadQueue = [];
        this.activeLoads = 0;
        const items = document.querySelectorAll('.am-bts-item');
        items.forEach(item => {
            const video = item.querySelector('.am-bts-video');
            const src = item.dataset.videoSrc;
            const id = item.dataset.videoId;
            if (video && src) {
                this.loadQueue.push({ video, videoSrc: src, videoId: id, item });
            }
        });
        for (let i = 0; i < this.config.maxConcurrentLoads && i < this.loadQueue.length; i++) {
            this.processNextInQueue();
        }
    },
    
    processNextInQueue() {
        if (this.loadQueue.length === 0 || this.activeLoads >= this.config.maxConcurrentLoads) return;
        const next = this.loadQueue.shift();
        if (!next) return;
        this.activeLoads++;
        const isNear = this.isElementNearViewport(next.item);
        if (isNear || this.activeLoads <= 2) {
            this.loadVideoFromCache(next.video, next.videoSrc, next.videoId)
                .finally(() => { this.activeLoads--; this.processNextInQueue(); });
        } else {
            setTimeout(() => { this.activeLoads--; this.loadQueue.unshift(next); this.processNextInQueue(); }, 500);
        }
    },
    
    isElementNearViewport(element) {
        if (!element) return false;
        const container = document.querySelector('.am-bts-swiper');
        if (!container) return true;
        const cRect = container.getBoundingClientRect();
        const eRect = element.getBoundingClientRect();
        const distance = this.config.preloadAheadDistance;
        return (eRect.right >= cRect.left - distance && eRect.left <= cRect.right + distance);
    },
    
    manageVideoQueue() {
        const videos = document.querySelectorAll('.am-bts-video');
        const container = document.querySelector('.am-bts-swiper');
        if (!container) return;
        const cRect = container.getBoundingClientRect();
        videos.forEach(video => {
            const parent = video.closest('.am-bts-item');
            if (!parent) return;
            const eRect = parent.getBoundingClientRect();
            const isFar = (eRect.right < cRect.left - 1500 || eRect.left > cRect.right + 1500);
            const vidId = parent.dataset.videoId;
            if (isFar && video.dataset.loaded === 'true' && video.paused) {
                if (this.unloadTimeouts?.[vidId]) clearTimeout(this.unloadTimeouts[vidId]);
                this.unloadTimeouts = this.unloadTimeouts || {};
                this.unloadTimeouts[vidId] = setTimeout(() => this.unloadVideo(video, vidId), this.config.videoUnloadDelay);
            } else if (!isFar && video.dataset.loaded !== 'true' && !video.dataset.loading) {
                const src = parent.dataset.videoSrc;
                if (src) this.loadVideoFromCache(video, src, vidId);
            }
        });
    },
    
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            const videos = document.querySelectorAll('.am-bts-video');
            if (document.hidden) {
                videos.forEach(v => { if (!v.paused) { v.pause(); v.dataset.wasPlaying = 'true'; } });
                // Pause continuous scroll when tab is hidden
                if (this.scrollInterval) clearInterval(this.scrollInterval);
            } else {
                videos.forEach(v => {
                    const parent = v.closest('.am-bts-item');
                    if (parent && parent.matches(':hover') && v.dataset.wasPlaying === 'true') {
                        v.play().catch(()=>{});
                        delete v.dataset.wasPlaying;
                    }
                });
                // Restart continuous scroll when tab is visible
                if (!this.config.lowPowerMode && this.btsSwiper) {
                    this.scrollInterval = setInterval(() => {
                        if (this.btsSwiper && !this.btsSwiper.autoplay?.paused) {
                            this.btsSwiper.slideNext();
                        }
                    }, 3000);
                }
            }
        });
    },
    
    setupMemoryCleanup() {
        setInterval(() => {
            const videos = document.querySelectorAll('.am-bts-video');
            videos.forEach(video => {
                const parent = video.closest('.am-bts-item');
                if (parent && !this.isElementNearViewport(parent) && video.paused && video.dataset.loaded === 'true') {
                    this.unloadVideo(video, parent.dataset.videoId);
                }
            });
        }, 30000);
        window.addEventListener('beforeunload', () => {
            document.querySelectorAll('.am-bts-video').forEach(v => {
                if (v.src && v.src.startsWith('blob:')) URL.revokeObjectURL(v.src);
            });
            if (this.scrollInterval) clearInterval(this.scrollInterval);
        });
    }
};

// Add spinner style if missing
if (!document.getElementById('am-bts-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'am-bts-spinner-style';
    style.textContent = `
        @keyframes amSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .am-bts-item {
            transition: transform 0.3s ease;
        }
        .am-bts-video {
            border-radius: 12px;
        }
        /* Spinner loading animation */
        .am-bts-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(212, 175, 55, 0.2);
            border-top: 3px solid var(--metallic-gold);
            border-right: 3px solid var(--metallic-gold);
            border-radius: 50%;
            animation: amSpin 0.8s linear infinite;
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }
        @media (max-width: 480px) {
            .am-bts-loading-spinner {
                width: 30px;
                height: 30px;
            }
        }
        @media (prefers-reduced-motion: reduce) {
            .am-bts-loading-spinner {
                animation: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        BTSSlider.init();
    });
} else {
    BTSSlider.init();
}

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BTSSlider;
}