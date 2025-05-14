/**
 * Network Visualization Module
 * Creates and manages the interactive D3.js network visualization
 */
export class NetworkVisualization {
    constructor(containerId) {
        // Container element ID
        this.containerId = containerId;
        
        // Reference to container element
        this.container = document.getElementById(containerId);
        
        // D3 elements
        this.svg = null;
        this.g = null;
        this.simulation = null;
        this.link = null;
        this.node = null;
        this.label = null;
        
        // Data
        this.nodes = [];
        this.links = [];
        this.skills = [];
        this.projects = [];
        
        // Controls
        this.toggleVisLayout = document.getElementById('toggleVisLayout');
        this.layerSkillsCheckbox = document.getElementById('layerSkills');
        this.layerProjectsCheckbox = document.getElementById('layerProjects');
        this.layerConnectionsCheckbox = document.getElementById('layerConnections');
        this.visLayersBtn = document.getElementById('visLayersBtn');
        this.layersDropdown = document.getElementById('layersDropdown');
        
        // State
        this.isRadialLayout = false;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    /**
     * Initialize the network visualization
     */
    init() {
        if (!this.container) return;
        
        this.setupDimensions();
        this.extractData();
        this.createVisualization();
        this.setupControls();
        this.setupWindowResize();
    }
    
    /**
     * Set up initial dimensions
     */
    setupDimensions() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    /**
     * Extract skills and projects data from DOM
     */
    extractData() {
        // Extract skills from skill badges
        this.skills = Array.from(document.querySelectorAll('.skill-badge')).map(badge => ({
            id: badge.textContent.trim(),
            group: "skill",
            value: Math.random() * 10 + 5
        }));
        
        // Extract projects from project cards
        this.projects = Array.from(document.querySelectorAll('.card')).map(card => {
            const titleEl = card.querySelector('.project-title');
            const title = titleEl ? titleEl.textContent.split(':')[0].trim() : 'Project';
            
            return {
                id: title,
                group: "project",
                value: Math.random() * 15 + 10
            };
        });
        
        // Combine both sets into nodes array
        this.nodes = [...this.skills, ...this.projects];
        
        // Generate links between nodes
        this.generateLinks();
    }
    
    /**
     * Generate links between nodes
     */
    generateLinks() {
        // For each project, link to 3-5 random skills
        this.projects.forEach(project => {
            const shuffledSkills = [...this.skills].sort(() => 0.5 - Math.random());
            const numLinks = Math.floor(Math.random() * 3) + 3; // 3 to 5 links
            
            for (let i = 0; i < numLinks && i < shuffledSkills.length; i++) {
                this.links.push({
                    source: project.id,
                    target: shuffledSkills[i].id,
                    value: Math.random() * 2 + 1
                });
            }
        });
        
        // Add links between skills based on relatedness (random for demo)
        for (let i = 0; i < this.skills.length; i++) {
            for (let j = i + 1; j < this.skills.length; j++) {
                // Only connect some skills randomly
                if (Math.random() < 0.15) {
                    this.links.push({
                        source: this.skills[i].id,
                        target: this.skills[j].id,
                        value: Math.random() * 1.5 + 0.5
                    });
                }
            }
        }
    }
    
    /**
     * Create the D3.js visualization
     */
    createVisualization() {
        // Create SVG element with proper cursor attributes
        this.svg = d3.select(`#${this.containerId}`)
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("class", "visualization-svg")
            .style("cursor", "default"); // Set default cursor
            
        // Create group for zooming
        this.g = this.svg.append("g");
        
        // Define forces for network graph
        this.simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(d => d.id).distance(100))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(this.width / 2, this.height / 2));
            
        // Define zoom behavior
        const zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on("zoom", (event) => {
                this.g.attr("transform", event.transform);
            });
            
        this.svg.call(zoom);
        
        // Create links
        this.link = this.g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(this.links)
            .enter()
            .append("line")
            .attr("stroke-width", d => Math.sqrt(d.value))
            .attr("stroke", "#4F5458")
            .attr("opacity", 0.5);
            
        // Create nodes with enhanced interactive properties
        this.node = this.g.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(this.nodes)
            .enter()
            .append("circle")
            .attr("r", d => d.group === "project" ? 8 : 5)
            .attr("fill", d => d.group === "project" ? "#00BCD4" : "#FF6D00")
            .attr("stroke", "#191f27")
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer") // Set pointer cursor explicitly
            .attr("data-interactive", "true") // Mark as interactive for cursor manager
            .call(this.drag());
            
