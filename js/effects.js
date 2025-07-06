// ===== RIPPLE EFFECT SYSTEM ===== //
class RippleEffect {
    constructor() {
        this.ripples = [];
        this.init();
    }
    
    init() {
        this.bindEvents();
    }
    
    bindEvents() {
        document.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
        
        const rippleElements = document.querySelectorAll('.btn, .nav-link, .gallery-item');
        rippleElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createElementRipple(e, element);
            });
        });
    }
    
    createRipple(x, y, color = 'rgba(0, 212, 255, 0.3)') {
        const ripple = document.createElement('div');
        ripple.className = 'global-ripple';
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: ${color};
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 9999;
            animation: ripple-expand 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
    
    createElementRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.className = 'element-ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.2);
            transform: scale(0);
            pointer-events: none;
            animation: element-ripple 0.6s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ===== REACTIVE LIGHTING SYSTEM ===== //
class ReactiveLighting {
    constructor() {
        this.elements = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }
    
    init() {
        this.findElements();
        this.bindEvents();
        this.animate();
    }
    
    findElements() {
        this.elements = Array.from(document.querySelectorAll('.reactive-lighting, .btn, .nav-link'));
    }
    
    bindEvents() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        window.addEventListener('resize', () => {
            this.findElements();
        });
    }
    
    animate() {
        this.elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(this.mouseX - centerX, 2) + 
                Math.pow(this.mouseY - centerY, 2)
            );
            
            const maxDistance = 200;
            const intensity = Math.max(0, 1 - distance / maxDistance);
            
            if (intensity > 0) {
                const relativeX = ((this.mouseX - rect.left) / rect.width) * 100;
                const relativeY = ((this.mouseY - rect.top) / rect.height) * 100;
                
                element.style.setProperty('--mouse-x', `${relativeX}%`);
                element.style.setProperty('--mouse-y', `${relativeY}%`);
                element.style.setProperty('--light-intensity', intensity);
                
                const glowIntensity = intensity * 20;
                element.style.boxShadow = `0 0 ${glowIntensity}px rgba(0, 212, 255, ${intensity * 0.5})`;
            } else {
                element.style.boxShadow = '';
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== REFLECTION EFFECT ===== //
class ReflectionEffect {
    constructor() {
        this.init();
    }
    
    init() {
        const reflectiveElements = document.querySelectorAll('.gallery-item, .console-screen');
        
        reflectiveElements.forEach(element => {
            this.addReflection(element);
        });
    }
    
    addReflection(element) {
        element.addEventListener('mouseenter', () => {
            this.createReflection(element);
        });
        
        element.addEventListener('mouseleave', () => {
            this.removeReflection(element);
        });
    }
    
    createReflection(element) {
        const reflection = document.createElement('div');
        reflection.className = 'dynamic-reflection';
        reflection.style.cssText = `
            position: absolute;
            bottom: -100%;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                to bottom,
                rgba(0, 212, 255, 0.1) 0%,
                transparent 50%
            );
            transform: scaleY(-1);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(reflection);
        
        setTimeout(() => {
            reflection.style.opacity = '1';
        }, 10);
    }
    
    removeReflection(element) {
        const reflection = element.querySelector('.dynamic-reflection');
        if (reflection) {
            reflection.style.opacity = '0';
            setTimeout(() => {
                reflection.remove();
            }, 300);
        }
    }
}

// ===== ELECTROMAGNETIC FIELD EFFECT ===== //
class ElectromagneticField {
    constructor(element) {
        this.element = element;
        this.field = null;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createField();
        this.createParticles();
        this.animate();
    }
    
    createField() {
        this.field = document.createElement('div');
        this.field.className = 'em-field';
        this.field.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                from 0deg,
                transparent,
                rgba(0, 212, 255, 0.05),
                transparent,
                rgba(255, 0, 64, 0.05),
                transparent
            );
            animation: electromagnetic-rotation 15s linear infinite;
            pointer-events: none;
        `;
        
        this.element.style.position = 'relative';
        this.element.appendChild(this.field);
    }
    
    createParticles() {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'em-particle';
            
            const angle = (i / 8) * Math.PI * 2;
            const radius = 50 + Math.random() * 30;
            
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: ${Math.random() > 0.5 ? '#00d4ff' : '#ff0040'};
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                pointer-events: none;
            `;
            
            particle.emData = {
                angle: angle,
                radius: radius,
                speed: 0.02 + Math.random() * 0.01
            };
            
            this.element.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.emData.angle += particle.emData.speed;
            
            const x = Math.cos(particle.emData.angle) * particle.emData.radius;
            const y = Math.sin(particle.emData.angle) * particle.emData.radius;
            
            particle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== DISTORTION WAVE EFFECT ===== //
class DistortionWave {
    constructor(element) {
        this.element = element;
        this.waves = [];
        this.init();
    }
    
    init() {
        this.createWaves();
        this.bindEvents();
    }
    
    createWaves() {
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.className = 'distortion-wave';
            wave.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    45deg,
                    transparent 40%,
                    rgba(0, 212, 255, ${0.1 - i * 0.02}) 50%,
                    transparent 60%
                );
                animation: wave-distortion ${3 + i}s ease-in-out infinite;
                animation-delay: ${i * 0.5}s;
                pointer-events: none;
            `;
            
            this.element.appendChild(wave);
            this.waves.push(wave);
        }
    }
    
    bindEvents() {
        this.element.addEventListener('mouseenter', () => {
            this.waves.forEach(wave => {
                wave.style.animationDuration = '1s';
            });
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.waves.forEach((wave, index) => {
                wave.style.animationDuration = `${3 + index}s`;
            });
        });
    }
}

// ===== CHROMATIC ABERRATION EFFECT ===== //
class ChromaticAberration {
    constructor(element) {
        this.element = element;
        this.intensity = 0;
        this.targetIntensity = 0;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        this.element.addEventListener('mouseenter', () => {
            this.targetIntensity = 3;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.targetIntensity = 0;
        });
    }
    
    animate() {
        this.intensity += (this.targetIntensity - this.intensity) * 0.1;
        
        this.element.style.filter = `
            drop-shadow(${-this.intensity}px 0 0 #ff0040)
            drop-shadow(${this.intensity}px 0 0 #00ffff)
        `;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== CURSOR TRAIL SYSTEM ===== //
class CursorTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = 10;
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.createTrail(e.clientX, e.clientY);
        });
    }
    
    createTrail(x, y) {
        if (this.trails.length >= this.maxTrails) {
            const oldTrail = this.trails.shift();
            oldTrail.remove();
        }
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail-particle';
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, var(--electric-blue), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            animation: trail-fade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        this.trails.push(trail);
        
        setTimeout(() => {
            const index = this.trails.indexOf(trail);
            if (index > -1) {
                this.trails.splice(index, 1);
                trail.remove();
            }
        }, 800);
    }
}

