document.addEventListener('DOMContentLoaded', () => {

        const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');
    if (loader && mainContent) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.addEventListener('transitionend', () => {
                loader.style.display = 'none';
                mainContent.style.display = 'block';
            }, { once: true });
        }, 3500);
    }

        const sections = document.querySelectorAll('.text-section');
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        sections.forEach(section => observer.observe(section));
    }

        const audioControl = document.getElementById('audio-control');
    const ambientSound = document.getElementById('ambient-wind');
    const sfxSources = [
        document.getElementById('sfx-metal'),
        document.getElementById('sfx-heartbeat'),
        document.getElementById('sfx-breath'),
        document.getElementById('sfx-breath2'),
        document.getElementById('sfx-breath3'),
        document.getElementById('sfx-breath4'),
        document.getElementById('sfx-breath5'),
        document.getElementById('sfx-breath6'),
    ];
    if (audioControl && ambientSound && sfxSources.every(s => s)) {
        let isPlaying = false;
        let sfxInterval;
        ambientSound.volume = 0.2;
        sfxSources.forEach(sfx => { sfx.volume = 0.3; });

        function playRandomSfx() {
            const sfx = sfxSources[Math.floor(Math.random() * sfxSources.length)];
            sfx.play();
        }

        audioControl.addEventListener('click', () => {
            if (isPlaying) {
                ambientSound.pause();
                clearInterval(sfxInterval);
                audioControl.textContent = 'SOUND OFF';
            } else {
                ambientSound.play().catch(e => console.error("Audio play failed:", e));
                sfxInterval = setInterval(playRandomSfx, Math.random() * 7000 + 8000);
                audioControl.textContent = 'SOUND ON';
            }
            isPlaying = !isPlaying;
        });
    }

                const langSwitcher = document.getElementById('lang-switcher');
    const htmlEl = document.documentElement;

    const translations = {
        loaderText: {
            pt: "A Man From Another World",
            en: "A Man From Another World"
        },
        soundButtonTitle: {
            pt: "Ativar/Desativar som",
            en: "Enable/Disable sound"
        },
        text1: {
            pt: "Eles veem o <span class='glitch-text' data-text='reflexo'>reflexo</span> no metal, mas não a ferrugem que corrói por dentro. Cada passo nesta terra devastada é um eco. Um eco de quem eu fui, um fantasma de quem me tornei. A loucura não é um abismo. É um lar — frio, mas honesto.",
            en: "They see the <span class='glitch-text' data-text='reflection'>reflection</span> in the metal, but not the rust that corrodes inside. Every step on this devastated land is an echo. An echo of who I was, a ghost of who I became. Madness is not an abyss. It’s a home — cold, but honest."
        },
        text2: {
            pt: "A memória é uma faca de dois gumes, cravada na alma.<br> Ela sangra <span class='glitch-text' data-text='nostalgia'>nostalgia</span> e dor, em gotas que mancham o presente.",
            en: "Memory is a double-edged sword, lodged deep in the soul.<br>It bleeds <span class='glitch-text' data-text='nostalgia'>nostalgia</span> and pain, in drops that stain the present."
        },
        text3: {
            pt: "Eu não fujo da escuridão.<br> Eu a convido para dançar, um passo de cada vez, no salão vazio da minha mente.<br> Cada batida do coração é o ritmo dessa <span class='glitch-text' data-text='valsa'>valsa</span> macabra.",
            en: "I do not flee the darkness.<br> I invite it to dance, one step at a time, in the empty ballroom of my mind.<br> Every heartbeat is the rhythm of this <span class='glitch-text' data-text='waltz'>waltz</span> macabre."
        },
        text4: {
            pt: "Cada palavra não dita é um <span class='glitch-text' data-text='tiro'>tiro</span> que ecoa no escuro.<br> Existem dores que não se curam. A gente só organiza pra não transbordar.",
            en: "Every unspoken word is a <span class='glitch-text' data-text='shot'>shot</span> that echoes in the dark.<br> There are wounds that do not heal. We just organize them so they don’t overflow."
        },
        text5: {
            pt: "Eu não estou <span class='glitch-text' data-text='dead'>dead</span><br> Eu não estou <span class='glitch-text' data-text='dead'>dead</span><br> O que está <span class='glitch-text' data-text='dead'>dead</span> está <span class='glitch-text' data-text='dead'>dead</span><br> O que está <span class='glitch-text' data-text='dead'>dead</span> está <span class='glitch-text' data-text='dead'>dead</span><br>",
            en: "I’m not <span class='glitch-text' data-text='dead'>dead</span><br> I’m not <span class='glitch-text' data-text='dead'>dead</span><br> What’s <span class='glitch-text' data-text='dead'>dead</span> is <span class='glitch-text' data-text='dead'>dead</span><br> What’s <span class='glitch-text' data-text='dead'>dead</span> is <span class='glitch-text' data-text='dead'>dead</span><br>"
        },
        text6: {
            pt: "Aqui não tem <span class='glitch-text' data-text='final'>final</span> feliz.<br> Só silêncio, poeira... e o que sobrou de mim.",
            en: "There is no <span class='glitch-text' data-text='happy'>happy</span> ending here.<br> Only silence, dust... and what’s left of me."
        },
        returnLink: {
            pt: "[ RETORNAR AO SILÊNCIO ]",
            en: "[ RETURN TO SILENCE ]"
        },
                                quoteNietzscheNew: {
            pt: `Eu caminho na solidão para não beber da cisterna de todos. Quando estou entre a multidão, vivo como a multidão, e não penso como realmente penso; depois de um tempo, parece que querem me banir de mim mesmo e roubar minha alma. <footer>— Friedrich Nietzsche</footer>`,
            en: `I go in solitude, so as not to drink out of everybody’s cistern. When I am among the many I live as the many do, and I do not think as I really think; after a time it always seems as if they want to banish me from myself and rob me of my soul. <footer>— Friedrich Nietzsche</footer>`
        },
        quoteBlakeNew: {
            pt: `Ver um mundo em um grão de areia,<br>E um céu em uma flor selvagem,<br>Segurar o infinito na palma da mão,<br>E a eternidade em uma hora. <footer>— William Blake</footer>`,
            en: `To see a world in a grain of sand, And a heaven in a wild flower, Hold infinity in the palm of your hand, And eternity in an hour <footer>— William Blake</footer>`
        }
                            };

    let currentLang = 'pt';

    function switchLanguage(lang) {
        document.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            if (translations[key] && translations[key][lang]) {
                if (key === 'soundButtonTitle') {
                    el.setAttribute('title', translations[key][lang]);
                } else {
                    el.innerHTML = translations[key][lang];
                }
            }
        });
        htmlEl.setAttribute('lang', lang === 'pt' ? 'pt-br' : 'en');
    }

    langSwitcher.addEventListener('click', () => {
        currentLang = (currentLang === 'pt') ? 'en' : 'pt';
        langSwitcher.textContent = (currentLang === 'pt') ? 'PT-BR' : 'EN-US';
        switchLanguage(currentLang);
    });

        switchLanguage(currentLang);
});