        // Add labels to nodes
        this.label = this.g.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(this.nodes)
            .enter()
            .append("text")
            .text(d => d.id)
            .attr("font-size", d => d.group === "project" ? "10px" : "8px")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .style("fill", "#d8d8d8")
            .style("opacity", 0)
            .style("pointer-events", "none");
            
        // Add node interactions
        this.setupNodeInteractions();
        
        // Start simulation
        this.simulation
            .nodes(this.nodes)
            .on("tick", () => this.updatePositions());
            
        this.simulation.force("link")
            .links(this.links);
    }
    
    /**
     * Define drag behavior for nodes
     */
    drag() {
        const dragstarted = (event, d) => {
            // Add class to the dragged node for visual feedback
            d3.select(event.sourceEvent.target).classed("dragging", true);
            
            if (!event.active) this.simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
            
            // Emit an event that cursor manager can listen to
            document.dispatchEvent(new CustomEvent('cursor-change', { 
                detail: { type: 'grabbing' } 
            }));
        };
        
        const dragged = (event, d) => {
            // Apply some damping effect for smoother movement
            const damping = 1.0;  // 1.0 = no damping, lower = more damping
            d.fx = event.x * damping + d.fx * (1-damping);
            d.fy = event.y * damping + d.fy * (1-damping);
        };
        
        const dragended = (event, d) => {
            // Remove visual feedback
            d3.select(event.sourceEvent.target).classed("dragging", false);
            
            if (!event.active) this.simulation.alphaTarget(0);
            
            // Add a slight transition before releasing the fixed position
            setTimeout(() => {
                d.fx = null;
                d.fy = null;
            }, 100);
            
            // Reset cursor
            document.dispatchEvent(new CustomEvent('cursor-change', { 
                detail: { type: 'default' } 
            }));
        };
        
        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    
    /**
     * Setup node hover and click interactions
     */
    setupNodeInteractions() {
        // Use data-cursor attribute for consistent cursor management
        this.node
        .attr("data-cursor", "pointer")
        .style("cursor", "pointer")
        .on("mouseover", (event, d) => {
            d3.select(event.currentTarget)
                .attr("stroke", "#d8d8d8")
                .attr("stroke-width", 2)
                .style("filter", "drop-shadow(0 0 3px rgba(216, 216, 216, 0.7))");
                
            // Highlight connected links
            this.link
                .style("stroke", l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    "#d8d8d8" : "#4F5458"
                )
                .style("opacity", l => 
                    l.source.id === d.id || l.target.id === d.id ? 
                    0.8 : 0.3
                );
                
            // Show label for hovered node
            this.label
                .style("opacity", l => 
                    l.id === d.id ? 1 : 0
                );
                
            // Let the cursor manager handle cursor style
            // No direct manipulation of document.body.style.cursor here
            
            // Dispatch custom event for cursor manager to handle
            const cursorEvent = new CustomEvent('cursor-change', { 
                detail: { type: 'pointer' },
                bubbles: true 
            });
            event.currentTarget.dispatchEvent(cursorEvent);
        })
        .on("mouseout", (event) => {
            d3.select(event.currentTarget)
                .attr("stroke", "#191f27")
                .attr("stroke-width", 1.5)
                .style("filter", "none");
                
            // Reset link styles
            this.link
                .style("stroke", "#4F5458")
                .style("opacity", 0.5);
                
            // Hide labels
            this.label.style("opacity", 0);
            
            // Let cursor manager handle cursor reset
            // No direct manipulation of document.body.style.cursor here
        })
        .on("click", (event, d) => {
            // Create ripple effect on click
            const circle = event.currentTarget;
            const r = parseFloat(circle.getAttribute("r"));
            
            // Pulse animation for feedback
            d3.select(circle)
                .transition()
                .duration(200)
                .attr("r", r * 1.5)
                .transition()
                .duration(200)
                .attr("r", r);
            
            // Find corresponding DOM element to trigger action
            if (d.group === "project") {
                const projectCards = document.querySelectorAll('.card[data-project-id]');
                projectCards.forEach(card => {
                    const titleEl = card.querySelector('.project-title');
                    if (titleEl && titleEl.textContent.includes(d.id)) {
                        const detailBtn = card.querySelector('.project-details-btn');
                        if (detailBtn) detailBtn.click();
                    }
                });
            } else if (d.group === "skill") {
                const skillBadges = document.querySelectorAll('.skill-badge');
                skillBadges.forEach(badge => {
                    if (badge.textContent.trim() === d.id) {
                        badge.click();
                    }
                });
            }
        });
    }
    
    /**
     * Update node and link positions on simulation tick
     */
    updatePositions() {
        this.link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
            
        this.node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
            
        this.label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    }
    
    /**
     * Setup visualization controls
     */
    setupControls() {
        // Check if control elements exist
        if (!this.toggleVisLayout || !this.layerSkillsCheckbox || 
            !this.layerProjectsCheckbox || !this.layerConnectionsCheckbox ||
            !this.visLayersBtn || !this.layersDropdown) {
            return;
        }
        
        // Toggle between layouts
        this.toggleVisLayout.addEventListener('click', () => {
            this.toggleLayout();
        });
        
        // Show/hide layers dropdown
        this.visLayersBtn.addEventListener('click', () => {
            this.layersDropdown.classList.toggle('hidden');
        });
        
        // Hide dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.visLayersBtn.contains(event.target) && 
                !this.layersDropdown.contains(event.target)) {
                this.layersDropdown.classList.add('hidden');
            }
        });
        
        // Layer visibility toggles
        this.layerSkillsCheckbox.addEventListener('change', () => {
            this.toggleSkillsVisibility();
        });
        
        this.layerProjectsCheckbox.addEventListener('change', () => {
            this.toggleProjectsVisibility();
        });
        
        this.layerConnectionsCheckbox.addEventListener('change', () => {
            this.toggleConnectionsVisibility();
        });
    }
    
    /**
     * Toggle between force and radial layouts
     */
    toggleLayout() {
        if (this.isRadialLayout) {
            // Switch to force layout
            this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2))
                .force("x", d3.forceX(this.width / 2).strength(0.05))
                .force("y", d3.forceY(this.height / 2).strength(0.05));
                
            this.toggleVisLayout.textContent = "Switch to Radial Layout";
        } else {
            // Switch to radial layout
            const radius = Math.min(this.width, this.height) / 3;
            
            this.simulation.force("x", d3.forceRadial(
                    d => d.group === "project" ? radius * 0.5 : radius,
                    this.width / 2,
                    this.height / 2
                ).strength(0.8)
            );
            
            this.simulation.force("y", null);
            
            this.toggleVisLayout.textContent = "Switch to Force Layout";
        }
        
        this.isRadialLayout = !this.isRadialLayout;
        this.simulation.alpha(1).restart();
    }
    
    /**
     * Toggle skills visibility
     */
    toggleSkillsVisibility() {
        const skillNodes = this.node.filter(d => d.group === "skill");
        
        if (this.layerSkillsCheckbox.checked) {
            skillNodes.style("visibility", "visible");
        } else {
            skillNodes.style("visibility", "hidden");
        }
        
        this.updateLinkVisibility();
    }
    
    /**
     * Toggle projects visibility
     */
    toggleProjectsVisibility() {
        const projectNodes = this.node.filter(d => d.group === "project");
        
        if (this.layerProjectsCheckbox.checked) {
            projectNodes.style("visibility", "visible");
        } else {
            projectNodes.style("visibility", "hidden");
        }
        
        this.updateLinkVisibility();
    }
    
    /**
     * Toggle connections visibility
     */
    toggleConnectionsVisibility() {
        if (this.layerConnectionsCheckbox.checked) {
            this.updateLinkVisibility();
        } else {
            this.link.style("visibility", "hidden");
        }
    }
    
    /**
     * Update links visibility based on connected nodes visibility
     */
    updateLinkVisibility() {
        if (!this.layerConnectionsCheckbox.checked) return;
        
        this.link.each((d, i, nodes) => {
            const sourceVisible = 
                (this.layerProjectsCheckbox.checked && d.source.group === "project") || 
                (this.layerSkillsCheckbox.checked && d.source.group === "skill");
                
            const targetVisible = 
                (this.layerProjectsCheckbox.checked && d.target.group === "project") || 
                (this.layerSkillsCheckbox.checked && d.target.group === "skill");
                
            d3.select(nodes[i]).style("visibility", 
                sourceVisible && targetVisible ? "visible" : "hidden"
            );
        });
    }
    
    /**
     * Handle window resize events
     */
    setupWindowResize() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            
            // Update SVG dimensions
            this.svg.attr("width", this.width)
                .attr("height", this.height);
                
            // Update simulation center
            this.simulation.force("center", d3.forceCenter(this.width / 2, this.height / 2));
            
            // Update forces
            if (this.isRadialLayout) {
                const radius = Math.min(this.width, this.height) / 3;
                this.simulation.force("x", d3.forceRadial(
                    d => d.group === "project" ? radius * 0.5 : radius,
                    this.width / 2,
                    this.height / 2
                ).strength(0.8));
            } else {
                this.simulation.force("x", d3.forceX(this.width / 2).strength(0.05));
                this.simulation.force("y", d3.forceY(this.height / 2).strength(0.05));
            }
            
            // Restart simulation
            this.simulation.alpha(1).restart();
        });
    }
}
