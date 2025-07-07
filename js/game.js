

const Game = {
    
    scene: null, camera: null, renderer: null, controls: null, animationFrameId: null, clock: null,
    
    
    player: {
        velocity: new THREE.Vector3(), direction: new THREE.Vector3(),
        shootCooldown: 0, fireRate: 0.2, powerUpTimeout: null, health: 3,
        isDashing: false, dashCooldown: 0, dashPower: 80, dashDuration: 0.2,
        isReloading: false, ammo: 20, clipSize: 20, reloadTime: 1.5,
        isTakingDamage: false, shakeTime: 0,
        shakeOffset: new THREE.Vector3(0, 0, 0),
        bulletDamage: 2, 
        currentLang: 'en'
    },
    
    
    input: { moveForward: false, moveBackward: false, moveLeft: false, moveRight: false },
    
    
    projectiles: [], enemies: [], powerUps: [], particles: [], enemyProjectiles: [],
    
    
    bosses: [], 
    enemySpawner: null,
    gameState: { score: 0, highScore: 0, isGameOver: false, isBossFight: false, combo: 0, comboTimeout: null, BOSS_TRIGGER_SCORE: 5000, bossLevel: 1, canSpawnBoss: true },
    
    
    dom: { canvas: null, uiOverlay: null, scoreElement: null, messageElement: null, healthElement: null, playAgainBtn: null, ammoElement: null, dashBar: null },
    sounds: { shoot: null, explosion: null, powerup: null, hurt: null, dash: null, hitmarker: null, bossSpawn: null, emptyClip: null },
    
    
    listeners: { onKeyDown: null, onKeyUp: null, onMouseDown: null, onWindowResize: null, onCanvasClick: null },

    init: function(canvasId, uiOverlayId) {
        this.dom.canvas = document.getElementById(canvasId);
        this.dom.uiOverlay = document.getElementById(uiOverlayId);
        this.initSounds();
        this.loadHighScore();
    },
    
    initSounds: function() {
        try {
            this.sounds.shoot = new Audio('../sounds/shoot.wav'); this.sounds.shoot.volume = 0.3;
            this.sounds.explosion = new Audio('../sounds/explosion.wav'); this.sounds.explosion.volume = 0.5;
            this.sounds.powerup = new Audio('../sounds/powerup.wav');
            this.sounds.hurt = new Audio('../sounds/hurt.wav'); this.sounds.hurt.volume = 0.7;
            this.sounds.dash = new Audio('../sounds/dash.wav'); this.sounds.dash.volume = 0.6;
            this.sounds.hitmarker = new Audio('../sounds/hitmarker.wav'); this.sounds.hitmarker.volume = 0.4;
            this.sounds.bossSpawn = new Audio('../sounds/boss_spawn.wav');
            this.sounds.emptyClip = new Audio('../sounds/empty_clip.wav');
        } catch(e) { console.warn("Não foi possível carregar os arquivos de áudio."); }
    },

    startGame: function(currentLang) {
        this.player.currentLang = currentLang;
        this.resetState();
        this.initScene();
        this.initUI();
        this.initEventListeners();
        this.spawnEnemies();
        this.animate();
    },

    
    resetState: function() {
        
        if (this.scene) {
            
            this.projectiles.forEach(p => this.scene.remove(p));
            this.enemies.forEach(e => this.scene.remove(e));
            this.powerUps.forEach(pUp => this.scene.remove(pUp));
            this.particles.forEach(pSys => this.scene.remove(pSys));
            this.enemyProjectiles.forEach(ep => this.scene.remove(ep));
            this.bosses.forEach(boss => this.scene.remove(boss));
        }
    
        
        this.projectiles = []; 
        this.enemies = []; 
        this.powerUps = []; 
        this.particles = []; 
        this.enemyProjectiles = [];
        this.bosses = [];
    
        
        this.gameState = { 
            score: 0, 
            highScore: this.gameState.highScore, 
            isGameOver: false, 
            isBossFight: false, 
            combo: 0, 
            comboTimeout: null, 
            BOSS_TRIGGER_SCORE: 5000, 
            bossLevel: 1, 
            canSpawnBoss: true 
        };
    
        
        this.player.velocity.set(0,0,0);
        this.player.direction.set(0,0,0);
        this.player.fireRate = 0.2;
        this.player.health = 3;
        this.player.dashCooldown = 0;
        this.player.isDashing = false;
        this.player.isTakingDamage = false;
        this.player.shakeTime = 0;
        this.player.shakeOffset.set(0,0,0);
        this.player.ammo = this.player.clipSize;
        this.player.isReloading = false;
        
        
        if (this.player.powerUpTimeout) clearTimeout(this.player.powerUpTimeout);
        if (this.gameState.comboTimeout) clearTimeout(this.gameState.comboTimeout);
        if (this.enemySpawner) {
            clearInterval(this.enemySpawner);
            this.enemySpawner = null;
        }
    },

    initScene: function() {
        const container = this.dom.canvas.parentElement;
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x05050a);
        this.scene.fog = new THREE.Fog(0x05050a, 20, 50);
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.dom.canvas, antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.controls = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        this.scene.add(this.controls.getObject());
        this.scene.add(new THREE.AmbientLight(0x666666));
        const dirLight = new THREE.DirectionalLight(0xff4444, 0.5);
        dirLight.position.set(5, 5, 5);
        this.scene.add(dirLight);
        const grid = new THREE.GridHelper(100, 40, 0xff0000, 0x444444);
        grid.material.opacity = 0.3;
        grid.material.transparent = true;
        this.scene.add(grid);
    },

    initUI: function() {
        this.dom.scoreElement = this.dom.uiOverlay.querySelector('#game-score');
        this.dom.messageElement = this.dom.uiOverlay.querySelector('#game-message');
        this.dom.healthElement = this.dom.uiOverlay.querySelector('#game-health');
        this.dom.playAgainBtn = this.dom.uiOverlay.querySelector('#play-again-btn');
        this.dom.ammoElement = this.dom.uiOverlay.querySelector('#ammo-display');
        this.dom.dashBar = this.dom.uiOverlay.querySelector('#dash-cooldown .cooldown-bar-fill');
        const crosshair = document.getElementById('crosshair');
        if(crosshair) crosshair.classList.remove('hidden');
        this.dom.playAgainBtn.classList.add('hidden');
        this.updateScore();
        this.updateHealthUI();
        this.updateAmmoUI();
        this.displayMessage(this.player.currentLang === 'pt' ? 'PURGUE O SISTEMA' : 'PURGE THE SYSTEM', 3000);
    },

    initEventListeners: function() {
        this.listeners.onCanvasClick = () => { if(this.controls && !this.gameState.isGameOver) this.controls.lock() };
        this.dom.canvas.addEventListener('click', this.listeners.onCanvasClick);
        this.listeners.onKeyDown = (e) => this.handleKey(e.code, true);
        this.listeners.onKeyUp = (e) => this.handleKey(e.code, false);
        document.addEventListener('keydown', this.listeners.onKeyDown);
        document.addEventListener('keyup', this.listeners.onKeyUp);
        this.listeners.onMouseDown = (e) => { if (this.controls?.isLocked && e.button === 0) this.shoot(); };
        document.addEventListener('mousedown', this.listeners.onMouseDown);
        this.listeners.onWindowResize = () => { if (!this.renderer) return; const container = this.renderer.domElement.parentElement; const width = container.clientWidth; const height = container.clientHeight; this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height); };
        window.addEventListener('resize', this.listeners.onWindowResize);
    },

    handleKey: function(code, isPressed) {
        switch(code) {
            case 'KeyW': this.input.moveForward = isPressed; break;
            case 'KeyA': this.input.moveLeft = isPressed; break;
            case 'KeyS': this.input.moveBackward = isPressed; break;
            case 'KeyD': this.input.moveRight = isPressed; break;
            case 'ShiftLeft': if (isPressed) this.dash(); break;
            case 'KeyR': if (isPressed) this.reload(); break;
        }
    },
    
    dash: function() {
        if (this.player.dashCooldown > 0) return;
        this.player.isDashing = true;
        this.player.dashCooldown = 2;
        this.sounds.dash?.play();
        const localDirection = new THREE.Vector3(Number(this.input.moveRight) - Number(this.input.moveLeft), 0, Number(this.input.moveForward) - Number(this.input.moveBackward));
        if (localDirection.lengthSq() === 0) { localDirection.z = 1; } else { localDirection.normalize(); }
        this.player.velocity.x = -localDirection.x * this.player.dashPower;
        this.player.velocity.z = -localDirection.z * this.player.dashPower;
        this.camera.fov *= 1.2;
        this.camera.updateProjectionMatrix();
        setTimeout(() => { this.player.isDashing = false; this.camera.fov /= 1.2; this.camera.updateProjectionMatrix(); }, this.player.dashDuration * 1000);
    },

    shoot: function() {
        if (this.player.shootCooldown > 0 || this.player.isReloading) return;
        if (this.player.ammo <= 0) { this.sounds.emptyClip?.play(); this.reload(); return; }
        this.player.ammo--; this.updateAmmoUI(); this.sounds.shoot?.play();
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true }));
        p.damage = this.player.bulletDamage;
        this.camera.getWorldDirection(p.velocity = new THREE.Vector3());
        p.position.copy(this.controls.getObject().position).add(p.velocity.clone().multiplyScalar(0.5));
        p.velocity.multiplyScalar(50);
        this.scene.add(p);
        this.projectiles.push(p);
        this.player.shootCooldown = this.player.fireRate;
    },
    
    reload: function() {
        if (this.player.isReloading || this.player.ammo === this.player.clipSize) return;
        this.player.isReloading = true;
        this.updateAmmoUI();
        setTimeout(() => { this.player.ammo = this.player.clipSize; this.player.isReloading = false; this.updateAmmoUI(); }, this.player.reloadTime * 1000);
    },

    spawnEnemies: function() {
        this.enemySpawner = setInterval(() => {
            if (this.gameState.isGameOver) return;
            const tankChance = Math.min(this.gameState.score / 10000, 0.5);
            let enemy;
            if (Math.random() < tankChance) {
                enemy = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.5), new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0x880000 }));
                enemy.health = 3; enemy.speed = 1.5; enemy.points = 500;
            } else {
                enemy = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xaa0000 }));
                enemy.health = 1; enemy.speed = 2.5; enemy.points = 100;
            }
            const angle = Math.random() * Math.PI * 2; const distance = 35;
            enemy.position.set(this.controls.getObject().position.x + Math.sin(angle) * distance, 1, this.controls.getObject().position.z + Math.cos(angle) * distance);
            this.scene.add(enemy); this.enemies.push(enemy);
        }, 1800);
    },

    spawnPowerUp: function(position) {
        const pUp = new THREE.Mesh(new THREE.TetrahedronGeometry(0.4, 0), new THREE.MeshStandardMaterial({color: 0x00ff00, emissive: 0x00aa00}));
        pUp.position.copy(position); pUp.type = 'rapid-fire';
        this.scene.add(pUp); this.powerUps.push(pUp);
    },

    createExplosion: function(position, color = 0xff4444) {
        const pCount = 50, pGeo = new THREE.BufferGeometry(), posArray = new Float32Array(pCount * 3);
        for(let i=0; i<pCount*3; i++) posArray[i] = (Math.random() - 0.5) * 0.5;
        pGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const pMat = new THREE.PointsMaterial({ size: 0.05, color: color, transparent: true, opacity: 1.0 });
        const pSys = new THREE.Points(pGeo, pMat); pSys.position.copy(position); pSys.velocities = [];
        for(let i=0; i<pCount; i++) pSys.velocities.push(new THREE.Vector3((Math.random()-0.5), (Math.random()-0.5), (Math.random()-0.5)).normalize().multiplyScalar(5));
        this.scene.add(pSys); this.particles.push(pSys);
    },

    spawnBoss: function() {
        if (this.gameState.isBossFight) return;
        this.gameState.isBossFight = true;
        this.sounds.bossSpawn?.play();

        const bossCount = (this.gameState.bossLevel === 3) ? 2 : 1;
        this.displayMessage(`WARNING: ${bossCount > 1 ? 'DUAL' : ''} TITAN SENTINEL LV.${this.gameState.bossLevel} DETECTED`, 4000);

        for (let i = 0; i < bossCount; i++) {
            const bossGeo = new THREE.IcosahedronGeometry(4, 1);
            const bossMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaa00aa, roughness: 0.1, metalness: 0.8, wireframe: true });
            const boss = new THREE.Mesh(bossGeo, bossMat);
            
            const initialX = (bossCount > 1) ? -15 + (i * 30) : 0;
            boss.position.set(initialX, 5, -40);
            
            boss.health = 2 + (20 * this.gameState.bossLevel);
            boss.points = 10000 * this.gameState.bossLevel;
            boss.attackCooldown = 3;
            boss.state = 'entering';
            boss.basePosition = boss.position.clone();
            
            this.scene.add(boss);
            this.bosses.push(boss);
        }
    },

    updateBosses: function(delta) {
        if (this.bosses.length === 0) return;

        this.bosses.forEach((boss, i) => {
            boss.rotation.x += 0.2 * delta;
            boss.rotation.y += 0.2 * delta;

            if (boss.basePosition) {
                const moveSpeed = 0.6;
                const moveRange = 20;
                boss.position.x = boss.basePosition.x + Math.sin(this.clock.getElapsedTime() * moveSpeed + i) * moveRange;
            }

            if (boss.state === 'entering') {
                if (boss.position.z < -25) { boss.position.z += 10 * delta; } else { boss.state = 'attacking'; }
            } else if (boss.state === 'attacking') {
                boss.attackCooldown -= delta;
                if (boss.attackCooldown <= 0) {
                    for (let j = 0; j < 8; j++) { setTimeout(() => this.bossShoot(boss), j * 100); }
                    boss.attackCooldown = Math.max(1.5, 3 - (this.gameState.bossLevel * 0.2));
                }
            }
        });
    },

    bossShoot: function(boss) {
        if (!boss || this.gameState.isGameOver) return;
        const projectile = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }));
        const direction = this.controls.getObject().position.clone().sub(boss.position);
        const spread = 0.3;
        direction.x += (Math.random() - 0.5) * spread;
        direction.y += (Math.random() - 0.5) * spread;
        direction.z += (Math.random() - 0.5) * spread;
        direction.normalize();
        projectile.velocity = direction.multiplyScalar(25);
        projectile.position.copy(boss.position);
        this.scene.add(projectile);
        this.enemyProjectiles.push(projectile);
    },
    
    animate: function() {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
        if (!this.renderer || !this.scene || !this.camera) return;
        const delta = this.clock.getDelta();
        if (this.player.isTakingDamage) this.applyScreenShake(delta);
        this.updatePlayerMovement(delta);
        this.updateParticles(delta);
        this.updateEnemyProjectiles(delta);
        if (this.gameState.isBossFight) this.updateBosses(delta);

        if (this.gameState.isGameOver) {
            this.renderer.render(this.scene, this.camera);
            return;
        }

        if (this.gameState.isBossFight && this.bosses.length === 0) {
            this.endBossFight();
        }

        if (this.player.dashCooldown > 0) this.player.dashCooldown -= delta;
        if (this.player.shootCooldown > 0) this.player.shootCooldown -= delta;
        this.updateCooldownUI();
        this.updateProjectiles(delta);
        this.updateEnemies(delta);
        this.updatePowerUps(delta);
        this.checkCollisions();
        this.renderer.render(this.scene, this.camera);
    },
    
    applyScreenShake: function(delta) {
        this.controls.getObject().position.sub(this.player.shakeOffset);
        if (this.player.shakeTime > 0) {
            const shakeIntensity = 0.1;
            this.player.shakeOffset.set((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
            this.controls.getObject().position.add(this.player.shakeOffset);
            this.player.shakeTime -= delta;
        } else if (this.player.isTakingDamage) {
            this.player.shakeOffset.set(0, 0, 0);
            this.player.isTakingDamage = false;
        }
    },
    
    updateParticles: function(delta) { for (let i = this.particles.length - 1; i >= 0; i--) { const ps = this.particles[i]; const pos = ps.geometry.attributes.position.array; for (let j=0; j<ps.velocities.length; j++) { pos[j*3] += ps.velocities[j].x*delta; pos[j*3+1] += ps.velocities[j].y*delta; pos[j*3+2] += ps.velocities[j].z*delta; } ps.geometry.attributes.position.needsUpdate = true; ps.material.opacity -= 1.5 * delta; if (ps.material.opacity <= 0) { ps.geometry.dispose(); ps.material.dispose(); this.scene.remove(ps); this.particles.splice(i, 1); } } },
    updatePlayerMovement: function(delta) {
        if (!this.controls) return;
        this.player.velocity.x -= this.player.velocity.x * 10 * delta;
        this.player.velocity.z -= this.player.velocity.z * 10 * delta;
        if (!this.player.isDashing) {
            this.player.direction.z = Number(this.input.moveForward) - Number(this.input.moveBackward);
            this.player.direction.x = Number(this.input.moveRight) - Number(this.input.moveLeft);
            this.player.direction.normalize();
            if (this.input.moveForward || this.input.moveBackward) { this.player.velocity.z -= this.player.direction.z * 40 * delta; }
            if (this.input.moveLeft || this.input.moveRight) { this.player.velocity.x -= this.player.direction.x * 40 * delta; }
        }
        if (this.controls.isLocked) {
            this.controls.moveRight(-this.player.velocity.x * delta);
            this.controls.moveForward(-this.player.velocity.z * delta);
        }
    },
    updateProjectiles: function(delta) { for (let i = this.projectiles.length - 1; i >= 0; i--) { const p = this.projectiles[i]; p.position.add(p.velocity.clone().multiplyScalar(delta)); if (p.position.distanceTo(this.controls.getObject().position) > 100) { this.scene.remove(p); this.projectiles.splice(i, 1); } } },
    updateEnemies: function(delta) { this.enemies.forEach(e => { if (Math.random() > 0.95) e.scale.set(1.5,1.5,1.5); else e.scale.set(1,1,1); const dir = this.controls.getObject().position.clone().sub(e.position).normalize(); e.position.add(dir.multiplyScalar(e.speed * delta)); }); },
    updateEnemyProjectiles: function(delta) { for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) { const ep = this.enemyProjectiles[i]; ep.position.add(ep.velocity.clone().multiplyScalar(delta)); if (ep.position.distanceTo(this.controls.getObject().position) > 100) { this.scene.remove(ep); this.enemyProjectiles.splice(i, 1); } } },
    updatePowerUps: function(delta) { for (let i = this.powerUps.length - 1; i >= 0; i--) { const p = this.powerUps[i]; p.rotation.y += 2 * delta; p.rotation.x += 1 * delta; if (p.position.distanceTo(this.controls.getObject().position) < 1.5) { this.activatePowerUp(p.type); this.scene.remove(p); this.powerUps.splice(i, 1); } } },
    activatePowerUp: function(type) { this.sounds.powerup?.play(); if (type === 'rapid-fire') { this.player.fireRate = 0.05; this.displayMessage('RAPID FIRE ACTIVATED', 2000); if (this.player.powerUpTimeout) clearTimeout(this.player.powerUpTimeout); this.player.powerUpTimeout = setTimeout(() => { this.player.fireRate = 0.2; this.displayMessage('Rapid Fire Deactivated', 1000); }, 10000); } },

    checkCollisions: function() {
        const playerPosition = this.controls.getObject().position;
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            if (!p) continue;
            let projectileRemoved = false;
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies[j];
                if (p.position.distanceTo(e.position) < 1.2) {
                    this.sounds.hitmarker?.play();
                    this.scene.remove(p);
                    this.projectiles.splice(i, 1);
                    projectileRemoved = true;
                    e.health -= p.damage;
                    if (e.health <= 0) {
                        this.createExplosion(e.position);
                        this.sounds.explosion?.play();
                        this.scene.remove(e);
                        this.enemies.splice(j, 1);
                        this.gameState.score += e.points;
                        this.handleCombo();
                        this.updateScore();
                        if (Math.random() < 0.15) this.spawnPowerUp(e.position);
                    }
                    break;
                }
            }
            if (projectileRemoved) continue;
            for (let b = this.bosses.length - 1; b >= 0; b--) {
                const boss = this.bosses[b];
                if (p.position.distanceTo(boss.position) < 4.0) {
                    this.sounds.hitmarker?.play();
                    this.createExplosion(p.position, 0xffffff);
                    this.scene.remove(p);
                    this.projectiles.splice(i, 1);
                    boss.health -= p.damage;
                    if (boss.health <= 0) {
                        this.createExplosion(boss.position, 0xff00ff);
                        this.sounds.explosion?.play();
                        this.scene.remove(boss);
                        this.gameState.score += boss.points;
                        this.updateScore();
                        this.bosses.splice(b, 1);
                    }
                    break;
                }
            }
        }
        for (let i = this.enemies.length - 1; i >= 0; i--) { if (this.enemies[i].position.distanceTo(playerPosition) < 1.2) { this.scene.remove(this.enemies[i]); this.enemies.splice(i, 1); this.takeDamage(); break; } }
        for (let i = this.enemyProjectiles.length - 1; i >= 0; i--) { if (this.enemyProjectiles[i].position.distanceTo(playerPosition) < 1.0) { this.scene.remove(this.enemyProjectiles[i]); this.enemyProjectiles.splice(i, 1); this.takeDamage(); break; } }
    },

    takeDamage: function() { if (this.player.isTakingDamage) return; this.player.health--; this.sounds.hurt?.play(); this.updateHealthUI(); this.gameState.combo = 0; this.player.isTakingDamage = true; this.player.shakeTime = 0.25; if (this.player.health <= 0) this.gameOver(); },
    handleCombo: function() { this.gameState.combo++; if (this.gameState.comboTimeout) clearTimeout(this.gameState.comboTimeout); this.gameState.comboTimeout = setTimeout(() => { this.gameState.combo = 0; }, 2000); let msg='', pts=0; if (this.gameState.combo === 2) { msg = 'DOUBLE PURGE!'; pts=200; } else if (this.gameState.combo >= 4 && this.gameState.combo < 6) { msg = 'MULTI PURGE!'; pts=500; } else if (this.gameState.combo >= 6) { msg = 'SYSTEM CLEANSED!'; pts=1000; } if (msg) { this.displayMessage(msg, 1500); this.gameState.score += pts; this.updateScore(); } },
    
    endBossFight: function() {
        this.gameState.bossLevel++;
        this.gameState.BOSS_TRIGGER_SCORE += 5000;
        this.gameState.isBossFight = false;
        this.gameState.canSpawnBoss = false;
        this.displayMessage(`TITAN(S) LV.${this.gameState.bossLevel - 1} PURGED. BREATHE.`, 4000);
        this.player.health = 3;
        this.updateHealthUI();
        setTimeout(() => {
            this.gameState.canSpawnBoss = true;
            this.displayMessage("The System is adapting... Get ready.", 3000);
        }, 30000);
    },

    gameOver: function() { this.gameState.isGameOver = true; this.saveHighScore(); clearInterval(this.enemySpawner); this.displayMessage(`FIM DE JOGO | PONTUAÇÃO FINAL: ${this.gameState.score}`, 0); this.dom.playAgainBtn.classList.remove('hidden'); this.dom.playAgainBtn.onclick = () => { this.startGame(this.player.currentLang); }; this.controls.unlock(); },
    updateScore: function() { if(this.gameState.score > this.gameState.highScore) { this.gameState.highScore = this.gameState.score; } if(this.dom.scoreElement) this.dom.scoreElement.textContent = `SCORE: ${this.gameState.score} | HIGH SCORE: ${this.gameState.highScore}`; if (!this.gameState.isBossFight && this.gameState.score >= this.gameState.BOSS_TRIGGER_SCORE && this.gameState.canSpawnBoss) { this.spawnBoss(); } },
    updateHealthUI: function() { if(this.dom.healthElement) this.dom.healthElement.textContent = '♥ '.repeat(Math.max(0, this.player.health)); },
    updateAmmoUI: function() { if (this.dom.ammoElement) { if (this.player.isReloading) { this.dom.ammoElement.textContent = 'RECARREGANDO...'; } else { this.dom.ammoElement.textContent = `MUNIÇÃO: ${this.player.ammo} / ${this.player.clipSize}`; } } },
    updateCooldownUI: function() { if (this.dom.dashBar) { const dashProgress = 1 - (this.player.dashCooldown / 2); this.dom.dashBar.style.width = `${Math.max(0, dashProgress) * 100}%`; } },
    displayMessage: function(msg, duration) { if(!this.dom.messageElement) return; this.dom.messageElement.textContent = msg; this.dom.messageElement.classList.add('active'); if(duration > 0) { setTimeout(() => { if(this.dom.messageElement) this.dom.messageElement.classList.remove('active'); }, duration); } },
    loadHighScore: function() { const storedScore = localStorage.getItem('systemPurgeHighScore'); this.gameState.highScore = storedScore ? parseInt(storedScore, 10) : 0; },
    saveHighScore: function() { localStorage.setItem('systemPurgeHighScore', this.gameState.highScore); },
    
    stopGame: function() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        if (this.enemySpawner) clearInterval(this.enemySpawner);
        document.removeEventListener('keydown', this.listeners.onKeyDown);
        document.removeEventListener('keyup', this.listeners.onKeyUp);
        document.removeEventListener('mousedown', this.listeners.onMouseDown);
        window.removeEventListener('resize', this.listeners.onWindowResize);
        if (this.renderer) this.renderer.domElement.removeEventListener('click', this.listeners.onCanvasClick);
        if (this.controls && this.controls.isLocked) this.controls.unlock();
        this.saveHighScore();
        if(this.dom.playAgainBtn) this.dom.playAgainBtn.classList.add('hidden');
        if (this.renderer) { this.renderer.dispose(); this.renderer = null; }
        if (this.scene) { while(this.scene.children.length > 0) { this.scene.remove(this.scene.children[0]); } this.scene = null; }
        this.resetState();
        this.camera = null; this.controls = null;
    }
};