

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    initLoadingScreen();
    initNavigation();
    initLanguageSelector();
    initInteractiveElements();
    initBackgroundEffects();
    initTypingEffects();
    initScrollAnimations();
    
    console.log('Dnyaary Website Initialized');
}


function initLoadingScreen() {
    
    
    const loadingScreen = document.getElementById('loading-screen');
    
    
    
    if (!loadingScreen) {
        
        startMainAnimations();
        return; 
    }
    

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
                startMainAnimations(); 
            }, 500);
        }
        
        
        if (loadingProgress) {
            loadingProgress.style.width = progress + '%';
        }
        
        if (loadingText && Math.random() > 0.7 && messageIndex < loadingMessages.length - 1) {
            messageIndex++;
            loadingText.textContent = loadingMessages[messageIndex];
        }
        
    }, 200);
}

function startMainAnimations() {
    const homeSection = document.getElementById('home');
    if (homeSection) {
        animatePortal();
    }
    
    
}


function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-list .nav-link');
    const ctaButtons = document.querySelectorAll('.btn[data-target]');
    
    navLinks.forEach(link => {
        
    });
    
    
    
    if (ctaButtons.length > 0) {
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-target');
                const currentPath = window.location.pathname;
                const lang = currentPath.includes('/pt/') ? 'pt' : 'en';
                const deviceSegment = currentPath.includes("/mobile/") ? "mobile" : "pc";
                let newUrl = (targetPage === "home") ? `/${deviceSegment}/${lang}/index.html` : `/${deviceSegment}/${lang}/${targetPage}.html`;
                window.location.href = newUrl;
            });
        });
    }
    
    highlightActiveNavLink();
    window.addEventListener('popstate', highlightActiveNavLink); 
}

function highlightActiveNavLink() {
    
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-list .nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        
        
        if (linkHref && currentPath.endsWith(linkHref.replace('./', ''))) {
            link.classList.add('active');
        }
    });

    
    if (currentPath.endsWith('/') || currentPath.endsWith('index.html')) {
        const homeLink = document.querySelector('a[href*="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
}



function initLanguageSelector() {
    const langSelector = document.getElementById('lang-selector');
    
    if (langSelector) {
        const currentPath = window.location.pathname;
        langSelector.value = currentPath.includes('/pt/') ? 'pt' : 'en';

        langSelector.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            const currentPathname = window.location.pathname;
            const pathSegments = currentPathname.split('/');
            const deviceSegment = pathSegments.includes('mobile') ? 'mobile' : 'pc';
            const currentPage = pathSegments[pathSegments.length - 1] || 'index.html'; 
            const newUrl = `/${deviceSegment}/${selectedLang}/${currentPage}`;
            window.location.href = newUrl;
        });
    }
}



function initInteractiveElements() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            
            if (this.querySelector('.btn-ripple')) {
                createRippleEffect(e, this);
            }
        });
    });
}

function createRippleEffect(event, element) {
    
    const ripple = element.querySelector('.btn-ripple');
    ripple.classList.remove('active'); 
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('active');
    setTimeout(() => { ripple.classList.remove('active'); }, 600);
}



function initBackgroundEffects() {
    
    createFloatingParticles();
    createMatrixRain();
    animateDigitalNoise();
}

function createFloatingParticles() {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;
    
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `position: absolute; width: ${Math.random() * 4 + 2}px; height: ${Math.random() * 4 + 2}px; background: ${Math.random() > 0.5 ? 'var(--electric-blue)' : 'var(--neon-cyan)'}; border-radius: 50%; left: ${Math.random() * 100}%; top: ${Math.random() * 100}%; animation: float ${Math.random() * 10 + 15}s ease-in-out infinite; animation-delay: ${Math.random() * 5}s; opacity: ${Math.random() * 0.5 + 0.3};`;
        particleContainer.appendChild(particle);
    }
}

