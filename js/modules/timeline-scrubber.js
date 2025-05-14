/**
 * TimelineScrubber Module
 * Handles the timeline filtering functionality
 */
export class TimelineScrubber {
    constructor() {
        // DOM elements
        this.elements = {
            startSlider: document.getElementById('timelineStartSlider'),
            endSlider: document.getElementById('timelineEndSlider'),
            rangeDisplay: document.getElementById('timelineRangeDisplay'),
            selectedRange: document.getElementById('timelineSelectedRange'),
            applyButton: document.getElementById('applyTimelineFilter'),
            resetButton: document.getElementById('resetTimelineFilter'),
            timelineScrubber: document.querySelector('.timeline-scrubber-section'),
            heroSection: document.querySelector('.hero-section')
        };
        
        // State
        this.state = {
            startYear: 0,
            endYear: 0,
            isFilterActive: false,
            minYear: 0,
            maxYear: 0,
            filterChangeCallbacks: []
        };
    }
    
    /**
     * Initialize the timeline scrubber
     */
    init() {
        if (!this.validateElements()) return;
        
        // Set initial state
        this.state.startYear = parseFloat(this.elements.startSlider.value);
        this.state.endYear = parseFloat(this.elements.endSlider.value);
        this.state.minYear = parseFloat(this.elements.startSlider.min);
        this.state.maxYear = parseFloat(this.elements.endSlider.max);
        
        this.setupEventListeners();
        this.updateUI();
        this.setupScrollBehavior();
        this.initializeFromURL();
    }
    
    /**
     * Validate that all required DOM elements are present
     * @returns {boolean} True if all elements are valid
     */
    validateElements() {
        return this.elements.startSlider && 
               this.elements.endSlider && 
               this.elements.rangeDisplay && 
               this.elements.selectedRange && 
               this.elements.applyButton && 
               this.elements.resetButton;
    }
    
    /**
     * Setup event listeners for timeline controls
     */
    setupEventListeners() {
        // Start slider change
        this.elements.startSlider.addEventListener('input', () => {
            this.state.startYear = parseFloat(this.elements.startSlider.value);
            
            // Ensure start doesn't exceed end
            if (this.state.startYear > this.state.endYear) {
                this.state.endYear = this.state.startYear;
                this.elements.endSlider.value = this.state.startYear;
            }
            
            this.updateUI();
        });
        
        // End slider change
        this.elements.endSlider.addEventListener('input', () => {
            this.state.endYear = parseFloat(this.elements.endSlider.value);
            
            // Ensure end doesn't go below start
            if (this.state.endYear < this.state.startYear) {
                this.state.startYear = this.state.endYear;
                this.elements.startSlider.value = this.state.endYear;
            }
            
            this.updateUI();
        });
        
        // Apply filter button
        this.elements.applyButton.addEventListener('click', () => {
            this.handleApplyFilter();
        });
        
        // Reset filter button
        this.elements.resetButton.addEventListener('click', () => {
            this.handleResetFilter();
        });
    }
    
    /**
     * Format year values (handles quarters)
     * @param {number} year - The year value to format
     * @returns {string} Formatted year string
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
     * Update the timeline UI elements
     */
    updateUI() {
        const totalRange = this.state.maxYear - this.state.minYear;
        
        // Calculate positions as percentages
        const startPosition = ((this.state.startYear - this.state.minYear) / totalRange) * 100;
        const endPosition = ((this.state.endYear - this.state.minYear) / totalRange) * 100;
        
        // Update the visual indicator
        this.elements.selectedRange.style.left = startPosition + '%';
        this.elements.selectedRange.style.width = (endPosition - startPosition) + '%';
        
        // Update the text display
        this.elements.rangeDisplay.textContent = `${this.formatYear(this.state.startYear)} - ${this.formatYear(this.state.endYear)}`;
    }
    
    /**
     * Apply the timeline filter
     */
    handleApplyFilter() {
        this.state.isFilterActive = true;
        
        // Update button states
        this.elements.applyButton.classList.add('active');
        this.elements.resetButton.classList.remove('opacity-50');
        
        // Update URL parameters
        this.updateURLParameters();
        
        // Notify listeners about filter change
        this.notifyFilterChange();
    }
    
    /**
     * Reset the timeline filter
     */
    handleResetFilter() {
        // Reset sliders to default values
        this.elements.startSlider.value = this.state.minYear;
        this.elements.endSlider.value = this.state.maxYear;
        
        // Update state
        this.state.startYear = this.state.minYear;
        this.state.endYear = this.state.maxYear;
        this.state.isFilterActive = false;
        
        // Update UI
        this.updateUI();
        
        // Update button states
        this.elements.applyButton.classList.remove('active');
        this.elements.resetButton.classList.add('opacity-50');
        
        // Clear URL parameters
        this.updateURLParameters(true);
        
        // Notify listeners about filter reset
        this.notifyFilterChange();
    }
    
