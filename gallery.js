// ===== 3D GALLERY SYSTEM ===== //

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
        
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    setupItemInteractions(item, index) {
        const frame = item.querySelector('.item-frame');
        
        item.addEventListener('mouseenter', () => {
            this.highlightItem(item);
        });
        
        item.addEventListener('mouseleave', () => {
            this.unhighlightItem(item);
        });
        
        item.addEventListener('click', () => {
            this.selectItem(item, index);
        });
        
        item.addEventListener('touchstart', () => {
            this.highlightItem(item);
        });
        
        item.addEventListener('touchend', () => {
            this.selectItem(item, index);
        });
    }
    
    highlightItem(item) {
        if (this.isAnimating) return;
        
        item.style.transform = 'rotateY(15deg) rotateX(10deg) translateZ(30px) scale(1.05)';
        item.style.zIndex = '10';
        
        const frame = item.querySelector('.item-frame');
        frame.style.boxShadow = '0 20px 60px rgba(0, 212, 255, 0.4)';
        frame.style.borderColor = 'var(--electric-blue)';
        
        this.createParticleEffect(item);
        
        this.createSoundWave(item);
    }
    
    unhighlightItem(item) {
        if (this.isAnimating) return;
        
        item.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px) scale(1)';
        item.style.zIndex = '1';
        
        const frame = item.querySelector('.item-frame');
        frame.style.boxShadow = '';
        frame.style.borderColor = 'var(--medium-gray)';
    }
    
    selectItem(item, index) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        
        item.style.transform = 'scale(1.2) translateZ(50px)';
        item.style.zIndex = '100';
        
        this.showItemDetail(item, index);
        
        setTimeout(() => {
            this.isAnimating = false;
            this.unhighlightItem(item);
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
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const category = item.getAttribute('data-category');
        
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
                    <div class="modal-image">
                        <div class="placeholder-large">
                            <span class="large-title">${title}</span>
                            <span class="large-type">${category}</span>
                        </div>
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
                                <span class="detail-value">2024</span>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button class="btn btn-primary">View Full Size</button>
                            <button class="btn btn-secondary">Download</button>
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
    
    createParticleEffect(item) {
        const rect = item.getBoundingClientRect();
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'gallery-particle';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const distance = 50 + Math.random() * 30;
            const x = rect.left + rect.width / 2 + Math.cos(angle) * distance;
            const y = rect.top + rect.height / 2 + Math.sin(angle) * distance;
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: var(--electric-blue);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                animation: particle-burst 0.8s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }
    
    createSoundWave(item) {
        const rect = item.getBoundingClientRect();
        const wave = document.createElement('div');
        wave.className = 'sound-wave';
        
        wave.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 0;
            height: 0;
            border: 2px solid var(--electric-blue);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9998;
            animation: sound-wave-expand 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(wave);
        
        setTimeout(() => {
            wave.remove();
        }, 600);
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
    
    handleKeyboard(e) {
        if (this.isAnimating) return;
        
        const visibleItems = this.items.filter(item => 
            item.style.display !== 'none' && 
            (this.currentFilter === 'all' || item.getAttribute('data-category') === this.currentFilter)
        );
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.navigateItems(visibleItems, -1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.navigateItems(visibleItems, 1);
                break;
            case 'Enter':
                e.preventDefault();
                const focusedItem = document.querySelector('.gallery-item.focused');
                if (focusedItem) {
                    const index = this.items.indexOf(focusedItem);
                    this.selectItem(focusedItem, index);
                }
                break;
        }
    }
    
    navigateItems(visibleItems, direction) {
        const currentFocused = document.querySelector('.gallery-item.focused');
        let currentIndex = currentFocused ? visibleItems.indexOf(currentFocused) : -1;
        
        if (currentFocused) {
            currentFocused.classList.remove('focused');
            this.unhighlightItem(currentFocused);
        }
        
        currentIndex += direction;
        if (currentIndex < 0) currentIndex = visibleItems.length - 1;
        if (currentIndex >= visibleItems.length) currentIndex = 0;
        
        const newFocused = visibleItems[currentIndex];
        if (newFocused) {
            newFocused.classList.add('focused');
            this.highlightItem(newFocused);
            newFocused.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// ===== GALLERY INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const galleryContainer = document.getElementById('gallery-3d');
    if (galleryContainer) {
        new Gallery3D(galleryContainer);
    }
}

// ===== GALLERY STYLES ===== //
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
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    background: var(--dark-gray);
    border: 1px solid var(--electric-blue);
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
}

.gallery-modal.active .modal-content {
    transform: translate(-50%, -50%) scale(1);
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
}

.modal-close:hover {
    background: var(--electric-blue);
    color: var(--void-black);
    transform: rotate(90deg);
}

.modal-header {
    padding: 2rem;
    border-bottom: 1px solid var(--medium-gray);
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
}

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
    color: var(--light-gray);
}

.modal-description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    color: var(--light-gray);
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

