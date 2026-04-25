/* ========== BTS SECTION - SWIPER SLIDER ========== */
.bts-section {
    background: var(--pure-black);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem 0;
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    min-height: 0;
    margin: 0 auto;
}

/* Ensure the parent container allows proper flow */
.section {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible !important;
}

/* Section Header */
.section-header {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.5rem;
    color: var(--metallic-gold);
    letter-spacing: 6px;
    margin-bottom: 2rem;
    padding-left: 2rem;
    font-weight: 400;
    opacity: 0.9;
    align-self: flex-start;
    width: 100%;
    z-index: 10;
    max-width: 1400px;
    flex-shrink: 0;
}

/* ===== SWIPER CONTAINER ===== */
.bts-swiper {
    width: 100%;
    flex: 1;
    min-height: 0;
    padding: 0.5rem 1rem 2rem 1rem;
    position: relative;
    overflow: visible;
}

/* Make slides full width */
.bts-swiper .swiper-slide {
    width: auto;
    height: auto;
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.bts-swiper .swiper-slide-active {
    opacity: 1;
}

/* ===== SLIDE CONTENT - MAINTAINS COLUMN STRUCTURE ===== */
.bts-slide-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    min-width: 280px;
    max-width: 320px;
    padding: 0.5rem 0;
}

/* Column width variations - consistent widths */
.bts-slide-content.wide {
    min-width: 380px;
    max-width: 420px;
}

.bts-slide-content.narrow {
    min-width: 240px;
    max-width: 260px;
}

/* ===== SLIDE ITEMS - IMPROVED HEIGHT MANAGEMENT ===== */
.bts-slide-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.4s cubic-bezier(0.2, 0.9, 0.3, 1), 
                box-shadow 0.3s ease,
                filter 0.3s ease;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(212, 175, 55, 0.1);
    width: 100%;
    min-height: 120px;
    flex-shrink: 0;
    transform: rotate(0deg) scale(1);
    will-change: transform;
    background: #1a1a1a;
}

/* Fix height variations - use aspect ratio approach */
.bts-slide-item[data-height="60"],
.bts-slide-item[data-height="40"],
.bts-slide-item[data-height="70"],
.bts-slide-item[data-height="30"],
.bts-slide-item[data-height="50"],
.bts-slide-item[data-height="55"],
.bts-slide-item[data-height="45"],
.bts-slide-item[data-height="65"],
.bts-slide-item[data-height="35"],
.bts-slide-item[data-height="75"],
.bts-slide-item[data-height="25"],
.bts-slide-item[data-height="80"],
.bts-slide-item[data-height="20"] {
    flex: 1 1 auto;
    height: auto;
    min-height: 100px;
}

/* Use min-height for better responsiveness */
.bts-slide-item[data-height="80"] { min-height: 480px; }
.bts-slide-item[data-height="75"] { min-height: 450px; }
.bts-slide-item[data-height="70"] { min-height: 420px; }
.bts-slide-item[data-height="65"] { min-height: 390px; }
.bts-slide-item[data-height="60"] { min-height: 360px; }
.bts-slide-item[data-height="55"] { min-height: 330px; }
.bts-slide-item[data-height="50"] { min-height: 300px; }
.bts-slide-item[data-height="45"] { min-height: 270px; }
.bts-slide-item[data-height="40"] { min-height: 240px; }
.bts-slide-item[data-height="35"] { min-height: 210px; }
.bts-slide-item[data-height="30"] { min-height: 180px; }
.bts-slide-item[data-height="25"] { min-height: 150px; }
.bts-slide-item[data-height="20"] { min-height: 120px; }

/* ===== VIDEO ELEMENTS - AUTO-PLAY ===== */
.bts-slide-item.video-item {
    cursor: pointer;
    position: relative;
    background-color: #1a1a1a;
}

.bts-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.4s cubic-bezier(0.2, 0.9, 0.3, 1),
                transform 0.6s cubic-bezier(0.2, 0.9, 0.3, 1);
    filter: grayscale(0.3) brightness(0.85);
    will-change: transform;
    background-color: #1a1a1a;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

/* Video container for proper aspect ratio */
.bts-slide-item.video-item {
    position: relative;
    overflow: hidden;
}