// ===== ENERGY FIELD INTERACTION ===== //
class EnergyField {
    constructor(element) {
        this.element = element;
        this.energy = 0;
        this.targetEnergy = 0;
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.animate();
    }
    
    bindEvents() {
        this.element.addEventListener('mouseenter', () => {
            this.targetEnergy = 1;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.targetEnergy = 0;
        });
        
        this.element.addEventListener('click', () => {
            this.pulse();
        });
    }
    
    animate() {
        this.energy += (this.targetEnergy - this.energy) * 0.05;
        
        const intensity = this.energy;
        this.element.style.background = `
            radial-gradient(
                ellipse at center,
                rgba(0, 212, 255, ${0.1 * intensity}) 0%,
                rgba(0, 212, 255, ${0.05 * intensity}) 50%,
                transparent 100%
            )
        `;
        
        requestAnimationFrame(() => this.animate());
    }
    
    pulse() {
        const pulseElement = document.createElement('div');
        pulseElement.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border: 2px solid var(--electric-blue);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: energy-pulse 1s ease-out forwards;
            pointer-events: none;
        `;
        
        this.element.appendChild(pulseElement);
        
        setTimeout(() => {
            pulseElement.remove();
        }, 1000);
    }
}

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', function() {
    initInteractiveEffects();
});

function initInteractiveEffects() {

    new RippleEffect();
    
    new ReactiveLighting();
    
    new ReflectionEffect();
    
    new CursorTrail();
    
    const emElements = document.querySelectorAll('.portal-container, .profile-container');
    emElements.forEach(element => {
        new ElectromagneticField(element);
    });
    
    const distortionElements = document.querySelectorAll('.gallery-item');
    distortionElements.forEach(element => {
        new DistortionWave(element);
    });
    
    const chromaticElements = document.querySelectorAll('.glitch-text, .glitch-name');
    chromaticElements.forEach(element => {
        new ChromaticAberration(element);
    });
    
    const energyElements = document.querySelectorAll('.btn, .nav-link');
    energyElements.forEach(element => {
        new EnergyField(element);
    });
}

// ===== ADDITIONAL CSS ANIMATIONS ===== //
const effectStyles = `
@keyframes ripple-expand {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 300px;
        height: 300px;
        opacity: 0;
    }
}

@keyframes element-ripple {
    0% {
        transform: scale(0);
        opacity: 1;
    }
    100% {
        transform: scale(1);
        opacity: 0;
    }
}

@keyframes trail-fade {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
    }
}

@keyframes energy-pulse {
    0% {
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        width: 200px;
        height: 200px;
        opacity: 0;
    }
}

@keyframes electromagnetic-rotation {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.cursor-trail-particle {
    transition: none;
}

.em-particle {
    transition: transform 0.1s ease;
}

.dynamic-reflection {
    z-index: -1;
}
`;

const effectStyleSheet = document.createElement('style');
effectStyleSheet.textContent = effectStyles;
document.head.appendChild(effectStyleSheet);

