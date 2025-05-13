/**
 * ProjectData Module
 * Handles project data management and filtering
 */
export class ProjectData {
    constructor() {
        this.projects = [];
        this.projectClickListeners = [];
        this.activeFilters = {
            dateRange: { start: 0, end: 9999 },
            categories: new Set(),
            skills: new Set(),
            status: new Set()
        };
    }
    
    /**
     * Initialize project data
     */
    init() {
        this.loadProjects();
        this.setupProjectCards();
        this.setupFilterListeners();
    }
    
    /**
     * Load project data from DOM or external source
     */
    loadProjects() {
        const projectCards = document.querySelectorAll('.card[data-project-id]');
        
        projectCards.forEach(card => {
            const projectId = card.dataset.projectId;
            
            if (!projectId) return;
            
            // Extract project data
            const titleEl = card.querySelector('.project-title');
            const summaryEl = card.querySelector('.project-summary');
            const imageEl = card.querySelector('.project-image');
            
            this.projects.push({
                id: projectId,
                title: titleEl ? titleEl.textContent.trim() : 'Untitled Project',
                summary: summaryEl ? summaryEl.textContent.trim() : '',
                imageUrl: imageEl ? imageEl.getAttribute('src') : '',
                startDate: parseFloat(card.dataset.projectStart || '0'),
                endDate: parseFloat(card.dataset.projectEnd || '9999'),
                element: card,
                // Additional properties would be extracted or populated here
                categories: this.extractCategories(card, summaryEl),
                skills: this.extractSkills(card, summaryEl)
            });
        });
    }
    
    /**
     * Extract categories from project card content
     * @param {Element} card - The project card element
     * @param {Element} summaryEl - The summary element
     * @returns {Array} - Array of category strings
     */
    extractCategories(card, summaryEl) {
        // This is a simplified approach - in a real application, 
        // categories would likely be data attributes or from a database
        const categories = [];
        const summary = summaryEl ? summaryEl.textContent.toLowerCase() : '';
        
        if (summary.includes('blockchain') || card.id === 'bittensor') {
            categories.push('blockchain');
        }
        
        if (summary.includes('finance') || summary.includes('trading') || 
            card.id === 'cryptoDD' || card.id === 'imcTrading') {
            categories.push('finance');
        }
        
        if (summary.includes('research') || card.id === 'stablecoinResearch') {
            categories.push('research');
        }
        
        return categories;
    }
    
    /**
     * Extract skills from project content
     * @param {Element} card - The project card element
     * @param {Element} summaryEl - The summary element
     * @returns {Array} - Array of skill strings
     */
    extractSkills(card, summaryEl) {
        // Simplified approach for demo purposes
        const skills = [];
        const summary = summaryEl ? summaryEl.textContent.toLowerCase() : '';
        const id = card.dataset.projectId;
        
        if (summary.includes('python') || id === 'imcTrading') {
            skills.push('python');
        }
        
        if (summary.includes('blockchain') || id === 'bittensor' || id === 'cryptoDD') {
            skills.push('blockchain');
        }
        
        if (summary.includes('modeling') || id === 'creModeling') {
            skills.push('modeling');
        }
        
        if (summary.includes('analysis') || id === 'stablecoinResearch' || id === 'cryptoDD') {
            skills.push('analysis');
        }
        
        return skills;
    }
    
    /**
     * Setup project card click handlers
     */
    setupProjectCards() {
        this.projects.forEach(project => {
            const detailsBtn = project.element.querySelector('.project-details-btn');
            if (!detailsBtn) return;
            
            detailsBtn.addEventListener('click', () => {
                this.notifyProjectClick(project.id);
            });
        });
    }
    
    /**
     * Setup filter change event listeners
     */
    setupFilterListeners() {
        document.addEventListener('filter-change', (event) => {
            const { type, value, active } = event.detail;
            
            // Update the appropriate filter collection
            if (type === 'category') {
                this.updateFilterSet(this.activeFilters.categories, value, active);
            } else if (type === 'skill') {
                this.updateFilterSet(this.activeFilters.skills, value, active);
            } else if (type === 'status') {
                this.updateFilterSet(this.activeFilters.status, value, active);
            }
            
            // Apply all filters
            this.applyFilters();
        });
    }
    
