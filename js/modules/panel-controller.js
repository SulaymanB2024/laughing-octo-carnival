/**
 * PanelController
 * Manages the sliding panels functionality
 */
export class PanelController {
    constructor() {
        // DOM elements
        this.leftPanel = document.getElementById('leftPanel');
        this.rightPanel = document.getElementById('rightPanel');
        this.contentBackdrop = document.getElementById('contentBackdrop');
        this.closeLeftPanelBtn = document.getElementById('closeLeftPanel');
        this.closeRightPanelBtn = document.getElementById('closeRightPanel');
        
        // Project panel content elements
        this.panelProjectOverview = document.getElementById('panelProjectOverview');
        this.panelProjectTimeline = document.getElementById('panelProjectTimeline');
        this.panelProjectCategory = document.getElementById('panelProjectCategory');
        this.panelProjectStatus = document.getElementById('panelProjectStatus');
        this.panelProjectAccomplishments = document.getElementById('panelProjectAccomplishments');
        this.panelRelatedProjects = document.getElementById('panelRelatedProjects');
    }
    
    /**
     * Initialize panel controller
     */
    init() {
        if (!this.leftPanel || !this.rightPanel) return;
        
        this.setupEventListeners();
        this.setupProjectCards();
        this.setupSkillBadges();
        this.setupFilterChips();
    }
    
