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
                    <div class="swiper-wrapper am-swiper-wrapper">
                        ${this.renderSlides()}
                    </div>
                    
                    <!-- Swiper Navigation -->
                    <div class="am-bts-swiper-button-prev"></div>
                    <div class="am-bts-swiper-button-next"></div>
                    
                    <!-- Swiper Pagination -->
                    <div class="am-bts-pagination"></div>
                </div>
            </section>
        `;
    },
    
    getVideoPath(index) {
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },
    
    renderSlides() {
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
        
        return slides.map((slide) => `
            <div class="swiper-slide am-swiper-slide">
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
                                 data-h="${videoCounter <= 8 ? '80' : '60'}"
                                 style="min-height: auto;">
                                <video class="am-bts-video" 
                                       data-src="${videoPath}"
                                       muted
                                       loop
                                       playsinline
                                       preload="none">
                                    Your browser does not support the video tag.
                                </video>
                                <div class="am-bts-pattern"></div>
                                <div class="am-bts-play-hint">
                                    <i class="fas fa-play"></i>
                                </div>
                                <div class="am-bts-loading">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('');
    },
    
    getRandomRotation() {
        const rotations = [-4, -2, 0, 2, 4];
        return rotations[Math.floor(Math.random() * rotations.length)];
    },
    
    // Check if device is in low power mode or has limited resources
    detectPerformanceMode() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.charging === false && battery.level < 0.2) {
                    this.config.lowPowerMode = true;
                    console.log('Low power mode detected, reducing video quality');
                }
            }).catch(() => {});
        }
        
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            this.config.lowPowerMode = true;
            console.log('Limited device memory detected, optimizing performance');
        }
        
        if ('connection' in navigator) {
            const conn = navigator.connection;
            if (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
                this.config.lowPowerMode = true;
                console.log('Slow connection detected, reducing preload');
            }
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
            const thumbnailLoaded = await this.loadThumbnailFromCache(videoElement, videoUrl, videoId);
            
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
                
                setTimeout(() => {
                    this.cacheVideoInBackground(videoUrl, videoId);
                }, 3000);
                
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
            const thumbnailUrl = this.thumbnailCache.get(videoUrl);
            videoElement.poster = thumbnailUrl;
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
                    
                    const videoWidth = tempVideo.videoWidth;
                    const videoHeight = tempVideo.videoHeight;
                    
                    if (videoWidth === 0 || videoHeight === 0) {
                        tempVideo.remove();
                        resolve(null);
                        return;
                    }
                    
                    const maxThumbWidth = 160;
                    let thumbWidth = videoWidth;
                    let thumbHeight = videoHeight;
                    
                    if (thumbWidth > maxThumbWidth) {
                        const ratio = maxThumbWidth / thumbWidth;
                        thumbWidth = maxThumbWidth;
                        thumbHeight = Math.floor(videoHeight * ratio);
                    }
                    
                    canvas.width = thumbWidth;
                    canvas.height = thumbHeight;
                    ctx.drawImage(tempVideo, 0, 0, thumbWidth, thumbHeight);
                    
                    const dataURL = canvas.toDataURL('image/jpeg', 0.5);
                    resolve(dataURL);
                } catch (error) {
                    console.error(`Thumbnail error for ${videoId}:`, error);
                    resolve(null);
                } finally {
                    tempVideo.remove();
                }
            });
            
            tempVideo.addEventListener('error', () => {
                clearTimeout(timeoutId);
                tempVideo.remove();
                resolve(null);
            });
            
            tempVideo.load();
        });
    },
    
    setupVideoElement(videoElement, src, videoId, isCached = false) {
        const parent = videoElement.closest('.am-bts-item');
        
        videoElement.dataset.currentSrc = src;
        videoElement.dataset.loaded = 'true';
        
        if (!videoElement.dataset.listenersSetup) {
            videoElement.addEventListener('play', () => {
                this.activeVideos.set(videoId, videoElement);
            });
            
            videoElement.addEventListener('pause', () => {
                if (this.activeVideos.get(videoId) === videoElement) {
                    this.activeVideos.delete(videoId);
                }
            });
            
            videoElement.dataset.listenersSetup = 'true';
        }
        
        videoElement.src = src;
        videoElement.load();
        
        videoElement.addEventListener('canplay', () => {
            if (parent) {
                parent.classList.remove('loading');
            }
        }, { once: true });
        
        console.log(`Video ${videoId} setup complete (${isCached ? 'cached' : 'network'})`);
    },
    
    async cacheVideoInBackground(videoUrl, videoId) {
        if (!('caches' in window)) return;
        
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const cached = await cache.match(videoUrl);
            if (cached) return;
            
            const response = await fetch(videoUrl);
            if (response.ok) {
                await cache.put(videoUrl, response.clone());
                console.log(`Background cached: ${videoId}`);
            }
        } catch (error) {
            console.log(`Background cache failed for ${videoId}:`, error);
        }
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
        
        console.log(`Unloaded video ${videoId} to free memory`);
    },
    
    init() {
        this.detectPerformanceMode();
        
        const btsSwiper = new Swiper('.am-bts-swiper', {
            slidesPerView: 'auto',
            spaceBetween: this.config.lowPowerMode ? 15 : 25,
            centeredSlides: false,
            loop: true,
            speed: this.config.lowPowerMode ? 400 : 800,
            
            autoplay: this.config.lowPowerMode ? false : {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
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
                enabled: true,
                momentum: !this.config.lowPowerMode,
                momentumRatio: 0.5,
            },
            
            breakpoints: {
                320: { spaceBetween: 10 },
                768: { spaceBetween: 15 },
                1024: { spaceBetween: this.config.lowPowerMode ? 20 : 25 }
            },
            
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
            },
            
            keyboard: { enabled: true, onlyInViewport: true },
            touchRatio: 1.5,
            grabCursor: true,
            
            on: {
                init: () => {
                    console.log('BTS Swiper initialized (optimized mode)');
                    if (this.config.lowPowerMode) {
                        console.log('Running in low-power/performance mode');
                    }
                    this.startLazyLoading();
                },
                slideChange: () => {
                    this.manageVideoQueue();
                },
                resize: () => {
                    this.manageVideoQueue();
                }
            }
        });
        
        window.BTSSliderInstance = this;
        this.btsSwiper = btsSwiper;
        
        this.setupVideoInteractions();
        this.setupVisibilityHandler();
        this.setupMemoryCleanup();
        
        console.log('BTS Slider initialized with unique class names - no conflicts');
    },
    
    startLazyLoading() {
        this.loadQueue = [];
        this.activeLoads = 0;
        
        const allVideoItems = document.querySelectorAll('.am-bts-item');
        allVideoItems.forEach(item => {
            const video = item.querySelector('.am-bts-video');
            const videoSrc = item.dataset.videoSrc;
            const videoId = item.dataset.videoId;
            
            if (video && videoSrc) {
                this.loadQueue.push({ video, videoSrc, videoId, item });
            }
        });
        
        for (let i = 0; i < this.config.maxConcurrentLoads && i < this.loadQueue.length; i++) {
            this.processNextInQueue();
        }
    },
    
    processNextInQueue() {
        if (this.loadQueue.length === 0 || this.activeLoads >= this.config.maxConcurrentLoads) {
            return;
        }
        
        const next = this.loadQueue.shift();
        if (!next) return;
        
        this.activeLoads++;
        
        const isNearViewport = this.isElementNearViewport(next.item);
        
        if (isNearViewport || this.activeLoads <= 2) {
            this.loadVideoFromCache(next.video, next.videoSrc, next.videoId)
                .finally(() => {
                    this.activeLoads--;
                    this.processNextInQueue();
                });
        } else {
            setTimeout(() => {
                this.activeLoads--;
                this.loadQueue.unshift(next);
                this.processNextInQueue();
            }, 500);
        }
    },
    
    isElementNearViewport(element) {
        if (!element) return false;
        
        const swiperContainer = document.querySelector('.am-bts-swiper');
        if (!swiperContainer) return true;
        
        const containerRect = swiperContainer.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        const preloadDistance = this.config.preloadAheadDistance;
        const isNear = (elementRect.right >= containerRect.left - preloadDistance &&
                        elementRect.left <= containerRect.right + preloadDistance);
        
        return isNear;
    },
    
    manageVideoQueue() {
        const allVideos = document.querySelectorAll('.am-bts-video');
        const swiperContainer = document.querySelector('.am-bts-swiper');
        
        if (!swiperContainer) return;
        
        const containerRect = swiperContainer.getBoundingClientRect();
        const unloadDistance = 1500;
        
        allVideos.forEach(video => {
            const parent = video.closest('.am-bts-item');
            if (!parent) return;
            
            const elementRect = parent.getBoundingClientRect();
            const isFar = (elementRect.right < containerRect.left - unloadDistance ||
                          elementRect.left > containerRect.right + unloadDistance);
            
            const videoId = parent.dataset.videoId;
            
            if (isFar && video.dataset.loaded === 'true' && video.paused) {
                if (this.unloadTimeouts && this.unloadTimeouts[videoId]) {
                    clearTimeout(this.unloadTimeouts[videoId]);
                }
                
                this.unloadTimeouts = this.unloadTimeouts || {};
                this.unloadTimeouts[videoId] = setTimeout(() => {
                    this.unloadVideo(video, videoId);
                }, this.config.videoUnloadDelay);
            } else if (!isFar && video.dataset.loaded !== 'true') {
                const videoSrc = parent.dataset.videoSrc;
                const videoId = parent.dataset.videoId;
                if (videoSrc && video.dataset.loaded !== 'true' && video.dataset.loading !== 'true') {
                    this.loadVideoFromCache(video, videoSrc, videoId);
                }
            }
        });
    },
    
    setupVideoInteractions() {
        const videoItems = document.querySelectorAll('.am-bts-item');
        
        videoItems.forEach((item) => {
            const rotation = item.dataset.rotation;
            const video = item.querySelector('.am-bts-video');
            
            item.addEventListener('mouseenter', () => {
                item.style.transform = `rotate(${rotation}deg) scale(1.03)`;
                item.style.transition = 'transform 0.3s ease';
                
                if (video && video.dataset.loaded === 'true' && video.readyState >= 2) {
                    video.play().catch(e => console.log('Play failed:', e));
                }
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'rotate(0deg) scale(1)';
                
                if (video && !video.paused) {
                    video.pause();
                }
            });
        });
    },
    
    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                const videos = document.querySelectorAll('.am-bts-video');
                videos.forEach(video => {
                    if (!video.paused) {
                        video.pause();
                        video.dataset.wasPlaying = 'true';
                    }
                });
            } else {
                const videos = document.querySelectorAll('.am-bts-video');
                videos.forEach(video => {
                    const parent = video.closest('.am-bts-item');
                    if (parent && parent.matches(':hover') && video.dataset.wasPlaying === 'true') {
                        video.play().catch(() => {});
                        delete video.dataset.wasPlaying;
                    }
                });
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
            const videos = document.querySelectorAll('.am-bts-video');
            videos.forEach(video => {
                if (video.src && video.src.startsWith('blob:')) {
                    URL.revokeObjectURL(video.src);
                }
            });
        });
    }
};

// Add CSS for spinner animation if not already present
if (!document.getElementById('am-bts-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'am-bts-spinner-style';
    style.textContent = `
        @keyframes amSpin {
            to { transform: rotate(360deg); }
        }
        .am-bts-item {
            transition: transform 0.3s ease, min-height 0.2s ease;
        }
        .am-bts-video {
            border-radius: 12px;
        }
    `;
    document.head.appendChild(style);
}