/**
 * Cursor Manager Module
 * 
 * Manages cursor states and interactions across the website
 * Provides a consistent cursor experience with special effects
 */
export class CursorManager {
    constructor() {
        // Default cursor states
        this.cursorStates = {
            default: 'default',
            pointer: 'pointer',
            grab: 'grab',
            grabbing: 'grabbing',
            text: 'text'
        };
        
        // Currently active cursor state
        this.currentState = this.cursorStates.default;
        
        // Custom cursor element (for future enhancement)
        this.customCursor = null;
        
        // Elements with custom cursor states
        this.interactiveSelectors = [
            'a', 'button', '.btn', '.card', '.filter-chip', 
            '.project-details-btn', '.skill-badge', '.panel-close',
            '.timeline-slider', '.nodes circle', '[data-cursor]'
        ];
        
        // Element-specific cursor mappings
        this.cursorMappings = {
            'a': this.cursorStates.pointer,
            'button': this.cursorStates.pointer,
            '.btn': this.cursorStates.pointer,
            '.card': this.cursorStates.pointer,
            '.filter-chip': this.cursorStates.pointer,
            '.project-details-btn': this.cursorStates.pointer,
            '.skill-badge': this.cursorStates.pointer,
            '.panel-close': this.cursorStates.pointer,
            '.timeline-slider': this.cursorStates.grab,
            '.timeline-slider:active': this.cursorStates.grabbing,
            '.nodes circle': this.cursorStates.pointer
        };
        
        // State tracking
        this.isInitialized = false;
        
        // Bound methods to maintain context
        this._handleMouseOver = this._handleMouseOver.bind(this);
        this._handleMouseOut = this._handleMouseOut.bind(this);
        this._handleMouseDown = this._handleMouseDown.bind(this);
        this._handleMouseUp = this._handleMouseUp.bind(this);
    }
    
    /**
     * Initialize the cursor manager
     */
    init() {
        if (this.isInitialized) return;
        
        // Add CSS variables for cursor states
        this._addCursorStyles();
        
        // Add event listeners for interactive elements
        this._addEventListeners();
        
        this.isInitialized = true;
        
        // Add custom cursor support
        this._initCustomCursor();
        
        console.log('Cursor Manager initialized');
    }
    
    /**
     * Add CSS variables for cursor states
     * @private
     */
    _addCursorStyles() {
        // Get or create style element
        let styleEl = document.getElementById('cursor-manager-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'cursor-manager-styles';
            document.head.appendChild(styleEl);
        }
        
        // Create CSS rules
        const css = `
            :root {
                --cursor-default: default;
                --cursor-pointer: pointer;
                --cursor-grab: grab;
                --cursor-grabbing: grabbing;
                --cursor-text: text;
            }
            
            /* Apply cursor styles */
            .cursor-default { cursor: var(--cursor-default) !important; }
            .cursor-pointer { cursor: var(--cursor-pointer) !important; }
            .cursor-grab { cursor: var(--cursor-grab) !important; }
            .cursor-grabbing { cursor: var(--cursor-grabbing) !important; }
            .cursor-text { cursor: var(--cursor-text) !important; }
            
            /* Apply to elements */
            a, button, .btn, .card, .filter-chip, 
            .project-details-btn, .skill-badge, .panel-close { 
                cursor: var(--cursor-pointer);
            }
            
            .timeline-slider { 
                cursor: var(--cursor-grab);
            }
            
            .timeline-slider:active { 
                cursor: var(--cursor-grabbing);
            }
        `;
        
        styleEl.textContent = css;
    }
    
    /**
     * Add event listeners for all interactive elements
     * @private
     */
    _addEventListeners() {
        // Add global event delegation
        document.body.addEventListener('mouseover', this._handleMouseOver);
        document.body.addEventListener('mouseout', this._handleMouseOut);
        document.body.addEventListener('mousedown', this._handleMouseDown);
        document.body.addEventListener('mouseup', this._handleMouseUp);
        
        // Handle specific network visualization events
        this._handleNetworkVisualization();
        
        // Handle particles interactions
        this._handleParticlesInteractions();
    }
    
    /**
     * Set cursor state based on event target
     * @private
     * @param {Event} event - Mouse event
     */
    _handleMouseOver(event) {
        let cursorType = null;
        
        // Check if target matches any selector
        for (const selector of this.interactiveSelectors) {
            if (event.target.matches && event.target.matches(selector)) {
                cursorType = this.cursorMappings[selector] || this.cursorStates.pointer;
                break;
            }
            
            // Check for parent elements that might match (for SVG elements)
            let parent = event.target.parentElement;
            while (parent) {
                if (parent.matches && parent.matches(selector)) {
                    cursorType = this.cursorMappings[selector] || this.cursorStates.pointer;
                    break;
                }
                parent = parent.parentElement;
            }
            
            if (cursorType) break;
        }
        
        // Check for custom cursor attribute
        const customCursor = event.target.getAttribute('data-cursor');
        if (customCursor && this.cursorStates[customCursor]) {
            cursorType = this.cursorStates[customCursor];
        }
        
        // Apply cursor state
        if (cursorType) {
            this.setCursorState(cursorType);
        }
    }
    
    /**
     * Reset cursor state on mouse out
     * @private
     */
    _handleMouseOut(event) {
        // Only reset if we're not entering another interactive element
        const relatedTarget = event.relatedTarget;
        if (!relatedTarget || !this._isInteractiveElement(relatedTarget)) {
            this.resetCursorState();
        }
    }
    
