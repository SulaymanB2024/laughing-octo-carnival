/**
 * Network Visualization Enhancer
 * 
 * This module enhances the network visualization to make interactivity more obvious
 * and improves the cursor interaction experience.
 */
export class NetworkEnhancer {
    constructor() {
        this.init();
    }
    
    /**
     * Initialize enhancer
     */
    init() {
        console.log('Initializing Network Enhancer');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.enhance());
        } else {
            // DOM already loaded, run enhancement immediately
            setTimeout(() => this.enhance(), 500);
        }
    }
    
    /**
     * Apply enhancements to network visualization
     */
    enhance() {
        try {
            console.log('Applying network visualization enhancements');
            
            // Wait a moment to ensure network visualization is fully loaded
            setTimeout(() => {
                this.enhanceNetworkNodes();
                this.addInteractivityHints();
                this.fixCursorPositioning();
                this.addPulsatingEffect();
                
                console.log('Network enhancements applied successfully');
            }, 100);
        } catch (error) {
            console.warn('Failed to apply network enhancements:', error.message);
        }
    }
    
    /**
     * Enhance network nodes with better visual indicators for interactivity
     */
    enhanceNetworkNodes() {
        try {
            const nodes = document.querySelectorAll('#network-visualization circle');
            
            if (nodes.length > 0) {
                console.log(`Enhancing ${nodes.length} network nodes`);
                
                nodes.forEach(node => {
                    try {
                        // Add data attributes for interaction
                        node.setAttribute('data-interactive', 'true');
                        node.setAttribute('data-cursor', 'pointer');
                        
                        // Ensure proper cursor
                        node.style.cursor = 'pointer';
                        
                        // Add pulsing animation class
                        node.classList.add('interactive-node');
                        
                        // Only add filter if the glow filter exists
                        if (document.getElementById('glow')) {
                            node.setAttribute('filter', 'url(#glow)');
                        }
                        
                        // Add title attribute for tooltip (with fallback color check)
                        const fill = node.getAttribute('fill');
                        const nodeType = (fill && fill === '#00BCD4') ? 'project' : 'skill';
                        node.setAttribute('title', `Click to explore this ${nodeType}`);
                    } catch (nodeError) {
                        console.warn('Error enhancing node:', nodeError.message);
                    }
                });
                
                // Create filter for glow effect if it doesn't exist
                this.createGlowFilter();
            }
        } catch (error) {
            console.warn('Error in enhanceNetworkNodes:', error.message);
        }
    }
    
    /**
     * Create SVG filter for glow effect
     */
    createGlowFilter() {
        const svg = document.querySelector('#network-visualization svg');
        if (!svg) return;
        
        // Check if filter exists
        if (document.getElementById('glow')) return;
        
        try {
            // Create defs element if it doesn't exist
            let defs = svg.querySelector('defs');
            if (!defs) {
                defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                svg.appendChild(defs);
            }
            
            // Create filter
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', 'glow');
            filter.setAttribute('x', '-50%');
            filter.setAttribute('y', '-50%');
            filter.setAttribute('width', '200%');
            filter.setAttribute('height', '200%');
            
            const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
            feGaussianBlur.setAttribute('stdDeviation', '1.5');
            feGaussianBlur.setAttribute('result', 'blur');
            
            filter.appendChild(feGaussianBlur);
            defs.appendChild(filter);
        } catch (error) {
            console.warn('Could not create glow filter:', error.message);
        }
    }
    
    /**
     * Add subtle visual hints to indicate interactivity
     */
    addInteractivityHints() {
        try {
            // Instead of adding an intrusive hint text, just enhance nodes visually
            // Add visual enhancements for network nodes
            const styleElement = document.createElement('style');
            styleElement.id = 'network-node-enhancements';
            styleElement.textContent = `
                /* Node hover effect */
                #network-visualization circle:hover {
                    stroke: #58a6ff !important;
                    stroke-width: 2px !important;
                    filter: drop-shadow(0 0 3px rgba(88, 166, 255, 0.7)) !important;
                }
                
                /* Pulsating effect for key nodes */
                .interactive-node {
                    animation: nodePulse 3s infinite alternate;
                }
                
                @keyframes nodePulse {
                    0% {
                        filter: drop-shadow(0 0 1px rgba(255, 255, 255, 0.2));
                    }
                    100% {
                        filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
                    }
                }
            `;
            
            // Only add if not already added
            if (!document.getElementById('network-node-enhancements')) {
                document.head.appendChild(styleElement);
            }
            
        } catch (error) {
            console.warn('Could not add node interactivity hints:', error.message);
        }
    }
    
    /**
     * Fix cursor positioning issues
     */
    fixCursorPositioning() {
        try {
            // Add CSS to fix z-index layering and cursor issues
            const styleId = 'cursor-position-fix-style';
            
            // Only add if not already added
            if (!document.getElementById(styleId)) {
                const styleElement = document.createElement('style');
                styleElement.id = styleId;
                styleElement.textContent = `
                    .custom-cursor {
                        transform: translate(-50%, -50%) !important;
                        pointer-events: none !important;
                    }
                    
                    #network-visualization {
                        z-index: 5 !important;
                        position: relative !important;
                    }
                    
                    #particles-js {
                        z-index: 1 !important;
                        pointer-events: none !important;
                        position: relative !important;
                    }
                    
                    .hero-section {
                        position: relative;
                        overflow: hidden;
                    }
                    
                    /* Make sure network nodes can be interacted with */
                    #network-visualization circle {
                        cursor: pointer !important;
                    }
                `;
                
                document.head.appendChild(styleElement);
                
                console.log("Applied z-index and cursor positioning fixes");
            }
        } catch (error) {
            console.warn('Could not fix cursor positioning:', error.message);
        }
    }
    
    /**
     * Add pulsating effect to nodes to indicate interactivity
     */
    addPulsatingEffect() {
        try {
            // Find all nodes that haven't been clicked yet
            const nodes = document.querySelectorAll('#network-visualization circle:not(.clicked)');
            
            if (nodes.length === 0) {
                return; // No nodes found
            }
            
            // Add initial pulse to draw attention
            setTimeout(() => {
                // Choose only up to 3 random nodes to highlight for less visual noise
                const nodesToHighlight = Array.from(nodes);
                if (nodesToHighlight.length > 3) {
                    // Shuffle and take first 3
                    nodesToHighlight.sort(() => Math.random() - 0.5);
                    nodesToHighlight.length = 3;
                }
                
                nodesToHighlight.forEach((node, index) => {
                    try {
                        setTimeout(() => {
                            try {
                                const r = parseFloat(node.getAttribute('r') || '5');
                                const originalStroke = node.getAttribute('stroke') || '#191f27';
                                
                                // Use CSS class instead of direct animation when possible
                                node.classList.add('highlight-pulse');
                                
                                // Fallback to WAAPI if available, but handle gracefully if not
                                if (node.animate) {
                                    try {
                                        // Add a data attribute to prevent double animations
                                        if (node.getAttribute('data-animated') !== 'true') {
                                            node.setAttribute('data-animated', 'true');
                                            
                                            // Animate radius
                                            node.animate([
                                                { r: r },
                                                { r: r * 1.3 },
                                                { r: r }
                                            ], {
                                                duration: 1200,
                                                iterations: 1
                                            });
                                            
                                            // Animate stroke
                                            node.animate([
                                                { stroke: originalStroke },
                                                { stroke: '#ffffff' },
                                                { stroke: originalStroke }
                                            ], {
                                                duration: 1200,
                                                iterations: 1
                                            });
                                        }
                                    } catch (animError) {
                                        console.warn('Animation failed for node:', animError.message);
                                    }
                                }
                            } catch (nodeError) {
                                console.warn('Node animation setup failed:', nodeError.message);
                            }
                        }, index * 300); // Increase stagger time between nodes
                    } catch (error) {
                        console.warn('Node animation error:', error.message);
                    }
                });
            }, 3000); // Increased wait time after load for better stability
        } catch (error) {
            console.warn('Could not add pulsating effect:', error.message);
        }
    }
}

// Add a safe initialization function for main.js to use
export function initNetworkEnhancer() {
    try {
        return new NetworkEnhancer();
    } catch (error) {
        console.warn('Could not initialize NetworkEnhancer:', error.message);
        return null;
    }
}

// Create a more resilient fallback initialization
export function safeInit() {
    try {
        console.log('Attempting safe NetworkEnhancer initialization');
        return initNetworkEnhancer();
    } catch (error) {
        console.warn('Safe NetworkEnhancer initialization failed:', error.message);
        return null;
    }
}

// We no longer auto-initialize to prevent double initialization
// Will be initialized from main.js
