/**
 * Main JavaScript entry point
 * Initializes all modules and application functionality
 */

// Import all modules
import { NavigationController } from './modules/navigation.js';
import { RevealAnimation } from './modules/reveal-animation.js';
import { PanelController } from './modules/panel-controller.js';
import { NetworkVisualization } from './modules/network-visualization.js';
import { TimelineScrubber } from './modules/timeline-scrubber.js';
import { TimelineEnhancer } from './modules/timeline-enhancer.js';
import { ProjectData } from './modules/project-data.js';
import { ModalController } from './modules/modal-controller.js';
import { ParticlesBackground } from './modules/particles-background.js';
import { CursorManager } from './modules/cursor-manager.js';
import { ScrollManager } from './modules/scroll-manager.js';
import { TimelineFix } from './modules/timeline-fix.js';

// Initialize modules when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll manager first to centralize all scroll events
    const scrollManager = new ScrollManager();
    scrollManager.init();
    
    // Initialize cursor manager to ensure consistent cursor experience
    const cursorManager = new CursorManager();
    cursorManager.init();

    // Initialize navigation
    const navigation = new NavigationController();
    navigation.init();
    
    // Initialize scroll reveal animations with special handling for hero section
    const revealAnimations = new RevealAnimation();
    
    // Pre-process hero elements to prevent shifting
    const heroElements = document.querySelectorAll('.hero-section .revealable');
    heroElements.forEach(item => {
        item.classList.add('hero-no-transform', 'revealed');
    });
    
    revealAnimations.init(scrollManager);
    
    // Initialize sliding panels
    const panelController = new PanelController();
    panelController.init();
    
    // Initialize network visualization
    const networkVisualization = new NetworkVisualization('network-visualization');
    networkVisualization.init();
    
    // Initialize timeline scrubber
    const timelineScrubber = new TimelineScrubber();
    timelineScrubber.init();
    
    // Initialize timeline enhancer for improved functionality
    const timelineEnhancer = new TimelineEnhancer();
    timelineEnhancer.init();
    
    // Initialize timeline fix helper
    const timelineFix = new TimelineFix();
    timelineFix.init();
    
    // Initialize project data and filtering
    const projectData = new ProjectData();
    projectData.init();
    
    // Connect timeline scrubber with project filtering
    timelineScrubber.onFilterChange((startYear, endYear) => {
        projectData.filterByDateRange(startYear, endYear);
    });
    
    // Connect project clicks to panel opening
    projectData.onProjectClick((projectId) => {
        panelController.openLeftPanel(projectId);
    });
    
    // Initialize modal controller
    const modalController = new ModalController();
    modalController.init();
    
    // Connect project modal triggers
    projectData.onModalOpen((project) => {
        // Check if we have detailed info for this project
        const detailedInfo = projectData.projectDetails[project.id];
        
        if (detailedInfo) {
            // Use the detailed project information
            modalController.openModal(detailedInfo);
        } else {
            // Fallback to basic project information
            modalController.openModal({
                title: project.title + " (Details)",
                description: `<p>${project.summary || ""} More details for this project are coming soon.</p>`,
                image: project.image
            });
        }
    });
    
    // Cursor manager is already initialized at the top, no need to reinitialize
    
    // Initialize particles background if available with improved initialization
    if (document.getElementById('particles-js')) {
        // Add initial loading state
        const particlesContainer = document.getElementById('particles-js');
        particlesContainer.classList.add('loading');
        
        const particlesBackground = new ParticlesBackground('particles-js', {
            animationPreset: 'enhanced',
            interactionMode: 'gotham', 
            fpsMonitoring: true,
            performanceMode: window.innerWidth < 768 // Automatically use performance mode on mobile
        });
        
        // Use async initialization with improved cursor handling
        (async () => {
            try {
                particlesContainer.style.opacity = '0';
                await particlesBackground.init('gotham');
                particlesContainer.style.transition = 'opacity 0.8s ease-in-out';
                particlesContainer.style.opacity = '1';
                particlesContainer.classList.remove('loading');
                particlesContainer.classList.add('loaded');
                
                // Ensure network visualization nodes are correctly interactive after particles load
                setTimeout(() => {
                    const networkNodes = document.querySelectorAll('#network-visualization circle');
                    networkNodes.forEach(node => {
                        node.style.cursor = 'pointer';
                        node.setAttribute('data-interactive', 'true');
                    });
                    
                    // Load network enhancer for better interaction cues
                    import('./modules/network-enhancer.js')
                        .then(module => {
                            console.log('Network enhancer module loaded');
                            // Initialize the enhancer in a try-catch block for safety
                            try {
                                if (module && module.safeInit) {
                                    module.safeInit();
                                } else if (module && module.initNetworkEnhancer) {
                                    module.initNetworkEnhancer();
                                }
                            } catch (enhancerError) {
                                console.warn('Network enhancer initialization failed:', enhancerError.message);
                            }
                        })
                        .catch(err => console.warn('Failed to load network enhancer:', err.message));
                }, 800); // Increased timeout for better stability
                
            } catch (error) {
                console.error('Failed to initialize particles:', error);
            }
        })();
        setTimeout(() => {
            document.getElementById('particles-js').style.transition = 'opacity 0.8s ease-in-out';
            document.getElementById('particles-js').style.opacity = '1';
        }, 100);
    }
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Load diagnostics module for troubleshooting (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        import('./modules/page-diagnostics.js')
            .then(module => {
                console.log('Diagnostics module loaded');
                console.info('You can run diagnostics by typing window.runPageDiagnostics() in the console');
            })
            .catch(err => console.warn('Diagnostics module not loaded:', err.message));
    }
});