/* Remove hover filter change since videos are always playing */
.bts-slide-item.video-item:hover .bts-video {
    filter: grayscale(0) brightness(1.02);
    transform: scale(1.02);
}

/* Video play hint - shows play icon on hover */
.video-control-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background: rgba(212, 175, 55, 0.85);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--pure-black);
    font-size: 1.3rem;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 3;
    pointer-events: none;
    backdrop-filter: blur(4px);
}

.bts-slide-item.video-item:hover .video-control-hint {
    opacity: 0.9;
    transform: translate(-50%, -50%) scale(1.1);
}

.bts-slide-item.video-item .video-control-hint i {
    margin-left: 3px;
}

/* Pattern overlay for texture */
.bts-slide-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 10px, transparent 10px, transparent 20px);
    opacity: 0;
    pointer-events: none;
    z-index: 1;
    transition: opacity 0.4s ease;
}

.bts-slide-item:hover .bts-slide-pattern {
    opacity: 0.15;
}

/* ===== LOADING ANIMATION ===== */
.video-loading-animation {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 8px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.2s ease, visibility 0.2s ease;
    z-index: 5;
    pointer-events: none;
}

.bts-slide-item.video-loading .video-loading-animation {
    opacity: 1;
    visibility: visible;
}

.video-loading-animation .dot {
    width: 10px;
    height: 10px;
    background-color: var(--metallic-gold);
    border-radius: 50%;
    display: inline-block;
    animation: dotPulse 1.2s infinite ease-in-out;
    box-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
}

.video-loading-animation .dot:nth-child(1) {
    animation-delay: 0s;
}
.video-loading-animation .dot:nth-child(2) {
    animation-delay: 0.15s;
}
.video-loading-animation .dot:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes dotPulse {
    0%, 60%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
    }
    30% {
        transform: scale(1.2);
        opacity: 1;
    }
}

/* Overlay for captions */
.bts-slide-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.9) 0%,
        rgba(0, 0, 0, 0.5) 50%,
        transparent 100%
    );
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 1.2rem 1rem;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 2;
    transform: translateY(0);
}

.bts-slide-item:hover .bts-slide-overlay {
    opacity: 1;
}

.bts-slide-caption {
    font-family: 'Inter', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--off-white);
    letter-spacing: 1px;
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.bts-slide-number {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    color: var(--metallic-gold);
    opacity: 0.9;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

/* ===== SWIPER NAVIGATION ===== */
.bts-swiper-button {
    color: var(--metallic-gold);
    background: rgba(18, 18, 18, 0.85);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    backdrop-filter: blur(5px);
    border: 1px solid rgba(212, 175, 55, 0.3);
    transition: all 0.3s ease;
}

.bts-swiper-button:hover {
    background: var(--metallic-gold);
    color: var(--pure-black);
    transform: scale(1.1);
    border-color: var(--metallic-gold);
}

.bts-swiper-button::after {
    font-size: 1.2rem;
    font-weight: bold;
}

/* ===== SWIPER PAGINATION ===== */
.bts-swiper-pagination {
    bottom: 0 !important;
    position: relative;
    margin-top: 1rem;
}

.bts-swiper-pagination .swiper-pagination-bullet {
    width: 30px;
    height: 3px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
    margin: 0 4px;
}

.bts-swiper-pagination .swiper-pagination-bullet-active {
    background: var(--metallic-gold);
    width: 45px;
}

.bts-swiper-pagination .swiper-pagination-bullet:hover {
    background: var(--metallic-gold);
    opacity: 0.8;
}

/* ===== VIDEO MODAL ===== */
.video-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    animation: modalFadeIn 0.3s ease;
}

.video-modal-content {
    position: relative;
    width: 90%;
    max-width: 1200px;
    max-height: 90vh;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 30px 50px rgba(0, 0, 0, 0.5);
    border: 2px solid var(--metallic-gold);
    background: #000;
}

.video-modal-player {
    width: 100%;
    height: auto;
    max-height: 80vh;
    display: block;
    background: #000;
}

.video-modal-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    color: var(--off-white);
    padding: 2rem 1.5rem 1.5rem;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    letter-spacing: 2px;
    text-align: center;
    pointer-events: none;
}

