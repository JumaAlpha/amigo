const AboutGear = {
    render() {
        return `
            <section class="section about-gear-section">
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
                                <button class="tab-btn" data-tab="gear">GEAR</button>
                                <div class="tab-indicator" id="tabIndicator"></div>
                            </div>
                            
                            <!-- Tab Content -->
                            <div class="tab-content">
                                <div class="tab-pane active" id="vision-tab">
                                    <h3 class="tab-title">The Vision</h3>
                                    <p class="tab-text">From the rhythmic energy of a church drum kit to the director's chair, Amigo Johnson has always moved to the beat of worship. Based in Nairobi and Dar es Salaam, he has redefined gospel visuals in East Africa, blending technical precision with a deep spiritual understanding of the message.</p>
                                </div>
                                
                                <div class="tab-pane" id="experience-tab">
                                    <h3 class="tab-title">The Experience</h3>
                                    <p class="tab-text">Amigo's portfolio features work with Alice Kimanzi, Essence of Worship, and Neema Gospel Choir. As Director of Video Production for Rhema Feast Kenya 2025, he captured ministry moments from Sinach and Nathaniel Bassey for a global audience.</p>
                                </div>
                                
                                <div class="tab-pane" id="standard-tab">
                                    <h3 class="tab-title">The Standard</h3>
                                    <p class="tab-text">Under "Levels to the World," Amigo leads a team of elite drone pilots and camera technicians delivering world-class live recordings and music videos. His mission remains the same: capture the spirit of worship through dynamic, high-definition storytelling.</p>
                                </div>
                                
                                <div class="tab-pane" id="gear-tab">
                                    <h3 class="tab-title">Gear</h3>
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
        let typingTimeout = null;
        let isTyping = false;
        
        // Tab functionality
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        const tabIndicator = document.getElementById('tabIndicator');
        const tabButtonsContainer = document.getElementById('tabButtons');
        
        function updateIndicator(activeButton) {
            if (!tabIndicator || !activeButton) return;
            const left = activeButton.offsetLeft;
            const width = activeButton.offsetWidth;
            tabIndicator.style.left = left + 'px';
            tabIndicator.style.width = width + 'px';
            tabIndicator.classList.add('active');
            setTimeout(() => tabIndicator.classList.remove('active'), 400);
        }
        
        setTimeout(() => {
            const activeButton = document.querySelector('.tab-btn.active');
            if (activeButton) updateIndicator(activeButton);
        }, 100);
        
        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const previousActive = document.querySelector('.tab-btn.active');
                    const previousIndex = previousActive ? Array.from(tabButtons).indexOf(previousActive) : -1;
                    const currentIndex = Array.from(tabButtons).indexOf(button);
                    
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    
                    button.classList.add('active');
                    updateIndicator(button);
                    
                    const tabId = button.dataset.tab + '-tab';
                    const activePane = document.getElementById(tabId);
                    if (activePane) {
                        if (currentIndex > previousIndex) {
                            activePane.classList.add('slide-right');
                        } else if (currentIndex < previousIndex) {
                            activePane.classList.add('slide-left');
                        }
                        activePane.classList.add('active');
                        setTimeout(() => {
                            activePane.classList.remove('slide-right', 'slide-left');
                        }, 500);
                    }
                });
            });
        }
        
        window.addEventListener('resize', () => {
            const activeButton = document.querySelector('.tab-btn.active');
            if (activeButton) updateIndicator(activeButton);
        });
        
        // Typing animation
        function typeWriter(element, text, index = 0) {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                typingTimeout = setTimeout(() => typeWriter(element, text, index), 100);
            } else {
                isTyping = false;
                setTimeout(() => {
                    if (element) element.style.borderRight = 'none';
                }, 500);
            }
        }
        
        function startTypingAnimation() {
            if (!nameElement) return;
            if (typingTimeout) clearTimeout(typingTimeout);
            nameElement.textContent = '';
            nameElement.style.borderRight = '3px solid var(--metallic-gold)';
            isTyping = true;
            typeWriter(nameElement, fullName);
        }
        
        function resetTypingAnimation() {
            if (typingTimeout) clearTimeout(typingTimeout);
            if (nameElement) {
                nameElement.textContent = '';
                nameElement.style.borderRight = '3px solid var(--metallic-gold)';
            }
            isTyping = false;
        }
        
        // Intersection Observer
        const aboutSection = document.querySelector('.about-gear-section');
        if (aboutSection && nameElement) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !isTyping && nameElement.textContent !== fullName) {
                        startTypingAnimation();
                    }
                });
            }, { threshold: 0.3, root: document.querySelector('.main-content') });
            observer.observe(aboutSection);
        }
        
        // Scroll parallax
        const mainContent = document.querySelector('.main-content');
        const bwPhoto = document.querySelector('.bw-photo');
        
        if (mainContent) {
            mainContent.addEventListener('scroll', () => {
                const scrollPosition = mainContent.scrollLeft;
                const sectionWidth = window.innerWidth;
                const aboutSectionStart = sectionWidth * 3;
                const aboutSectionEnd = sectionWidth * 4;
                
                if (scrollPosition > aboutSectionStart - 100 && scrollPosition < aboutSectionEnd - 100) {
                    if ((lastScrollPosition <= aboutSectionStart - 100 || lastScrollPosition >= aboutSectionEnd - 100) 
                        && nameElement.textContent !== fullName) {
                        resetTypingAnimation();
                        startTypingAnimation();
                    }
                    if (bwPhoto) {
                        const offset = (scrollPosition - aboutSectionStart) * 0.1;
                        bwPhoto.style.transform = `translateX(${Math.min(offset, 50)}px)`;
                    }
                }
                lastScrollPosition = scrollPosition;
            });
        }
        
        // Navigation trigger
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (link.dataset.section === 'about') {
                    setTimeout(() => {
                        resetTypingAnimation();
                        startTypingAnimation();
                        const activeButton = document.querySelector('.tab-btn.active');
                        if (activeButton) updateIndicator(activeButton);
                    }, 350);
                }
            });
        });
    }
};