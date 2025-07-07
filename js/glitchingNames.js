

document.addEventListener('DOMContentLoaded', () => {
    const names = [
         "Kantheus",
  "Platonin",
  "Aristox",
  "Socranis",
  "Nietzvar",
  "Sartrex",
  "Beauvira",
  "Jungar",
  "Foucros",
  "Camuson",
  "Sundarien",
  "Mariath",
  "Shepherdyx",
  "Dombros",
  "Oroskan",
  "Lauren",
  "Pyramis",
  "Solidus",
  "Bigax",
  "Ocelon",
  "Liquis",
  "Otakar",
  "Raidex",
  "Quietra",
  "Venomis",
  "Jessen",
  "Dylor",
  "Directan",
  "Ahtiel",
  "Marshol",
  "Porterix",
  "Fragilux",
  "Diehardon",
  "Higson",
  "Ungari",
  "Mamanis",
  "Dnyaarox",
  "Blakhar",
  "Niethel",
  "Sartrix",
  "Lispira",
  "Jungis",
  "Nyxar",
  "Obsidion",
  "Abyssar",
  "Echoith",
  "Cryptal",
  "Zenithar",
  "Syntarix",
  "Etherion",
  "Veilbor",
  "Cthorin",
  "Vesperon",
  "Runebrix",
  "Noctrix",
  "Dunyar",
  "Oblivis",
  "Astronix",
  "Phantor",
  "Hexvel",
  "Liminox",
  "Nebulor",
  "Cipherin",
  "Wraithor",
  "Nocturon",
  "Vespar",
  "Echorun",
  "Runeblade",
  "Shadowen",
  "Spectril",
  "Nightrix",
  "Dreamfrak",
  "Fluxvel",
  "Shadebor",
  "Auralith",
  "Necroven",
  "Ghostwir",
  "Nightbloom",
  "Echoshard",
  "Cryptalis",
  "Runeveil",
  "Dnyaron",
  "Blakpul"
    ];

    const glitchingNamesCanvas = document.querySelector('.glitching-names-canvas');

    if (!glitchingNamesCanvas) {
        console.error("Elemento '.glitching-names-canvas' não encontrado no DOM. Certifique-se de que ele existe no seu HTML.");
        return;
    }

    function createGlitchingName() {
        const randomName = names[Math.floor(Math.random() * names.length)];
        const nameElement = document.createElement('div');
        nameElement.classList.add('glitching-name');
        nameElement.textContent = randomName;

        
        
        
        const initialTop = 20 + Math.random() * 60; 
        const initialLeft = 20 + Math.random() * 60; 

        nameElement.style.top = `${initialTop}%`;
        nameElement.style.left = `${initialLeft}%`;

        
        
        nameElement.style.setProperty('--initial-y', `${initialTop}%`);


        glitchingNamesCanvas.appendChild(nameElement);

        const duration = Math.random() * 4 + 3; 
        const delay = Math.random() * 0.5; 

        nameElement.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;

        
        const moveAnimation = Math.random() < 0.5 ? 'moveAndFadeUp' : 'moveAndFadeDown';

        
        nameElement.style.animation = `
            ${moveAnimation} ${duration}s ease-out ${delay}s forwards,
            glitch ${Math.random() * 0.4 + 0.1}s infinite linear,
            text-glitch-on ${Math.random() * 0.4 + 0.1}s infinite alternate
        `;

        
        const totalRemovalTime = (duration + delay + 0.5) * 1000;
        setTimeout(() => {
            if (nameElement && nameElement.parentNode) {
                nameElement.remove();
            }
        }, totalRemovalTime);

        
        nameElement.addEventListener('animationend', (event) => {
            if (event.animationName === 'moveAndFadeUp' || event.animationName === 'moveAndFadeDown') {
                if (nameElement && nameElement.parentNode) {
                    nameElement.remove();
                }
            }
        });
    }

    
    setInterval(createGlitchingName, 800);

    
    function applyDynamicTextGlitch() {
        const allNames = document.querySelectorAll('.glitching-name');
        allNames.forEach(name => {
            if (Math.random() < 0.08) {
                const originalText = name.textContent;
                let glitchedText = '';
                for (let i = 0; i < originalText.length; i++) {
                    if (Math.random() < 0.2) {
                        glitchedText += String.fromCharCode(originalText.charCodeAt(i) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
                    } else {
                        glitchedText += originalText[i];
                    }
                }
                name.textContent = glitchedText;

                setTimeout(() => {
                    name.textContent = originalText;
                }, 80);
            }
        });
    }

    
    setInterval(applyDynamicTextGlitch, 150);
});