.video-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
    background: var(--deep-charcoal);
    border: 2px solid var(--metallic-gold);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--metallic-gold);
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
}

.video-modal-close:hover {
    background: var(--metallic-gold);
    color: var(--pure-black);
    transform: scale(1.1);
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.swiper-slide {
    animation: fadeIn 0.6s ease-out forwards;
}

/* ===== RESPONSIVE BREAKPOINTS ===== */

/* Large desktops */
@media (max-width: 1200px) {
    .bts-slide-content {
        min-width: 260px;
        max-width: 300px;
        gap: 1.2rem;
    }
    
    .bts-slide-content.wide {
        min-width: 340px;
        max-width: 380px;
    }
    
    .bts-slide-content.narrow {
        min-width: 220px;
        max-width: 240px;
    }
    
    .bts-slide-item[data-height="80"] { min-height: 420px; }
    .bts-slide-item[data-height="70"] { min-height: 370px; }
    .bts-slide-item[data-height="60"] { min-height: 320px; }
    .bts-slide-item[data-height="50"] { min-height: 270px; }
    .bts-slide-item[data-height="40"] { min-height: 220px; }
    .bts-slide-item[data-height="30"] { min-height: 170px; }
}

/* Tablets */
@media (max-width: 900px) {
    .bts-section {
        padding: 1.5rem 0;
    }
    
    .section-header {
        font-size: 2.2rem;
        letter-spacing: 4px;
        margin-bottom: 1.5rem;
        padding-left: 1.5rem;
    }
    
    .bts-swiper {
        padding: 0 0.75rem 1.5rem 0.75rem;
    }
    
    .bts-slide-content {
        min-width: 240px;
        max-width: 280px;
        gap: 1rem;
    }
    
    .bts-slide-content.wide {
        min-width: 300px;
        max-width: 340px;
    }
    
    .bts-slide-content.narrow {
        min-width: 200px;
        max-width: 220px;
    }
    
    .bts-slide-caption {
        font-size: 0.8rem;
    }
    
    .bts-slide-number {
        font-size: 1.1rem;
    }
    
    .bts-swiper-button {
        width: 40px;
        height: 40px;
    }
    
    .video-control-hint {
        width: 40px;
        height: 40px;
        font-size: 1.1rem;
    }
}

/* Large phones */
@media (max-width: 600px) {
    .bts-section {
        padding: 1rem 0;
    }
    
    .section-header {
        font-size: 2rem;
        letter-spacing: 3px;
        margin-bottom: 1rem;
        padding-left: 1rem;
    }
    
    .bts-swiper {
        padding: 0 0.5rem 1rem 0.5rem;
    }
    
    .bts-slide-content {
        min-width: 220px;
        max-width: 260px;
        gap: 0.9rem;
    }
    
    .bts-slide-content.wide {
        min-width: 260px;
        max-width: 300px;
    }
    
    .bts-slide-content.narrow {
        min-width: 180px;
        max-width: 200px;
    }
    
    .bts-swiper-button {
        width: 36px;
        height: 36px;
    }
    
    .bts-swiper-button::after {
        font-size: 1rem;
    }
    
    .bts-swiper-pagination .swiper-pagination-bullet {
        width: 20px;
        height: 2px;
    }
    
    .bts-swiper-pagination .swiper-pagination-bullet-active {
        width: 30px;
    }
    
    .video-control-hint {
        width: 36px;
        height: 36px;
        font-size: 1rem;
    }
}

/* Small phones */
@media (max-width: 480px) {
    .bts-section {
        padding: 0.8rem 0;
    }
    
    .section-header {
        font-size: 1.6rem;
        padding-left: 0.8rem;
        margin-bottom: 0.8rem;
        letter-spacing: 2px;
    }
    
    .bts-swiper {
        padding: 0 0.4rem 0.8rem 0.4rem;
    }
    
    .bts-slide-content {
        min-width: 190px;
        max-width: 220px;
        gap: 0.8rem;
    }
    
    .bts-slide-content.wide {
        min-width: 220px;
        max-width: 250px;
    }
    
    .bts-slide-content.narrow {
        min-width: 160px;
        max-width: 180px;
    }
    
    .bts-slide-caption {
        font-size: 0.7rem;
    }
    
    .bts-slide-number {
        font-size: 0.9rem;
    }
    
    .bts-swiper-button {
        width: 32px;
        height: 32px;
    }
    
    .bts-swiper-button::after {
        font-size: 0.9rem;
    }
    
    .video-control-hint {
        width: 32px;
        height: 32px;
        font-size: 0.9rem;
    }
}

/* Height-based adjustments */
@media (max-height: 700px) {
    .bts-section {
        padding: 1rem 0;
    }
    
    .section-header {
        margin-bottom: 0.8rem;
    }
    
    .bts-slide-item[data-height="80"] { min-height: 380px; }
    .bts-slide-item[data-height="70"] { min-height: 330px; }
    .bts-slide-item[data-height="60"] { min-height: 280px; }
    .bts-slide-item[data-height="50"] { min-height: 230px; }
    .bts-slide-item[data-height="40"] { min-height: 190px; }
    .bts-slide-item[data-height="30"] { min-height: 150px; }
    .bts-slide-item[data-height="20"] { min-height: 110px; }
}

@media (max-height: 600px) {
    .bts-section {
        padding: 0.8rem 0;
    }
    
    .section-header {
        margin-bottom: 0.6rem;
        font-size: 1.8rem;
    }
    
    .bts-slide-content {
        gap: 0.8rem;
    }
    
    .bts-slide-item[data-height="80"] { min-height: 340px; }
    .bts-slide-item[data-height="70"] { min-height: 300px; }
    .bts-slide-item[data-height="60"] { min-height: 260px; }
    .bts-slide-item[data-height="50"] { min-height: 220px; }
    .bts-slide-item[data-height="40"] { min-height: 180px; }
    .bts-slide-item[data-height="30"] { min-height: 140px; }
}

@media (max-height: 500px) and (orientation: landscape) {
    .bts-section {
        padding: 0.5rem 0;
    }
    
    .section-header {
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
        padding-left: 1rem;
    }
    
    .bts-swiper {
        padding: 0 0.5rem 0.5rem 0.5rem;
    }
    
    .bts-slide-content {
        min-width: 180px;
        max-width: 200px;
        gap: 0.6rem;
    }
    
    .bts-slide-content.wide {
        min-width: 220px;
        max-width: 240px;
    }
    
    .bts-slide-content.narrow {
        min-width: 150px;
        max-width: 160px;
    }
    
    .bts-slide-item {
        border-radius: 8px;
    }
    
    .bts-slide-item[data-height="80"] { min-height: 280px; }
    .bts-slide-item[data-height="70"] { min-height: 250px; }
    .bts-slide-item[data-height="60"] { min-height: 220px; }
    .bts-slide-item[data-height="50"] { min-height: 190px; }
    .bts-slide-item[data-height="40"] { min-height: 160px; }
    .bts-slide-item[data-height="30"] { min-height: 130px; }
    .bts-slide-item[data-height="20"] { min-height: 100px; }
    
    .bts-slide-overlay {
        padding: 0.6rem;
    }
    
    .bts-slide-caption {
        font-size: 0.65rem;
    }
    
    .bts-slide-number {
        font-size: 0.8rem;
    }
    
    .video-control-hint {
        width: 28px;
        height: 28px;
        font-size: 0.8rem;
    }
}

/* Responsive modal */
@media (max-width: 768px) {
    .video-modal-content {
        width: 95%;
    }
    
    .video-modal-caption {
        font-size: 1.2rem;
        padding: 1.5rem 1rem 1rem;
    }
    
    .video-modal-close {
        width: 40px;
        height: 40px;
        font-size: 1.3rem;
    }
}

@media (max-width: 480px) {
    .video-modal-caption {
        font-size: 1rem;
        padding: 1rem 0.8rem 0.8rem;
    }
    
    .video-modal-close {
        width: 36px;
        height: 36px;
        font-size: 1.1rem;
    }
}

/* Extra large screens */
@media (min-width: 1800px) {
    .bts-section {
        padding: 3rem 0;
    }
    
    .bts-slide-content {
        min-width: 380px;
        max-width: 420px;
        gap: 2rem;
    }
    
    .bts-slide-content.wide {
        min-width: 480px;
        max-width: 520px;
    }
    
    .bts-slide-content.narrow {
        min-width: 300px;
        max-width: 320px;
    }
    
    .section-header {
        max-width: 1600px;
        font-size: 3rem;
        margin-bottom: 2.5rem;
    }
    
    .bts-swiper-button {
        width: 56px;
        height: 56px;
    }
    
    .bts-swiper-button::after {
        font-size: 1.5rem;
    }
    
    .bts-slide-caption {
        font-size: 1rem;
    }
    
    .bts-slide-number {
        font-size: 1.6rem;
    }
    
    .video-control-hint {
        width: 56px;
        height: 56px;
        font-size: 1.6rem;
    }
    
    .bts-slide-item[data-height="80"] { min-height: 580px; }
    .bts-slide-item[data-height="70"] { min-height: 510px; }
    .bts-slide-item[data-height="60"] { min-height: 440px; }
    .bts-slide-item[data-height="50"] { min-height: 370px; }
    .bts-slide-item[data-height="40"] { min-height: 300px; }
    .bts-slide-item[data-height="30"] { min-height: 230px; }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
    .swiper-slide,
    .bts-slide-item,
    .bts-slide-item video,
    .bts-slide-overlay,
    .bts-slide-pattern,
    .bts-swiper-button,
    .bts-swiper-pagination .swiper-pagination-bullet,
    .video-modal,
    .video-modal-close,
    .video-control-hint {
        transition: none !important;
        animation: none !important;
    }
    
    .bts-slide-item {
        transform: rotate(0deg) scale(1) !important;
    }
    
    .video-loading-animation .dot {
        animation: none !important;
    }
}

@media (prefers-contrast: high) {
    .bts-slide-item {
        border: 2px solid var(--metallic-gold);
    }
    
    .bts-swiper-button {
        border: 2px solid var(--metallic-gold);
        background: var(--pure-black);
    }
    
    .bts-slide-overlay {
        background: rgba(0, 0, 0, 0.85);
    }
    
    .video-modal-content {
        border: 3px solid var(--metallic-gold);
    }
}

/* Data saving preference */
@media (prefers-reduced-data: reduce) {
    .bts-video {
        preload: none;
    }
    
    .video-control-hint {
        display: none;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    .bts-section {
        height: auto;
        overflow: visible;
        margin: 1cm 0;
        padding: 0;
    }
    
    .swiper-wrapper {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5cm;
        transform: none !important;
    }
    
    .swiper-slide {
        width: auto !important;
        margin: 0 !important;
        animation: none;
        opacity: 1;
    }
    
    .bts-slide-content {
        height: auto;
        gap: 0.3cm;
    }
    
    .bts-slide-item {
        break-inside: avoid;
        border: 1px solid #ccc;
        transform: rotate(0deg) scale(1) !important;
        box-shadow: none;
        flex: none !important;
        height: auto !important;
        min-height: auto;
        margin-bottom: 0.3cm;
    }
    
    .bts-slide-item video,
    .bts-video {
        display: none;
    }
    
    .bts-slide-overlay {
        opacity: 1;
        background: rgba(255, 255, 255, 0.1);
        position: static;
        padding: 0.5rem;
        color: #333;
    }
    
    .bts-slide-caption,
    .bts-slide-number {
        color: #333;
        text-shadow: none;
    }
    
    .bts-slide-pattern,
    .bts-swiper-button,
    .bts-swiper-pagination,
    .video-control-hint,
    .video-modal,
    .video-loading-animation {
        display: none !important;
    }
}

/* Fix for Safari and iOS */
@supports (-webkit-touch-callout: none) {
    .bts-swiper {
        -webkit-overflow-scrolling: touch;
    }
    
    .bts-slide-item {
        transform: translateZ(0);
    }
    
    .bts-video {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}

/* Fix for Firefox */
@-moz-document url-prefix() {
    .bts-slide-item {
        will-change: transform;
    }
    
    .bts-video {
        object-fit: cover;
    }
}

/* Fix for smooth scrolling on all browsers */
.bts-swiper {
    overflow: visible;
}

.bts-swiper .swiper-wrapper {
    transition-timing-function: cubic-bezier(0.2, 0.9, 0.4, 1);
}