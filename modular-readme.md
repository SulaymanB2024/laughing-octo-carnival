# Portfolio UI Enhancement Project

This project enhances a portfolio website with modern UI components and interactive features using a modular code structure.

## Key Features

1. **Sliding Context Panels** - Interactive side panels for project details and filters
2. **Interactive Network Visualization** - D3.js-powered network graph showing connections between skills and projects
3. **Timeline Scrubber** - Interactive timeline for filtering projects by date range
4. **Modular Structure** - Well-organized code with separate modules for different functionality

## Project Structure

### CSS Modules
- `css/styles.css` - Main styles and common elements
- `css/panels.css` - Sliding context panel styles  
- `css/timeline.css` - Timeline scrubber component styles
- `css/modal.css` - Modal dialog styles

### JavaScript Modules
- `js/main.js` - Main entry point that initializes all modules
- `js/modules/navigation.js` - Navigation functionality
- `js/modules/reveal-animation.js` - Scroll-based reveal animations  
- `js/modules/panel-controller.js` - Sliding panel management
- `js/modules/timeline-scrubber.js` - Timeline filtering functionality
- `js/modules/project-data.js` - Project data management and filtering
- `js/modules/network-visualization.js` - D3.js interactive visualization

## Implementation Details

### Modular Architecture

The codebase follows a modular architecture with these benefits:
- **Separation of Concerns**: Each module is responsible for a specific feature
- **Easier Maintenance**: Isolated functionality makes debugging and updates simpler
- **Better Organization**: Clear structure makes code more navigable
- **Reusability**: Components can be reused across projects

### Timeline Scrubber Module

The timeline scrubber provides an interactive way to filter projects by date range:
- Dual sliders for selecting start and end dates
- Visual indicator for the selected range
- Updates project visibility in real-time
- Persists filter state in URL parameters

### Network Visualization Module

The D3.js visualization creates an interactive representation of skills and projects:
- Force-directed graph shows relationships between skills and projects
- Toggle between force and radial layouts
- Layer controls to show/hide skills, projects, or connections
- Interactive hover effects and click actions

### Panel Controller Module

The sliding panels system provides contextual information:
- Left panel displays project details
- Right panel shows skill details and filtering options
- Smooth animations for opening and closing
- Backdrop overlay with click-to-close functionality
- Keyboard accessibility (ESC key to close)

## Technologies Used

- **HTML5/CSS3** - For structure and styling
- **JavaScript (ES6+)** - For interactive functionality
- **D3.js** - For data visualization
- **TailwindCSS** - For utility-first styling
- **FontAwesome** - For iconography

## Setup Instructions

1. Clone the repository
2. No build process required - open `index.html` in a browser
3. Use a local server (like Live Server VSCode extension) for optimal module loading

## Future Enhancements

- Add dark/light theme toggle
- Improve accessibility features
- Add animations for page transitions
- Implement collapsible toolbar navigation
