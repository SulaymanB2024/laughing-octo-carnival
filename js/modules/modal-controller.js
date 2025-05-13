/**
 * ModalController Module
 * Handles the project modal functionality
 */
export class ModalController {
    constructor() {
        // DOM elements
        this.modal = document.getElementById("projectModal");
        this.closeBtn = this.modal.querySelector(".modal-close-btn");
        this.modalImage = document.getElementById("modalProjectImage");
        this.modalTitle = document.getElementById("modalProjectTitle");
        this.modalDescription = document.getElementById("modalProjectDescription");
    }
    
    /**
     * Initialize the modal controller
     */
    init() {
        // Set up event listeners
        this.closeBtn.addEventListener("click", () => this.closeModal());
        
        // Close modal when clicking outside of it
        window.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Add escape key listener
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.modal.classList.contains("active")) {
                this.closeModal();
            }
        });
    }
    
    /**
     * Open modal with project details
     * @param {Object} projectData Project data object
     */
    openModal(projectData) {
        if (!projectData) return;
        
        // Set modal content
        this.modalTitle.textContent = projectData.title || "";
        this.modalDescription.innerHTML = projectData.description || "";
        
        // Set image if available
        if (projectData.image) {
            this.modalImage.src = projectData.image;
            this.modalImage.style.display = "block";
            this.modalImage.alt = (projectData.title || "") + " Image";
        } else {
            this.modalImage.style.display = "none";
        }
        
        // Show modal - using the original style from the old HTML
        this.modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
    
    /**
     * Close the modal
     */
    closeModal() {
        this.modal.style.display = "none";
        document.body.style.overflow = "";
    }
}
