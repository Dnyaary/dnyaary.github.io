// ===== MAIN JAVASCRIPT ===== //

let currentSection = 'home';
let isLoading = true;
let mouseX = 0;
let mouseY = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initLoadingScreen();
    
    initNavigation();
    
    initMouseTracking();
    
    initScrollAnimations();
    
    initInteractiveElements();
    
    initBackgroundEffects();
    
    initTypingEffects();
    
    console.log('Dnyaary Website Initialized');
}

// ===== LOADING SCREEN ===== //
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    const loadingMessages = [
        'Initializing Reality...',
        'Loading Digital Fragments...',
        'Establishing Connection...',
        'Calibrating Dimensions...',
        'Welcome to the Void...'
    ];
    
    let progress = 0;
    let messageIndex = 0;
    
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                isLoading = false;
                startMainAnimations();
            }, 500);
        }
        
        loadingProgress.style.width = progress + '%';
        
        if (Math.random() > 0.7 && messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
        }
        
    }, 200);
}

function startMainAnimations() {
    animatePortal();
    startTypingAnimation('.typing-text');
    triggerFadeInAnimations();
}

// ===== NAVIGATION ===== //
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const ctaButtons = document.querySelectorAll('.btn[data-target]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            navigateToSection(targetSection);
        });
    });
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            navigateToSection(targetSection);
        });
    });
    
    window.addEventListener('popstate', function(e) {
        const section = e.state ? e.state.section : 'home';
        navigateToSection(section, false);
    });
}

function navigateToSection(sectionName, updateHistory = true) {
    if (sectionName === currentSection) return;
    
    const currentSectionEl = document.getElementById(currentSection);
    const targetSectionEl = document.getElementById(sectionName);
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!targetSectionEl) return;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
    
    currentSectionEl.classList.remove('active');
    
    setTimeout(() => {
        targetSectionEl.classList.add('active');
        currentSection = sectionName;
        
        triggerSectionAnimations(sectionName);
        
        if (updateHistory) {
            history.pushState({section: sectionName}, '', `#${sectionName}`);
        }
        
    }, 300);
}

function triggerSectionAnimations(sectionName) {
    switch(sectionName) {
        case 'about':
            animateAboutSection();
            break;
        case 'art':
            animateArtSection();
            break;
        case 'games':
            animateGamesSection();
            break;
    }
}

// ===== MOUSE TRACKING ===== //
function initMouseTracking() {
    document.addEventListener('mousemove', function(e) {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;
        
        updateReactiveLighting(e.clientX, e.clientY);
        
        createCursorTrail(e.clientX, e.clientY);
    });
}

function updateReactiveLighting(x, y) {
    const reactiveElements = document.querySelectorAll('.reactive-lighting');
    
    reactiveElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const elementX = ((x - rect.left) / rect.width) * 100;
        const elementY = ((y - rect.top) / rect.height) * 100;
        
        element.style.setProperty('--mouse-x', elementX + '%');
        element.style.setProperty('--mouse-y', elementY + '%');
    });
}

function createCursorTrail(x, y) {
    if (Math.random() > 0.8) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.remove();
        }, 500);
    }
}

// ===== SCROLL ANIMATIONS ===== //
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    const fadeElements = document.querySelectorAll('.fade-in-text');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

function triggerFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-text');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('visible');
        }, index * 200);
    });
}

// ===== INTERACTIVE ELEMENTS ===== //
function initInteractiveElements() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(10deg) rotateX(5deg) translateZ(20px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
        });
    });
    
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.classList.add('hover-glow');
        });
        
        link.addEventListener('mouseleave', function() {
            this.classList.remove('hover-glow');
        });
    });
}

function createRippleEffect(event, element) {
    const ripple = element.querySelector('.btn-ripple');
    if (!ripple) return;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    ripple.classList.add('active');
    
    setTimeout(() => {
        ripple.classList.remove('active');
    }, 600);
}

// ===== BACKGROUND EFFECTS ===== //
function initBackgroundEffects() {
    createFloatingParticles();
    
    animateDigitalNoise();
    
    createMatrixRain();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${Math.random() > 0.5 ? 'var(--electric-blue)' : 'var(--neon-cyan)'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 15}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
            opacity: ${Math.random() * 0.5 + 0.3};
        `;
        
        particleContainer.appendChild(particle);
    }
}

function animateDigitalNoise() {
    const noiseElement = document.querySelector('.digital-noise');
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            noiseElement.style.opacity = Math.random() * 0.1 + 0.02;
            setTimeout(() => {
                noiseElement.style.opacity = '0.03';
            }, 100);
        }
    }, 100);
}

function createMatrixRain() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';
    document.querySelector('.background-effects').appendChild(matrixContainer);
    
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    setInterval(() => {
        if (Math.random() > 0.98) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
            char.style.left = Math.random() * 100 + '%';
            char.style.animationDuration = (Math.random() * 2 + 1) + 's';
            
            matrixContainer.appendChild(char);
            
            setTimeout(() => {
                char.remove();
            }, 3000);
        }
    }, 200);
}

// ===== TYPING EFFECTS ===== //
function initTypingEffects() {
    const terminalCommands = document.querySelectorAll('.typing-command');
    terminalCommands.forEach(command => {
        startTypingAnimation(command);
    });
}

function startTypingAnimation(element) {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }
    
    if (!element) return;
    
    const text = element.textContent;
    element.textContent = '';
    element.style.borderRight = '2px solid var(--electric-blue)';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        
        if (i >= text.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                element.style.borderRight = 'none';
            }, 1000);
        }
    }, 100);
}

// ===== SECTION-SPECIFIC ANIMATIONS ===== //
function animateAboutSection() {
    const textBlocks = document.querySelectorAll('#about .text-block');
    
    textBlocks.forEach((block, index) => {
        setTimeout(() => {
            block.classList.add('visible');
        }, index * 300);
    });
}

function animateArtSection() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function animateGamesSection() {
    const terminal = document.querySelector('.terminal-text');
    const lines = terminal.querySelectorAll('.terminal-line');
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

function animatePortal() {
    const portal = document.querySelector('.digital-portal');
    const rings = document.querySelectorAll('.ring');
    const core = document.querySelector('.portal-core');

    rings.forEach((ring, index) => {
        ring.style.animationDelay = (index * 0.5) + 's';
    });
    
    core.style.animation = 'pulse 2s ease-in-out infinite, energy 1s ease-in-out infinite alternate';
}

// ===== UTILITY FUNCTIONS ===== //
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ===== PERFORMANCE OPTIMIZATION ===== //
function optimizePerformance() {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.body.classList.add('reduced-animations');
    }
    document.addEventListener('visibilitychange', function() {
        const animations = document.querySelectorAll('*');
        if (document.hidden) {
            animations.forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            animations.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });
}

// ===== ERROR HANDLING ===== //
window.addEventListener('error', function(e) {
    console.error('Dnyaary Website Error:', e.error);
});

// ===== RESIZE HANDLER ===== //
window.addEventListener('resize', debounce(function() {
    const portal = document.querySelector('.digital-portal');
    if (portal && window.innerWidth < 768) {
        portal.style.width = '250px';
        portal.style.height = '250px';
    } else if (portal) {
        portal.style.width = '400px';
        portal.style.height = '400px';
    }
}, 250));

optimizePerformance();

