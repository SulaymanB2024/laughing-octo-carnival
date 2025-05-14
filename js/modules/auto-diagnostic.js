/**
 * Auto-diagnostic script
 * This will run automatically to verify the page is working properly
 */
(function() {
    // Wait a moment after page load to run diagnostics
    setTimeout(() => {
        console.log('%c[AUTO-DIAGNOSTIC] Starting page diagnosis...', 'color: blue; font-weight: bold');
        
        try {
            // Check if critical elements exist
            const criticalElements = [
                { id: 'particles-js', name: 'Particles Background' },
                { id: 'network-visualization', name: 'Network Visualization' }
            ];
            
            criticalElements.forEach(element => {
                const el = document.getElementById(element.id);
                if (!el) {
                    console.error(`[AUTO-DIAGNOSTIC] Critical element missing: ${element.name} (${element.id})`);
                } else {
                    console.log(`[AUTO-DIAGNOSTIC] Found ${element.name}`);
                }
            });
            
            // Check if particles were initialized
            const particlesCanvas = document.querySelector('#particles-js canvas');
            if (!particlesCanvas) {
                console.warn('[AUTO-DIAGNOSTIC] Particles canvas not found - particles.js may not be initialized');
            } else {
                console.log('[AUTO-DIAGNOSTIC] Particles appear to be working');
            }
            
            // Check if network nodes exist
            const networkNodes = document.querySelectorAll('#network-visualization circle');
            console.log(`[AUTO-DIAGNOSTIC] Found ${networkNodes.length} network nodes`);
            
            // Check cursor system and do a performance check
            const customCursor = document.querySelector('.custom-cursor');
            if (customCursor) {
                console.log('[AUTO-DIAGNOSTIC] Custom cursor element exists');
                
                // Test performance - only enable custom cursor if we have good performance
                // This is a simple test that checks if animations are running smoothly
                let frameCount = 0;
                let startTime = performance.now();
                let testDuration = 500; // ms
                
                function countFrame() {
                    frameCount++;
                    const elapsed = performance.now() - startTime;
                    
                    if (elapsed < testDuration) {
                        requestAnimationFrame(countFrame);
                    } else {
                        // Calculate FPS
                        const fps = Math.round(frameCount / (elapsed / 1000));
                        console.log(`[AUTO-DIAGNOSTIC] Performance test: ${fps} FPS`);
                        
                        // Enable custom cursor only if performance is good (above 30fps)
                        if (fps > 30 && window.enableCustomCursor) {
                            console.log('[AUTO-DIAGNOSTIC] Performance good, enabling custom cursor');
                            window.enableCustomCursor();
                        } else {
                            console.log('[AUTO-DIAGNOSTIC] Using system cursor for better performance');
                        }
                    }
                }
                
                requestAnimationFrame(countFrame);
            } else {
                console.log('[AUTO-DIAGNOSTIC] Custom cursor not found, using system cursor');
            }
            
            // Check z-index values for proper layering and fix any issues
            const networkVis = document.getElementById('network-visualization');
            const particles = document.getElementById('particles-js');
            
            if (networkVis && particles) {
                const networkStyle = window.getComputedStyle(networkVis);
                const particlesStyle = window.getComputedStyle(particles);
                
                console.log(`[AUTO-DIAGNOSTIC] Z-index values - Network: ${networkStyle.zIndex}, Particles: ${particlesStyle.zIndex}`);
                
                // Apply comprehensive fixes for network visualization and particles
                console.log('[AUTO-DIAGNOSTIC] Applying comprehensive layer and interaction fixes...');
                
                // Ensure proper z-index layering
                networkVis.style.zIndex = '5';
                networkVis.style.position = 'relative';
                particles.style.zIndex = '1';
                particles.style.position = 'relative';
                
                // Ensure particles don't block interaction
                particles.style.pointerEvents = 'none';
                
                // Make network nodes interactive
                const networkNodes = document.querySelectorAll('#network-visualization circle');
                networkNodes.forEach(node => {
                    node.style.cursor = 'pointer';
                });
                
                // Check if particles container is blocking interactions and fix if needed
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.style.position = 'relative';
                    heroSection.style.overflow = 'hidden';
                }
            }
            
            // Fix for network nodes to ensure they're interactive
            const circles = document.querySelectorAll('#network-visualization circle');
            
            console.log(`[AUTO-DIAGNOSTIC] Found ${circles.length} network nodes, fixing interaction issues`);
            
            circles.forEach(circle => {
                // Always ensure cursor is pointer even with custom cursor disabled
                if (circle.style.cursor !== 'pointer') {
                    circle.style.cursor = 'pointer';
                }
                
                // Add data attributes for interactivity
                if (!circle.getAttribute('data-interactive')) {
                    circle.setAttribute('data-interactive', 'true');
                }
                
                // Add event listeners to handle clicks regardless of cursor state
                if (!circle.getAttribute('data-event-added')) {
                    circle.addEventListener('click', function(e) {
                        console.log('Node clicked:', circle);
                        // Add a visual indicator that it was clicked
                        circle.classList.add('clicked');
                    });
                    
                    // Add hover effect
                    circle.addEventListener('mouseenter', function() {
                        circle.classList.add('hovered');
                        const r = parseFloat(circle.getAttribute('r') || '5');
                        circle.setAttribute('r', r * 1.2);
                    });
                    
                    circle.addEventListener('mouseleave', function() {
                        circle.classList.remove('hovered');
                        const r = parseFloat(circle.getAttribute('r') || '6');
                        circle.setAttribute('r', r / 1.2);
                    });
                    
                    circle.setAttribute('data-event-added', 'true');
                }
            });
            
            console.log('%c[AUTO-DIAGNOSTIC] Diagnosis complete. Page should be working correctly.', 'color: green; font-weight: bold');
            
        } catch (error) {
            console.error('[AUTO-DIAGNOSTIC] Error during diagnosis:', error);
        }
    }, 2000); // Run 2 seconds after page load to allow everything to initialize
})();