    /**
     * Helper to update a filter set based on active state
     * @param {Set} filterSet - The Set to update
     * @param {string} value - The value to add or remove
     * @param {boolean} isActive - Whether the filter is active
     */
    updateFilterSet(filterSet, value, isActive) {
        if (isActive) {
            filterSet.add(value);
        } else {
            filterSet.delete(value);
        }
    }
    
    /**
     * Filter projects by date range
     * @param {number} startYear - Start year for filtering
     * @param {number} endYear - End year for filtering
     * @param {boolean} isActive - Whether the filter is active
     */
    filterByDateRange(startYear, endYear, isActive = true) {
        this.activeFilters.dateRange = {
            start: isActive ? startYear : 0,
            end: isActive ? endYear : 9999
        };
        
        this.applyFilters();
    }
    
    /**
     * Apply all active filters to projects
     */
    applyFilters() {
        const { dateRange, categories, skills, status } = this.activeFilters;
        
        this.projects.forEach(project => {
            // Check if project falls within date range
            const isInDateRange = (
                project.endDate >= dateRange.start && 
                project.startDate <= dateRange.end
            );
            
            // Check if project matches category filter (if any active)
            const matchesCategory = categories.size === 0 || 
                project.categories.some(cat => categories.has(cat));
            
            // Check if project matches skill filter (if any active)
            const matchesSkill = skills.size === 0 || 
                project.skills.some(skill => skills.has(skill));
            
            // Check if project matches status filter (if any active)
            // This assumes status information would be available on the project object
            const matchesStatus = status.size === 0;
            
            // Apply visibility based on all filter criteria
            const isVisible = isInDateRange && matchesCategory && matchesSkill && matchesStatus;
            
            this.setProjectVisibility(project.element, isVisible);
        });
    }
    
    /**
     * Set project card visibility with animations
     * @param {Element} card - The project card element
     * @param {boolean} isVisible - Whether the card should be visible
     */
    setProjectVisibility(card, isVisible) {
        if (isVisible) {
            card.style.display = '';
            card.classList.add('active');
            
            // Apply a smooth fade-in transition
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        } else {
            card.classList.remove('active');
            
            // Apply a smooth fade-out transition
            card.style.opacity = '0.3';
            card.style.transform = 'translateY(10px)';
            
            // Hide completely after transition (for better layout)
            setTimeout(() => {
                if (!card.classList.contains('active')) {
                    card.style.display = 'none';
                }
            }, 300);
        }
    }
    
    /**
     * Reset all filters and show all projects
     */
    resetFilters() {
        // Clear all filters
        this.activeFilters.dateRange = { start: 0, end: 9999 };
        this.activeFilters.categories.clear();
        this.activeFilters.skills.clear();
        this.activeFilters.status.clear();
        
        // Reset all filter UI elements
        document.querySelectorAll('.filter-chip.active').forEach(chip => {
            chip.classList.remove('active');
        });
        
        // Show all projects
        this.projects.forEach(project => {
            this.setProjectVisibility(project.element, true);
        });
    }
    
    /**
     * Register a callback for project click events
     * @param {Function} callback - Function to call with project ID
     */
    onProjectClick(callback) {
        if (typeof callback === 'function') {
            this.projectClickListeners.push(callback);
        }
    }
    
    /**
     * Notify all project click listeners
     * @param {string} projectId - ID of the clicked project
     */
    notifyProjectClick(projectId) {
        this.projectClickListeners.forEach(callback => {
            callback(projectId);
        });
    }
    
    /**
     * Get a project by ID
     * @param {string} id - The project ID to find
     * @returns {Object|null} The project object or null if not found
     */
    getProjectById(id) {
        return this.projects.find(project => project.id === id) || null;
    }
}
