const BookingForm = {
    render() {
        return `
            <section class="section booking-section">
                <div class="gold-form">
                    <h2>BOOKING</h2>
                    <form id="bookingForm">
                        <input type="text" placeholder="Full name" class="input-line" required>
                        <input type="email" placeholder="Email / country" class="input-line" required>
                        <input type="text" placeholder="Project details + dates" class="input-line" required>
                        <button type="submit" class="gold-btn">SEND INQUIRY</button>
                    </form>
                    <p class="booking-note">international inquiries welcome</p>
                </div>
            </section>
        `;
    },
    
    init() {
        const form = document.getElementById('bookingForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                alert(`Thank you ${data['Full name'] || 'for your inquiry'}! We will respond within 48 hours.`);
                form.reset();
                
                const btn = form.querySelector('.gold-btn');
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = 'scale(1)', 200);
            });
            
            const inputs = form.querySelectorAll('.input-line');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.transform = 'translateX(5px)';
                });
                input.addEventListener('blur', () => {
                    input.style.transform = 'translateX(0)';
                });
            });
        }
    }
};