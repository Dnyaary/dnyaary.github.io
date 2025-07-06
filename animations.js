// ===== GLITCH EFFECTS ===== //
class GlitchEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            intensity: options.intensity || 1,
            speed: options.speed || 100,
            duration: options.duration || 2000,
            ...options
        };
        this.isActive = false;
        this.glitchInterval = null;
    }
    
    start() {
        if (this.isActive) return;
        this.isActive = true;
        
        const originalText = this.element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
        
        this.glitchInterval = setInterval(() => {
            if (Math.random() < 0.1) {
                let glitchedText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.1 * this.options.intensity) {
                        glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    } else {
                        glitchedText += originalText[i];
                    }
                }
                
                this.element.textContent = glitchedText;
                
                setTimeout(() => {
                    this.element.textContent = originalText;
                }, 50);
            }
        }, this.options.speed);
        
        if (this.options.duration > 0) {
            setTimeout(() => {
                this.stop();
            }, this.options.duration);
        }
    }
    
    stop() {
        this.isActive = false;
        if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
            this.glitchInterval = null;
        }
    }
}

// ===== PARTICLE SYSTEM ===== //
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.options = {
            count: options.count || 50,
            speed: options.speed || 1,
            size: options.size || 2,
            color: options.color || '#00d4ff',
            life: options.life || 5000,
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < this.options.count; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        
        const size = Math.random() * this.options.size + 1;
        const x = Math.random() * this.container.offsetWidth;
        const y = Math.random() * this.container.offsetHeight;
        const vx = (Math.random() - 0.5) * this.options.speed;
        const vy = (Math.random() - 0.5) * this.options.speed;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${this.options.color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            opacity: ${Math.random() * 0.8 + 0.2};
        `;
        
        particle.vx = vx;
        particle.vy = vy;
        particle.life = this.options.life;
        particle.age = 0;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle depois life expires
        setTimeout(() => {
            this.removeParticle(particle);
        }, this.options.life);
    }
    
    removeParticle(particle) {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
            particle.remove();
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            const rect = particle.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();
            
            let x = parseFloat(particle.style.left);
            let y = parseFloat(particle.style.top);
            
            x += particle.vx;
            y += particle.vy;
            
            if (x <= 0 || x >= this.container.offsetWidth) {
                particle.vx *= -1;
            }
            if (y <= 0 || y >= this.container.offsetHeight) {
                particle.vy *= -1;
            }
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            particle.age += 16; // 60fps
            const opacity = 1 - (particle.age / particle.life);
            particle.style.opacity = Math.max(0, opacity);
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== DIGITAL PORTAL ANIMATION ===== //
class DigitalPortal {
    constructor(element) {
        this.element = element;
        this.rings = element.querySelectorAll('.ring');
        this.core = element.querySelector('.portal-core');
        this.isActive = false;
        
        this.init();
    }
    
    init() {
        this.setupRings();
        this.setupCore();
        this.start();
    }
    
    setupRings() {
        this.rings.forEach((ring, index) => {
            const radius = 50 + (index * 50);
            const speed = 10 + (index * 5);
            const direction = index % 2 === 0 ? 1 : -1;
            
            ring.style.width = radius * 2 + 'px';
            ring.style.height = radius * 2 + 'px';
            ring.style.top = -radius + 'px';
            ring.style.left = -radius + 'px';
            ring.style.animationDuration = speed + 's';
            ring.style.animationDirection = direction > 0 ? 'normal' : 'reverse';
        });
    }
    
    setupCore() {
        this.core.addEventListener('click', () => {
            this.pulse();
        });
    }
    
    start() {
        this.isActive = true;
        this.element.classList.add('active');
    }
    
    pulse() {
        this.core.style.animation = 'none';
        setTimeout(() => {
            this.core.style.animation = 'pulse 0.5s ease-out, energy 1s ease-in-out infinite alternate';
        }, 10);
        
        // Create energy
        this.createEnergyBurst();
    }
    
    createEnergyBurst() {
        const burst = document.createElement('div');
        burst.className = 'energy-burst';
        burst.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, var(--electric-blue), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: energy-burst 0.8s ease-out forwards;
            pointer-events: none;
        `;
        
        this.element.appendChild(burst);
        
        setTimeout(() => {
            burst.remove();
        }, 800);
    }
}

// ===== HOLOGRAM EFFECT ===== //
class HologramEffect {
    constructor(element) {
        this.element = element;
        this.scanLines = [];
        this.init();
    }
    
    init() {
        this.createScanLines();
        this.startEffect();
    }
    
    createScanLines() {
        for (let i = 0; i < 3; i++) {
            const scanLine = document.createElement('div');
            scanLine.className = 'hologram-scan-line';
            scanLine.style.cssText = `
                position: absolute;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg, transparent, var(--electric-blue), transparent);
                animation: scan-lines ${2 + i}s linear infinite;
                animation-delay: ${i * 0.5}s;
                opacity: 0.7;
            `;
            
            this.element.appendChild(scanLine);
            this.scanLines.push(scanLine);
        }
    }
    
