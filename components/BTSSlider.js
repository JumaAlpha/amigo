// ========== BTS SLIDER - INFINITE LOOP (FAST NAVIGATION) ==========
const BTSSlider = {
    CACHE_KEY: 'bts_videos_cache',
    activeVideos: new Map(),
    thumbnailCache: new Map(),
    config: {
        maxConcurrentLoads: 6,
        thumbnailGenerationDelay: 300,
        videoUnloadDelay: 10000,
        preloadAheadDistance: 1200,
        lowPowerMode: false,
        previewDuration: 3,
        maxConcurrentPreviews: 4,
        thumbnailMaxWidth: 200,
        thumbnailConcurrency: 1
    },

    _thumbnailQueue: [],
    _activeThumbnails: 0,
    _previewInterval: null,
    _previewVideos: new Set(),
    _clonedItems: new WeakSet(), // avoid repeated cloning

    render() {
        return `
            <section class="section bts-section bts-custom-section" id="bts-custom-section" data-aos="fade-up" data-aos-duration="700">
                <div class="bts-custom-header">· behind the scenes</div>
                <div class="bts-custom-viewport">
                    <div class="bts-custom-carousel-wrapper" aria-label="Behind the scenes video carousel">
                        <div class="bts-custom-fade bts-custom-fade-left"></div>
                        <div class="swiper bts-custom-swiper" role="region" aria-roledescription="carousel">
                            <div class="swiper-wrapper bts-custom-loop-track">
                                ${this.renderSlides()}
                            </div>
                            <div class="bts-custom-button-prev" aria-label="Previous slide">
                                <i class="fas fa-chevron-left"></i>
                            </div>
                            <div class="bts-custom-button-next" aria-label="Next slide">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        <div class="bts-custom-fade bts-custom-fade-right"></div>
                    </div>
                    <div class="bts-custom-hint">Tap / hover to view</div>
                </div>
            </section>
        `;
    },

    getVideoPath(index) {
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },

    renderSlides() {
        const slideGroups = [
            { width: 'normal', videos: [1, 2, 3] },
            { width: 'wide', videos: [4, 5, 6] },
            { width: 'normal', videos: [7, 8, 9] },
            { width: 'narrow', videos: [10, 11, 12] },
            { width: 'normal', videos: [13, 14, 15] },
            { width: 'wide', videos: [16, 1, 2] }
        ];

        const repeatedGroups = Array.from({ length: 12 }, () => slideGroups).flat();

        return repeatedGroups.map((slide, slideIndex) => `
            <div class="swiper-slide">
                <div class="bts-custom-slide-content ${slide.width}">
                    ${slide.videos.map((videoNumber, itemIndex) => {
                        const videoPath = this.getVideoPath(videoNumber - 1);
                        const videoId = `bts_video_${slideIndex}_${itemIndex}_${videoNumber}`;
                        return `
                            <div class="bts-custom-item" 
                                 data-rotation="${this.getRandomRotation()}"
                                 data-video-src="${videoPath}"
                                 data-video-id="${videoId}"
                                 data-loaded="false">
                                <video class="bts-custom-video" 
                                       data-src="${videoPath}"
                                       data-previewing="false"
                                       data-full-play="false"
                                       muted loop playsinline preload="auto" poster="">
                                    Your browser does not support the video tag.
                                </video>
                                <div class="bts-custom-pattern"></div>
                                <div class="bts-custom-play-hint"><i class="fas fa-play"></i></div>
                                <div class="bts-custom-loading"><div class="bts-custom-loading-spinner"></div></div>
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

    detectPerformanceMode() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (!battery.charging && battery.level < 0.2) {
                    this.config.lowPowerMode = true;
                    this._applyLowPowerSettings();
                }
            }).catch(()=>{});
        }
        if ('deviceMemory' in navigator && navigator.deviceMemory < 4) {
            this.config.lowPowerMode = true;
            this._applyLowPowerSettings();
        }
        if ('connection' in navigator && navigator.connection.saveData) {
            this.config.lowPowerMode = true;
            this._applyLowPowerSettings();
        }
    },

    _applyLowPowerSettings() {
        this.config.maxConcurrentLoads = 2;
        this.config.preloadAheadDistance = 600;
        this.config.thumbnailMaxWidth = 80;
        this.config.thumbnailGenerationDelay = 800;
        this.config.maxConcurrentPreviews = 2;
    },

    async loadVideoFromCache(videoElement, videoUrl, videoId) {
        if (videoElement.dataset.loaded === 'true' || videoElement.dataset.loading === 'true') return false;
        videoElement.dataset.loading = 'true';
        const parent = videoElement.closest('.bts-custom-item');
        if (parent) parent.classList.add('loading');
        try {
            await this.loadThumbnailFromCache(videoElement, videoUrl, videoId);
            this.setupVideoElement(videoElement, videoUrl, videoId, false);
            this._cacheFullVideoInBackground(videoUrl, videoId);
            await new Promise((resolve) => {
                if (videoElement.readyState >= 2) {
                    resolve();
                } else {
                    const onCanPlay = () => {
                        videoElement.removeEventListener('canplay', onCanPlay);
                        resolve();
                    };
                    videoElement.addEventListener('canplay', onCanPlay, { once: true });
                    setTimeout(resolve, 2000);
                }
            });
            if (parent) parent.classList.remove('loading');
            videoElement.dataset.loaded = 'true';
            return true;
        } catch (error) {
            console.log(`Error loading video ${videoId}:`, error);
            this.setupVideoElement(videoElement, videoUrl, videoId, false);
            if (parent) parent.classList.remove('loading');
            return false;
        } finally {
            videoElement.dataset.loading = 'false';
        }
    },

    async _cacheFullVideoInBackground(videoUrl, videoId) {
        if (!('caches' in window)) return;
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const cachedResponse = await cache.match(videoUrl);
            if (!cachedResponse) {
                const response = await fetch(videoUrl);
                if (response.ok) await cache.put(videoUrl, response.clone());
            }
        } catch(e) {}
    },

    _prioritizeFullVideoForInteraction(videoElement, videoUrl, videoId) {
        if (!('caches' in window)) return;
        caches.open('bts-videos-cache-v1').then(cache => {
            cache.match(videoUrl).then(cached => {
                if (!cached) {
                    fetch(videoUrl).then(response => {
                        if (response.ok) cache.put(videoUrl, response);
                    }).catch(e => console.log('Urgent fetch failed', e));
                }
            });
        });
    },

    async loadThumbnailFromCache(videoElement, videoUrl, videoId) {
        if (this.thumbnailCache.has(videoUrl)) {
            videoElement.poster = this.thumbnailCache.get(videoUrl);
            return true;
        }
        const parent = videoElement.closest('.bts-custom-item');
        if (parent && !this.isElementNearViewport(parent) && this.config.lowPowerMode) {
            return false;
        }
        return new Promise((resolve) => {
            this._thumbnailQueue.push({
                videoUrl, videoId, videoElement, resolve
            });
            this._processThumbnailQueue();
        });
    },

    _processThumbnailQueue() {
        if (this._thumbnailQueue.length === 0) return;
        if (this._activeThumbnails >= this.config.thumbnailConcurrency) return;

        const task = this._thumbnailQueue.shift();
        if (!task) return;
        this._activeThumbnails++;

        const doGenerate = () => {
            setTimeout(async () => {
                const thumbnail = await this.generateThumbnailEfficient(task.videoUrl, task.videoId);
                if (thumbnail) {
                    this.thumbnailCache.set(task.videoUrl, thumbnail);
                    task.videoElement.poster = thumbnail;
                    task.resolve(true);
                } else {
                    task.resolve(false);
                }
                this._activeThumbnails--;
                this._processThumbnailQueue();
            }, this.config.thumbnailGenerationDelay);
        };

        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(doGenerate, { timeout: 2000 });
        } else {
            doGenerate();
        }
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
                const seekTime = Math.min(0.1, tempVideo.duration * 0.02);
                tempVideo.currentTime = seekTime;
            });

            tempVideo.addEventListener('seeked', () => {
                clearTimeout(timeoutId);
                try {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const vw = tempVideo.videoWidth, vh = tempVideo.videoHeight;
                    if (vw === 0 || vh === 0) {
                        tempVideo.remove();
                        resolve(null);
                        return;
                    }
                    const maxWidth = this.config.thumbnailMaxWidth;
                    let tw = vw, th = vh;
                    if (tw > maxWidth) {
                        const ratio = maxWidth / tw;
                        tw = maxWidth;
                        th = Math.floor(vh * ratio);
                    }
                    canvas.width = tw;
                    canvas.height = th;
                    ctx.drawImage(tempVideo, 0, 0, tw, th);
                    const dataURL = canvas.toDataURL('image/jpeg', 0.4);
                    resolve(dataURL);
                } catch(e) {
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

    _startPreview(video) {
        if (!video || video.dataset.fullPlay === 'true') return;
        if (video.dataset.previewing === 'true') return;
        if (video.readyState < 2) return;
        video.dataset.previewing = 'true';
        video.muted = true;
        video.currentTime = 0;
        video.play().catch(e => console.log('Preview play failed', e));
        const stopTimeout = setTimeout(() => {
            if (video && video.dataset.previewing === 'true' && video.dataset.fullPlay !== 'true') {
                this._stopPreview(video);
            }
        }, this.config.previewDuration * 1000);
        video._previewTimeout = stopTimeout;
        const onEnded = () => {
            if (video.dataset.previewing === 'true') this._stopPreview(video);
        };
        video.addEventListener('ended', onEnded, { once: true });
        video._previewEndHandler = onEnded;
    },

    _stopPreview(video) {
        if (!video) return;
        if (video._previewTimeout) {
            clearTimeout(video._previewTimeout);
            delete video._previewTimeout;
        }
        if (video._previewEndHandler) {
            video.removeEventListener('ended', video._previewEndHandler);
            delete video._previewEndHandler;
        }
        if (video.dataset.previewing === 'true') {
            video.pause();
            video.currentTime = 0;
            video.dataset.previewing = 'false';
        }
    },

    _updateVisiblePreviews() {
        const container = document.querySelector('.bts-custom-carousel-wrapper');
        if (!container) return;
        const cRect = container.getBoundingClientRect();
        const allVideos = Array.from(document.querySelectorAll('.bts-custom-video'))
            .filter(v => v.dataset.loaded === 'true' && !v.dataset.fullPlay);
        const videosWithDistance = allVideos.map(v => {
            const parent = v.closest('.bts-custom-item');
            const rect = parent ? parent.getBoundingClientRect() : null;
            let distance = Infinity;
            if (rect) {
                const center = (rect.left + rect.right) / 2;
                const viewportCenter = (cRect.left + cRect.right) / 2;
                distance = Math.abs(center - viewportCenter);
            }
            return { video: v, distance };
        }).sort((a,b) => a.distance - b.distance);
        let previewCount = 0;
        for (let {video} of videosWithDistance) {
            const parent = video.closest('.bts-custom-item');
            if (!parent) continue;
            const rect = parent.getBoundingClientRect();
            const isVisible = (rect.right >= cRect.left && rect.left <= cRect.right);
            if (isVisible && video.dataset.previewing !== 'true' && previewCount < this.config.maxConcurrentPreviews) {
                this._startPreview(video);
                previewCount++;
            } else if (!isVisible && video.dataset.previewing === 'true') {
                this._stopPreview(video);
            }
        }
    },

    setupVideoElement(videoElement, src, videoId, isCached = false) {
        const parent = videoElement.closest('.bts-custom-item');
        if (!parent) return;
        
        // Avoid cloning if already set up
        if (this._clonedItems.has(parent)) {
            const video = parent.querySelector('.bts-custom-video');
            if (video && video.src !== src) {
                video.src = src;
                video.load();
            }
            return;
        }

        // Clone once to attach fresh listeners
        const newParent = parent.cloneNode(true);
        parent.parentNode.replaceChild(newParent, parent);
        this._clonedItems.add(newParent);
        const newVideo = newParent.querySelector('.bts-custom-video');
        newVideo.src = src;
        newVideo.load();
        newVideo.dataset.loaded = 'false';
        newVideo.dataset.currentSrc = src;

        const onCanPlay = () => {
            const loadingParent = newVideo.closest('.bts-custom-item');
            if (loadingParent) loadingParent.classList.remove('loading');
            newVideo.dataset.loaded = 'true';
            newVideo.removeEventListener('canplay', onCanPlay);
        };
        newVideo.addEventListener('canplay', onCanPlay, { once: true });

        newParent.addEventListener('mouseenter', () => {
            if (newVideo.dataset.previewing === 'true') this._stopPreview(newVideo);
            newVideo.dataset.fullPlay = 'true';
            newVideo.muted = false;
            const fullSrc = newParent.dataset.videoSrc;
            if (fullSrc) this._prioritizeFullVideoForInteraction(newVideo, fullSrc, videoId);
            newVideo.play().catch(e => console.log('Full play failed', e));
        });
        newParent.addEventListener('mouseleave', () => {
            if (!newVideo.paused) newVideo.pause();
            newVideo.dataset.fullPlay = 'false';
            newVideo.muted = true;
            setTimeout(() => {
                if (newVideo.dataset.fullPlay !== 'true' && this.isElementNearViewport(newParent)) {
                    this._startPreview(newVideo);
                }
            }, 200);
        });
        console.log(`Video ${videoId} ready for preview (${isCached ? 'cached' : 'network'})`);
        this._updateVisiblePreviews();
    },

    async cacheVideoInBackground(videoUrl, videoId) {
        if (!('caches' in window)) return;
        try {
            const cache = await caches.open('bts-videos-cache-v1');
            const response = await fetch(videoUrl);
            if (response.ok) await cache.put(videoUrl, response.clone());
        } catch(e) {}
    },

    async precacheAllVideos() {
        if (!('caches' in window)) return;
        const uniqueUrls = new Set();
        document.querySelectorAll('.bts-custom-item').forEach(item => {
            const url = item.dataset.videoSrc;
            if (url) uniqueUrls.add(url);
        });
        const cache = await caches.open('bts-videos-cache-v1');
        for (let url of uniqueUrls) {
            try {
                const cached = await cache.match(url);
                if (!cached) {
                    const response = await fetch(url);
                    if (response.ok) await cache.put(url, response);
                }
            } catch(e) {}
        }
    },

    unloadVideo(videoElement, videoId) {
        if (!videoElement || videoElement.dataset.loaded !== 'true') return;
        if (!videoElement.paused) return;
        this._stopPreview(videoElement);
        videoElement.pause();
        videoElement.src = '';
        videoElement.load();
        videoElement.dataset.loaded = 'false';
        if (videoElement.dataset.currentSrc && videoElement.dataset.currentSrc.startsWith('blob:')) {
            URL.revokeObjectURL(videoElement.dataset.currentSrc);
        }
    },

    mount(container = document.body) {
        if (document.getElementById('bts-custom-section')) return;
        container.insertAdjacentHTML('beforeend', this.render());
        this.init();
    },

    init() {
        this.detectPerformanceMode();
        if (typeof Swiper === 'undefined') {
            console.error('Swiper library not loaded.');
            return;
        }

        const btsSwiper = new Swiper('.bts-custom-swiper', {
            slidesPerView: 'auto',
            spaceBetween: this.config.lowPowerMode ? 15 : 25,
            centeredSlides: false,
            loop: true,
            loopedSlides: 24,
            loopAdditionalSlides: 24,
            speed: this.config.lowPowerMode ? 4000 : 8000,
            autoplay: {
                delay: this.config.lowPowerMode ? 3000 : 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
                stopOnLastSlide: false,
                waitForTransition: true
            },
            freeMode: false,
            slidesPerGroup: 1,
            simulateTouch: true,
            allowTouchMove: true,
            mousewheel: { forceToAxis: true, sensitivity: 1 },
            keyboard: { enabled: true, onlyInViewport: true },
            touchRatio: 1.5,
            grabCursor: true,
            touchStartPreventDefault: false,
            passiveListeners: true,
            resistance: true,
            resistanceRatio: 0.85,
            shortSwipes: true,
            longSwipes: false,
            navigation: {
                nextEl: '.bts-custom-button-next',
                prevEl: '.bts-custom-button-prev',
            },
            on: {
                init: () => {
                    console.log('BTS carousel ready – fast navigation enabled');
                    this.startLazyLoading();
                    this._previewInterval = setInterval(() => this._updateVisiblePreviews(), 1200);
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(() => this.precacheAllVideos(), { timeout: 5000 });
                    } else {
                        setTimeout(() => this.precacheAllVideos(), 3000);
                    }
                },
                touchEnd: (swiper) => {
                    if (swiper.autoplay?.running === false) swiper.autoplay.start();
                },
                slideChange: () => {
                    requestAnimationFrame(() => {
                        this.manageVideoQueue();
                        this._updateVisiblePreviews();
                    });
                },
                resize: () => {
                    requestAnimationFrame(() => {
                        this.manageVideoQueue();
                        this._updateVisiblePreviews();
                    });
                }
            }
        });

        window.BTSSliderInstance = this;
        this.btsSwiper = btsSwiper;
        this.setupVisibilityHandler();
        this.setupMemoryCleanup();
        console.log('BTS Slider mounted – navigation buttons responsive');
    },

    startLazyLoading() {
        this.loadQueue = [];
        this.activeLoads = 0;
        const items = document.querySelectorAll('.bts-custom-item');
        items.forEach(item => {
            const video = item.querySelector('.bts-custom-video');
            const src = item.dataset.videoSrc;
            const id = item.dataset.videoId;
            if (video && src && video.dataset.loaded !== 'true') {
                this.loadQueue.push({ video, videoSrc: src, videoId: id, item });
            }
        });
        for (let i = 0; i < this.config.maxConcurrentLoads; i++) {
            this.processNextInQueue();
        }
    },

    processNextInQueue() {
        if (this.loadQueue.length === 0 || this.activeLoads >= this.config.maxConcurrentLoads) return;
        const next = this.loadQueue.shift();
        if (!next) return;
        this.activeLoads++;
        this.loadVideoFromCache(next.video, next.videoSrc, next.videoId)
            .finally(() => {
                this.activeLoads--;
                this.processNextInQueue();
            });
    },

    isElementNearViewport(element) {
        if (!element) return false;
        const container = document.querySelector('.bts-custom-carousel-wrapper');
        if (!container) return true;
        const cRect = container.getBoundingClientRect();
        const eRect = element.getBoundingClientRect();
        const distance = this.config.preloadAheadDistance;
        return (eRect.right >= cRect.left - distance && eRect.left <= cRect.right + distance);
    },

    manageVideoQueue() {
        const videos = document.querySelectorAll('.bts-custom-video');
        const container = document.querySelector('.bts-custom-carousel-wrapper');
        if (!container) return;
        const cRect = container.getBoundingClientRect();
        videos.forEach(video => {
            const parent = video.closest('.bts-custom-item');
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
            const videos = document.querySelectorAll('.bts-custom-video');
            if (document.hidden) {
                videos.forEach(v => {
                    if (!v.paused) { v.pause(); v.dataset.wasPlaying = 'true'; }
                    this._stopPreview(v);
                });
                if (this.btsSwiper?.autoplay?.stop) this.btsSwiper.autoplay.stop();
            } else {
                videos.forEach(v => {
                    const parent = v.closest('.bts-custom-item');
                    if (parent && parent.matches(':hover') && v.dataset.wasPlaying === 'true') {
                        v.play().catch(()=>{});
                        delete v.dataset.wasPlaying;
                    }
                });
                if (this.btsSwiper?.autoplay?.start) this.btsSwiper.autoplay.start();
                this._updateVisiblePreviews();
            }
        });
    },

    setupMemoryCleanup() {
        setInterval(() => {
            const videos = document.querySelectorAll('.bts-custom-video');
            videos.forEach(video => {
                const parent = video.closest('.bts-custom-item');
                if (parent && !this.isElementNearViewport(parent) && video.paused && video.dataset.loaded === 'true') {
                    this.unloadVideo(video, parent.dataset.videoId);
                }
            });
        }, 30000);
        window.addEventListener('beforeunload', () => {
            if (this._previewInterval) clearInterval(this._previewInterval);
            document.querySelectorAll('.bts-custom-video').forEach(v => {
                if (v.src && v.src.startsWith('blob:')) URL.revokeObjectURL(v.src);
            });
        });
    }
};

// ========== INJECT STYLES (unchanged) ==========
if (!document.getElementById('bts-custom-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'bts-custom-spinner-style';
    style.textContent = `
        @keyframes btsCustomSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .bts-custom-loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(212,175,55,0.2);
            border-top: 3px solid var(--metallic-gold, #d4af37);
            border-right: 3px solid var(--metallic-gold, #d4af37);
            border-radius: 50%;
            animation: btsCustomSpin 0.8s linear infinite;
        }
        .bts-custom-button-prev,
        .bts-custom-button-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height: 50px;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 20;
            transition: all 0.3s ease;
            color: var(--metallic-gold, #d4af37);
            font-size: 24px;
            border: 1px solid rgba(212,175,55,0.5);
            pointer-events: auto;
        }
        .bts-custom-button-prev { left: 20px; }
        .bts-custom-button-next { right: 20px; }
        .bts-custom-button-prev:hover,
        .bts-custom-button-next:hover {
            background: rgba(212,175,55,0.3);
            transform: translateY(-50%) scale(1.1);
            border-color: var(--metallic-gold, #d4af37);
        }
        .bts-custom-hint {
            text-align: center;
            font-size: 0.85rem;
            color: rgba(212,175,55,0.7);
            margin-top: 12px;
            letter-spacing: 0.5px;
            font-weight: 400;
        }
        @media (max-width: 768px) {
            .bts-custom-button-prev,
            .bts-custom-button-next {
                width: 35px;
                height: 35px;
                font-size: 18px;
            }
            .bts-custom-button-prev { left: 10px; }
            .bts-custom-button-next { right: 10px; }
            .bts-custom-hint { font-size: 0.7rem; margin-top: 8px; }
        }
    `;
    document.head.appendChild(style);
}

if (typeof module !== 'undefined' && module.exports) module.exports = BTSSlider;
