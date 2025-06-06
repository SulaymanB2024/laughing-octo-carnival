/**
 * ParticlesBackground Module
 * Handles the background particles effect with advanced animation and interaction features
 * @version 2.0.0
 */
export class ParticlesBackground {
    /**
     * Creates a new particles background instance
     * @param {string} containerId - The ID of the container element
     * @param {Object} [options={}] - Custom configuration options
     */
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = options;
        this.instance = null;
        this.isRunning = false;
        this.activeTheme = null;
        this.originalCanvasSize = { width: 0, height: 0 };
        this.performanceMode = options.performanceMode || false;
        this.animationPreset = options.animationPreset || null;
        this.fpsMonitoring = options.fpsMonitoring || false;
        this.fpsValue = 0;
        this.fpsHistory = [];
        this.interactionMode = options.interactionMode || 'default';
        this.eventListeners = {};
        
        // Extended themes with advanced configurations
        this.themes = {
            dark: {
                particles: { 
                    color: { value: "#ffffff" }, 
                    line_linked: { color: "#ffffff" },
                    shape: { type: "circle" }
                },
                background: { color: "#000000" }
            },
            light: {
                particles: { 
                    color: { value: "#636363" }, 
                    line_linked: { color: "#515151" },
                    shape: { type: "circle" }
                },
                background: { color: "#f7f7f7" }
            },
            blue: {
                particles: { 
                    color: { value: "#1E90FF" }, 
                    line_linked: { color: "#4169E1" },
                    shape: { type: "circle" }
                },
                background: { color: "#f8f9fa" }
            },
            neon: {
                particles: { 
                    color: { value: ["#ff00ff", "#00ffff", "#ff8800"] }, 
                    line_linked: { color: "#ff00ff", opacity: 0.7 },
                    shape: { type: "circle" }
                },
                background: { 
                    color: "#0a0a0a",
                    gradient: {
                        enable: true, 
                        startColor: "#0a0a0a", 
                        endColor: "#1a1a2e"
                    }
                }
            },
            nature: {
                particles: { 
                    color: { value: ["#76ff03", "#1b5e20", "#81c784"] }, 
                    line_linked: { color: "#33691e" },
                    shape: { type: ["circle", "leaf", "triangle"] }
                },
                background: { color: "#f1f8e9" }
            },
            cosmos: {
                particles: {
                    color: { value: ["#E3F2FD", "#90CAF9", "#42A5F5"] },
                    line_linked: { color: "#1565C0", opacity: 0.4 },
                    size: { value: 3, random: true, anim: { enable: true, speed: 2 } },
                    shape: { type: ["circle", "star"] },
                    move: { direction: "none", random: true, out_mode: "out" }
                },
                background: { 
                    color: "#0D47A1",
                    gradient: { 
                        enable: true, 
                        startColor: "#0D47A1", 
                        endColor: "#000000" 
                    }
                }
            },
            cyberpunk: {
                particles: {
                    color: { value: ["#f700ff", "#00c3ff", "#ffe600"] },
                    line_linked: { color: "#f700ff", opacity: 0.5, width: 2 },
                    shape: { type: ["edge", "polygon"] },
                    size: { value: 3, random: true, anim: { enable: true, speed: 3 } },
                    move: { 
                        speed: 6, 
                        direction: "right", 
                        straight: false,
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    }
                },
                background: {
                    color: "#0f0f1b",
                    gradient: { 
                        enable: true, 
                        startColor: "#0f0f1b", 
                        endColor: "#1a1033" 
                    },
                    image: { src: "", opacity: 0.3 }
                }
            },
            gotham: {
                particles: {
                    number: { 
                        value: 120,
                        density: { enable: true, value_area: 800 }
                    },
                    color: { value: ["#00BFFF", "#4F5458", "#767676"] },
                    opacity: { 
                        value: 0.6,
                        random: true,
                        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#4A5568",
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: { enable: true, rotateX: 600, rotateY: 1200 }
                    }
                },
                background: { 
                    color: "#0A0F1F",
                    gradient: {
                        enable: true, 
                        startColor: "#0A0F1F", 
                        endColor: "#1E2124"
                    }
                }
            }
        };
        
