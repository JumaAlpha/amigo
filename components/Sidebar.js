const Sidebar = {
    render() {
        return `
            <aside class="sidebar" id="mainSidebar">
                <!-- Hamburger Menu (Three Strips) -->
                <div class="hamburger-menu" id="hamburgerMenu">
                    <div class="hamburger-strip"></div>
                    <div class="hamburger-strip"></div>
                    <div class="hamburger-strip"></div>
                </div>
                
                <!-- Navigation Menu -->
                <ul class="nav-menu" id="navMenu">
                    <li><a href="#" class="nav-link active" data-section="hero">HOME</a></li>
                    <li><a href="#" class="nav-link" data-section="work">WORK</a></li>
                    <li><a href="#" class="nav-link" data-section="bts">BTS</a></li>
                    <li><a href="#" class="nav-link" data-section="about">ABOUT</a></li>
                    <li><a href="#" class="nav-link" data-section="booking">BOOKING</a></li>
                </ul>
                
                <!-- Social Drawer - Opens to Right with > symbol -->
                <div class="social-drawer-container">
                    <div class="social-toggle" id="socialToggle">
                        <i class="fas fa-share-alt"></i>
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
        const sidebar = document.getElementById('mainSidebar');
        const hamburger = document.getElementById('hamburgerMenu');
        const socialToggle = document.getElementById('socialToggle');
        const socialDrawer = document.getElementById('socialDrawer');
        const navLinks = document.querySelectorAll('.nav-link');
        const mainContent = document.querySelector('.main-content');
        const sections = document.querySelectorAll('.section');
        
        // Helper functions for screen size detection
        const isMobile = () => window.innerWidth <= 768;
        const isSmallMobile = () => window.innerWidth <= 480;
        
        // Get sidebar width based on current state and screen size
        const getSidebarWidth = () => {
            if (isMobile()) {
                // When mobile and sidebar is visible, it's expanded width, otherwise 0
                return sidebar.classList.contains('mobile-visible') ? 
                    (isSmallMobile() ? 220 : 240) : 0;
            } else {
                return sidebar.classList.contains('expanded') ? 
                    (isSmallMobile() ? 200 : 250) : (isSmallMobile() ? 60 : 80);
            }
        };
        
        // Update social drawer position based on sidebar width
        const updateDrawerPosition = () => {
            const sidebarWidth = getSidebarWidth();
            socialDrawer.style.left = sidebarWidth + 'px';
        };
        
        // Close social drawer and reset arrow
        const closeSocialDrawer = () => {
            socialToggle.classList.remove('active');
            socialDrawer.classList.remove('open');
            
            // Reset arrow position
            const arrow = socialToggle.querySelector('.arrow-symbol');
            const arrowOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 8);
            const expandedOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 5);
            
            if (sidebar.classList.contains('expanded') || sidebar.classList.contains('mobile-visible')) {
                arrow.style.transform = `translateX(${expandedOffset}px)`;
            } else {
                arrow.style.transform = `translateX(${arrowOffset}px)`;
            }
        };
        
        // Open sidebar on mobile (show it)
        const openMobileSidebar = () => {
            sidebar.classList.add('mobile-visible');
            mainContent.classList.add('sidebar-open'); // Add overlay class to main content
            // Hide floating toggle
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle) mobileToggle.classList.add('hidden');
            updateDrawerPosition();
        };
        
        // Close sidebar on mobile (hide it)
        const closeMobileSidebar = () => {
            sidebar.classList.remove('mobile-visible');
            mainContent.classList.remove('sidebar-open'); // Remove overlay class from main content
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
                openMobileSidebar();
            });
        }
        
        // Hamburger click behavior
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (isMobile()) {
                // On mobile, hamburger is inside sidebar: clicking it closes the sidebar
                if (sidebar.classList.contains('mobile-visible')) {
                    closeMobileSidebar();
                }
            } else {
                // On desktop, toggle expanded state
                sidebar.classList.toggle('expanded');
                mainContent.classList.toggle('sidebar-expanded');
                updateDrawerPosition();
                
                // Close social drawer when collapsing
                if (!sidebar.classList.contains('expanded')) {
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
                if (sidebar.classList.contains('expanded') || sidebar.classList.contains('mobile-visible')) {
                    arrow.style.transform = `translateX(${expandedOffset}px) rotate(180deg)`;
                } else {
                    arrow.style.transform = `translateX(${arrowOffset}px) rotate(180deg)`;
                }
            } else {
                if (sidebar.classList.contains('expanded') || sidebar.classList.contains('mobile-visible')) {
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
        
        // Close mobile sidebar when clicking on overlay (now attached to main content)
        document.addEventListener('click', (e) => {
            if (isMobile() && mainContent.classList.contains('sidebar-open') && 
                !sidebar.contains(e.target) && !e.target.classList.contains('mobile-menu-toggle')) {
                closeMobileSidebar();
            }
        });
        
        // Navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const sectionId = link.dataset.section;
                const sectionMap = {
                    'hero': 0, 'work': 1, 'bts': 2, 'about': 3, 'booking': 4
                };
                const targetIndex = sectionMap[sectionId];
                if (targetIndex !== undefined && sections[targetIndex]) {
                    sections[targetIndex].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'start' 
                    });
                }
                
                // On mobile, close sidebar after navigation
                if (isMobile()) {
                    closeMobileSidebar();
                }
            });
        });
        
        // Intersection Observer for active section highlighting
        const observerOptions = {
            root: mainContent,
            threshold: 0.5
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.classList[1]?.replace('-section', '') || 'hero';
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.dataset.section === sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        sections.forEach(section => observer.observe(section));
        
        // Window resize handling
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Switch to desktop mode
                sidebar.classList.remove('mobile-visible');
                mainContent.classList.remove('sidebar-open'); // Remove overlay class
                mainContent.classList.remove('sidebar-expanded');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (mobileToggle) mobileToggle.remove(); // Remove floating toggle on desktop
            } else {
                // Switch to mobile mode: ensure sidebar is hidden initially, and create toggle if needed
                sidebar.classList.remove('mobile-visible', 'expanded');
                mainContent.classList.remove('sidebar-open'); // Remove overlay class
                mainContent.classList.remove('sidebar-expanded');
                if (!document.querySelector('.mobile-menu-toggle')) {
                    const toggle = document.createElement('div');
                    toggle.className = 'mobile-menu-toggle';
                    toggle.innerHTML = '<div class="strip"></div><div class="strip"></div><div class="strip"></div>';
                    document.body.appendChild(toggle);
                    toggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openMobileSidebar();
                    });
                }
            }
            updateDrawerPosition();
            closeSocialDrawer(); // Close any open drawer on resize
        });
        
        // Escape key: close social drawer and/or mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (socialDrawer.classList.contains('open')) {
                    closeSocialDrawer();
                }
                if (isMobile() && sidebar.classList.contains('mobile-visible')) {
                    closeMobileSidebar();
                }
            }
        });
        
        // Swipe to open sidebar on mobile (from left edge)
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
                
                // If swiped from left edge (touchStartX near 0) and distance > 50px, and not scrolling vertically, open sidebar
                if (touchStartX < 50 && swipeDistanceX > 50 && swipeDistanceY < 30 && !sidebar.classList.contains('mobile-visible')) {
                    openMobileSidebar();
                }
            }, { passive: true });
        }
        
        // Initial setup
        if (isMobile()) {
            // Ensure sidebar is hidden on mobile start
            sidebar.classList.remove('mobile-visible', 'expanded');
            mainContent.classList.remove('sidebar-open'); // Remove overlay class
            mainContent.classList.remove('sidebar-expanded');
            // Create toggle if not exists
            if (!document.querySelector('.mobile-menu-toggle')) {
                const toggle = document.createElement('div');
                toggle.className = 'mobile-menu-toggle';
                toggle.innerHTML = '<div class="strip"></div><div class="strip"></div><div class="strip"></div>';
                document.body.appendChild(toggle);
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openMobileSidebar();
                });
            }
        } else {
            // Desktop: initial collapsed state
            sidebar.classList.remove('mobile-visible', 'expanded');
            mainContent.classList.remove('sidebar-open'); // Remove overlay class
            mainContent.classList.remove('sidebar-expanded');
        }
        
        // Initial drawer position
        updateDrawerPosition();
        
        // Initial arrow position
        const arrow = socialToggle.querySelector('.arrow-symbol');
        const arrowOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 8);
        const expandedOffset = isSmallMobile() ? 3 : (isMobile() ? 5 : 5);
        
        if (sidebar.classList.contains('expanded') || sidebar.classList.contains('mobile-visible')) {
            arrow.style.transform = `translateX(${expandedOffset}px)`;
        } else {
            arrow.style.transform = `translateX(${arrowOffset}px)`;
        }
        
        console.log('Sidebar initialized');
    }
};