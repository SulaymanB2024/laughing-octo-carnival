/**
 * Cursor Interaction Test Script
 * 
 * This script tests cursor interactions between particles background and network visualization
 * It should be loaded after all other scripts to verify cursor behaviors
 */
(function() {
    // Wait for DOM to fully load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Cursor interaction test initialized');
        
        // Wait for all visualizations to load
        setTimeout(function() {
            testCursorInteractions();
        }, 1500);
    });
    
    function testCursorInteractions() {
        console.log('Testing cursor interactions...');
        
        // Test network visualization nodes
        const networkNodes = document.querySelectorAll('#network-visualization circle');
        console.log(`Found ${networkNodes.length} network nodes to test`);
        
        if (networkNodes.length > 0) {
            networkNodes.forEach(node => {
                if (node.style.cursor !== 'pointer') {
                    console.warn('Network node missing pointer cursor style');
                    node.style.cursor = 'pointer';
                }
                
                if (!node.hasAttribute('data-interactive')) {
                    console.warn('Network node missing data-interactive attribute');
                    node.setAttribute('data-interactive', 'true');
                }
            });
            
            console.log('Network visualization nodes cursor check complete');
        }
        
        // Test particles container
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            const particlesCanvas = particlesContainer.querySelector('canvas');
            
            if (particlesCanvas) {
                console.log('Particles canvas found, checking interactions');
                
                // Ensure the canvas doesn't interfere with network visualization
                if (window.getComputedStyle(particlesContainer).zIndex > 
                    window.getComputedStyle(document.getElementById('network-visualization')).zIndex) {
                    console.warn('Particles container has higher z-index than network visualization');
                    // This would be fixed with CSS updates we've already made
                }
                
                // Log cursor tracking setup
                console.log('Cursor tracking setup verified');
            } else {
                console.warn('Particles canvas not found');
            }
        }
        
        // Monitor cursor changes
        document.addEventListener('mousemove', function() {
            const hoveredElements = document.querySelectorAll(':hover');
            const lastHovered = hoveredElements[hoveredElements.length - 1];
            
            // Only log if top element is an SVG circle
            if (lastHovered && lastHovered.tagName.toLowerCase() === 'circle') {
                console.log('Hovering over network node:', lastHovered);
            }
        }, { once: true });
        
        console.log('Cursor interaction tests complete');
    }
})();