    startEffect() {
        this.element.style.position = 'relative';
        this.element.style.overflow = 'hidden';
        
        // Add holograma flicker
        setInterval(() => {
            if (Math.random() < 0.1) {
                this.element.style.opacity = Math.random() * 0.3 + 0.7;
                setTimeout(() => {
                    this.element.style.opacity = '1';
                }, 50);
            }
        }, 100);
    }
}

// ===== NEURAL NETWORK VISUALIZATION ===== //
class NeuralNetwork {
    constructor(container) {
        this.container = container;
        this.nodes = [];
        this.connections = [];
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createNodes();
        this.createConnections();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;
        
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createNodes() {
        const nodeCount = 15;
        
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 2,
                pulse: Math.random() * Math.PI * 2
            });
        }
    }
    
    createConnections() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < 150) {
                    this.connections.push({
                        nodeA: this.nodes[i],
                        nodeB: this.nodes[j],
                        strength: 1 - (distance / 150)
                    });
                }
            }
        }
    }
    
    getDistance(nodeA, nodeB) {
        const dx = nodeA.x - nodeB.x;
        const dy = nodeA.y - nodeB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update e draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.pulse += 0.05;
            
            if (node.x <= 0 || node.x >= this.canvas.width) node.vx *= -1;
            if (node.y <= 0 || node.y >= this.canvas.height) node.vy *= -1;
            
            const pulseSize = node.radius + Math.sin(node.pulse) * 2;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00d4ff';
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(0, 212, 255, 0.1)';
            this.ctx.fill();
        });
        
        // Draw connection
        this.connections.forEach(connection => {
            const distance = this.getDistance(connection.nodeA, connection.nodeB);
            if (distance < 150) {
                this.ctx.beginPath();
                this.ctx.moveTo(connection.nodeA.x, connection.nodeA.y);
                this.ctx.lineTo(connection.nodeB.x, connection.nodeB.y);
                this.ctx.strokeStyle = `rgba(0, 212, 255, ${connection.strength * 0.3})`;
                this.ctx.lineWidth = connection.strength * 2;
                this.ctx.stroke();
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== QUANTUM FIELD EFFECT ===== //
class QuantumField {
    constructor(element) {
        this.element = element;
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createQuantumParticles();
        this.animate();
    }
    
    createQuantumParticles() {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'quantum-particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? '#00d4ff' : '#ff0040'};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.8 + 0.2};
                pointer-events: none;
            `;
            
            particle.quantum = {
                phase: Math.random() * Math.PI * 2,
                frequency: Math.random() * 0.02 + 0.01,
                amplitude: Math.random() * 20 + 10
            };
            
            this.element.appendChild(particle);
            this.particles.push(particle);
        }
    }
    
    animate() {
        this.particles.forEach(particle => {
            particle.quantum.phase += particle.quantum.frequency;
            
            const x = parseFloat(particle.style.left);
            const y = parseFloat(particle.style.top);
            
            const offsetX = Math.sin(particle.quantum.phase) * particle.quantum.amplitude;
            const offsetY = Math.cos(particle.quantum.phase * 1.5) * particle.quantum.amplitude;
            
            particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            particle.style.opacity = (Math.sin(particle.quantum.phase * 2) + 1) * 0.4 + 0.2;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===== INITIALIZATION ===== //
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedAnimations();
});

function initAdvancedAnimations() {
    // Inicializa Glitch effects
    const glitchElements = document.querySelectorAll('.glitch-text, .glitch-name');
    glitchElements.forEach(element => {
        const glitch = new GlitchEffect(element, {
            intensity: 0.5,
            speed: 150,
            duration: 0
        });
        
        // Start glitch
        element.addEventListener('mouseenter', () => glitch.start());
        element.addEventListener('mouseleave', () => glitch.stop());
    });
    
    const particleContainers = document.querySelectorAll('.floating-particles');
    particleContainers.forEach(container => {
        new ParticleSystem(container, {
            count: 25,
            speed: 0.5,
            size: 3,
            color: '#00d4ff'
        });
    });
    
    const portalElement = document.querySelector('.digital-portal');
    if (portalElement) {
        new DigitalPortal(portalElement);
    }
    
    const hologramElements = document.querySelectorAll('.profile-frame');
    hologramElements.forEach(element => {
        new HologramEffect(element);
    });
    
    const neuralContainer = document.querySelector('.about-visual');
    if (neuralContainer) {
        new NeuralNetwork(neuralContainer);
    }
    
    const quantumElements = document.querySelectorAll('.quantum-fluctuation');
    quantumElements.forEach(element => {
        new QuantumField(element);
    });
}

// ===== CSS ANIMATIONS FOR JAVASCRIPT EFFECTS ===== //
const additionalStyles = `
@keyframes energy-burst {
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

.dynamic-particle {
    transition: opacity 0.1s ease;
}

.quantum-particle {
    transition: transform 0.1s ease, opacity 0.1s ease;
}

.energy-burst {
    z-index: 10;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

