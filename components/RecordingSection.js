const RecordingSection = {
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
        const embedUrl = `https://www.youtube.com/embed/videoseries?list=${this.playlistId}&rel=0&modestbranding=1`;
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

                    <div class="recording-player-wrap">
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
                            <span>Songs</span>
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

                player.src = `https://www.youtube.com/embed/${videoId}?list=${this.playlistId}&rel=0&modestbranding=1&autoplay=1`;
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

    async init() {
        if (this._initialized) return;
        this._initialized = true;

        const list = document.getElementById('recording-description-list');
        if (!list) return;

        // Directly render the static fallback videos – no network, no descriptions
        this.renderSongData(this.videos);
    }
};

if (typeof module !== 'undefined' && module.exports) module.exports = RecordingSection;
