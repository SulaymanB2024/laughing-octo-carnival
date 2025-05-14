/**
 * Critical Network Visualization Fix
 * This module ensures the network visualization appears correctly and
 * fixes z-index, positioning, and display issues.
 * 
 * @version 1.1 - Enhanced with improved SVG initialization and forced loading
 */

(function() {
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', fixNetworkVisualization);
    
    // Also try on window load in case DOM content loaded already fired
    window.addEventListener('load', fixNetworkVisualization);
    
    /**
     * Apply fixes to make sure network visualization appears
     */
    function fixNetworkVisualization() {
        console.log('[NetworkFix] Applying critical fixes to network visualization');
        
        // 1. Get network container
        const networkContainer = document.getElementById('network-visualization');
        if (!networkContainer) {
            console.error('[NetworkFix] Network container not found');
            return;
        }
        
        // 2. Make sure container has the right styles
        const essentialStyles = {
            'position': 'absolute',
            'z-index': '5',
            'pointer-events': 'all',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'display': 'block',
            'opacity': '1'
        };
        
        Object.keys(essentialStyles).forEach(property => {
            networkContainer.style[property] = essentialStyles[property];
        });
        
        // 3. Add a class for easier CSS targeting
        networkContainer.classList.add('network-fixed');
        
        // 4. Make sure hero section has position relative
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.position = 'relative';
            heroSection.style.overflow = 'hidden';
        }
        
        // 5. Scheduled fix for potential race conditions
        setTimeout(forceNetworkVisibility, 500);
        setTimeout(forceNetworkVisibility, 1000);
        setTimeout(forceNetworkVisibility, 2000);
    }
    
    /**
     * Force the network visualization to be visible
     */
    function forceNetworkVisibility() {
        const networkContainer = document.getElementById('network-visualization');
        if (!networkContainer) return;
        
        // Make sure it's visible
        networkContainer.style.display = 'block';
        networkContainer.style.opacity = '1';
        networkContainer.style.visibility = 'visible';
        
        // Check if SVG exists
        let svg = networkContainer.querySelector('svg');
        
        // If SVG doesn't exist, try to initialize it if D3 is available
        if (!svg && typeof d3 !== 'undefined') {
            console.log('[NetworkFix] SVG not found, attempting to initialize one');
            try {
                // Create a basic SVG element
                svg = d3.select('#network-visualization')
                    .append('svg')
                    .attr('width', '100%')
                    .attr('height', '100%')
                    .attr('class', 'network-svg')
                    .node();
                
                // Add a basic visualization with some nodes if none exist
                const visualizationExists = networkContainer.querySelector('.nodes') || 
                                          networkContainer.querySelector('circle');
                                          
                if (!visualizationExists) {
                    const visualization = d3.select(svg);
                    
                    // Create a simple visualization with a few nodes
                    const dummyNodes = [
                        {id: "node1", group: 1, name: "Skill 1", x: window.innerWidth * 0.3, y: window.innerHeight * 0.4},
                        {id: "node2", group: 2, name: "Project 1", x: window.innerWidth * 0.6, y: window.innerHeight * 0.4},
                        {id: "node3", group: 1, name: "Skill 2", x: window.innerWidth * 0.5, y: window.innerHeight * 0.6}
                    ];
                    
                    const dummyLinks = [
                        {source: "node1", target: "node2", value: 1},
                        {source: "node2", target: "node3", value: 1}
                    ];
                    
                    // Create link lines
                    visualization.append("g")
                        .attr("class", "links")
                        .selectAll("line")
                        .data(dummyLinks)
                        .enter()
                        .append("line")
                        .attr("x1", d => d.source.x || window.innerWidth * 0.4)
                        .attr("y1", d => d.source.y || window.innerHeight * 0.4)
                        .attr("x2", d => d.target.x || window.innerWidth * 0.6)
                        .attr("y2", d => d.target.y || window.innerHeight * 0.5)
                        .attr("stroke", "rgba(255, 255, 255, 0.3)")
                        .attr("stroke-width", 1);
                    
                    // Create nodes
                    const nodeElements = visualization.append("g")
                        .attr("class", "nodes")
                        .selectAll("circle")
                        .data(dummyNodes)
                        .enter()
                        .append("circle")
                        .attr("r", 10)
                        .attr("cx", d => d.x || window.innerWidth / 2)
                        .attr("cy", d => d.y || window.innerHeight / 2)
                        .attr("fill", d => d.group === 1 ? "#58a6ff" : "#00BCD4")
                        .attr("stroke", "#fff")
                        .attr("stroke-width", 1)
                        .attr("cursor", "pointer")
                        .attr("data-interactive", "true");
                        
                    console.log('[NetworkFix] Created basic visualization with', dummyNodes.length, 'nodes');
                }
            } catch (e) {
                console.error('[NetworkFix] Failed to initialize SVG:', e);
            }
        }
        
        // If we now have an SVG, make sure it's properly styled
        if (svg) {
            // Make sure SVG has proper dimensions
            svg.style.width = '100%';
            svg.style.height = '100%';
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
            
            // Make sure all circles are interactive
            const circles = svg.querySelectorAll('circle');
            circles.forEach(circle => {
                circle.style.cursor = 'pointer';
                circle.setAttribute('data-interactive', 'true');
            });
            
            console.log('[NetworkFix] Network visualization fixed with', circles.length, 'nodes');
        } else {
            console.warn('[NetworkFix] Could not find or create SVG element');
        }
    }
})();
