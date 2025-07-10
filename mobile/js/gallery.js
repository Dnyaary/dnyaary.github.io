class Gallery3D {
    constructor(container) {
        this.container = container;
        this.items = [];
        this.currentFilter = 'all';
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.findItems();
        this.bindEvents();
        this.setupFilters();
        this.initializeItems();
    }
    
    findItems() {
        this.items = Array.from(this.container.querySelectorAll('.gallery-item'));
    }
    
    bindEvents() {
        const filterButtons = this.container.querySelectorAll('.gallery-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                this.filterItems(filter);
                this.updateActiveFilter(button);
            });
        });
        
        this.items.forEach((item, index) => {
            this.setupItemInteractions(item, index);
        });
        
        
    }
    
    setupItemInteractions(item, index) {
                
            
        item.addEventListener('click', () => {
        this.selectItem(item, index);
    });
    }
    
    highlightItem(item) {
        item.classList.add('highlighted');
    }
    
    unhighlightItem(item) {
        item.classList.remove('highlighted');
    }
    
    selectItem(item, index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        this.showItemDetail(item, index);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 1000);
    }
    
    showItemDetail(item, index) {
        const modal = this.createModal(item);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        [closeBtn, overlay].forEach(element => {
            element.addEventListener('click', () => {
                this.closeModal(modal);
            });
        });
        
        const handleKeyClose = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', handleKeyClose);
            }
        };
        document.addEventListener('keydown', handleKeyClose);
    }
    
    createModal(item) {
        const title = item.querySelector('.art-title').textContent;
        const description = item.querySelector('.item-info p').textContent;
        const category = item.getAttribute('data-category');
        
        const imageStyle = item.querySelector('.placeholder-art').style.backgroundImage;
        const imageSrc = imageStyle ? imageStyle.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : ''; 
        
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-header">
                    <h2 class="modal-title">${title}</h2>
                    <span class="modal-category">${category.toUpperCase()}</span>
                </div>
                <div class="modal-body">
                    <div class="modal-image" style="background-image: url('${imageSrc}'); background-size: cover; background-position: center;">
                        </div>
                    <div class="modal-info">
                        <p class="modal-description">${description}</p>
                        <div class="modal-details">
                            <div class="detail-item">
                                <span class="detail-label">Type:</span>
                                <span class="detail-value">${category}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Status:</span>
                                <span class="detail-value">Concept</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Year:</span>
                                <span class="detail-value">2025</span>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <a href="https://www.artstation.com/dnyaary" target="_blank" class="btn btn-primary">Ver no ArtStation</a>
                            <button class="btn btn-secondary">Download (Em breve)</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }
    
    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    filterItems(filter) {
        if (this.isAnimating || filter === this.currentFilter) return;
        
        this.isAnimating = true;
        this.currentFilter = filter;
        
        
        this.items.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'translateY(50px) rotateX(-90deg)';
                item.style.opacity = '0';
            }, index * 50);
        });
        
        
        setTimeout(() => {
            this.items.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.transform = 'translateY(0) rotateX(0deg)';
                        item.style.opacity = '1';
                    }, index * 100);
                } else {
                    item.style.display = 'none';
                }
            });
            
            setTimeout(() => {
                this.isAnimating = false;
            }, this.items.length * 100 + 500); 
        }, this.items.length * 50 + 200); 
    }
    
    updateActiveFilter(activeButton) {
        const buttons = this.container.querySelectorAll('.gallery-btn');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }
    
    initializeItems() {
        this.items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
}


document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const galleryContainer = document.getElementById('gallery-3d');
    if (galleryContainer) {
        new Gallery3D(galleryContainer);
    }
}

const galleryStyles = `
.gallery-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gallery-modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
}

.modal-content {
    position: relative;
    transform: scale(0.8);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: var(--dark-gray);
    border: 1px solid var(--electric-blue);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;
    z-index: 1; }

.gallery-modal.active .modal-content {
    transform: scale(1);
}

.modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: transparent;
    border: 2px solid var(--electric-blue);
    border-radius: 50%;
    color: var(--electric-blue);
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    background: var(--electric-blue);
    color: var(--void-black);
    transform: rotate(90deg);
}

.modal-header {
    padding: 2rem;
    border-bottom: 1px solid var(--medium-gray);
    flex-shrink: 0;
}

.modal-title {
    font-family: var(--font-primary);
    font-size: 2rem;
    color: var(--electric-blue);
    margin-bottom: 0.5rem;
}

.modal-category {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--light-gray);
    background: var(--medium-gray);
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
}

.modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
    overflow-y: auto; }

.modal-image {
    aspect-ratio: 16/9;
    background: var(--medium-gray);
    border-radius: 8px;
    overflow: hidden;
    }

.placeholder-large {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--medium-gray), var(--dark-gray));
}

.large-title {
    font-family: var(--font-primary);
    font-size: 1.5rem;
    color: var(--electric-blue);
    margin-bottom: 0.5rem;
}

.large-type {
    font-family: var(--font-mono);
    color: white;
}

.modal-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: white;
}

.modal-details {
    margin-bottom: 2rem;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.8rem;
    padding-bottom: 0.8rem;
    border-bottom: 1px solid var(--medium-gray);
}

.detail-label {
    font-weight: 600;
    color: var(--electric-blue);
}

.detail-value {
    color: var(--light-gray);
}

.modal-actions {
    display: flex;
    gap: 1rem;
}

.gallery-item.focused {
    outline: 2px solid var(--electric-blue);
    outline-offset: 4px;
}

@keyframes particle-burst {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0) translateY(-20px);
    }
}

@keyframes sound-wave-expand {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 100px;
        height: 100px;
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95vh;
    }
    
    .modal-body {
        grid-template-columns: 1fr;
        gap: 1.5rem;
        padding: 1.5rem;
    }
    
    .modal-header {
        padding: 1.5rem;
    }
    
    .modal-title {
        font-size: 1.5rem;
    }
    
    .modal-actions {
        flex-direction: column;
    }
}
`;

const galleryStyleSheet = document.createElement('style');
galleryStyleSheet.textContent = galleryStyles;
document.head.appendChild(galleryStyleSheet);