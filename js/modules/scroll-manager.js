/**
 * ScrollManager
 * Centralized scroll event handling to improve performance
 * and prevent scroll event handlers from fighting each other
 */
export class ScrollManager {
    constructor() {
        this.scrollCallbacks = [];
        this.resizeCallbacks = [];
        this.lastScrollTop = 0;
        this.ticking = false;
        this._boundScrollHandler = this._handleScroll.bind(this);
        this._boundResizeHandler = this._handleResize.bind(this);
    }
    
    /**
     * Initialize the scroll manager
     */
    init() {
        // Remove any existing handlers to prevent duplicates
        window.removeEventListener('scroll', this._boundScrollHandler);
        window.removeEventListener('resize', this._boundResizeHandler);
        
        // Add handlers
        window.addEventListener('scroll', this._boundScrollHandler, { passive: true });
        window.addEventListener('resize', this._boundResizeHandler, { passive: true });
        
        console.log('ScrollManager initialized');
    }
    
    /**
     * Register a scroll event callback
     * @param {Function} callback - The function to call on scroll events
     * @param {Object} context - The context (this) to apply to the callback
     * @returns {Function} Unregister function
     */
    onScroll(callback, context) {
        const callbackWithContext = () => callback.call(context);
        this.scrollCallbacks.push(callbackWithContext);
        
        // Return a function to unregister this callback
        return () => {
            this.scrollCallbacks = this.scrollCallbacks.filter(cb => cb !== callbackWithContext);
        };
    }
    
    /**
     * Register a resize event callback
     * @param {Function} callback - The function to call on resize events
     * @param {Object} context - The context (this) to apply to the callback
     * @returns {Function} Unregister function
     */
    onResize(callback, context) {
        const callbackWithContext = () => callback.call(context);
        this.resizeCallbacks.push(callbackWithContext);
        
        // Return a function to unregister this callback
        return () => {
            this.resizeCallbacks = this.resizeCallbacks.filter(cb => cb !== callbackWithContext);
        };
    }
    
    /**
     * Handle scroll events with debouncing
     * @private
     */
    _handleScroll() {
        // Update last scroll position
        this.lastScrollTop = window.scrollY;
        
        // Use requestAnimationFrame for better performance
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this._executeScrollCallbacks();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }
    
    /**
     * Execute all registered scroll callbacks
     * @private
     */
    _executeScrollCallbacks() {
        for (const callback of this.scrollCallbacks) {
            try {
                callback();
            } catch (error) {
                console.error('Error in scroll callback:', error);
            }
        }
    }
    
    /**
     * Handle resize events
     * @private
     */
    _handleResize() {
        if (!this.resizeTicking) {
            window.requestAnimationFrame(() => {
                this._executeResizeCallbacks();
                this.resizeTicking = false;
            });
            this.resizeTicking = true;
        }
    }
    
    /**
     * Execute all registered resize callbacks
     * @private
     */
    _executeResizeCallbacks() {
        for (const callback of this.resizeCallbacks) {
            try {
                callback();
            } catch (error) {
                console.error('Error in resize callback:', error);
            }
        }
    }
    
    /**
     * Get the current scroll position
     */
    getScrollPosition() {
        return {
            top: window.scrollY || document.documentElement.scrollTop,
            left: window.scrollX || document.documentElement.scrollLeft
        };
    }
    
    /**
     * Check if we're scrolling down
     */
    isScrollingDown() {
        return window.scrollY > this.lastScrollTop;
    }
}