    /**
     * Handle mouse down events (for dragging states)
     * @private
     */
    _handleMouseDown(event) {
        if (event.target.matches && event.target.matches('.timeline-slider')) {
            this.setCursorState(this.cursorStates.grabbing);
        }
    }
    
    /**
     * Handle mouse up events
     * @private
     */
    _handleMouseUp(event) {
        if (event.target.matches && event.target.matches('.timeline-slider')) {
            this.setCursorState(this.cursorStates.grab);
        }
    }
    
    /**
     * Check if element is interactive
     * @private
     * @param {Element} element - DOM element
     * @returns {boolean} True if element is interactive
     */
    _isInteractiveElement(element) {
        if (!element) return false;
        
        // Direct match
        for (const selector of this.interactiveSelectors) {
            if (element.matches && element.matches(selector)) {
                return true;
            }
        }
        
        // Check parents
        let parent = element.parentElement;
        while (parent) {
            for (const selector of this.interactiveSelectors) {
                if (parent.matches && parent.matches(selector)) {
                    return true;
                }
            }
            parent = parent.parentElement;
        }
        
        return false;
    }
    
    /**
     * Set cursor state for the entire app
     * @param {string} state - Cursor state name
     */
    setCursorState(state) {
        if (!this.cursorStates[state]) return;
        
        this.currentState = state;
        document.body.style.cursor = state;
        
        // Update custom cursor if available
        if (this.customCursor) {
            // Remove all state classes
            Object.values(this.cursorStates).forEach(s => {
                this.customCursor.classList.remove(s);
            });
            
            // Add current state class
            this.customCursor.classList.add(state);
        }
    }
    
    /**
     * Reset cursor to default state
     */
    resetCursorState() {
        this.setCursorState(this.cursorStates.default);
    }
    
    /**
     * Initialize custom cursor with proper positioning
     * @private
     */
    _initCustomCursor() {
        try {
            // Check if custom cursor already exists
            let cursorElement = document.querySelector('.custom-cursor');
            
            // Create it if it doesn't exist
            if (!cursorElement) {
                cursorElement = document.createElement('div');
                cursorElement.className = 'custom-cursor';
                document.body.appendChild(cursorElement);
            }
            
            this.customCursor = cursorElement;
            
            // Position the cursor properly following mouse movement with throttling
            let lastUpdated = 0;
            const updateThreshold = 8; // Only update every 8ms for performance (about 120fps)
            
            document.addEventListener('mousemove', (e) => {
                const now = performance.now();
                if (now - lastUpdated < updateThreshold) return; // Skip updates that are too frequent
                
                lastUpdated = now;
                requestAnimationFrame(() => {
                    try {
                        const x = e.clientX;
                        const y = e.clientY;
                        
                        // The CSS already has transform: translate(-50%, -50%) to center
                        cursorElement.style.left = `${x}px`;
                        cursorElement.style.top = `${y}px`;
                        
                        // Store current position for other functions to use
                        this.cursorX = x;
                        this.cursorY = y;
                    } catch (posErr) {
                        console.warn('Error updating cursor position:', posErr.message);
                    }
                });
            });
            
            // Add default class
            cursorElement.classList.add('default');
            
            console.log('Custom cursor initialized successfully');
        } catch (error) {
            console.warn('Error initializing custom cursor:', error.message);
        }
        
        // Listen for cursor-change events
        document.addEventListener('cursor-change', (e) => {
            if (e.detail && e.detail.type) {
                this.setCursorState(e.detail.type);
            }
        });
        
        // Create a utility function to enable/disable custom cursor
        window.enableCustomCursor = () => {
            document.body.classList.add('using-custom-cursor');
            console.log('Custom cursor enabled');
        };
        
        window.disableCustomCursor = () => {
            document.body.classList.remove('using-custom-cursor');
            console.log('Custom cursor disabled, using system cursor');
        };
        
        // Let the auto-diagnostic decide whether to enable the custom cursor 
        // based on system performance and compatibility
    }
    
    /**
     * Handle special case for network visualization
     * @private
     */
    _handleNetworkVisualization() {
        const networkVis = document.getElementById('network-visualization');
        if (!networkVis) return;
        
        // Ensure the SVG elements have proper cursor behavior
        setTimeout(() => {
            const circles = networkVis.querySelectorAll('circle');
            circles.forEach(circle => {
                circle.setAttribute('style', 'cursor: pointer');
            });
        }, 1000); // Allow time for SVG to render
    }
    
    /**
     * Handle special case for particles interactions
     * @private
     */
    _handleParticlesInteractions() {
        const particlesContainer = document.getElementById('particles-js');
        if (!particlesContainer) return;
        
        particlesContainer.addEventListener('mousemove', (event) => {
            // Optional: You could add special cursor effects when hovering particles
            // For now, we'll just ensure the cursor is consistent
        });
    }
    
    /**
     * Clean up event listeners
     */
    destroy() {
        document.body.removeEventListener('mouseover', this._handleMouseOver);
        document.body.removeEventListener('mouseout', this._handleMouseOut);
        document.body.removeEventListener('mousedown', this._handleMouseDown);
        document.body.removeEventListener('mouseup', this._handleMouseUp);
        
        this.isInitialized = false;
    }
}
