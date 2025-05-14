/**
 * Page Diagnostics Module
 * 
 * This module performs various diagnostics to check for issues
 * and ensure that all page elements are working correctly
 */

export class PageDiagnostics {
    constructor() {
        this.issues = [];
        this.status = 'unknown';
    }
    
    /**
     * Run all diagnostic tests
     */
    run() {
        this.issues = [];
        
        try {
            this.checkCursorManager();
            this.checkNetworkVisualization();
            this.checkParticlesBackground();
            this.checkLayerInteractions();
            
            // Set overall status
            this.status = this.issues.length === 0 ? 'ok' : 'issues-found';
            
            console.log(`Diagnostics complete. Status: ${this.status}`);
            if (this.issues.length > 0) {
                console.warn('Issues found:', this.issues);
            } else {
                console.log('All tests passed!');
            }
            
            return {
                status: this.status,
                issues: this.issues
            };
        } catch (error) {
            console.error('Failed to run diagnostics:', error);
            this.issues.push({
                severity: 'critical',
                component: 'diagnostics',
                message: `Failed to run diagnostics: ${error.message}`
            });
            
            this.status = 'error';
            return {
                status: this.status,
                issues: this.issues
            };
        }
    }
    
    /**
     * Check cursor manager functionality
     */
    checkCursorManager() {
        // Check if cursor manager is initialized
        if (!window.cursorManager && !document.querySelector('.custom-cursor')) {
            this.issues.push({
                severity: 'medium',
                component: 'cursor-manager',
                message: 'Cursor manager not initialized or custom cursor not found'
            });
        }
        
        // Check cursor styles
        const customCursor = document.querySelector('.custom-cursor');
        if (customCursor) {
            const style = window.getComputedStyle(customCursor);
            const transform = style.transform || style.webkitTransform;
            
            if (!transform.includes('translate')) {
                this.issues.push({
                    severity: 'medium',
                    component: 'cursor-manager',
                    message: 'Custom cursor missing transform styles'
                });
            }
        }
    }
    
    /**
     * Check network visualization
     */
    checkNetworkVisualization() {
        // Check SVG exists
        const svg = document.querySelector('#network-visualization svg');
        if (!svg) {
            this.issues.push({
                severity: 'high',
                component: 'network-visualization',
                message: 'Network visualization SVG not found'
            });
            return;
        }
        
        // Check for nodes
        const nodes = document.querySelectorAll('#network-visualization circle');
        if (nodes.length === 0) {
            this.issues.push({
                severity: 'high',
                component: 'network-visualization',
                message: 'No nodes found in network visualization'
            });
            return;
        }
        
        // Check node interactivity
        let hasInteractiveNodes = false;
        nodes.forEach(node => {
            if (node.getAttribute('data-interactive') === 'true' || 
                node.style.cursor === 'pointer') {
                hasInteractiveNodes = true;
            }
        });
        
        if (!hasInteractiveNodes) {
            this.issues.push({
                severity: 'medium',
                component: 'network-visualization',
                message: 'Nodes are missing interactive attributes'
            });
        }
    }
    
    /**
     * Check particles background
     */
    checkParticlesBackground() {
        // Check particles canvas
        const canvas = document.querySelector('#particles-js canvas');
        if (!canvas) {
            this.issues.push({
                severity: 'medium',
                component: 'particles-background',
                message: 'Particles canvas not found'
            });
            return;
        }
        
        // Check if canvas is visible
        const style = window.getComputedStyle(canvas);
        if (style.display === 'none' || style.visibility === 'hidden' || 
            parseFloat(style.opacity) === 0) {
            this.issues.push({
                severity: 'medium',
                component: 'particles-background',
                message: 'Particles canvas is hidden or has zero opacity'
            });
        }
        
        // Check if particles container has proper z-index
        const container = document.getElementById('particles-js');
        if (container) {
            const containerStyle = window.getComputedStyle(container);
            const zIndex = parseInt(containerStyle.zIndex, 10);
            
            if (isNaN(zIndex) || zIndex > 10) {
                this.issues.push({
                    severity: 'low',
                    component: 'particles-background',
                    message: 'Particles container z-index may be incorrect'
                });
            }
        }
    }
    
