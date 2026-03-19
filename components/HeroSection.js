const HeroSection = {
    render() {
        return `
            <section class="section hero-section">
                <!-- Video with higher quality - single source -->
                <video class="hero-video-bg" autoplay muted loop playsinline poster="assets/hero-poster.jpg">
                    <source src="assets/hero-video.mp4" type="video/mp4">
                    <!-- Fallback text -->
                    Your browser does not support the video tag.
                </video>
                
                <!-- Cinematic Overlay Layers -->
                <div class="hero-overlay gradient-overlay"></div>
                <div class="hero-overlay vignette-overlay"></div>
                <div class="hero-overlay texture-overlay"></div>
                
                <!-- Animated Light Leak (optional) -->
                <div class="light-leak"></div>
                
                <div class="hero-title">
                    AMIGO JOHNSON:<br>LEVELS TO THE WORLD
                    <small>gospel cinema</small>
                </div>
                
                <!-- Horizontal Scroll Indicator -->
                <div class="scroll-indicator horizontal">
                    <span class="scroll-arrow">⟩</span>
                    <span class="scroll-text">SCROLL</span>
                    <span class="scroll-arrow">⟨</span>
                </div>
            </section>
        `;
    },
    
    init() {
        const heroVideo = document.querySelector('.hero-video-bg');
        if (heroVideo) {
            // Set cinematic playback rate
            heroVideo.playbackRate = 0.85; // Slightly slower for cinematic feel
            
            // Ensure video loads with high quality
            heroVideo.load();
            
            // Force high quality rendering
            heroVideo.style.imageRendering = 'high-quality';
            
            // Log when video is ready
            heroVideo.addEventListener('loadeddata', () => {
                console.log('Hero video loaded');
                heroVideo.play().catch(e => console.log('Autoplay prevented:', e));
            });
            
            // Retry playing if needed (for browsers that block autoplay)
            document.addEventListener('click', () => {
                if (heroVideo.paused) {
                    heroVideo.play().catch(e => console.log('Play on click failed:', e));
                }
            }, { once: true });
        }
        
        // Add click handler to scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        const mainContent = document.querySelector('.main-content');
        
        if (scrollIndicator && mainContent) {
            scrollIndicator.addEventListener('click', () => {
                // Scroll to the next section (Work section)
                const sections = document.querySelectorAll('.section');
                if (sections.length > 1) {
                    sections[1].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'start' 
                    });
                }
            });
        }
    }
};