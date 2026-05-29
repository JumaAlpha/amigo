const rs = {
    playlistId: 'PLD7Kg_fa7aSxaOhKDm0NYe-869_1zysI1',
    // Cache properties kept but no longer used (safe to leave)
    cacheKey: 'amigo_recording_playlist_cache_v1',
    cacheDuration: 24 * 60 * 60 * 1000,
    videos: [
        { id: 'NwjhASzKuTY', artist: 'Njoki Munyi', title: 'BABA - Njoki Munyi || Offical Live Video' },
        { id: 'oT_S6cwhJic', artist: 'Jaque Gachiri', title: 'NIMESAMEHEWA / USIMTAFUTE KABURINI - Jaque Gachiri ft Onjula Praise // Official Live Video' },
        { id: 'WoDDX3mk0cw', artist: 'Neema Gospel Choir', title: 'Neema Gospel Choir - Nasema Asante (Live Music Video)' },
        { id: 'n-PRvVFRYNU', artist: 'Eddieson Owuor', title: 'NITULIE NIKUJUE (Official Video) - EDDIESON FT @ManoloKenya' },
        { id: 'odrOA5ctTPQ', artist: 'Wanza', title: 'Umwaminifu- Wanza Ft Anthony Juma || Official Live 4K Video' },
        { id: 'x3qFQqNncJw', artist: 'Alice Kimanzi', title: 'Alice Kimanzi - Yesu Uinuliwe |Official Video|' },
        { id: '2ZEljr4QJPY', artist: 'Neema Gospel Choir', title: 'Neema Gospel Choir - Sijawahi Shinda Ft. Paul Clement (Live Music Video)' },
        { id: 'KaH1IkAqTpA', artist: 'Eve Nyasha Ngoloma', title: 'Eve Nyasha Ngoloma Ft Paul Clement & Kambua - Muite (Official Music Video)' },
        { id: 'Unej7v_l1os', artist: 'BOAZ DANKEN', title: 'Boaz Danken- JEHOVAH NI MUNGU ft @EliyaMwantondo & @PastorEpa' },
        { id: 'UnPrDKn4QyA', artist: 'Medza', title: 'What If God Sang To You? | EMMANUEL (God With Us) | Live | Healed Project | Gospel Song 2026' },
        { id: 'X_TK7PLPxPI', artist: 'BOAZ DANKEN', title: 'Boaz Danken-TAAMBATANA NAWE MILELE LoveAnthemtoJESUS' },
        { id: '87lY55cmau8', artist: 'Njoki Munyi', title: 'TAWALA - NJOKI MUNYI || Official Live Recording Video' },
        { id: '-gVR8FHjC7E', artist: 'Rehema Simfukwe', title: 'Rehema Simfukwe Ft Neema Gospel Choir Damu Yako ( Live Music Video )' },
        { id: 'JYs97sxZRls', artist: 'Alice Kimanzi', title: 'Alice Kimanzi - Unaweza |Official Video|' },
        { id: 'ZyXhq_cgB5I', artist: 'Neema Gospel Choir', title: 'Neema Gospel Choir - Hakuna Gumu (Live Music Video)' }
    ],

    escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    // formatDescription removed – no descriptions needed

    render() {
        const origin = encodeURIComponent(window.location.origin);
        const embedUrl = `https://www.youtube.com/embed/videoseries?list=${this.playlistId}&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&origin=${origin}`;
        const playlistUrl = `https://www.youtube.com/playlist?list=${this.playlistId}`;
        const fallbackVideos = this.normalizeVideos(this.videos);

        return `
            <section class="section recording-section" id="recording-section" data-aos="fade-up" data-aos-duration="700">
                <div class="recording-shell">
                    <div class="recording-copy">
                        <div class="section-header">· recordings</div>
                        <p class="recording-kicker">Video Directed by Amigo Johnson</p>
                        <a class="recording-link" href="${playlistUrl}" target="_blank" rel="noopener">
                            <span>Open playlist</span>
                            <i class="fas fa-arrow-up-right-from-square" aria-hidden="true"></i>
                        </a>
                    </div>

                    <div class="recording-player-wrap" id="recording-player-wrap">
                        <div class="recording-pip-bar" data-pip-drag-handle>
                            <span>Now playing</span>
                            <div class="recording-pip-actions">
                                <button type="button" data-pip-return aria-label="Return to recordings">
                                    <i class="fas fa-up-right-and-down-left-from-center" aria-hidden="true"></i>
                                </button>
                                <button type="button" data-pip-close aria-label="Close mini player">
                                    <i class="fas fa-xmark" aria-hidden="true"></i>
                                </button>
                            </div>
                        </div>
                        <iframe
                            class="recording-player"
                            id="recording-player"
                            src="${embedUrl}"
                            title="Video Directed by Amigo Johnson YouTube playlist"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                            loading="lazy">
                        </iframe>
                    </div>

                    <div class="recording-description-panel" aria-live="polite">
                        <div class="recording-description-header">
                            <span>Latest Videos</span>
                            <span id="recording-feed-count">${fallbackVideos.length}</span>
                        </div>
                        <div class="recording-description-list" id="recording-description-list">
                            ${this.renderDescriptions(fallbackVideos)}
                        </div>
                    </div>
                </div>
            </section>
        `;
    },

    normalizeVideos(videos) {
        return videos.map(video => ({
            id: video.id || '',
            title: video.title || 'Untitled video',
            author: video.author || video.artist || 'YouTube',
            url: video.url || (video.id
                ? `https://www.youtube.com/watch?v=${video.id}&list=${this.playlistId}`
                : `https://www.youtube.com/playlist?list=${this.playlistId}`)
        }));
    },

    renderDescriptions(entries) {
        const videos = this.normalizeVideos(entries);

        if (!videos.length) {
            return '<div class="recording-description-empty">No songs available.</div>';
        }

        // No description text rendered – only title, artist, and watch link
        return videos.map((entry, index) => `
            <article class="recording-description-item">
                <button class="recording-song-button" type="button" data-video-id="${this.escapeHtml(entry.id)}">
                    <span class="recording-index">${String(index + 1).padStart(2, '0')}</span>
                    <div>
                        <h3>${this.escapeHtml(entry.title)}</h3>
                        <p>${this.escapeHtml(entry.author)}</p>
                    </div>
                </button>
                <a href="${this.escapeHtml(entry.url)}" target="_blank" rel="noopener">Watch on YouTube</a>
            </article>
        `).join('');
    },

    // parseFeed, readCache, writeCache removed – no external fetching

    buildVideoEmbedUrl(videoId, autoplay = true) {
        const origin = encodeURIComponent(window.location.origin);
        const autoplayParam = autoplay ? '&autoplay=1' : '';
        return `https://www.youtube.com/embed/${videoId}?list=${this.playlistId}&rel=0&modestbranding=1&enablejsapi=1&playsinline=1&origin=${origin}${autoplayParam}`;
    },

    bindSongList() {
        const player = document.getElementById('recording-player');
        if (!player) return;

        const oldButtons = document.querySelectorAll('.recording-song-button');
        if (oldButtons.length === 0) return;

        oldButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });

        const freshButtons = document.querySelectorAll('.recording-song-button');
        freshButtons.forEach(button => {
            button.addEventListener('click', () => {
                const videoId = button.dataset.videoId;
                if (!videoId) return;

                if (this._ytPlayer?.loadVideoById) {
                    this._ytPlayer.loadVideoById(videoId);
                } else {
                    player.src = this.buildVideoEmbedUrl(videoId);
                }
                this._isPlaying = true;
                freshButtons.forEach(item => item.classList.remove('active'));
                button.classList.add('active');
            });
        });
    },

    renderSongData(entries) {
        const list = document.getElementById('recording-description-list');
        const count = document.getElementById('recording-feed-count');
        if (!list) return;

        list.innerHTML = this.renderDescriptions(entries);
        if (count) count.textContent = `${entries.length} songs`;
        this.bindSongList();
    },

    _initialized: false,
    _ytPlayer: null,
    _isPlaying: false,
    _isSectionVisible: true,
    _pipVisible: false,
    _pipDragState: null,
    _handlePipDragMove: null,
    _handlePipDragEnd: null,

    loadYouTubeApi() {
        if (window.YT?.Player) return Promise.resolve();
        if (window.__recordingYouTubeApiPromise) return window.__recordingYouTubeApiPromise;

        window.__recordingYouTubeApiPromise = new Promise((resolve) => {
            const previousReady = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (typeof previousReady === 'function') previousReady();
                resolve();
            };

            if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(script);
            }
        });

        return window.__recordingYouTubeApiPromise;
    },

    setupYouTubePlayer() {
        const iframe = document.getElementById('recording-player');
        if (!iframe) return;

        this.loadYouTubeApi().then(() => {
            if (!window.YT?.Player || this._ytPlayer) return;

            this._ytPlayer = new YT.Player(iframe, {
                events: {
                    onStateChange: (event) => {
                        this._isPlaying = event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.BUFFERING;
                        this.evaluatePipState();
                    }
                }
            });
        }).catch((error) => {
            console.warn('Could not initialize YouTube iframe API:', error);
        });
    },

    setupPip() {
        const pip = document.getElementById('recording-player-wrap');
        if (!pip) return;

        pip.querySelector('[data-pip-close]')?.addEventListener('click', () => {
            if (this._ytPlayer?.pauseVideo) this._ytPlayer.pauseVideo();
            this._isPlaying = false;
            this.hidePip(false);
        });

        pip.querySelector('[data-pip-return]')?.addEventListener('click', () => {
            document.getElementById('recording-section')?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
            this.restorePlayer();
        });

        pip.querySelector('[data-pip-drag-handle]')?.addEventListener('pointerdown', (event) => this.startPipDrag(event));
    },

    startPipDrag(event) {
        const pip = document.getElementById('recording-player-wrap');
        if (!pip || event.button !== 0) return;

        const rect = pip.getBoundingClientRect();
        pip.style.left = `${rect.left}px`;
        pip.style.top = `${rect.top}px`;
        pip.style.right = 'auto';
        pip.style.bottom = 'auto';

        this._pipDragState = {
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };

        pip.setPointerCapture(event.pointerId);
        pip.classList.add('dragging');
        pip.addEventListener('pointermove', this._handlePipDragMove);
        pip.addEventListener('pointerup', this._handlePipDragEnd);
        pip.addEventListener('pointercancel', this._handlePipDragEnd);
    },

    movePip(event) {
        const pip = document.getElementById('recording-player-wrap');
        if (!pip || !this._pipDragState) return;

        const maxLeft = window.innerWidth - pip.offsetWidth - 8;
        const maxTop = window.innerHeight - pip.offsetHeight - 8;
        const nextLeft = Math.max(8, Math.min(event.clientX - this._pipDragState.offsetX, maxLeft));
        const nextTop = Math.max(8, Math.min(event.clientY - this._pipDragState.offsetY, maxTop));

        pip.style.left = `${nextLeft}px`;
        pip.style.top = `${nextTop}px`;
    },

    endPipDrag() {
        const pip = document.getElementById('recording-player-wrap');
        if (!pip || !this._pipDragState) return;

        pip.releasePointerCapture(this._pipDragState.pointerId);
        pip.classList.remove('dragging');
        pip.removeEventListener('pointermove', this._handlePipDragMove);
        pip.removeEventListener('pointerup', this._handlePipDragEnd);
        pip.removeEventListener('pointercancel', this._handlePipDragEnd);
        this._pipDragState = null;
    },

    showPip() {
        if (this._pipVisible) return;

        const pip = document.getElementById('recording-player-wrap');
        if (!pip) return;

        document.body.classList.add('recording-pip-mode');
        document.getElementById('recording-section')?.classList.add('recording-pip-host');
        pip.classList.add('recording-pip-active');
        this._pipVisible = true;
    },

    evaluatePipState() {
        this.updateSectionVisibility();

        if (this._isPlaying && !this._isSectionVisible) {
            this.showPip();
            return;
        }

        if (this._pipVisible) {
            this.restorePlayer();
        }
    },

    updateSectionVisibility() {
        const section = document.getElementById('recording-section');
        const mainContent = document.getElementById('main-content');
        if (!section) {
            this._isSectionVisible = false;
            return false;
        }

        const sectionRect = section.getBoundingClientRect();
        const rootRect = mainContent ? mainContent.getBoundingClientRect() : {
            left: 0,
            right: window.innerWidth,
            top: 0,
            bottom: window.innerHeight
        };

        const visibleWidth = Math.min(sectionRect.right, rootRect.right) - Math.max(sectionRect.left, rootRect.left);
        const visibleHeight = Math.min(sectionRect.bottom, rootRect.bottom) - Math.max(sectionRect.top, rootRect.top);
        const isVisible = visibleWidth > sectionRect.width * 0.45 && visibleHeight > sectionRect.height * 0.45;

        this._isSectionVisible = isVisible;
        return isVisible;
    },

    restorePlayer() {
        const wrap = document.getElementById('recording-player-wrap');
        if (wrap) {
            wrap.classList.remove('recording-pip-active', 'dragging');
            wrap.style.left = '';
            wrap.style.top = '';
            wrap.style.right = '';
            wrap.style.bottom = '';
        }
        document.body.classList.remove('recording-pip-mode');
        document.getElementById('recording-section')?.classList.remove('recording-pip-host');
        this._pipVisible = false;
    },

    hidePip(restore = true) {
        if (restore) {
            this.restorePlayer();
            return;
        }

        const pip = document.getElementById('recording-player-wrap');
        if (pip) pip.classList.remove('recording-pip-active', 'dragging');
        document.body.classList.remove('recording-pip-mode');
        document.getElementById('recording-section')?.classList.remove('recording-pip-host');
        this._pipVisible = false;
    },

    setupSectionObserver() {
        const section = document.getElementById('recording-section');
        const mainContent = document.getElementById('main-content');
        if (!section) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this._isSectionVisible = entry.isIntersecting;
                this.evaluatePipState();
            });
        }, {
            root: mainContent || null,
            threshold: 0.35
        });

        observer.observe(section);

        const recheck = () => window.requestAnimationFrame(() => this.evaluatePipState());
        mainContent?.addEventListener('scroll', recheck, { passive: true });
        window.addEventListener('resize', recheck);
    },

    async init() {
        if (this._initialized) return;
        this._initialized = true;
        this._handlePipDragMove = (event) => this.movePip(event);
        this._handlePipDragEnd = () => this.endPipDrag();

        const list = document.getElementById('recording-description-list');
        if (!list) return;

        // Directly render the static fallback videos – no network, no descriptions
        this.renderSongData(this.videos);
        this.setupPip();
        this.setupYouTubePlayer();
        this.setupSectionObserver();
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = rs;
