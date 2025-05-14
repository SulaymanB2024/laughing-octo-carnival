/**
 * Enhanced Timeline Module
 * This module extends the timeline functionality with advanced features and fixes
 */
export class TimelineEnhancer {
    constructor() {
        this.timelineScrubber = document.querySelector('.timeline-scrubber-section');
        this.startSlider = document.getElementById('timelineStartSlider');
        this.endSlider = document.getElementById('timelineEndSlider');
        this.applyButton = document.getElementById('applyTimelineFilter');
        this.resetButton = document.getElementById('resetTimelineFilter');
        this.heroSection = document.querySelector('.hero-section');
        this.initialized = false;
    }

    /**
     * Initialize the timeline enhancer
     */
    init() {
        if (!this.validateElements()) {
            console.warn('[TimelineEnhancer] Some elements not found, initialization skipped');
            return;
        }

        console.log('[TimelineEnhancer] Initializing timeline enhancer');
        this.fixZIndexIssues();
        this.enhancePointerEvents();
        this.fixScrollBehavior();
        this.enhanceSliderHandling();
        this.fixButtonInteractions();
        
        // Mark as initialized
        this.initialized = true;
    }

    /**
     * Validate that all required elements are present
     */
    validateElements() {
        return this.timelineScrubber && 
               this.startSlider && 
               this.endSlider && 
               this.applyButton && 
               this.resetButton;
    }

    /**
     * Fix z-index issues with the timeline
     */
    fixZIndexIssues() {
        if (this.timelineScrubber) {
            // Ensure timeline is above other content but below modals
            this.timelineScrubber.style.zIndex = "100";
            
            // Add class for special handling
            this.timelineScrubber.classList.add('timeline-enhanced');
        }
    }

    /**
     * Enhance pointer events for better interaction
     */
    enhancePointerEvents() {
        if (this.startSlider && this.endSlider) {
            // Ensure sliders have proper pointer events
            this.startSlider.style.pointerEvents = "auto";
            this.endSlider.style.pointerEvents = "auto";
            
            // Add visual cue on hover
            this.startSlider.addEventListener('mouseover', () => {
                document.body.classList.add('timeline-slider-hover');
            });
            
            this.endSlider.addEventListener('mouseover', () => {
                document.body.classList.add('timeline-slider-hover');
            });
            
            this.startSlider.addEventListener('mouseout', () => {
                document.body.classList.remove('timeline-slider-hover');
            });
            
            this.endSlider.addEventListener('mouseout', () => {
                document.body.classList.remove('timeline-slider-hover');
            });
        }
    }

    /**
     * Fix scroll behavior for the timeline
     */
    fixScrollBehavior() {
        if (!this.timelineScrubber || !this.heroSection) return;
        
        // Force repaint the timeline on resize to fix positioning issues
        window.addEventListener('resize', () => {
            if (this.timelineScrubber) {
                this.timelineScrubber.style.display = 'none';
                setTimeout(() => {
                    this.timelineScrubber.style.display = '';
                }, 5);
            }
        });
        
        // Force correct timeline position on scroll
        let lastKnownScrollY = window.scrollY;
        let ticking = false;
        
        const handleScroll = () => {
            const heroHeight = this.heroSection.clientHeight;
            const scrollY = window.scrollY;
            
            // Ensure timeline shows properly when scrolled past hero
            if (scrollY > heroHeight - 100) {
                this.timelineScrubber.classList.add('timeline-fixed');
                this.timelineScrubber.classList.remove('scrolled-past-hero');
                
                // Force correct position
                this.timelineScrubber.style.top = '64px';
            } else {
                this.timelineScrubber.classList.remove('timeline-fixed');
            }
            
            lastKnownScrollY = scrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
        
        // Run once on initialization
        handleScroll();
    }

    /**
     * Enhance slider handling for better user experience
     */
    enhanceSliderHandling() {
        if (this.startSlider && this.endSlider) {
            // Add more responsive feedback when dragging
            const addDraggingClass = () => document.body.classList.add('timeline-dragging');
            const removeDraggingClass = () => document.body.classList.remove('timeline-dragging');
            
            this.startSlider.addEventListener('mousedown', addDraggingClass);
            this.endSlider.addEventListener('mousedown', addDraggingClass);
            
            document.addEventListener('mouseup', removeDraggingClass);
            
            // Keep focus on range when clicking track
            const timelineTrack = document.querySelector('.timeline-track');
            if (timelineTrack) {
                timelineTrack.addEventListener('click', (e) => {
                    // Determine which slider to move based on click position
                    const rect = timelineTrack.getBoundingClientRect();
                    const clickPosition = (e.clientX - rect.left) / rect.width;
                    
                    const startVal = parseFloat(this.startSlider.value);
                    const endVal = parseFloat(this.endSlider.value);
                    const startPos = (startVal - parseFloat(this.startSlider.min)) / 
                                    (parseFloat(this.startSlider.max) - parseFloat(this.startSlider.min));
                    const endPos = (endVal - parseFloat(this.endSlider.min)) / 
                                    (parseFloat(this.endSlider.max) - parseFloat(this.endSlider.min));
                    
                    // Move the closer handle
                    if (Math.abs(clickPosition - startPos) < Math.abs(clickPosition - endPos)) {
                        this.startSlider.value = clickPosition * (parseFloat(this.startSlider.max) - parseFloat(this.startSlider.min)) + 
                                                parseFloat(this.startSlider.min);
                        this.startSlider.dispatchEvent(new Event('input'));
                    } else {
                        this.endSlider.value = clickPosition * (parseFloat(this.endSlider.max) - parseFloat(this.endSlider.min)) + 
                                              parseFloat(this.endSlider.min);
                        this.endSlider.dispatchEvent(new Event('input'));
                    }
                });
            }
        }
    }

    /**
     * Fix button interactions for better usability
     */
    fixButtonInteractions() {
        if (this.applyButton && this.resetButton) {
            // Enhance button hover states
            [this.applyButton, this.resetButton].forEach(button => {
                button.addEventListener('mouseover', () => {
                    button.classList.add('hover');
                });
                
                button.addEventListener('mouseout', () => {
                    button.classList.remove('hover');
                });
                
                button.addEventListener('mousedown', () => {
                    button.classList.add('active');
                });
                
                button.addEventListener('mouseup', () => {
                    button.classList.remove('active');
                });
                
                // Ensure button is clickable
                button.style.position = 'relative';
                button.style.zIndex = '10';
            });
        }
    }
}