        // Animation presets
        this.animationPresets = {
            pulse: {
                opacity: { anim: { enable: true, speed: 1, opacity_min: 0.4 } },
                size: { anim: { enable: true, speed: 5, size_min: 0.1, sync: false } }
            },
            wave: {
                move: { 
                    enable: true, 
                    speed: 6,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: { enable: true, rotateX: 600, rotateY: 1200 }
                }
            },
            explosion: {
                move: {
                    speed: 10,
                    direction: "top",
                    random: true
                },
                opacity: {
                    anim: { enable: true, speed: 2, opacity_min: 0 }
                },
                size: {
                    anim: { enable: true, speed: 5, size_min: 0.1 }
                }
            },
            slow: {
                move: { speed: 1, straight: true },
                number: { value: 30 }
            },
            galaxy: {
                move: {
                    speed: 1,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 1200
                    }
                },
                shape: { type: "circle" },
                size: { value: 4, random: true }
            },
            enhanced: {
                number: { value: 100, density: { enable: true, value_area: 900 } },
                opacity: { 
                    value: 0.7, 
                    random: true, 
                    anim: { enable: true, speed: 1.5, opacity_min: 0.1 }
                },
                size: { 
                    value: 3, 
                    random: true, 
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
                },
                move: {
                    speed: 1.2,
                    direction: "none",
                    random: true,
                    straight: false,
                    out_mode: "out",
                    attract: { enable: true, rotateX: 600, rotateY: 1200 }
                }
            }
        };
        
        // Custom shapes
        this.customShapes = {
            leaf: {
                draw: (ctx, color, size) => {
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.moveTo(0, -size/2);
                    ctx.bezierCurveTo(size/3, -size/3, size/2, 0, 0, size/2);
                    ctx.bezierCurveTo(-size/2, 0, -size/3, -size/3, 0, -size/2);
                    ctx.fill();
                }
            },
            star: {
                draw: (ctx, color, size) => {
                    let spikes = 5, outerRadius = size, innerRadius = size/2.5;
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    
                    for (let i = 0; i < spikes * 2; i++) {
                        let radius = i % 2 === 0 ? outerRadius : innerRadius;
                        let x = radius * Math.cos(Math.PI * i / spikes);
                        let y = radius * Math.sin(Math.PI * i / spikes);
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    
                    ctx.closePath();
                    ctx.fill();
                }
            }
        };
        
        // Interaction modes
        this.interactionModes = {
            default: {
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            gotham: {
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    grab: { distance: 180, line_linked: { opacity: 0.8 } },
                    push: { particles_nb: 4 },
                    remove: { particles_nb: 2 }
                }
            },
            repulse: {
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    repulse: { distance: 200, duration: 0.4 }
                }
            },
            bubble: {
                events: {
                    onhover: { enable: true, mode: "bubble" },
                    onclick: { enable: true, mode: "repulse" }
                },
                modes: {
                    bubble: { distance: 250, size: 10, duration: 2 },
                    repulse: { distance: 200, duration: 0.4 }
                }
            },
            attract: {
                events: {
                    onhover: { enable: true, mode: "attract" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    attract: { distance: 200, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            none: {
                events: {
                    onhover: { enable: false },
                    onclick: { enable: false }
                }
            }
        };
        
        // Add custom themes if provided
        if (options.themes) {
            Object.assign(this.themes, options.themes);
        }
        
        // Add custom animation presets if provided
        if (options.animationPresets) {
            Object.assign(this.animationPresets, options.animationPresets);
        }
        
        // Add custom shape renderers if provided
        if (options.customShapes) {
            Object.assign(this.customShapes, options.customShapes);
        }
    }
    
    /**
     * Initialize particles background
     * @param {string} [theme] - Optional theme name ('dark', 'light', 'blue', etc.)
     * @returns {boolean} Success status
     */
    init(theme = null) {
        // Check if particles.js is loaded
        if (typeof particlesJS !== 'function') {
            console.error('particles.js is not loaded. Please include particles.js library.');
            return false;
        }
        
        // Save theme choice
        this.activeTheme = theme || Object.keys(this.themes)[0];
        
        // Get configuration
        const config = this._getConfiguration(this.activeTheme);
        
        try {
            // Initialize particles.js with configuration
            this.instance = particlesJS(this.containerId, config);
            this.isRunning = true;
            
            // Store original canvas size for later use
            const canvas = document.querySelector(`#${this.containerId} canvas`);
            if (canvas) {
                this.originalCanvasSize = {
                    width: canvas.width,
                    height: canvas.height
                };
                
                // Apply gradient background if specified
                this._applyBackgroundGradient(canvas);
            }
            
            // Add window resize handler for responsive behavior
            this._setupResponsiveHandling();
            
            // Setup performance monitoring if enabled
            if (this.fpsMonitoring) {
                this._setupPerformanceMonitoring();
            }
            
            // Apply custom shapes
            this._registerCustomShapes();
            
            // Emit init event
            this._emit('init', { theme: this.activeTheme });
            
            return true;
        } catch (error) {
            console.error('Failed to initialize particles:', error);
            return false;
        }
    }
    
    /**
     * Pause particles animation
     * @returns {boolean} Success status
     */
    pause() {
        if (!this.isRunning || !this.instance) {
            return false;
        }
        
        try {
            const pJSdom = window.pJSDom;
            if (pJSdom && pJSdom.length > 0) {
                for (let i = 0; i < pJSdom.length; i++) {
                    if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                        pJSdom[i].pJS.particles.move.enable = false;
                        this.isRunning = false;
                        this._emit('pause');
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Failed to pause particles:', error);
            return false;
        }
    }
    
    /**
     * Resume particles animation
     * @returns {boolean} Success status
     */
    resume() {
        try {
            const pJSdom = window.pJSDom;
            if (pJSdom && pJSdom.length > 0) {
                for (let i = 0; i < pJSdom.length; i++) {
                    if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                        pJSdom[i].pJS.particles.move.enable = true;
                        pJSdom[i].pJS.fn.particlesRefresh();
                        this.isRunning = true;
                        this._emit('resume');
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Failed to resume particles:', error);
            return false;
        }
    }
    
    /**
     * Change theme dynamically
     * @param {string} themeName - Theme name to apply
     * @returns {boolean} Success status
     */
    changeTheme(themeName) {
        if (!this.themes[themeName]) {
            console.error(`Theme '${themeName}' not found`);
            return false;
        }
        
        // Store new active theme
        this.activeTheme = themeName;
        
        // Destroy current instance if exists
        this.destroy();
        
        // Reinitialize with new theme
        const result = this.init(themeName);
        if (result) {
            this._emit('themeChanged', { theme: themeName });
        }
        return result;
    }
    
    /**
     * Set animation preset
     * @param {string} presetName - Name of the animation preset
     * @returns {boolean} Success status
     */
    setAnimationPreset(presetName) {
        if (!this.animationPresets[presetName]) {
            console.error(`Animation preset '${presetName}' not found`);
            return false;
        }
        
        this.animationPreset = presetName;
        return this.changeTheme(this.activeTheme);
    }
    
    /**
     * Set interaction mode
     * @param {string} modeName - Name of the interaction mode
     * @returns {boolean} Success status
     */
    setInteractionMode(modeName) {
        if (!this.interactionModes[modeName]) {
            console.error(`Interaction mode '${modeName}' not found`);
            return false;
        }
        
        this.interactionMode = modeName;
        return this.changeTheme(this.activeTheme);
    }
    
    /**
     * Trigger a particle explosion at coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} [particleCount=10] - Number of particles to create
     * @returns {boolean} Success status
     */
    explodeAt(x, y, particleCount = 10) {
        try {
            const pJSdom = window.pJSDom;
            if (pJSdom && pJSdom.length > 0) {
                for (let i = 0; i < pJSdom.length; i++) {
                    if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                        const pJS = pJSdom[i].pJS;
                        const pos = { x, y };
                        
                        for (let j = 0; j < particleCount; j++) {
                            pJS.particles.array.push(
                                new pJS.fn.particle(
                                    pJS.particles.color,
                                    pJS.particles.opacity.value,
                                    { x: pos.x, y: pos.y }
                                )
                            );
                        }
                        
                        this._emit('explode', { x, y, count: particleCount });
                        return true;
                    }
                }
            }
            return false;
        } catch (error) {
            console.error('Failed to create particle explosion:', error);
            return false;
        }
    }
    
    /**
     * Get current performance metrics
     * @returns {Object} Performance metrics object
     */
    getPerformanceMetrics() {
        return {
            fps: this.fpsValue,
            particleCount: this._getParticleCount(),
            averageFps: this.fpsHistory.length ? 
                this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length : 0
        };
    }
    
    /**
     * Export current configuration
     * @returns {Object} Current configuration
     */
    exportConfiguration() {
        try {
            const pJSdom = window.pJSDom;
            if (pJSdom && pJSdom.length > 0) {
                for (let i = 0; i < pJSdom.length; i++) {
                    if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                        const pJS = pJSdom[i].pJS;
                        return {
                            theme: this.activeTheme,
                            particles: pJS.particles,
                            interactivity: pJS.interactivity,
                            performanceMode: this.performanceMode,
                            animationPreset: this.animationPreset,
                            interactionMode: this.interactionMode
                        };
                    }
                }
            }
            return null;
        } catch (error) {
            console.error('Failed to export configuration:', error);
            return null;
        }
    }
    
    /**
     * Subscribe to events
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.eventListeners[event] = this.eventListeners[event]
                .filter(cb => cb !== callback);
        };
    }
    
    /**
     * Destroy particles instance
     * @returns {boolean} Success status
     */
    destroy() {
        try {
            const pJSdom = window.pJSDom;
            if (pJSdom && pJSdom.length > 0) {
                // Find our instance and remove it
                for (let i = 0; i < pJSdom.length; i++) {
                    if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                        // Remove canvas
                        const canvas = pJSdom[i].pJS.canvas.el;
                        if (canvas && canvas.parentNode) {
                            canvas.parentNode.removeChild(canvas);
                        }
                        
                        // Remove from pJSDom
                        pJSdom.splice(i, 1);
                        break;
                    }
                }
            }
            
            this.isRunning = false;
            this.instance = null;
            
            // Remove resize listener
            window.removeEventListener('resize', this._resizeHandler);
            
            // Remove performance monitoring
            if (this._fpsInterval) {
                cancelAnimationFrame(this._fpsRequestId);
                clearInterval(this._fpsInterval);
                this._fpsInterval = null;
            }
            
            this._emit('destroy');
            return true;
        } catch (error) {
            console.error('Failed to destroy particles:', error);
            return false;
        }
    }
    
    // Private methods with advanced functionality
    
    /**
     * Emit an event to subscribers
     * @private
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    _emit(event, data = {}) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in ${event} event handler:`, error);
                }
            });
        }
    }
    
    /**
     * Apply gradient background if specified in theme
     * @private
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    _applyBackgroundGradient(canvas) {
        const theme = this.themes[this.activeTheme];
        if (!theme.background.gradient || !theme.background.gradient.enable) return;
        
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, theme.background.gradient.startColor);
        gradient.addColorStop(1, theme.background.gradient.endColor);
        
        // Store original draw function
        if (!this._originalDrawFunc) {
            // Find pJS instance
            const pJSdom = window.pJSDom;
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === canvas.id) {
                    const pJS = pJSdom[i].pJS;
                    this._originalDrawFunc = pJS.fn.vendors.draw;
                    
                    // Override draw function to include gradient
                    pJS.fn.vendors.draw = () => {
                        ctx.fillStyle = gradient;
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        this._originalDrawFunc();
                    };
                    break;
                }
            }
        }
    }
    
    /**
     * Register custom shape renderers
     * @private
     */
    _registerCustomShapes() {
        // Find pJS instance
        const pJSdom = window.pJSDom;
        if (!pJSdom) return;
        
        for (let i = 0; i < pJSdom.length; i++) {
            if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                const pJS = pJSdom[i].pJS;
                
                // Add custom shape drawing functions
                Object.keys(this.customShapes).forEach(shapeName => {
                    pJS.fn.vendors.drawShape = function(c, startX, startY, sideLength, options) {
                        const shape = options.shape.type;
                        if (typeof shape === 'string') {
                            if (shape === shapeName) {
                                // Call our custom shape drawing function
                                const customShape = this.customShapes[shapeName];
                                const color = options.color.value;
                                const size = options.size.value;
                                
                                c.save();
                                c.translate(startX, startY);
                                customShape.draw(c, color, size);
                                c.restore();
                                return;
                            }
                        }
                        
                        // Default shape drawing
                        pJS.fn.vendors._drawShape(c, startX, startY, sideLength, options);
                    }.bind(this);
                });
                
                break;
            }
        }
    }
    
    /**
     * Setup performance monitoring
     * @private
     */
    _setupPerformanceMonitoring() {
        let lastLoop = performance.now();
        let lastFpsUpdate = 0;
        let frames = 0;
        
        const calculateFps = () => {
            const now = performance.now();
            frames++;
            
            if (now - lastFpsUpdate > 1000) { // Update FPS once per second
                this.fpsValue = Math.round((frames * 1000) / (now - lastFpsUpdate));
                this.fpsHistory.push(this.fpsValue);
                
                // Keep history to last 60 values
                if (this.fpsHistory.length > 60) {
                    this.fpsHistory.shift();
                }
                
                // Auto-adjust particle count based on FPS if performance mode is active
                if (this.performanceMode && this.fpsValue < 30) {
                    const currentCount = this._getParticleCount();
                    if (currentCount > 20) {
                        this._adjustParticleCount(currentCount * 0.8);
                    }
                }
                
                lastFpsUpdate = now;
                frames = 0;
                
                this._emit('fpsUpdate', { fps: this.fpsValue });
            }
            
            lastLoop = now;
            this._fpsRequestId = requestAnimationFrame(calculateFps);
        };
        
        calculateFps();
    }
    
    /**
     * Get current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    
    /**
     * Adjust particle count
     * @private
     * @param {number} count - New particle count
     */
    _adjustParticleCount(count) {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    const pJS = pJSdom[i].pJS;
                    pJS.particles.number.value = Math.floor(count);
                    pJS.fn.particlesRefresh();
                    return;
                }
            }
        }
    }
    
    /**
     * Get configuration object by merging defaults, theme and custom options
     * @private
     * @param {string} theme - Theme name
     * @returns {Object} Configuration object
     */
    _getConfiguration(theme) {
        // Default configuration
        const defaultConfig = {
            /* ... original configuration ... */
        };
        
        // Apply theme specific configuration
        let config = JSON.parse(JSON.stringify(defaultConfig));
        if (theme && this.themes[theme]) {
            const themeConfig = this.themes[theme];
            
            // Apply theme properties to configuration
            if (themeConfig.particles) {
                config.particles = {...config.particles, ...themeConfig.particles};
            }
            
            if (themeConfig.background) {
                config.background = themeConfig.background;
            }
        }
        
        // Apply performance mode adjustments
        if (this.performanceMode) {
            config.particles.number.value = Math.floor(config.particles.number.value * 0.5);
            config.particles.line_linked.opacity = 0.7;
            config.fps_limit = 30;
        }
        
        // Apply animation preset if specified
        if (this.animationPreset && this.animationPresets[this.animationPreset]) {
            const presetConfig = this.animationPresets[this.animationPreset];
            config.particles = this._deepMerge(config.particles, presetConfig);
        }
        
        // Apply interaction mode settings
        if (this.interactionMode && this.interactionModes[this.interactionMode]) {
            const interactionConfig = this.interactionModes[this.interactionMode];
            config.interactivity = this._deepMerge(config.interactivity || {}, interactionConfig);
        }
        
        // Override with user custom options if provided
        if (this.options.particles) {
            config.particles = this._deepMerge(config.particles, this.options.particles);
        }
        
        return config;
    }
    
    /**
     * Deep merge two objects
     * @private
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    _deepMerge(target, source) {
        const output = Object.assign({}, target);
        
        if (this._isObject(target) && this._isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this._isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source
[key] });
                        
                    }
                    else {
                        output[key] = this._deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            }
        );
        }
        return output;
    }
    }
    /**
     * Check if a value is an object
     * @private
     * @param {any} value - Value to check
     * @returns {boolean} True if value is an object, false otherwise
     */
    _isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    /**
     * Setup responsive handling for canvas resizing
     * @private
     */
    _setupResponsiveHandling() {
        const canvas = document.querySelector(`#${this.containerId} canvas`);
        if (!canvas) return;
        
        this._resizeHandler = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            
            if (newWidth !== this.originalCanvasSize.width || newHeight !== this.originalCanvasSize.height) {
                canvas.width = newWidth;
                canvas.height = newHeight;
                
                // Emit resize event
                this._emit('resize', { width: newWidth, height: newHeight });
            }
        };
        
        window.addEventListener('resize', this._resizeHandler);
        this._resizeHandler();
    }
    /**
     * Initialize from URL parameters
     * @private
     */
    _initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const theme = urlParams.get('theme');
        if (theme && this.themes[theme]) {
            this.changeTheme(theme);
        }
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
    _getParticleCount() {
        const pJSdom = window.pJSDom;
        if (pJSdom && pJSdom.length > 0) {
            for (let i = 0; i < pJSdom.length; i++) {
                if (pJSdom[i].pJS.canvas.el.id === `${this.containerId}-canvas`) {
                    return pJSdom[i].pJS.particles.array.length;
                }
            }
        }
        return 0;
    }
    /**
     * Get the current particle count
     * @private
     * @returns {number} Particle count
     */