    /**
     * Setup event listeners for panel functionality
     */
    setupEventListeners() {
        // Close panel buttons
        if (this.closeLeftPanelBtn) {
            this.closeLeftPanelBtn.addEventListener('click', () => this.closeLeftPanel());
        }
        
        if (this.closeRightPanelBtn) {
            this.closeRightPanelBtn.addEventListener('click', () => this.closeRightPanel());
        }
        
        // Click on backdrop to close panels
        if (this.contentBackdrop) {
            this.contentBackdrop.addEventListener('click', () => {
                this.closeLeftPanel();
                this.closeRightPanel();
            });
        }
        
        // Close panels with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLeftPanel();
                this.closeRightPanel();
            }
        });
    }
    
    /**
     * Setup project card click events to open left panel
     */
    setupProjectCards() {
        const projectCards = document.querySelectorAll('.card[data-project-id]');
        
        projectCards.forEach(card => {
            const detailsBtn = card.querySelector('.project-details-btn');
            if (!detailsBtn) return;
            
            detailsBtn.addEventListener('click', () => {
                const projectId = card.dataset.projectId;
                if (projectId) {
                    this.openLeftPanel(projectId);
                }
            });
        });
    }
    
    /**
     * Setup skill badge click events to open right panel
     */
    setupSkillBadges() {
        const skillBadges = document.querySelectorAll('.skill-badge');
        
        skillBadges.forEach(badge => {
            badge.addEventListener('click', () => {
                const skill = badge.textContent.trim();
                this.openRightPanel(skill);
            });
        });
    }
    
    /**
     * Setup filter chips functionality
     */
    setupFilterChips() {
        const filterChips = document.querySelectorAll('.filter-chip');
        
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                this.classList.toggle('active');
                
                // Get filter info
                const filterType = this.dataset.filter;
                const filterValue = this.dataset.value;
                
                // Dispatch custom event that can be listened to by other modules
                const event = new CustomEvent('filter-change', {
                    detail: {
                        type: filterType,
                        value: filterValue,
                        active: this.classList.contains('active')
                    }
                });
                document.dispatchEvent(event);
            });
        });
    }
    
    /**
     * Open left panel with project details
     * @param {string} projectId - ID of the project to display
     */
    openLeftPanel(projectId = null) {
        if (!this.leftPanel) return;
        
        if (projectId) {
            this.updateProjectPanelContent(projectId);
        }
        
        this.leftPanel.classList.add('panel-open');
        this.showBackdrop();
        document.body.classList.add('panel-active', 'panel-left-active');
    }
    
    /**
     * Close left panel
     */
    closeLeftPanel() {
        if (!this.leftPanel) return;
        
        this.leftPanel.classList.remove('panel-open');
        
        if (!this.rightPanel || !this.rightPanel.classList.contains('panel-open')) {
            this.hideBackdrop();
            document.body.classList.remove('panel-active');
        }
        
        document.body.classList.remove('panel-left-active');
    }
    
    /**
     * Open right panel with skill details or filters
     * @param {string} skill - Optional skill to display details for
     */
    openRightPanel(skill = null) {
        if (!this.rightPanel) return;
        
        if (skill) {
            this.updateSkillPanelContent(skill);
        }
        
        this.rightPanel.classList.add('panel-open');
        this.showBackdrop();
        document.body.classList.add('panel-active', 'panel-right-active');
    }
    
    /**
     * Close right panel
     */
    closeRightPanel() {
        if (!this.rightPanel) return;
        
        this.rightPanel.classList.remove('panel-open');
        
        if (!this.leftPanel || !this.leftPanel.classList.contains('panel-open')) {
            this.hideBackdrop();
            document.body.classList.remove('panel-active');
        }
        
        document.body.classList.remove('panel-right-active');
    }
    
    /**
     * Show content backdrop
     */
    showBackdrop() {
        if (this.contentBackdrop) {
            this.contentBackdrop.classList.add('backdrop-visible');
        }
    }
    
    /**
     * Hide content backdrop
     */
    hideBackdrop() {
        if (this.contentBackdrop) {
            this.contentBackdrop.classList.remove('backdrop-visible');
        }
    }
    
    /**
     * Update project panel content
     * @param {string} projectId - ID of the project
     */
    updateProjectPanelContent(projectId) {
        // This would normally fetch data from an API or a larger data source
        // For demonstration, we'll use a simplified approach with hardcoded data
        const projectDetails = {
            bittensor: {
                title: "VC-Backed Bittensor Project",
                overview: "Co-founded and architected a blockchain protocol project on the Bittensor network. Led technical development and governance implementation.",
                timeline: "2022 - 2024",
                category: "Blockchain",
                status: "Active",
                accomplishments: [
                    "Secured $10K grant from DormDAO",
                    "Developed governance framework",
                    "Managed technical implementations",
                    "Coordinated with venture capital partners"
                ],
                related: ["cryptoDD", "stablecoinResearch"]
            },
            cryptoDD: {
                title: "Crypto Due Diligence",
                overview: "Served as Investment Team Analyst at Texas Blockchain, conducting due diligence on various crypto assets.",
                timeline: "2021 - 2023",
                category: "Finance",
                status: "Completed",
                accomplishments: [
                    "Analyzed 10+ crypto assets for investment potential",
                    "Created risk and valuation summary reports",
                    "Pitched $5K-$8K allocations to the investment committee",
                    "Helped manage $120K AUM"
                ],
                related: ["bittensor", "stablecoinResearch"]
            },
            // Additional project details would be added here
        };
        
        const project = projectDetails[projectId] || {
            title: "Project Details",
            overview: "Project information not available.",
            timeline: "N/A",
            category: "N/A",
            status: "N/A",
            accomplishments: [],
            related: []
        };
        
        // Update panel content
        if (this.panelProjectOverview) {
            this.panelProjectOverview.textContent = project.overview;
        }
        
        if (this.panelProjectTimeline) {
            this.panelProjectTimeline.textContent = project.timeline;
        }
        
        if (this.panelProjectCategory) {
            this.panelProjectCategory.textContent = project.category;
        }
        
        if (this.panelProjectStatus) {
            this.panelProjectStatus.textContent = project.status;
        }
        
        if (this.panelProjectAccomplishments) {
            this.panelProjectAccomplishments.innerHTML = '';
            project.accomplishments.forEach(item => {
                const li = document.createElement('li');
                li.className = 'panel-list-item';
                li.textContent = item;
                this.panelProjectAccomplishments.appendChild(li);
            });
        }
        
        if (this.panelRelatedProjects) {
            this.panelRelatedProjects.innerHTML = '';
            project.related.forEach(relatedId => {
                const related = projectDetails[relatedId];
                if (!related) return;
                
                const div = document.createElement('div');
                div.className = 'mb-2 p-2 border border-gray-700 rounded hover:bg-gray-700 cursor-pointer';
                div.textContent = related.title;
                div.addEventListener('click', () => {
                    this.updateProjectPanelContent(relatedId);
                });
                
                this.panelRelatedProjects.appendChild(div);
            });
        }
    }
    
    /**
     * Update skill panel content
     * @param {string} skill - Skill to display
     */
    updateSkillPanelContent(skill) {
        const skillDetailContent = document.getElementById('skillDetailContent');
        if (!skillDetailContent) return;
        
        // Simulated skill data - in a real app, this would be from a database
        const skillDetails = {
            'Python': {
                description: 'Advanced proficiency in Python programming with focus on data analysis and algorithmic trading.',
                experience: '3+ years',
                projects: ['imcTrading', 'cryptoDD'],
                libraries: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn']
            },
            'Blockchain': {
                description: 'Extensive experience with blockchain technology and smart contract development.',
                experience: '2+ years',
                projects: ['bittensor', 'cryptoDD'],
                frameworks: ['Ethereum/Solidity', 'Bittensor', 'Web3.js']
            }
            // Additional skills would be defined here
        };
        
        // Default content if skill not found
        let content = `<p class="text-sm text-gray-400">Details for "${skill}" not available</p>`;
        
        // Get skill details if available
        const details = skillDetails[skill] || null;
        if (details) {
            content = `
                <div class="text-sm">
                    <p class="mb-3">${details.description}</p>
                    <div class="mb-2"><span class="text-gray-400">Experience:</span> ${details.experience}</div>
                    <div class="mb-3">
                        <div class="text-gray-400 mb-1">Related Projects:</div>
                        <div class="flex flex-wrap gap-1">
                            ${(details.projects || []).map(proj => `
                                <span class="px-2 py-1 bg-gray-700 text-xs rounded">${proj}</span>
                            `).join('')}
                        </div>
                    </div>
                    ${details.libraries ? `
                        <div class="mb-2">
                            <div class="text-gray-400 mb-1">Libraries/Tools:</div>
                            <div class="flex flex-wrap gap-1">
                                ${details.libraries.map(lib => `
                                    <span class="px-2 py-1 bg-gray-700 text-xs rounded">${lib}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${details.frameworks ? `
                        <div class="mb-2">
                            <div class="text-gray-400 mb-1">Frameworks:</div>
                            <div class="flex flex-wrap gap-1">
                                ${details.frameworks.map(fw => `
                                    <span class="px-2 py-1 bg-gray-700 text-xs rounded">${fw}</span>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        skillDetailContent.innerHTML = content;
    }
}
