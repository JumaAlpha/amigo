const AboutValues = {
    render() {
        return `
            <section class="section values-section" id="values-section">
                <!-- Content -->
                <div class="about-values-container">
                    <div class="about-values-wrapper">
                        <!-- Header Section -->
                        <div class="about-values-header">
                            <h2 class="about-values-title">
                                Our Story &amp;
                                <span class="gradient-text">Values</span>
                            </h2>
                            <p class="about-values-subtitle">
                                Founded in 2016, we lead visual storytelling in Tanzania with passion and innovation.
                            </p>
                        </div>

                        <!-- Mobile Tabs -->
                        <div class="about-values-mobile-tabs">
                            <!-- Tab Headers -->
                            <div class="about-values-tab-headers">
                                <button class="about-values-tab-btn active" data-tab="story">
                                    <i class="fas fa-history"></i>
                                    <span>Our Story</span>
                                </button>
                                <button class="about-values-tab-btn" data-tab="values">
                                    <i class="fas fa-star"></i>
                                    <span>Our Values</span>
                                </button>
                            </div>

                            <!-- Story Tab Content -->
                            <div class="about-values-tab-content active" id="story-tab-mobile">
                                <div class="about-values-card">
                                    <h3 class="about-values-card-title">
                                        <i class="fas fa-rocket"></i>
                                        Our Journey
                                    </h3>
                                    <div class="about-values-card-text">
                                        <p>Founded by Johnson Jimmy Sangu, we set new standards in production services through visual storytelling excellence.</p>
                                        <p>Since 2016, we've built a strong reputation as Tanzania's leading production company.</p>
                                    </div>

                                    <!-- Stats Grid -->
                                    <div class="about-values-stats-grid">
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">150+</div>
                                            <div class="about-values-stat-label">Projects</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">50+</div>
                                            <div class="about-values-stat-label">Clients</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">7+</div>
                                            <div class="about-values-stat-label">Years</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">12</div>
                                            <div class="about-values-stat-label">Awards</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Values Tab Content -->
                            <div class="about-values-tab-content" id="values-tab-mobile">
                                <div class="about-values-card">
                                    <h3 class="about-values-card-title">
                                        <i class="fas fa-gem"></i>
                                        Our Values
                                    </h3>
                                    <div class="about-values-skills">
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Creativity</h4>
                                                <span>95%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Pushing storytelling boundaries</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="95"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Excellence</h4>
                                                <span>90%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Highest quality standards</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="90"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Collaboration</h4>
                                                <span>92%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Teamwork for best results</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="92"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Innovation</h4>
                                                <span>88%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Embracing new technologies</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="88"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Desktop Layout (2 columns) -->
                        <div class="about-values-desktop">
                            <!-- Story Section -->
                            <div class="about-values-story">
                                <div class="about-values-card">
                                    <h3 class="about-values-card-title">
                                        <i class="fas fa-rocket"></i>
                                        Our Journey
                                    </h3>
                                    <div class="about-values-card-text">
                                        <p>Founded by Johnson Jimmy Sangu, we've set new standards in production services through exceptional visual storytelling.</p>
                                        <p>Since 2016, we've grown into Tanzania's premier production company, known for quality and innovation.</p>
                                        <p>We continuously evolve with cutting-edge equipment and emerging technologies.</p>
                                    </div>

                                    <div class="about-values-stats-grid">
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">150+</div>
                                            <div class="about-values-stat-label">Projects</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">50+</div>
                                            <div class="about-values-stat-label">Clients</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">7+</div>
                                            <div class="about-values-stat-label">Years</div>
                                        </div>
                                        <div class="about-values-stat-item">
                                            <div class="about-values-stat-number">12</div>
                                            <div class="about-values-stat-label">Awards</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Values Section -->
                            <div class="about-values-values">
                                <div class="about-values-card">
                                    <h3 class="about-values-card-title">
                                        <i class="fas fa-gem"></i>
                                        Our Values
                                    </h3>
                                    <div class="about-values-skills">
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Creativity</h4>
                                                <span>95%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Pushing boundaries in visual storytelling.</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="95"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Excellence</h4>
                                                <span>90%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Maintaining highest quality standards.</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="90"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Collaboration</h4>
                                                <span>92%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Achieving excellence through teamwork.</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="92"></div>
                                            </div>
                                        </div>
                                        <div class="about-values-skill-item">
                                            <div class="about-values-skill-header">
                                                <h4>Innovation</h4>
                                                <span>88%</span>
                                            </div>
                                            <p class="about-values-skill-desc">Embracing latest technologies.</p>
                                            <div class="about-values-skill-bar">
                                                <div class="about-values-skill-progress" data-width="88"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    init() {
        // Tab functionality for mobile
        const tabBtns = document.querySelectorAll('.about-values-tab-btn');
        const tabContents = document.querySelectorAll('.about-values-tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Update active button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                const activeContent = document.getElementById(`${tabId}-tab-mobile`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });

        // Animate skill bars when section becomes visible
        const section = document.getElementById('values-section');
        if (section) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(section);
        }
    },

    animateSkillBars() {
        const progressBars = document.querySelectorAll('.about-values-skill-progress');
        progressBars.forEach(bar => {
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 100);
        });
    }
};