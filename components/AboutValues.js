const AboutValues = {
    render() {
        return `
            <section class="section values-section" id="values-section">
                <div class="values-container">
                    <div class="values-header">
                        <h2>Amijoji Company</h2>
                        <p>East Africa's premier visual storytelling collective</p>
                    </div>

                    <div class="values-grid">
                        <!-- Left Column - Mission & Impact -->
                        <div class="values-left">
                            <div class="values-card">
                                <h3>Mission</h3>
                                <p>To elevate African gospel music through uncompromising visual excellence, bridging local talent with global production standards.</p>
                            </div>
                            
                            <div class="values-card">
                                <h3>Impact</h3>
                                <div class="values-stats">
                                    <div class="stat">
                                        <span class="stat-number">50+</span>
                                        <span class="stat-label">Artists</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-number">8</span>
                                        <span class="stat-label">Countries</span>
                                    </div>
                                    <div class="stat">
                                        <span class="stat-number">200+</span>
                                        <span class="stat-label">Productions</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column - Core Values with Sliders -->
                        <div class="values-right">
                            <div class="values-card">
                                <h3>Core Values</h3>
                                <div class="values-sliders">
                                    <div class="value-slider-item">
                                        <div class="value-header">
                                            <strong>Authenticity</strong>
                                            <span class="value-percent">98%</span>
                                        </div>
                                        <div class="value-slider-track">
                                            <div class="value-slider-fill" style="width: 0%;" data-target="98"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="value-slider-item">
                                        <div class="value-header">
                                            <strong>Excellence</strong>
                                            <span class="value-percent">96%</span>
                                        </div>
                                        <div class="value-slider-track">
                                            <div class="value-slider-fill" style="width: 0%;" data-target="96"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="value-slider-item">
                                        <div class="value-header">
                                            <strong>Collaboration</strong>
                                            <span class="value-percent">94%</span>
                                        </div>
                                        <div class="value-slider-track">
                                            <div class="value-slider-fill" style="width: 0%;" data-target="94"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="value-slider-item">
                                        <div class="value-header">
                                            <strong>Innovation</strong>
                                            <span class="value-percent">92%</span>
                                        </div>
                                        <div class="value-slider-track">
                                            <div class="value-slider-fill" style="width: 0%;" data-target="92"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Section - Philosophy -->
                    <div class="values-philosophy">
                        <div class="values-card full-width">
                            <h3>Philosophy</h3>
                            <p>We don't just film. We capture moments that transcend screens — connecting audiences to something greater. Every frame is intentional. Every edit serves the message.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    init() {
        // Animate sliders when section becomes visible
        const section = document.getElementById('values-section');
        if (section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSliders();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '50px' });
            
            observer.observe(section);
        }
        
        // Also trigger on window resize for mobile orientation changes
        window.addEventListener('resize', () => {
            if (this.isElementInViewport(section)) {
                this.animateSliders();
            }
        });
    },
    
    isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight - 100 && rect.bottom > 100;
    },

    animateSliders() {
        const sliders = document.querySelectorAll('.value-slider-fill');
        sliders.forEach(slider => {
            const target = parseInt(slider.dataset.target);
            // Reset width first (in case of re-animation)
            slider.style.width = '0%';
            // Animate the width after a tiny delay
            setTimeout(() => {
                slider.style.width = target + '%';
            }, 50);
        });
    }
};