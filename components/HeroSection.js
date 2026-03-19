const HeroSection = {
    render() {
        return `
            <section class="section hero-section" id="hero-section">
                <!-- Video with higher quality - single source -->
                <video class="hero-video-bg" autoplay muted loop playsinline poster="assets/hero-poster.jpg">
                    <source src="assets/hero-video.mp4" type="video/mp4">
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
                    <h1>VISUAL STORYTELLER</h1>
                    <div class="title-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="stat-videos" data-target="100" data-suffix="+">0+</span>
                            <span class="stat-label">Music Videos</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number" id="stat-views" data-target="50" data-suffix="M+">0M+</span>
                            <span class="stat-label">Views</span>
                        </div>
                        <div class="stat-divider"></div>
                        <div class="stat-item">
                            <span class="stat-number" id="stat-experience" data-target="15" data-suffix="+">0+</span>
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
            heroVideo.playbackRate = 0.85;
            heroVideo.load();
            heroVideo.style.imageRendering = 'high-quality';
            
            heroVideo.addEventListener('loadeddata', () => {
                console.log('Hero video loaded');
                heroVideo.play().catch(e => console.log('Autoplay prevented:', e));
            });
            
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
        
        // Set up counting animation when hero section becomes visible
        this.initCountingAnimation();
    },
    
    initRotatingArtists() {
        const artistRotations = {
            artist1: {
                currentIndex: 0,
                artists: [
                    'Alice Kimanzi',
                    'Agape Band',
                    'Sarah Mwangi',
                    'Joy Likavo',
                    'Eliya Mwantondo'
                ],
                intervalTime: 3000,
                element: document.getElementById('artist1')
            },
            artist2: {
                currentIndex: 0,
                artists: [
                    'Essence of Worship',
                    'Rehema Simfunkwe',
                    'Joel Maangi',
                    'Victoria Orenze',
                    'Psalmist Kay'
                ],
                intervalTime: 5000,
                element: document.getElementById('artist2')
            },
            artist3: {
                currentIndex: 0,
                artists: [
                    'Rhema Feast',
                    'Jackline Medza',
                    'Victorious Production TZ',
                    'Ruach Assemblies',
                    'Jaque Gachiri'
                ],
                intervalTime: 4000,
                element: document.getElementById('artist3')
            }
        };
        
        Object.keys(artistRotations).forEach(key => {
            const rotation = artistRotations[key];
            setTimeout(() => {
                this.rotateArtist(rotation);
            }, Math.random() * 1000);
        });
    },
    
    rotateArtist(rotation) {
        if (!rotation.element) return;
        
        rotation.element.classList.add('fade-out');
        
        setTimeout(() => {
            rotation.currentIndex = (rotation.currentIndex + 1) % rotation.artists.length;
            rotation.element.textContent = rotation.artists[rotation.currentIndex];
            
            rotation.element.classList.remove('fade-out');
            rotation.element.classList.add('fade-in');
            
            setTimeout(() => {
                rotation.element.classList.remove('fade-in');
            }, 500);
            
        }, 300);
        
        setTimeout(() => {
            this.rotateArtist(rotation);
        }, rotation.intervalTime);
    },
    
    initCountingAnimation() {
        const heroSection = document.getElementById('hero-section');
        if (!heroSection) return;
        
        // Options for the observer
        const observerOptions = {
            root: null, // viewport
            threshold: 0.3 // when 30% of the section is visible
        };
        
        // Callback when section becomes visible
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start counting
                    this.startCounting();
                    // Stop observing after counting starts
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(heroSection);
    },
    
    startCounting() {
        const statVideos = document.getElementById('stat-videos');
        const statViews = document.getElementById('stat-views');
        const statExperience = document.getElementById('stat-experience');
        
        if (!statVideos || !statViews || !statExperience) return;
        
        // Get target values and suffixes from data attributes
        const videosTarget = parseInt(statVideos.dataset.target);
        const videosSuffix = statVideos.dataset.suffix || '';
        
        const viewsTarget = parseInt(statViews.dataset.target);
        const viewsSuffix = statViews.dataset.suffix || '';
        
        const expTarget = parseInt(statExperience.dataset.target);
        const expSuffix = statExperience.dataset.suffix || '';
        
        // Animation duration in ms
        const duration = 2000; // 2 seconds
        const frameRate = 60; // 60fps
        const totalFrames = Math.round(duration / 1000 * frameRate);
        let frame = 0;
        
        // Increment values
        const incrementVideos = videosTarget / totalFrames;
        const incrementViews = viewsTarget / totalFrames;
        const incrementExp = expTarget / totalFrames;
        
        let currentVideos = 0;
        let currentViews = 0;
        let currentExp = 0;
        
        const timer = setInterval(() => {
            frame++;
            
            currentVideos = Math.min(currentVideos + incrementVideos, videosTarget);
            currentViews = Math.min(currentViews + incrementViews, viewsTarget);
            currentExp = Math.min(currentExp + incrementExp, expTarget);
            
            // Format numbers (whole numbers for videos and experience, maybe one decimal for views if needed)
            const videosDisplay = Math.floor(currentVideos);
            const viewsDisplay = currentViews.toFixed(0); // whole number for 50M
            const expDisplay = Math.floor(currentExp);
            
            statVideos.textContent = videosDisplay + videosSuffix;
            statViews.textContent = viewsDisplay + viewsSuffix;
            statExperience.textContent = expDisplay + expSuffix;
            
            if (frame >= totalFrames) {
                // Ensure final values are exact
                statVideos.textContent = videosTarget + videosSuffix;
                statViews.textContent = viewsTarget + viewsSuffix;
                statExperience.textContent = expTarget + expSuffix;
                clearInterval(timer);
            }
        }, 1000 / frameRate);
    }
};