const WorkGallery = {
    render() {
        return `
            <section class="section work-section">
                <div class="section-header">· featured videos</div>
                
                <!-- Swiper Container -->
                <div class="swiper work-swiper">
                    <div class="swiper-wrapper">
                        ${this.renderThumbnails()}
                    </div>
                    
                    <!-- Navigation Buttons -->
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    
                    <!-- Pagination -->
                    <div class="swiper-pagination"></div>
                </div>
                
                <p class="hint-text">⟹ hover to play silent preview / swipe to browse</p>
            </section>
        `;
    },
    
    renderThumbnails() {
        const thumbnails = [
            { artist: 'Alice Kimanzi', song: 'Milele', video: 'https://assets.mixkit.co/videos/38824/38824-720.mp4' },
            { artist: 'Essence of Worship', song: 'Wimbo wa sifa', video: 'assets/work/Essence_Of_worship_Wimbo_wa_sifa.mp4' },
            { artist: 'Rhema Feast 2025', song: 'live recording', video: 'https://assets.mixkit.co/videos/38586/38586-720.mp4' },
            { artist: 'Mercy Chinwo', song: 'Excess Love', video: 'https://assets.mixkit.co/videos/39970/39970-720.mp4' },
            { artist: 'Jackline Medza', song: 'Only You', video: 'assets/work/OnlyYou.mp4' }
        ];
        
        return thumbnails.map(thumb => `
            <div class="swiper-slide">
                <div class="thumb-card" data-artist="${thumb.artist}">
                    <video class="thumb-video" loop muted preload="metadata" src="${thumb.video}"></video>
                    <div class="thumb-label">
                        ${thumb.artist} 
                        <span class="thumb-artist">“${thumb.song}”</span>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    init() {
        // Initialize Swiper
        const workSwiper = new Swiper('.work-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 30,
            centeredSlides: false,
            loop: false,
            speed: 600,
            
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
            
            // Responsive breakpoints
            breakpoints: {
                320: {
                    spaceBetween: 15,
                },
                768: {
                    spaceBetween: 20,
                },
                1024: {
                    spaceBetween: 30,
                }
            },
            
            // Mousewheel control (optional)
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
            },
            
            // Free mode for natural scrolling feel
            freeMode: {
                enabled: true,
                sticky: true,
                momentumRatio: 0.5,
            },
            
            // Auto height
            autoHeight: false,
            
            // Keyboard control
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
        });
        
        // Video hover playback
        const thumbCards = document.querySelectorAll('.thumb-card');
        thumbCards.forEach(card => {
            const video = card.querySelector('.thumb-video');
            if (!video) return;
            
            card.addEventListener('mouseenter', () => {
                video.play().catch(e => {});
            });
            
            card.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0;
            });
        });
        
        // Optional: Pause video when slide changes
        workSwiper.on('slideChange', () => {
            thumbCards.forEach(card => {
                const video = card.querySelector('.thumb-video');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        });
    }
};