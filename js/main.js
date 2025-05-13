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
import { ProjectData } from './modules/project-data.js';
import { ModalController } from './modules/modal-controller.js';
import { ParticlesBackground } from './modules/particles-background.js';

// Initialize modules when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    const navigation = new NavigationController();
    navigation.init();
    
    // Initialize scroll reveal animations
    const revealAnimations = new RevealAnimation();
    revealAnimations.init();
    
    // Initialize sliding panels
    const panelController = new PanelController();
    panelController.init();
    
    // Initialize network visualization
    const networkVisualization = new NetworkVisualization('network-visualization');
    networkVisualization.init();
    
    // Initialize timeline scrubber
    const timelineScrubber = new TimelineScrubber();
    timelineScrubber.init();
    
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
    
    // Initialize particles background if available
    if (document.getElementById('particles-js')) {
        const particlesBackground = new ParticlesBackground('particles-js', {
            animationPreset: 'enhanced',
            interactionMode: 'gotham', 
            fpsMonitoring: true
        });
        particlesBackground.init('gotham');
    }
    
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});
