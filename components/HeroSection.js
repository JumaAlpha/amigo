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
                    <span class="title-pre">GOSPEL MUSIC VIDEO DIRECTOR</span>
                    <h1>VISUAL STORYTELLER<br>FOR WORSHIP</h1>
                    <div class="title-stats">
                        <div class="stat-item">
                            <span class="stat-number">100+</span>
                            <span class="stat-label">Music Videos</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">50M+</span>
                            <span class="stat-label">Views</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number">15+</span>
                            <span class="stat-label">Years Experience</span>
                        </div>
                    </div>
                    <div class="title-featured">
                        <span>Featured Work: </span>
                        <span class="rotating-artist" id="artist1">Alice Kimanzi</span>
                        <span class="featured-divider">•</span>
                        <span class="rotating-artist" id="artist2">Essence of Worship</span>
                        <span class="featured-divider">•</span>
                        <span class="rotating-artist" id="artist3">Rhema Feast</span>
                    </div>
                </div>
                
                <!-- Horizontal Scroll Indicator -->
                <div class="scroll-indicator horizontal">
                    <span class="scroll-arrow">⟩</span>
                    <span class="scroll-text">VIEW WORK</span>
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
        
        // Initialize rotating artists
        this.initRotatingArtists();
        
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
    },
    
    initRotatingArtists() {
        // Artist rotations for each position with different timing
        const artistRotations = {
            artist1: {
                currentIndex: 0,
                artists: [
                    'Alice Kimanzi',
                    'Agape Band',
                    'Sarah Mwangi',
                    'Heaven\'s Voice',
                    'Grace Choir'
                ],
                intervalTime: 3000, // 3 seconds
                element: document.getElementById('artist1')
            },
            artist2: {
                currentIndex: 0,
                artists: [
                    'Essence of Worship',
                    'Rehema Simfunkwe',
                    'Worship Life',
                    'Victoria Orenze',
                    'Psalmist Kay'
                ],
                intervalTime: 5000, // 5 seconds
                element: document.getElementById('artist2')
            },
            artist3: {
                currentIndex: 0,
                artists: [
                    'Rhema Feast',
                    'Jackline Medza',
                    'Great Man',
                    'Ruach Assemblies',
                    'Jaque Gachiri'
                ],
                intervalTime: 4000, // 4 seconds
                element: document.getElementById('artist3')
            }
        };
        
        // Start rotation for each artist independently
        Object.keys(artistRotations).forEach(key => {
            const rotation = artistRotations[key];
            
            // Set initial random start (so they don't all change at once)
            setTimeout(() => {
                this.rotateArtist(rotation);
            }, Math.random() * 1000);
        });
    },
    
    rotateArtist(rotation) {
        if (!rotation.element) return;
        
        // Add fade-out class
        rotation.element.classList.add('fade-out');
        
        // Change text after fade out
        setTimeout(() => {
            // Update to next artist
            rotation.currentIndex = (rotation.currentIndex + 1) % rotation.artists.length;
            rotation.element.textContent = rotation.artists[rotation.currentIndex];
            
            // Remove fade-out and add fade-in
            rotation.element.classList.remove('fade-out');
            rotation.element.classList.add('fade-in');
            
            // Remove fade-in class after animation completes
            setTimeout(() => {
                rotation.element.classList.remove('fade-in');
            }, 500);
            
        }, 300); // Wait for fade out to complete
        
        // Schedule next rotation
        setTimeout(() => {
            this.rotateArtist(rotation);
        }, rotation.intervalTime);
    }
};