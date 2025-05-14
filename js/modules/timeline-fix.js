/**
 * Timeline Diagnostics and Fixes
 * This module helps diagnose and fix common issues with the timeline scrubber
 */
export class TimelineFix {
    constructor() {
        this.timelineScrubber = document.querySelector('.timeline-scrubber-section');
        this.startSlider = document.getElementById('timelineStartSlider');
        this.endSlider = document.getElementById('timelineEndSlider');
        this.rangeDisplay = document.getElementById('timelineRangeDisplay');
        this.selectedRange = document.getElementById('timelineSelectedRange');
    }

    /**
     * Initialize the timeline fix module
     */
    init() {
        console.log('[Timeline Fix] Initializing timeline diagnostics');
        this.diagnose();
        
        // Set up a mutation observer to detect DOM changes affecting the timeline
        this.observeTimelineChanges();
        
        // Add periodic check for timeline functionality
        setInterval(() => this.checkTimelineStatus(), 5000);
    }

    /**
     * Run diagnostic checks on the timeline
     */
    diagnose() {
        if (!this.timelineScrubber) {
            console.error('[Timeline Fix] Timeline scrubber element not found');
            return;
        }

        // Check if the sliders are present and functional
        if (!this.startSlider || !this.endSlider) {
            console.error('[Timeline Fix] Timeline sliders not found');
            this.attemptRepair();
            return;
        }

        // Check if the display elements are present
        if (!this.rangeDisplay || !this.selectedRange) {
            console.warn('[Timeline Fix] Timeline display elements not found');
        }

        // Check if event listeners are properly attached
        this.checkEventListeners();
        
        console.log('[Timeline Fix] Timeline diagnosis complete');
    }

    /**
     * Check if the timeline event listeners are properly attached
     */
    checkEventListeners() {
        // Test the sliders by dispatching an input event
        const testEvent = new Event('input', { bubbles: true });
        
        try {
            // Store original values
            const originalStartValue = this.startSlider.value;
            const originalEndValue = this.endSlider.value;
            
            // Test the start slider
            this.startSlider.value = originalStartValue;
            this.startSlider.dispatchEvent(testEvent);
            
            // Test the end slider
            this.endSlider.value = originalEndValue;
            this.endSlider.dispatchEvent(testEvent);
            
            console.log('[Timeline Fix] Event listeners appear to be working');
        } catch (err) {
            console.error('[Timeline Fix] Error testing event listeners:', err);
            this.reattachEventListeners();
        }
    }
    
    /**
     * Reattach event listeners to the timeline sliders
     */
    reattachEventListeners() {
        console.log('[Timeline Fix] Attempting to reattach event listeners');
        
        // Start slider
        this.startSlider.addEventListener('input', () => {
            let value = parseFloat(this.startSlider.value);
            if (value > parseFloat(this.endSlider.value)) {
                this.endSlider.value = value;
            }
            this.updateTimelineUI();
        });
        
        // End slider
        this.endSlider.addEventListener('input', () => {
            let value = parseFloat(this.endSlider.value);
            if (value < parseFloat(this.startSlider.value)) {
                this.startSlider.value = value;
            }
            this.updateTimelineUI();
        });
        
        console.log('[Timeline Fix] Event listeners reattached');
    }
    
    /**
     * Update the timeline UI based on current slider values
     */
    updateTimelineUI() {
        const startYear = parseFloat(this.startSlider.value);
        const endYear = parseFloat(this.endSlider.value);
        const minYear = parseFloat(this.startSlider.min);
        const maxYear = parseFloat(this.endSlider.max);
        const totalRange = maxYear - minYear;
        
        // Calculate positions as percentages
        const startPosition = ((startYear - minYear) / totalRange) * 100;
        const endPosition = ((endYear - minYear) / totalRange) * 100;
        
        // Update the visual indicator
        this.selectedRange.style.left = startPosition + '%';
        this.selectedRange.style.width = (endPosition - startPosition) + '%';
        
        // Update the text display
        this.rangeDisplay.textContent = `${this.formatYear(startYear)} - ${this.formatYear(endYear)}`;
    }
    
    /**
     * Format year values (handles quarters)
     */
    formatYear(year) {
        const wholeYear = Math.floor(year);
        const fraction = year - wholeYear;
        
        if (fraction === 0) return wholeYear.toString();
        if (fraction === 0.25) return `${wholeYear} Q1`;
        if (fraction === 0.5) return `${wholeYear} Q2`;
        if (fraction === 0.75) return `${wholeYear} Q3`;
        return wholeYear.toString();
    }
    
    /**
     * Set up an observer to detect any changes to the timeline
     */
    observeTimelineChanges() {
        if (!this.timelineScrubber) return;
        
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || 
                     mutation.attributeName === 'style')) {
                    
                    // If timeline classes change, check if it's still functional
                    this.checkTimelineStatus();
                }
            }
        });
        
        observer.observe(this.timelineScrubber, { 
            attributes: true,
            attributeFilter: ['class', 'style'] 
        });
    }
    
    /**
     * Check the current status of the timeline and fix if needed
     */
    checkTimelineStatus() {
        if (!this.timelineScrubber) return;
        
        // Check if timeline is correctly positioned
        const computedStyle = window.getComputedStyle(this.timelineScrubber);
        
        // Fix timeline if it's hidden but shouldn't be
        if (computedStyle.opacity === '0' && window.scrollY > 0 && !document.querySelector('.mobile-menu.show')) {
            console.log('[Timeline Fix] Timeline is hidden but should be visible, fixing...');
            this.timelineScrubber.classList.remove('scrolled-past-hero');
            this.timelineScrubber.style.opacity = '1';
        }
        
        // Ensure correct z-index
        if (parseInt(computedStyle.zIndex) < 100) {
            console.log('[Timeline Fix] Timeline z-index is too low, fixing...');
            this.timelineScrubber.style.zIndex = '100';
        }
    }
    
    /**
     * Attempt to repair common timeline issues
     */
    attemptRepair() {
        console.log('[Timeline Fix] Attempting to repair timeline...');
        
        // If sliders are missing, try refreshing the timeline functionality
        this.refreshTimeline();
    }
    
    /**
     * Refresh the entire timeline component
     */
    refreshTimeline() {
        console.log('[Timeline Fix] Refreshing timeline functionality');
        
        // Force update any timeline CSS that might be causing issues
        if (this.timelineScrubber) {
            this.timelineScrubber.style.display = 'none';
            setTimeout(() => {
                this.timelineScrubber.style.display = '';
                this.timelineScrubber.style.opacity = '1';
                this.timelineScrubber.style.transform = 'none';
                this.timelineScrubber.style.position = 'sticky';
                this.timelineScrubber.style.zIndex = '100';
                this.timelineScrubber.classList.remove('scrolled-past-hero');
                
                console.log('[Timeline Fix] Timeline display restored');
            }, 100);
        }
    }
}
