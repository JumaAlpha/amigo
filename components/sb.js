const sb = {
    render() {
        return `
            <aside class="sb" id="mainsb">
                <!-- Hamburger Menu (Three Strips) -->
                <div class="hamburger-menu" id="hamburgerMenu">
                    <div class="hamburger-strip"></div>
                    <div class="hamburger-strip"></div>
                    <div class="hamburger-strip"></div>
                </div>
                
                <!-- Navigation Menu -->
                <ul class="nav-menu" id="navMenu">
                    <li><a href="#" class="nav-link active" data-section="hero">HOME</a></li>
                    <li><a href="#" class="nav-link" data-section="work">FEATURED CLIPS</a></li>
                    <li><a href="#" class="nav-link" data-section="recording">RECORDINGS</a></li>
                    <li><a href="#" class="nav-link" data-section="bts">BTS</a></li>
                    <li><a href="#" class="nav-link" data-section="about">ABOUT</a></li>
                    <li><a href="#" class="nav-link" data-section="values">VALUES</a></li>
                    <li><a href="#" class="nav-link" data-section="booking">BOOKING</a></li>
                </ul>
                
                <!-- Social Drawer - Opens to Right with > symbol -->
                <div class="social-drawer-container">
                    <div class="social-toggle" id="socialToggle">
                        <i class="fas fa-ellipsis-h"></i>
                        <span class="arrow-symbol">></span>
                    </div>
                    
                    <div class="social-drawer" id="socialDrawer">
                        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
            </aside>
        `;
    },
    
    init() {
        // Cache DOM elements
        const sb = document.getElementById('mainsb');
        const hamburger = document.getElementById('hamburgerMenu');
        const socialToggle = document.getElementById('socialToggle');
        const socialDrawer = document.getElementById('socialDrawer');
        const navLinks = document.querySelectorAll('.nav-link');
        const mainContent = document.querySelector('.main-content');
        const sections = document.querySelectorAll('.section');
        const sectionNavControls = document.createElement('div');
        let sectionScrollLock = false;
        let wheelDeltaBuffer = 0;
        let activeSectionIndex = 0;
        
        // Helper functions for screen size detection
        const isMobile = () => window.innerWidth <= 768;
        const isSmallMobile = () => window.innerWidth <= 480;
        
        // Get sb width based on current state and screen size
        const getsbWidth = () => {
            if (isMobile()) {
                // When mobile and sb is visible, it's expanded width, otherwise 0
                return sb.classList.contains('mobile-visible') ? 
                    (isSmallMobile() ? 280 : 300) : 0;
            } else {
                return sb.classList.contains('expanded') ? 
                    (isSmallMobile() ? 200 : 250) : (isSmallMobile() ? 60 : 80);
            }
        };
        
        // Update social drawer position based on sb width
        const updateDrawerPosition = () => {
            const sbWidth = getsbWidth();
            socialDrawer.style.left = sbWidth + 'px';
        };
        
        // Close social drawer and reset arrow
        const closeSocialDrawer = () => {
            socialToggle.classList.remove('active');
            socialDrawer.classList.remove('open');
            
            // Reset arrow position
            const arrow = socialToggle.querySelector('.arrow-symbol');
            const arrowOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 8);
            const expandedOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 5);
            
            if (sb.classList.contains('expanded') || sb.classList.contains('mobile-visible')) {
                arrow.style.transform = `translateX(${expandedOffset}px)`;
            } else {
                arrow.style.transform = `translateX(${arrowOffset}px)`;
            }
        };

        const getSectionIndex = () => {
            if (!mainContent || sections.length === 0) return 0;
            const currentLeft = mainContent.scrollLeft;
            let closestIndex = 0;
            let closestDistance = Infinity;

            sections.forEach((section, index) => {
                const distance = Math.abs(section.offsetLeft - currentLeft);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestIndex = index;
                }
            });

            return closestIndex;
        };

        const scrollToSection = (index) => {
            if (!mainContent || sections.length === 0) return;
            const nextIndex = Math.max(0, Math.min(index, sections.length - 1));
            const target = sections[nextIndex];
            if (!target) return;

            activeSectionIndex = nextIndex;
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 350);
            }
        };

        const realignCurrentSection = (index = getSectionIndex(), delay = 0) => {
            if (!mainContent || sections.length === 0) return;
            const targetIndex = Math.max(0, Math.min(index, sections.length - 1));
            const align = () => {
                const target = sections[targetIndex];
                if (!target) return;
                mainContent.scrollTo({
                    left: target.offsetLeft,
                    behavior: 'auto'
                });
                activeSectionIndex = targetIndex;
                setSectionNavState();
                if (typeof AOS !== 'undefined') AOS.refresh();
            };

            if (delay > 0) {
                setTimeout(align, delay);
            } else {
                requestAnimationFrame(align);
            }
        };

        const navigateSection = (direction) => {
            const currentIndex = getSectionIndex();
            scrollToSection(currentIndex + direction);
        };

        const isInteractiveScrollTarget = (target) => {
            return Boolean(target.closest(
                '.work-swiper, .bts-custom-swiper, .bts-custom-carousel-wrapper, .recording-description-panel, .recording-description-list, input, textarea, select, button, a'
            ));
        };

        const setSectionNavState = () => {
            const currentIndex = getSectionIndex();
            activeSectionIndex = currentIndex;
            sectionNavControls.querySelector('[data-section-nav="prev"]')?.toggleAttribute('disabled', currentIndex <= 0);
            sectionNavControls.querySelector('[data-section-nav="next"]')?.toggleAttribute('disabled', currentIndex >= sections.length - 1);
        };

        if (mainContent && sections.length > 1 && !document.querySelector('.section-nav-controls')) {
            sectionNavControls.className = 'section-nav-controls';
            sectionNavControls.setAttribute('aria-label', 'Section navigation');
            sectionNavControls.innerHTML = `
                <button class="section-nav-button section-nav-prev" type="button" data-section-nav="prev" aria-label="Previous section">
                    <i class="fas fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="section-nav-button section-nav-next" type="button" data-section-nav="next" aria-label="Next section">
                    <i class="fas fa-chevron-right" aria-hidden="true"></i>
                </button>
            `;
            document.body.appendChild(sectionNavControls);

            sectionNavControls.addEventListener('click', (e) => {
                const button = e.target.closest('[data-section-nav]');
                if (!button) return;
                navigateSection(button.dataset.sectionNav === 'next' ? 1 : -1);
            });
        }
        
        // Open sb on mobile (show it)
        const openMobilesb = () => {
            sb.classList.add('mobile-visible');
            document.body.classList.add('sb-open'); // Add class to body for overlay
            // Hide floating toggle
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle) mobileToggle.classList.add('hidden');
            updateDrawerPosition();
        };
        
        // Close sb on mobile (hide it)
        const closeMobilesb = () => {
            sb.classList.remove('mobile-visible');
            document.body.classList.remove('sb-open'); // Remove class from body
            // Show floating toggle
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle) mobileToggle.classList.remove('hidden');
            closeSocialDrawer(); // Also close any open drawer
            updateDrawerPosition();
        };
        
        // Create floating mobile toggle if it doesn't exist
        if (!document.querySelector('.mobile-menu-toggle') && isMobile()) {
            const toggle = document.createElement('div');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '<div class="strip"></div><div class="strip"></div><div class="strip"></div>';
            document.body.appendChild(toggle);
            
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                openMobilesb();
            });
        }
        
        // Hamburger click behavior
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMobile()) {
                // On mobile, hamburger is inside sb: clicking it closes the sb
                if (sb.classList.contains('mobile-visible')) {
                    closeMobilesb();
                }
            } else {
                // On desktop, toggle expanded state
                const currentIndex = getSectionIndex();
                sb.classList.toggle('expanded');
                mainContent.classList.toggle('sb-expanded');
                updateDrawerPosition();
                realignCurrentSection(currentIndex, 320);
                
                // Close social drawer when collapsing
                if (!sb.classList.contains('expanded')) {
                    closeSocialDrawer();
                }
            }
        });
        
        // Social toggle click
        socialToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            socialToggle.classList.toggle('active');
            socialDrawer.classList.toggle('open');
            
            // Ensure drawer is on top
            if (socialDrawer.classList.contains('open')) {
                socialDrawer.style.zIndex = '2000';
            } else {
                socialDrawer.style.zIndex = ''; // reset
            }
            
            // Animate arrow
            const arrow = socialToggle.querySelector('.arrow-symbol');
            const arrowOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 8);
            const expandedOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 5);
            
            if (socialDrawer.classList.contains('open')) {
                if (sb.classList.contains('expanded') || sb.classList.contains('mobile-visible')) {
                    arrow.style.transform = `translateX(${expandedOffset}px) rotate(180deg)`;
                } else {
                    arrow.style.transform = `translateX(${arrowOffset}px) rotate(180deg)`;
                }
            } else {
                if (sb.classList.contains('expanded') || sb.classList.contains('mobile-visible')) {
                    arrow.style.transform = `translateX(${expandedOffset}px)`;
                } else {
                    arrow.style.transform = `translateX(${arrowOffset}px)`;
                }
            }
        });
        
        // Close social drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!socialToggle.contains(e.target) && !socialDrawer.contains(e.target)) {
                closeSocialDrawer();
            }
        });
        
        // Prevent closing when clicking inside drawer
        socialDrawer.addEventListener('click', (e) => e.stopPropagation());
        
        // Close mobile sb when clicking on overlay
        document.addEventListener('click', (e) => {
            if (isMobile() && document.body.classList.contains('sb-open') && 
                !sb.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                closeMobilesb();
            }
        });
        
        // Navigation link clicks - Updated section mapping with VALUES
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const sectionId = link.dataset.section;
                const sectionMap = {
                    'hero': 0,
                    'work': 1,
                    'recording': 2,
                    'bts': 3,
                    'about': 4,
                    'values': 5,
                    'booking': 6
                };
                const targetIndex = sectionMap[sectionId];
                
                if (targetIndex !== undefined && sections[targetIndex]) {
                    scrollToSection(targetIndex);
                }
                
                // On mobile, close sb after navigation
                if (isMobile()) {
                    closeMobilesb();
                }
            });
        });
        
        // Intersection Observer for active section highlighting
        const observerOptions = {
            root: mainContent,
            threshold: 0.4
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Determine section ID from the section's class or id
                    let sectionId = '';
                    const section = entry.target;
                    
                    if (section.id === 'about-values-section') {
                        sectionId = 'values';
                    } else if (section.classList.contains('hero-section')) {
                        sectionId = 'hero';
                    } else if (section.classList.contains('work-section')) {
                        sectionId = 'work';
                    } else if (section.classList.contains('recording-section')) {
                        sectionId = 'recording';
                    } else if (section.classList.contains('bts-section')) {
                        sectionId = 'bts';
                    } else if (section.querySelector('.about-split')) {
                        sectionId = 'about';
                    } else if (section.classList.contains('booking-section')) {
                        sectionId = 'booking';
                    } else {
                        // Fallback to class name
                        const classList = section.classList;
                        for (let cls of classList) {
                            if (cls.includes('section')) {
                                const match = cls.replace('-section', '');
                                if (match === 'about') sectionId = 'about';
                                else if (match === 'values') sectionId = 'values';
                                else if (match !== 'section') sectionId = match;
                                break;
                            }
                        }
                    }
                    
                    if (sectionId) {
                        activeSectionIndex = Array.from(sections).indexOf(section);
                        setSectionNavState();
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.dataset.section === sectionId) {
                                link.classList.add('active');
                            }
                        });
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));

        mainContent?.addEventListener('wheel', (e) => {
            if (isInteractiveScrollTarget(e.target)) return;

            const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(dominantDelta) < 8) return;

            e.preventDefault();
            wheelDeltaBuffer += dominantDelta;

            if (sectionScrollLock || Math.abs(wheelDeltaBuffer) < 70) return;

            sectionScrollLock = true;
            navigateSection(wheelDeltaBuffer > 0 ? 1 : -1);
            wheelDeltaBuffer = 0;

            setTimeout(() => {
                sectionScrollLock = false;
            }, 700);
        }, { passive: false });

        mainContent?.addEventListener('scroll', () => {
            window.requestAnimationFrame(setSectionNavState);
        }, { passive: true });
        
        // Window resize handling
        window.addEventListener('resize', () => {
            const currentIndex = getSectionIndex();
            if (window.innerWidth > 768) {
                // Switch to desktop mode
                sb.classList.remove('mobile-visible');
                document.body.classList.remove('sb-open');
                mainContent.classList.remove('sb-expanded');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (mobileToggle) mobileToggle.remove(); // Remove floating toggle on desktop
            } else {
                // Switch to mobile mode: ensure sb is hidden initially, and create toggle if needed
                sb.classList.remove('mobile-visible', 'expanded');
                document.body.classList.remove('sb-open');
                mainContent.classList.remove('sb-expanded');
                if (!document.querySelector('.mobile-menu-toggle')) {
                    const toggle = document.createElement('div');
                    toggle.className = 'mobile-menu-toggle';
                    toggle.innerHTML = '<div class="strip"></div><div class="strip"></div><div class="strip"></div>';
                    document.body.appendChild(toggle);
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openMobilesb();
                    });
                }
            }
            updateDrawerPosition();
            closeSocialDrawer(); // Close any open drawer on resize
            realignCurrentSection(currentIndex, 120);
        });
        
        // Escape key: close social drawer and/or mobile sb
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (socialDrawer.classList.contains('open')) {
                    closeSocialDrawer();
                }
                if (isMobile() && sb.classList.contains('mobile-visible')) {
                    closeMobilesb();
                }
            }

            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

            const keyMap = {
                ArrowRight: 1,
                ArrowDown: 1,
                PageDown: 1,
                ArrowLeft: -1,
                ArrowUp: -1,
                PageUp: -1
            };

            if (keyMap[e.key]) {
                e.preventDefault();
                navigateSection(keyMap[e.key]);
            } else if (e.key === 'Home') {
                e.preventDefault();
                scrollToSection(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                scrollToSection(sections.length - 1);
            }
        });
        
        // Swipe to open sb on mobile (from left edge)
        if (isMobile()) {
            let touchStartX = 0;
            let touchStartY = 0;
            
            document.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            document.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const touchEndY = e.changedTouches[0].screenY;
                const swipeDistanceX = touchEndX - touchStartX;
                const swipeDistanceY = Math.abs(touchEndY - touchStartY);
                
                // If swiped from left edge (touchStartX near 0) and distance > 50px, and not scrolling vertically, open sb
                if (touchStartX < 50 && swipeDistanceX > 50 && swipeDistanceY < 30 && !sb.classList.contains('mobile-visible')) {
                    openMobilesb();
                }
            }, { passive: true });
        }
        
        // Initial setup
        if (isMobile()) {
            // Ensure sb is hidden on mobile start
            sb.classList.remove('mobile-visible', 'expanded');
            document.body.classList.remove('sb-open');
            mainContent.classList.remove('sb-expanded');
            // Create toggle if not exists
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('div');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<div class="strip"></div><div class="strip"></div><div class="strip"></div>';
                document.body.appendChild(toggle);
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMobilesb();
                });
            }
        } else {
            // Desktop: initial collapsed state
            sb.classList.remove('mobile-visible', 'expanded');
            document.body.classList.remove('sb-open');
            mainContent.classList.remove('sb-expanded');
        }
        
        // Initial drawer position
        updateDrawerPosition();
        setSectionNavState();
        
        // Initial arrow position
        const arrow = socialToggle.querySelector('.arrow-symbol');
        const arrowOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 8);
        const expandedOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 5);
        
        if (sb.classList.contains('expanded') || sb.classList.contains('mobile-visible')) {
            arrow.style.transform = `translateX(${expandedOffset}px)`;
        } else {
            arrow.style.transform = `translateX(${arrowOffset}px)`;
        }
        
        console.log('sb initialized with VALUES navigation item');
    }
};
