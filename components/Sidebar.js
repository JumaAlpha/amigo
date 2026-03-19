const Sidebar = {
    render() {
        return `
            <aside class="sidebar" id="mainSidebar">
                <!-- Hamburger Menu (Two Strips) -->
                <div class="hamburger-menu" id="hamburgerMenu">
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
                
                <!-- Social Drawer - Opens to Right with > symbol outside sidebar -->
                <div class="social-drawer-container">
                    <div class="social-toggle" id="socialToggle">
                        <i class="fas fa-globe"></i>
                        <span class="arrow-symbol">></span>
                    </div>
                    
                    <div class="social-drawer" id="socialDrawer">
                        <a href="#" aria-label="Instagram" target="_blank">
                            <i class="fab fa-instagram"></i>
                        </a>
                        <a href="#" aria-label="Facebook" target="_blank">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" aria-label="YouTube" target="_blank">
                            <i class="fab fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </aside>
        `;
    },
    
    init() {
        const sidebar = document.getElementById('mainSidebar');
        const hamburger = document.getElementById('hamburgerMenu');
        const socialToggle = document.getElementById('socialToggle');
        const socialDrawer = document.getElementById('socialDrawer');
        const navLinks = document.querySelectorAll('.nav-link');
        const mainContent = document.querySelector('.main-content');
        const sections = document.querySelectorAll('.section');
        
        // Toggle sidebar expansion on hamburger click
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('expanded');
            mainContent.classList.toggle('sidebar-expanded');
            
            // Update drawer position when sidebar expands/collapses
            if (sidebar.classList.contains('expanded')) {
                socialDrawer.style.left = '250px';
            } else {
                socialDrawer.style.left = '80px';
            }
            
            // Close social drawer when sidebar collapses (optional)
            if (!sidebar.classList.contains('expanded')) {
                socialToggle.classList.remove('active');
                socialDrawer.classList.remove('open');
            }
        });
        
        // Toggle social drawer (opens to the right)
        socialToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            socialToggle.classList.toggle('active');
            socialDrawer.classList.toggle('open');
            
            // Ensure drawer is on top when open
            if (socialDrawer.classList.contains('open')) {
                socialDrawer.style.zIndex = '2000';
            }
            
            // Animate arrow position
            const arrow = socialToggle.querySelector('.arrow-symbol');
            if (socialDrawer.classList.contains('open')) {
                arrow.style.transform = 'translateX(5px) rotate(180deg)';
                if (!sidebar.classList.contains('expanded')) {
                    arrow.style.transform = 'translateX(8px) rotate(180deg)';
                }
            } else {
                arrow.style.transform = 'translateX(5px)';
                if (!sidebar.classList.contains('expanded')) {
                    arrow.style.transform = 'translateX(8px)';
                }
            }
        });
        
        // Close drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!socialToggle.contains(e.target) && !socialDrawer.contains(e.target)) {
                socialToggle.classList.remove('active');
                socialDrawer.classList.remove('open');
                
                // Reset arrow position
                const arrow = socialToggle.querySelector('.arrow-symbol');
                arrow.style.transform = 'translateX(5px)';
                if (!sidebar.classList.contains('expanded')) {
                    arrow.style.transform = 'translateX(8px)';
                }
            }
        });
        
        // Prevent drawer from closing when clicking inside it
        socialDrawer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Highlight active section on scroll
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
        
        // Navigation click handling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                const sectionId = link.dataset.section;
                const sectionMap = {
                    'hero': 0,
                    'work': 1,
                    'bts': 2,
                    'about': 3,
                    'booking': 4
                };
                
                const targetIndex = sectionMap[sectionId];
                if (targetIndex !== undefined && sections[targetIndex]) {
                    sections[targetIndex].scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest', 
                        inline: 'start' 
                    });
                    
                    // Optional: Close sidebar after navigation on mobile
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('expanded');
                        mainContent.classList.remove('sidebar-expanded');
                    }
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // Update drawer position based on sidebar state
                if (sidebar.classList.contains('expanded')) {
                    socialDrawer.style.left = '250px';
                } else {
                    socialDrawer.style.left = '80px';
                }
            } else {
                // Collapse on mobile and close drawer
                sidebar.classList.remove('expanded');
                mainContent.classList.remove('sidebar-expanded');
                socialToggle.classList.remove('active');
                socialDrawer.classList.remove('open');
                socialDrawer.style.left = '80px';
                
                // Reset arrow position
                const arrow = socialToggle.querySelector('.arrow-symbol');
                arrow.style.transform = 'translateX(8px)';
            }
        });
        
        // Add keyboard support (Escape to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                socialToggle.classList.remove('active');
                socialDrawer.classList.remove('open');
                
                // Reset arrow position
                const arrow = socialToggle.querySelector('.arrow-symbol');
                arrow.style.transform = 'translateX(5px)';
                if (!sidebar.classList.contains('expanded')) {
                    arrow.style.transform = 'translateX(8px)';
                }
            }
        });
        
        // Initial arrow position
        const arrow = socialToggle.querySelector('.arrow-symbol');
        arrow.style.transform = 'translateX(5px)';
        if (!sidebar.classList.contains('expanded')) {
            arrow.style.transform = 'translateX(8px)';
        }
        
        // Initial drawer position
        socialDrawer.style.left = '80px';
    }
};