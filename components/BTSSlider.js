const BTSSlider = {
    // Configuration
    config: {
        lowPowerMode: false
    },
    
    // Get video path
    getVideoPath(index) {
        const videoNumber = String(index + 1).padStart(2, '0');
        return `assets/bts/video${videoNumber}.mp4`;
    },
    
    // Render HTML
    render() {
        return `
            <section class="section am-bts-section" id="am-bts-section">
                <div class="am-bts-header">· behind the scenes</div>
                <div class="swiper am-bts-swiper">
                    <div class="swiper-wrapper">
                        ${this.renderSlides()}
                    </div>
                    <div class="am-bts-swiper-button-prev"></div>
                    <div class="am-bts-swiper-button-next"></div>
                </div>
                <div class="am-bts-pagination"></div>
            </section>
        `;
    },
    
    // Render slides with consistent dimensions
    renderSlides() {
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
                            <div class="am-bts-item" data-video-src="${videoPath}" data-video-id="${videoId}">
                                <video class="am-bts-video" muted loop playsinline preload="none">
                                    <source src="${videoPath}" type="video/mp4">
                                </video>
                                <div class="am-bts-play-hint">
                                    <i class="fas fa-play"></i>
                                </div>
                                <div class="am-bts-pattern"></div>
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
    
    // Setup video hover
    setupVideo(video, item) {
        let isPlaying = false;
        
        item.addEventListener('mouseenter', () => {
            if (video.readyState >= 2) {
                video.play().catch(e => console.log('Play error:', e));
                isPlaying = true;
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (isPlaying) {
                video.pause();
                isPlaying = false;
            }
        });
        
        // Load video on first hover
        item.addEventListener('mouseenter', () => {
            if (video.preload !== 'auto') {
                video.preload = 'auto';
                video.load();
            }
        }, { once: true });
    },
    
    // Initialize
    init() {
        // Initialize Swiper
        const swiper = new Swiper('.am-bts-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 20,
            centeredSlides: false,
            loop: true,
            speed: 600,
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
            breakpoints: {
                320: { spaceBetween: 10 },
                768: { spaceBetween: 15 },
                1024: { spaceBetween: 20 }
            },
            mousewheel: { forceToAxis: true },
            keyboard: { enabled: true }
        });
        
        // Setup videos
        setTimeout(() => {
            document.querySelectorAll('.am-bts-item').forEach(item => {
                const video = item.querySelector('.am-bts-video');
                if (video) {
                    this.setupVideo(video, item);
                }
            });
        }, 100);
        
        console.log('BTS Slider initialized');
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BTSSlider.init());
} else {
    BTSSlider.init();
}