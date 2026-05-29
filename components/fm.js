const fm = {
    render() {
        return `
            <div class="fog-overlay-container">
                <!-- Single fog layer for subtle effect -->
                <div class="fog-layer fog-layer-1">
                    <img src="assets/images/fog2.ecb15114.webp" alt="atmospheric fog" draggable="false">
                    <img src="assets/images/fog2.ecb15114.webp" alt="atmospheric fog" draggable="false">
                </div>
            </div>
        `;
    },
    
    init() {
        console.log('fm initializing...');
        
        const fogImages = document.querySelectorAll('.fog-layer img');
        
        if (fogImages.length > 0) {
            // Add random delays
            fogImages.forEach((img, index) => {
                const delay = Math.random() * 5;
                img.style.animationDelay = `-${delay}s`;
            });
            console.log('fm initialized with', fogImages.length, 'images');
        }
    }
};