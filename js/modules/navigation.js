/**
 * NavigationController
 * Handles all navigation-related functionality
 */
export class NavigationController {
    constructor() {
        // DOM elements
        this.navbar = document.getElementById('navbar');
        this.mobileMenuButton = document.querySelector('.mobile-menu-button');
        this.mobileMenu = document.querySelector('.mobile-menu');
        
        // State
        this.lastScrollTop = 0;
    }
    
    /**
     * Initialize the navigation controller
     */
    init() {
        this.setupMobileMenu();
        this.setupScrollEffects();
        this.setupNavLinks();
    }
    
    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        if (!this.mobileMenuButton || !this.mobileMenu) return;
        
        this.mobileMenuButton.addEventListener('click', () => {
            this.mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.mobileMenuButton.contains(event.target) && 
                !this.mobileMenu.contains(event.target) && 
                !this.mobileMenu.classList.contains('hidden')) {
                this.mobileMenu.classList.add('hidden');
            }
        });
    }
    
    /**
     * Setup scroll effects for the navigation
     */
    setupScrollEffects() {
        if (!this.navbar) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            
            // Add shadow and more opacity when scrolling down
            if (scrollTop > 10) {
                this.navbar.classList.add('shadow-lg');
                this.navbar.style.backgroundColor = 'rgba(30, 33, 36, 0.95)';
            } else {
                this.navbar.classList.remove('shadow-lg');
                this.navbar.style.backgroundColor = 'rgba(30, 33, 36, 0.85)';
            }
            
            // Update last scroll position
            this.lastScrollTop = scrollTop;
        });
    }
    
    /**
     * Setup navigation link hover effects
     */
    setupNavLinks() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            const indicator = link.querySelector('.nav-link-indicator');
            if (!indicator) return;
            
            link.addEventListener('mouseenter', () => {
                indicator.style.width = '100%';
            });
            
            link.addEventListener('mouseleave', () => {
                indicator.style.width = '0';
            });
        });
        
        // Setup smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            });
        });
    }
}