    /**
     * Update URL parameters for filter state
     * @param {boolean} shouldClear - Whether to clear the parameters
     */
    updateURLParameters(shouldClear = false) {
        const urlParams = new URLSearchParams(window.location.search);
        
        if (shouldClear) {
            urlParams.delete('timelineStart');
            urlParams.delete('timelineEnd');
        } else {
            urlParams.set('timelineStart', this.state.startYear);
            urlParams.set('timelineEnd', this.state.endYear);
        }
        
        const newUrl = urlParams.toString().length ? 
            `${window.location.pathname}?${urlParams}${window.location.hash}` :
            `${window.location.pathname}${window.location.hash}`;
        
        window.history.replaceState({}, '', newUrl);
    }
    
    /**
     * Load filter state from URL parameters
     */
    initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('timelineStart') && urlParams.has('timelineEnd')) {
            const urlStartYear = parseFloat(urlParams.get('timelineStart'));
            const urlEndYear = parseFloat(urlParams.get('timelineEnd'));
            
            if (!isNaN(urlStartYear) && !isNaN(urlEndYear)) {
                // Update sliders
                this.elements.startSlider.value = urlStartYear;
                this.elements.endSlider.value = urlEndYear;
                
                // Update state
                this.state.startYear = urlStartYear;
                this.state.endYear = urlEndYear;
                this.state.isFilterActive = true;
                
                // Update UI
                this.updateUI();
                
                // Update button states
                this.elements.applyButton.classList.add('active');
                this.elements.resetButton.classList.remove('opacity-50');
                
                // Notify listeners about initial filter state
                this.notifyFilterChange();
            }
        }
    }
    
    /**
     * Handle scroll behavior for sticky timeline
     * Improved scroll behavior with smoother transitions and better performance
     */
    setupScrollBehavior() {
        if (!this.elements.timelineScrubber || !this.elements.heroSection) return;
        
        // Track scroll direction
        let lastScrollY = window.scrollY;
        let ticking = false;
        let scrollTimeout = null;
        
        // Use requestAnimationFrame for better scroll performance
        const handleScroll = () => {
            // Get hero section height with a small buffer for smoother transition
            const heroHeight = this.elements.heroSection.clientHeight - 20;
            const scrollY = window.scrollY;
            const scrollingDown = scrollY > lastScrollY;
            const headerHeight = 64; // Estimated header height
            
            if (scrollY > heroHeight - headerHeight) {
                // When scrolled past hero section
                this.elements.timelineScrubber.classList.add('timeline-fixed');
                
                // More responsive timeline behavior
                if (scrollingDown) {
                    // Only hide on mobile and when scrolling significantly
                    if (window.innerWidth < 1024 && (scrollY - lastScrollY > 10)) {
                        this.elements.timelineScrubber.classList.add('scrolled-past-hero');
                    }
                } else {
                    // Show when scrolling up
                    this.elements.timelineScrubber.classList.remove('scrolled-past-hero');
                }
                
                // Always show after scrolling stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.elements.timelineScrubber.classList.remove('scrolled-past-hero');
                }, 800);
            } else {
                // When at hero section, show timeline normally
                this.elements.timelineScrubber.classList.remove('scrolled-past-hero');
                this.elements.timelineScrubber.classList.remove('timeline-fixed');
            }
            
            lastScrollY = scrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(handleScroll);
                ticking = true;
            }
        });
        
        // Initial check in case page loads scrolled down
        handleScroll();
    }
    
    /**
     * Register a callback for when the filter changes
     * @param {Function} callback - Function to call with start and end years
     */
    onFilterChange(callback) {
        if (typeof callback === 'function') {
            this.state.filterChangeCallbacks.push(callback);
        }
    }
    
    /**
     * Notify all registered callbacks about filter changes
     */
    notifyFilterChange() {
        const { startYear, endYear, isFilterActive } = this.state;
        
        this.state.filterChangeCallbacks.forEach(callback => {
            callback(startYear, endYear, isFilterActive);
        });
    }
    
    /**
     * Get the current filter state
     * @returns {Object} Current filter state
     */
    getFilterState() {
        return {
            startYear: this.state.startYear,
            endYear: this.state.endYear,
            isActive: this.state.isFilterActive
        };
    }
}
