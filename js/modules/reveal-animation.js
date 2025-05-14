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
     * @param {ScrollManager} scrollManager - The central scroll manager
     */
    init(scrollManager) {
        if (this.revealItems.length === 0) return;
        
        // Initial check on page load
        this.checkReveal();
        
        // Use scroll manager if available
        if (scrollManager) {
            scrollManager.onScroll(this.checkReveal, this);
            scrollManager.onResize(this.checkReveal, this);
        } else {
            // Fallback to direct event listeners
            window.addEventListener('scroll', () => this.checkReveal());
            window.addEventListener('resize', () => this.checkReveal());
        }
    }
    
    /**
     * Check which elements should be revealed
     */
    checkReveal() {
        const viewportHeight = window.innerHeight;
        
        this.revealItems.forEach(item => {
            // Skip already revealed items
            if (this.revealed.has(item)) return;
            
            // Special handling for hero-section elements to prevent position shifting
            const isHeroElement = item.closest('.hero-section') !== null;
            if (isHeroElement) {
                // Immediately reveal hero elements with special class to prevent transform
                item.classList.add('hero-no-transform');
                setTimeout(() => {
                    item.classList.add('revealed');
                    this.revealed.add(item);
                }, 10); // Small delay to ensure hero-no-transform is applied first
                return;
            }
            
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