function animateDigitalNoise() {
    const noiseElement = document.querySelector('.digital-noise');
    if (!noiseElement) return;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            noiseElement.style.opacity = Math.random() * 0.1 + 0.02;
            setTimeout(() => { noiseElement.style.opacity = '0.03'; }, 100);
        }
    }, 100);
}

function createMatrixRain() {
    const backgroundEffects = document.querySelector('.background-effects');
    if (!backgroundEffects) return;
    
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-container';
    backgroundEffects.appendChild(matrixContainer);
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    setInterval(() => {
        if (Math.random() > 0.98) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = characters[Math.floor(Math.random() * characters.length)];
            char.style.left = Math.random() * 100 + '%';
            char.style.animationDuration = (Math.random() * 2 + 1) + 's';
            matrixContainer.appendChild(char);
            setTimeout(() => { char.remove(); }, 3000); 
        }
    }, 200);
}


function initTypingEffects() {
    const taglineElement = document.querySelector('.typing-text');
    
    if (taglineElement) {
        startTypingAnimation(taglineElement);
    }
}

function startTypingAnimation(element) {
    
    if (typeof element === 'string') { element = document.querySelector(element); }
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
            setTimeout(() => { element.style.borderRight = 'none'; }, 1000);
        }
    }, 100);
}

function animatePortal() {
    const portal = document.querySelector('.digital-portal');
    if (!portal) return;
    
    const rings = document.querySelectorAll('.digital-portal .ring');
    const core = document.querySelector('.portal-core');
    rings.forEach((ring, index) => {
        ring.style.animation = `rotate ${10 + index * 5}s linear infinite ${index * 0.5}s`;
    });
    core.style.animation = 'pulse 2s ease-in-out infinite, energy 1s ease-in-out infinite alternate';
}


function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-text');
    if (fadeElements.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(element => { observer.observe(element); });
}


window.addEventListener('error', function(e) {
    
    console.error('Dnyaary Website Error:', e.error);



});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');     if (hamburgerMenu && mainNav) {
        hamburgerMenu.addEventListener('click', () => {
            mainNav.classList.toggle('open');
            const icon = hamburgerMenu.querySelector('i');
            if (mainNav.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                hamburgerMenu.setAttribute('aria-label', 'Fechar Menu');             } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburgerMenu.setAttribute('aria-label', 'Abrir Menu');             }
        });
    }
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                const icon = hamburgerMenu.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                hamburgerMenu.setAttribute('aria-label', 'Abrir Menu');
            }
        });
    });
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');

    if (loadingScreen && loadingProgress && loadingText) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                loadingProgress.style.width = `${progress}%`;
                if (progress === 100) {
                    loadingText.textContent = 'Realidade Sincronizada.';
                }
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                }, 500);             }
        }, 150);         window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);         });
    }
    const taglineSpan = document.querySelector('.tagline .typing-text');
    if (taglineSpan) {
        const text = taglineSpan.textContent;
        taglineSpan.textContent = '';         let i = 0;
        let isDeleting = false;
        let charIndex = 0;
        let typingSpeed = 150; 
        function typeWriter() {
            if (taglineSpan.closest('.home-section')) {                 const currentText = text.substring(0, charIndex);
                taglineSpan.textContent = currentText;

                if (!isDeleting && charIndex < text.length) {
                    charIndex++;
                    typingSpeed = 150;
                } else if (isDeleting && charIndex > 0) {
                    charIndex--;
                    typingSpeed = 70;                 } else if (!isDeleting && charIndex === text.length) {
                    isDeleting = true;
                    typingSpeed = 2000; 
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    typingSpeed = 500; 
                }
                setTimeout(typeWriter, typingSpeed);
            } else {
                taglineSpan.textContent = text; 
            }
        }
        typeWriter();
    }
    const fadeInElements = document.querySelectorAll('.fade-in-text');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        observer.observe(el);
    });
});