    /**
     * Check layer interactions between particles and network
     */
    checkLayerInteractions() {
        const network = document.getElementById('network-visualization');
        const particles = document.getElementById('particles-js');
        
        if (!network || !particles) {
            this.issues.push({
                severity: 'low',
                component: 'layer-interaction',
                message: 'Cannot check layer interactions, components missing'
            });
            return;
        }
        
        const networkStyle = window.getComputedStyle(network);
        const particlesStyle = window.getComputedStyle(particles);
        
        const networkZIndex = parseInt(networkStyle.zIndex, 10);
        const particlesZIndex = parseInt(particlesStyle.zIndex, 10);
        
        if (!isNaN(networkZIndex) && !isNaN(particlesZIndex) && 
            networkZIndex <= particlesZIndex) {
            this.issues.push({
                severity: 'medium',
                component: 'layer-interaction',
                message: 'Network visualization should have higher z-index than particles'
            });
        }
        
        // Check pointer events
        if (particlesStyle.pointerEvents !== 'none') {
            this.issues.push({
                severity: 'medium',
                component: 'layer-interaction',
                message: 'Particles container should have pointer-events: none'
            });
        }
    }
    
    /**
     * Create a visual diagnostics report
     */
    createReport() {
        // Run diagnostics if not already run
        if (this.status === 'unknown') {
            this.run();
        }
        
        // Create report element
        const report = document.createElement('div');
        report.className = 'diagnostics-report';
        report.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        `;
        
        // Add header
        const header = document.createElement('div');
        header.innerHTML = `<strong>Page Diagnostics</strong>: ${this.status}`;
        header.style.marginBottom = '10px';
        report.appendChild(header);
        
        // Add issues
        if (this.issues.length > 0) {
            const issuesList = document.createElement('ul');
            issuesList.style.padding = '0 0 0 15px';
            issuesList.style.margin = '0';
            
            this.issues.forEach(issue => {
                const item = document.createElement('li');
                item.textContent = `${issue.component}: ${issue.message}`;
                
                switch (issue.severity) {
                    case 'critical':
                        item.style.color = 'red';
                        break;
                    case 'high':
                        item.style.color = 'orange';
                        break;
                    case 'medium':
                        item.style.color = 'yellow';
                        break;
                    default:
                        item.style.color = '#aaa';
                }
                
                issuesList.appendChild(item);
            });
            
            report.appendChild(issuesList);
        } else {
            const message = document.createElement('div');
            message.textContent = 'All tests passed';
            message.style.color = '#8f8';
            report.appendChild(message);
        }
        
        // Add close button
        const close = document.createElement('button');
        close.textContent = 'Close';
        close.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            background: #333;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        `;
        
        close.onclick = () => {
            if (document.body.contains(report)) {
                document.body.removeChild(report);
            }
        };
        
        report.appendChild(close);
        document.body.appendChild(report);
        
        return report;
    }
    
    /**
     * Fix common issues automatically
     */
    autoFix() {
        // Run diagnostics if not already run
        if (this.status === 'unknown') {
            this.run();
        }
        
        let fixesApplied = 0;
        
        // Fix z-index issues
        try {
            const network = document.getElementById('network-visualization');
            const particles = document.getElementById('particles-js');
            
            if (network && particles) {
                network.style.zIndex = '5';
                particles.style.zIndex = '1';
                particles.style.pointerEvents = 'none';
                fixesApplied++;
            }
        } catch (error) {
            console.warn('Could not fix layer issues:', error);
        }
        
        // Fix cursor issues
        try {
            const customCursor = document.querySelector('.custom-cursor');
            if (customCursor) {
                customCursor.style.transform = 'translate(-50%, -50%)';
                customCursor.style.pointerEvents = 'none';
                fixesApplied++;
            }
        } catch (error) {
            console.warn('Could not fix cursor issues:', error);
        }
        
        // Fix node interactivity
        try {
            const nodes = document.querySelectorAll('#network-visualization circle');
            if (nodes.length > 0) {
                nodes.forEach(node => {
                    node.style.cursor = 'pointer';
                    node.setAttribute('data-interactive', 'true');
                });
                fixesApplied++;
            }
        } catch (error) {
            console.warn('Could not fix node interactivity issues:', error);
        }
        
        // Run diagnostics again after fixes
        this.run();
        
        return {
            fixesApplied,
            remainingIssues: this.issues.length
        };
    }
}

// Export a global function to run diagnostics from console
window.runPageDiagnostics = function() {
    const diagnostics = new PageDiagnostics();
    diagnostics.createReport();
    return diagnostics;
};
