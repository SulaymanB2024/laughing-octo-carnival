/**
 * RevealAnimation
 * Handles scroll-based reveal animations
 */
export class RevealAnimation {
    constructor() {
        this.revealItems = document.querySelectorAll('.revealable');
        this.revealed = new Set();
    }
    
    /**
     * Initialize reveal animations
     */
    init() {
        if (this.revealItems.length === 0) return;
        
        // Initial check on page load
        this.checkReveal();
        
        // Check on scroll
        window.addEventListener('scroll', () => {
            this.checkReveal();
        });
        
        // Check on resize (in case reveal thresholds change)
        window.addEventListener('resize', () => {
            this.checkReveal();
        });
    }
    
    /**
     * Check which elements should be revealed
     */
    checkReveal() {
        const viewportHeight = window.innerHeight;
        
        this.revealItems.forEach(item => {
            // Skip already revealed items
            if (this.revealed.has(item)) return;
            
            const itemTop = item.getBoundingClientRect().top;
            const revealOffset = 50; // Pixels from bottom of viewport to trigger reveal
            
            if (itemTop <= viewportHeight - revealOffset) {
                item.classList.add('revealed');
                this.revealed.add(item);
            }
        });
    }
    
    /**
     * Reset all animations (useful for page changes or back navigation)
     */
    resetAnimations() {
        this.revealItems.forEach(item => {
            item.classList.remove('revealed');
        });
        this.revealed.clear();
        this.checkReveal();
    }
}
