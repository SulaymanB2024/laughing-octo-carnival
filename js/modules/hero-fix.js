/**
 * Hero Title Fix
 * This script ensures the title in the hero section doesn't shift position
 * by applying critical fixes and preventative measures.
 */

(function() {
    // Execute immediately and also on DOMContentLoaded for certainty
    applyHeroFixes();
    document.addEventListener('DOMContentLoaded', applyHeroFixes);
    window.addEventListener('load', applyHeroFixes);

    /**
     * Apply all fixes needed for the hero title
     */
    function applyHeroFixes() {
        console.log('[HeroFix] Applying hero section fixes');
        
        // Fix the hero title
        fixHeroTitle();
        
        // Schedule repeated fixes to catch any potential race conditions
        setTimeout(fixHeroTitle, 100);
        setTimeout(fixHeroTitle, 500);
        setTimeout(fixHeroTitle, 1000);
        
        // Set up a mutation observer to detect and fix any DOM changes
        observeHeroChanges();
    }
    
    /**
     * Fix positioning and styling of hero title elements
     */
    function fixHeroTitle() {
        // Get hero content and title elements
        const heroContent = document.querySelector('.hero-content');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        
        if (!heroContent || !heroTitle) {
            console.warn('[HeroFix] Hero title elements not found');
            return;
        }
        
        // Apply critical fixes to hero content container
        const heroContentStyles = {
            'position': 'relative',
            'z-index': '10',
            'display': 'flex',
            'flex-direction': 'column',
            'align-items': 'center',
            'justify-content': 'center',
            'text-align': 'center',
            'width': '100%',
            'max-width': '800px',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'transform': 'none',
            'padding': '2rem'
        };
        
        Object.keys(heroContentStyles).forEach(property => {
            heroContent.style[property] = heroContentStyles[property];
        });
        
        // Apply critical fixes to hero title
        const heroTitleStyles = {
            'position': 'static',
            'transform': 'none !important',
            'left': '0',
            'right': '0',
            'margin-left': 'auto',
            'margin-right': 'auto',
            'text-align': 'center',
            'width': '100%',
            'display': 'block',
            'float': 'none',
            'animation': 'none',
            'transition': 'none'
        };
        
        Object.keys(heroTitleStyles).forEach(property => {
            heroTitle.style[property] = heroTitleStyles[property];
        });
        
        // Make sure any reveal animations don't affect position
        heroTitle.classList.add('hero-no-transform', 'revealed');
        
        // Also fix subtitle if it exists
        if (heroSubtitle) {
            heroSubtitle.classList.add('hero-no-transform', 'revealed');
            heroSubtitle.style.textAlign = 'center';
            heroSubtitle.style.width = '100%';
            heroSubtitle.style.position = 'static';
            heroSubtitle.style.transform = 'none';
        }
        
        console.log('[HeroFix] Hero title styles fixed');
    }
    
    /**
     * Set up a mutation observer to fix hero title if DOM changes
     */
    function observeHeroChanges() {
        // Create a new observer
        const observer = new MutationObserver((mutations) => {
            let shouldFix = false;
            
            // Check if any relevant mutations occurred
            mutations.forEach(mutation => {
                if (mutation.target.classList.contains('hero-title') || 
                    mutation.target.classList.contains('hero-content') ||
                    mutation.target.classList.contains('hero-subtitle')) {
                    shouldFix = true;
                }
            });
            
            // Fix if needed
            if (shouldFix) {
                console.log('[HeroFix] Hero changes detected, reapplying fixes');
                fixHeroTitle();
            }
        });
        
        // Start observing hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            observer.observe(heroContent, { 
                attributes: true, 
                childList: true, 
                subtree: true 
            });
        }
    }
})();
