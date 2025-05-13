/**
 * ProjectData Module
 * Handles project data management and filtering
 */
export class ProjectData {
    constructor() {
        this.projects = [];
        this.projectClickListeners = [];
        this.projectModalListeners = [];
        this.activeFilters = {
            dateRange: { start: 0, end: 9999 },
            categories: new Set(),
            skills: new Set(),
            status: new Set()
        };
        
        // Project detailed information from the original HTML
        this.projectDetails = {
            bittensor: {
                title: "VC-Backed Bittensor Project (Details)",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=Bittensor+Protocol+Deep+Dive",
                description: `
                    <p>This project involved architecting a novel solution on the <strong>Bittensor protocol</strong>, a decentralized machine learning network. As a co-founder, my responsibilities were multifaceted, spanning from initial concept and whitepaper development to technical architecture and grant acquisition.</p>
                    <p><strong>Key Achievements & Responsibilities:</strong></p>
                    <ul>
                        <li>Secured a <strong>$10,000 grant from DormDAO</strong> through a competitive pitching process, validating the project's potential and our team's vision.</li>
                        <li>Led the design of the project's governance model, ensuring fair participation and decentralized decision-making processes.</li>
                        <li>Defined core technical requirements and collaborated with development resources to translate these into a functional PoC (Proof of Concept).</li>
                        <li>Conducted extensive research into subnets, tokenomics, and incentive mechanisms within the Bittensor ecosystem to optimize our project's integration and viability.</li>
                        <li>Due to the sensitive nature of ongoing development and intellectual property, further specific details are covered under a Non-Disclosure Agreement.</li>
                    </ul>
                    <p><em>Technologies involved: Blockchain, Bittensor Protocol, Python, Decentralized Systems, Governance Models.</em></p>
                `
            },
            cryptoDD: {
                title: "Crypto Due Diligence Case Studies",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=In-Depth+Crypto+Analysis",
                description: `
                    <p>As an Investment Team Analyst at Texas Blockchain, I was responsible for conducting thorough due diligence on a variety of cryptoasset projects. This involved a multi-faceted approach to evaluate potential investments for a $120K AUM student-managed portfolio.</p>
                    <p><strong>Process & Deliverables:</strong></p>
                    <ul>
                        <li>Analyzed over 10 distinct cryptoasset projects, ranging from Layer 1 protocols to DeFi applications and NFT ecosystems.</li>
                        <li>Developed comprehensive risk assessment frameworks, considering technical vulnerabilities, market risks, regulatory concerns, and team capabilities.</li>
                        <li>Created detailed valuation summaries using various models, including comparative analysis, network value to transactions (NVT) ratios, and discounted cash flow (DCF) where applicable.</li>
                        <li>Prepared and delivered investment pitches, successfully allocating between $5,000 - $8,000 per selected idea.</li>
                        <li>Focused on identifying projects with strong fundamentals, innovative technology, and sustainable tokenomics.</li>
                    </ul>
                    <p><em>Example areas of analysis: Token utility, smart contract audits, community engagement, competitive landscape, roadmap viability, and macroeconomic factors influencing the crypto space.</em></p>
                `
            },
            imcTrading: {
                title: "IMC Prosperity Trading Challenge: Strategy Insights",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=Algorithmic+Trading+Simulation",
                description: `
                    <p>Participated in the IMC Prosperity Global Trading Challenge, a highly competitive event simulating real-world market dynamics. This involved developing and testing both algorithmic and discretionary trading strategies across multiple rounds.</p>
                    <p><strong>Approach & Learnings:</strong></p>
                    <ul>
                        <li>Focused on quantitative strategies, including statistical arbitrage, momentum trading, and mean-reversion techniques.</li>
                        <li>Utilized simulated market data to backtest strategies and optimize parameters for risk management and profitability.</li>
                        <li>Developed algorithms to automate trade execution based on predefined signals and market conditions.</li>
                        <li>Gained practical experience in market microstructure, order book dynamics, and the psychological aspects of trading under pressure.</li>
                        <li>The challenge emphasized rapid decision-making, adaptability to changing market scenarios, and rigorous analytical thinking.</li>
                    </ul>
                    <p><em>This experience honed my skills in data analysis, algorithmic design, and risk assessment in a fast-paced trading environment.</em></p>
                `
            },
            stablecoinResearch: {
                title: "Messari Stablecoin Research: Market Analysis",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=Stablecoin+Ecosystem+Study",
                description: `
                    <p>As an analyst for Messari, I conducted in-depth research into the evolving landscape of stablecoins. This involved examining various stablecoin mechanisms, market trends, and their impact on the broader digital asset ecosystem.</p>
                    <p><strong>Key Research Areas:</strong></p>
                    <ul>
                        <li>Analyzed different types of stablecoins: fiat-collateralized, crypto-collateralized, and algorithmic.</li>
                        <li>Investigated peg stability mechanisms, risk factors (e.g., de-pegging events, regulatory scrutiny), and adoption metrics across multiple assets.</li>
                        <li>Automated data-monitoring workflows using Python scripts to track key stablecoin metrics such as market capitalization, trading volume, and on-chain velocity.</li>
                        <li>Contributed to reports and analyses on stablecoin market trends, highlighting opportunities and challenges for different protocols and use cases.</li>
                        <li>Explored the role of stablecoins in DeFi, cross-border payments, and as a store of value in volatile markets.</li>
                    </ul>
                    <p><em>This research provided valuable insights into the critical role stablecoins play in the digital economy and the complexities of maintaining their stability and utility.</em></p>
                `
            },
            creModeling: {
                title: "Commercial Real Estate Analysis: Modeling Samples",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=CRE+Financial+Forecasting",
                description: `
                    <p>During my internship at Investors Alliance, Inc., I was deeply involved in the financial analysis of commercial real estate properties. This included building sophisticated financial models to support investment decisions.</p>
                    <p><strong>Core Responsibilities & Outputs:</strong></p>
                    <ul>
                        <li>Developed detailed pro forma financial models for various property types (e.g., office, retail, multifamily).</li>
                        <li>Created comprehensive cash-flow forecasts, incorporating assumptions for rental income, operating expenses, capital expenditures, and debt service.</li>
                        <li>Performed sensitivity analysis to assess the impact of different market scenarios on investment returns (IRR, NPV, equity multiple).</li>
                        <li>Contributed to the rebuilding of the company's internal investment database, focusing on data integrity and efficient reporting. This involved redesigning the storage schema and standardizing data input processes.</li>
                        <li>Assisted in the preparation of investment memorandums and presentations for potential investors and internal review.</li>
                    </ul>
                    <p><em>Tools used: Advanced Microsoft Excel, ARGUS (exposure), SQL (for database interaction). This experience provided a strong foundation in real estate valuation and financial due diligence.</em></p>
                `
            },
            energyTrading: {
                title: "Energy Commodity Trading Analysis: Market Reports",
                image: "https://placehold.co/800x450/1e2124/d8d8d8?text=Energy+Market+Dynamics",
                description: `
                    <p>As a cohort member at UTEXAS Energy Trading, I engaged in the analysis of energy commodity markets, including electricity, natural gas, and renewables. The program focused on identifying trading opportunities through fundamental and technical analysis.</p>
                    <p><strong>Activities & Focus Areas:</strong></p>
                    <ul>
                        <li>Conducted market research on supply and demand dynamics, weather patterns, geopolitical events, and regulatory changes affecting energy prices.</li>
                        <li>Collaborated with team members to develop and refine trading models and strategies.</li>
                        <li>Analyzed historical price data and volatility to identify potential arbitrage opportunities and trends.</li>
                        <li>Prepared and presented market reports, summarizing key findings and potential trading ideas.</li>
                        <li>Gained exposure to risk management techniques specific to energy markets and portfolio optimization strategies.</li>
                    </ul>
                    <p><em>This program provided a comprehensive overview of energy trading operations and the analytical skills required to navigate these complex markets.</em></p>
                `
            }
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
                // Both open the panel and trigger modal
                this.notifyProjectClick(project.id);
                this.notifyModalOpen(project);
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
     * Register a function to be called when a modal should be opened
     * @param {Function} callback Function to call when a project is clicked
     */
    onModalOpen(callback) {
        if (typeof callback === 'function') {
            this.projectModalListeners.push(callback);
        }
    }
    
    /**
     * Notify all registered listeners about a modal open request
     * @param {Object} project The project data
     */
    notifyModalOpen(project) {
        this.projectModalListeners.forEach(callback => callback(project));
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
