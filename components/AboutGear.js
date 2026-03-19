const AboutGear = {
    render() {
        return `
            <section class="section">
                <div class="about-split">
                    <div class="bw-photo">
                        <img src="assets/images/amigo.jpg" 
                             alt="Amigo Johnson B&W portrait">
                    </div>
                    <div class="bio-gear">
                        <h2 class="typing-name"></h2>
                        
                        <!-- Tab Navigation -->
                        <div class="tab-container">
                            <div class="tab-buttons" id="tabButtons">
                                <button class="tab-btn active" data-tab="vision">VISION</button>
                                <button class="tab-btn" data-tab="experience">EXPERIENCE</button>
                                <button class="tab-btn" data-tab="standard">STANDARD</button>
                                <button class="tab-btn" data-tab="gear">⚙️ GEAR</button>
                                <div class="tab-indicator" id="tabIndicator"></div>
                            </div>
                            
                            <!-- Tab Content -->
                            <div class="tab-content">
                                <!-- Vision Tab -->
                                <div class="tab-pane active" id="vision-tab">
                                    <h3 class="tab-title">The Vision</h3>
                                    <p class="tab-text">From the rhythmic energy of a church drum kit to the director's chair, Amigo Johnson (founder of Amijoji Company) has always moved to the beat of worship. Based in Nairobi and Dar es Salaam, he has redefined gospel visuals in East Africa, blending technical precision with a deep spiritual understanding of the message.</p>
                                </div>
                                
                                <!-- Experience Tab -->
                                <div class="tab-pane" id="experience-tab">
                                    <h3 class="tab-title">The Experience</h3>
                                    <p class="tab-text">Amigo's portfolio is a "who's who" of the gospel industry. He has directed iconic visuals for artists like Alice Kimanzi, Essence of Worship, and Neema Gospel Choir. His expertise in large-scale production was cemented as the Director of Video Production for Rhema Feast Kenya 2025, where he captured the ministry of global icons like Sinach and Nathaniel Bassey for a worldwide audience.</p>
                                </div>
                                
                                <!-- Standard Tab -->
                                <div class="tab-pane" id="standard-tab">
                                    <h3 class="tab-title">The Standard</h3>
                                    <p class="tab-text">Under his signature brand, "Levels to the World," Amigo leads a premier technical team—including elite drone pilots and camera technicians—to deliver world-class live recordings and music videos. Whether on a local stage or a global platform, his mission remains the same: to capture the spirit of worship through dynamic, high-definition storytelling.</p>
                                </div>
                                
                                <!-- Gear Tab -->
                                <div class="tab-pane" id="gear-tab">
                                    <h3 class="tab-title">⚙️ GEAR</h3>
                                    <ul class="gear-list">
                                        <li>RED Digital Komodo</li>
                                        <li>Sony FX9 / FX6</li>
                                        <li>DJI Ronin 4D</li>
                                        <li>Angénieux zooms</li>
                                        <li>ARRI SkyPanel</li>
                                        <li>DJI Inspire 3</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    },
    
    init() {
        const nameElement = document.querySelector('.typing-name');
        const fullName = "AMIGO JOHNSON";
        let lastScrollPosition = 0;
        
        // Tab functionality with sliding indicator
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        const tabIndicator = document.getElementById('tabIndicator');
        const tabButtonsContainer = document.getElementById('tabButtons');
        
        // Function to update indicator position
        function updateIndicator(activeButton) {
            if (!tabIndicator || !activeButton) return;
            
            const buttonRect = activeButton.getBoundingClientRect();
            const containerRect = tabButtonsContainer.getBoundingClientRect();
            
            // Calculate position relative to container
            const left = activeButton.offsetLeft;
            const width = activeButton.offsetWidth;
            
            // Apply smooth transition
            tabIndicator.style.left = left + 'px';
            tabIndicator.style.width = width + 'px';
            
            // Add elastic animation class
            tabIndicator.classList.add('active');
            setTimeout(() => {
                tabIndicator.classList.remove('active');
            }, 400);
        }
        
        // Set initial indicator position
        setTimeout(() => {
            const activeButton = document.querySelector('.tab-btn.active');
            updateIndicator(activeButton);
        }, 100);
        
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Get previous active tab for direction detection
                    const previousActive = document.querySelector('.tab-btn.active');
                    const previousIndex = previousActive ? Array.from(tabButtons).indexOf(previousActive) : -1;
                    const currentIndex = Array.from(tabButtons).indexOf(button);
                    
                    // Remove active class from all buttons and panes
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    // Update indicator position
                    updateIndicator(button);
                    
                    // Show corresponding tab pane with direction-based animation
                    const tabId = button.dataset.tab + '-tab';
                    const activePane = document.getElementById(tabId);
                    if (activePane) {
                        // Add direction class for animation
                        if (currentIndex > previousIndex) {
                            activePane.classList.add('slide-right');
                        } else if (currentIndex < previousIndex) {
                            activePane.classList.add('slide-left');
                        }
                        
                        activePane.classList.add('active');
                        
                        // Remove direction class after animation
                        setTimeout(() => {
                            activePane.classList.remove('slide-right', 'slide-left');
                        }, 500);
                    }
                });
            });
        }
        
        // Handle window resize - update indicator position
        window.addEventListener('resize', () => {
            const activeButton = document.querySelector('.tab-btn.active');
            updateIndicator(activeButton);
        });
        
        // Typing animation function
        function typeWriter(element, text, index = 0) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(() => typeWriter(element, text, index), 100);
            } else {
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }
        
        // Function to start typing animation
        function startTypingAnimation() {
            if (nameElement) {
                nameElement.textContent = '';
                nameElement.style.borderRight = '3px solid var(--metallic-gold)';
                typeWriter(nameElement, fullName);
            }
        }
        
        // Intersection Observer for About section
        const aboutSection = document.querySelector('.section .about-split');
        
        if (aboutSection && nameElement) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        startTypingAnimation();
                    }
                });
            }, { 
                threshold: 0.3,
                root: document.querySelector('.main-content')
            });
            
            observer.observe(aboutSection);
        }
        
        // Scroll event for parallax
        const mainContent = document.querySelector('.main-content');
        const bwPhoto = document.querySelector('.bw-photo');
        
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                const scrollPosition = mainContent.scrollLeft;
                const sectionWidth = window.innerWidth;
                const aboutSectionIndex = 3;
                
                const aboutSectionStart = sectionWidth * aboutSectionIndex;
                const aboutSectionEnd = sectionWidth * (aboutSectionIndex + 1);
                
                // Check if we've just entered the About section
                if (scrollPosition > aboutSectionStart - 100 && 
                    scrollPosition < aboutSectionEnd - 100) {
                    
                    if (lastScrollPosition <= aboutSectionStart - 100 || 
                        lastScrollPosition >= aboutSectionEnd - 100) {
                        startTypingAnimation();
                    }
                    
                    // Parallax effect
                    if (bwPhoto) {
                        const offset = (scrollPosition - aboutSectionStart) * 0.1;
                        bwPhoto.style.transform = `translateX(${Math.min(offset, 50)}px)`;
                    }
                }
                
                lastScrollPosition = scrollPosition;
            });
        }
        
        // Navigation click trigger
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.dataset.section === 'about') {
                    setTimeout(() => {
                        startTypingAnimation();
                        // Update tab indicator when coming from navigation
                        const activeButton = document.querySelector('.tab-btn.active');
                        updateIndicator(activeButton);
                    }, 300);
                }
            });
        });
    }
};