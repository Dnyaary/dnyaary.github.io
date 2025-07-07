

document.addEventListener('DOMContentLoaded', function() {
	const terminalWrapper = document.getElementById('terminal-wrapper');
	if (terminalWrapper) {
		Game.init('three-js-canvas', 'game-ui-overlay');
		Portal.init('surreal-browser', 'embedded-iframe', 'browser-url-input', 'browser-refresh-btn');
		initTerminal();
	}
});

function initTerminal() {
	const terminalWrapper = document.getElementById('terminal-wrapper');
	const terminalOutput = document.getElementById('terminal-output');
	const terminalInput = document.getElementById('terminal-input');
	const terminalPrompt = document.getElementById('terminal-prompt');
    const inputMirror = document.getElementById('input-mirror');
	const embeddedContentContainer = document.getElementById('embedded-content-container');
	const backToTerminalBtn = document.getElementById('back-to-terminal-btn');
	const threeJsCanvas = document.getElementById('three-js-canvas');
	const gameUiOverlay = document.getElementById('game-ui-overlay'); 
	const surrealBrowser = document.getElementById('surreal-browser');

	let history = [];
	let historyIndex = -1;
	let currentLang = document.documentElement.lang.startsWith('pt') ? 'pt' : 'en';

	const commands = {
        'pt': {
            'help': `Comandos disponíveis:

 Exploração:
  sobre, arte, jogos, contato, projetos, iniciar jogo, abrir portal

 Sistema:
  clear, help, whoami, ls, ping, dog readme.txt, shutdown

 Hackerman:
  sudo, format, auto destruir, hackear matrix, abrir wormhole, ligar luz, matrix

 Filosofia:
  filosofar, sentido_da_vida, existencia, pensar, meditar, refletir

 Zoeiras:
  zoeira, cafe, me elogia, bau do tesouro, dormir, comando secreto, tempo, rickroll
`,

            'sobre': 'Daniel "Dnyaary" Carvalho: Arquiteto digital, contador de histórias e artista. Criador de mundos no limiar entre realidade e imaginação.',
            'arte': 'Para ver minhas criações artísticas, visite o portfólio no ArtStation: https://www.artstation.com/dnyaary',
            'jogos': 'Projetos de jogos HTML estão em desenvolvimento. Fique atento para futuras realidades interativas!',
            'contato': 'Para entrar em contato, envie uma mensagem via formulário na página de contato ou conecte-se nas redes sociais.',
            'clear': '', 
            'whoami': 'Você está falando com Dnyaary, o arquiteto do vazio digital.',
            'ls': 'readme.txt\nprojetos/\nsegredos_do_void/',
            'ping': 'Pinging 127.0.0.1 (localhost) with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nPing statistics for 127.0.0.1:\n    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = 0ms, Maximum = 0ms, Average = 0ms',
            'dog readme.txt': 'Bem-vindo ao terminal de Dnyaary. Este é um espaço para explorar as fronteiras da realidade e da imaginação. Digite "help" para mais informações.',
            'sudo rm -rf /': 'Permissão negada. Tentativa de exclusão de sistema detectada. Acesso registrado. Tenha mais cuidado.',
            'format c:': 'Operação não suportada. Este não é um sistema operacional convencional. Tente algo mais... existencial.',
            'zoeira': 'A zoeira nunca tem fim. Mas este terminal tem limites. Tente algo mais produtivo.',
            'shutdown': 'Desligamento iniciado. Adeus, explorador. (Brincadeira, você não pode me desligar assim!)',
            'projetos': 'Para ver todos os projetos, visite a seção de Artes.',
            'segredos_do_void': 'Ainda não é o momento de revelar os segredos do vazio. Continue explorando.',
            'iniciar jogo': '', 
            'abrir portal': '', 
            'cafe': 'Sistema abastecido com cafeína. Produtividade em 120%.',
            'hackear matrix': 'Conexão estabelecida com a Matriz. Você agora enxerga o código.',
            'me elogia': 'Você é incrível. Inteligente, criativo e... tá falando com um terminal. Mas valeu a tentativa!',
            'bau do tesouro': 'Você encontrou um baú! Dentro há... nada. Era só uma metáfora.',
            'dormir': 'Dormir é para os fracos. Continue explorando o vazio.',
            'comando secreto': 'Parabéns! Você encontrou um comando que nem eu sabia que existia.',
            'abrir wormhole': 'Gerando fenda espaço-temporal... Aviso: pode causar vertigem ou epifanias.',
            'tempo': 'O tempo é uma ilusão. O agora é tudo que existe.',
            'rickroll': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ — você pediu por isso.',
            'auto destruir': 'Iniciando autodestruição em 3... 2... 1... Ok, brincadeira.',
            'ligar luz': 'Acendendo luzes do vazio... Nada aconteceu.',
            'matrix': 'Você toma a pílula vermelha. Agora tudo vai mudar.',
            'filosofar': '“O universo não é obrigado a fazer sentido para você.” — Neil deGrasse Tyson',
            'sentido_da_vida': '42. (Mas isso você já sabia.)',
            'existencia': 'Penso, logo existo. Mas será que pensar demais também não enlouquece?',
            'pensar': 'Quanto mais você sabe, mais você percebe o quanto não sabe.',
            'meditar': 'Feche os olhos. Respire. O vazio também tem algo a dizer.',
            'refletir': 'Você está num terminal. Procurando respostas. E se as perguntas forem o verdadeiro caminho?',


        },
        'en': {
            'help': `Available commands:

 Exploration:
  about, art, games, contact, projects, start game, open portal

 System:
  clear, help, whoami, ls, ping, dog readme.txt, shutdown

 Hackerman:
  sudo, format, self destruct, hack matrix, open wormhole, turn on light, matrix

 Philosophy:
  philosophy, meaning_of_life, existence, contemplate, meditate, reflect

 Fun:
  prank, coffee, compliment me, treasure chest, sleep, secret command, time, rickroll
`,

            'about': 'Daniel "Dnyaary" Carvalho: Digital architect, storyteller, and artist. World-builder at the threshold between reality and imagination.',
            'art': 'To view my artistic creations, visit the ArtStation portfolio: https://www.artstation.com/dnyaary',
            'games': 'HTML game projects are under development. Stay tuned for future interactive realities!',
            'contact': 'To get in touch, send a message via the contact form or connect on social media.',
            'clear': '', 
            'whoami': 'You are speaking with Dnyaary, the architect of the digital void.',
            'ls': 'readme.txt\nprojects/\nvoid_secrets/',
            'ping': 'Pinging 127.0.0.1 (localhost) with 32 bytes of data:\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nReply from 127.0.0.1: bytes=32 time<1ms TTL=64\nPing statistics for 127.0.0.1:\n    Packets: Sent = 3, Received = 3, Lost = 0 (0% loss),\nApproximate round trip times in milli-seconds:\n    Minimum = 0ms, Maximum = 0ms, Average = 0ms',
            'dog readme.txt': 'Welcome to Dnyaary\'s terminal. This is a space to explore the boundaries of reality and imagination. Type "help" for more information.',
            'sudo rm -rf /': 'Permission denied. System deletion attempt detected. Access logged. Be more careful.',
            'format c:': 'Operation not supported. This is not a conventional operating system. Try something more... existential.',
            'prank': 'The prank never ends. But this terminal has limits. Try something more productive.',
            'shutdown': 'Shutdown initiated. Goodbye, explorer. (Just kidding, you can\'t shut me down like that!)',
            'projects': 'To view all projects, visit the Arts section.',
            'void_secrets': 'It is not yet time to reveal the secrets of the void. Keep exploring.',
            'start game': '', 
            'open portal': '', 
            'coffee': 'System infused with caffeine. Productivity boosted to 120%.',
            'hack matrix': 'Linking to the Matrix... You can now see the code.',
            'compliment me': 'You are awesome. Smart, creative and... talking to a terminal. Still, good job!',
            'treasure chest': 'You found a chest! Inside... nothing. Just a metaphor.',
            'sleep': 'Sleep is for mortals. Keep exploring the void.',
            'secret command': 'Congrats! You found a command not even I knew existed.',
            'open wormhole': 'Opening space-time rift... Warning: may cause vertigo or revelations.',
            'time': 'Time is an illusion. The now is all that exists.',
            'rickroll': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ — gotcha.',
            'self destruct': 'Initiating self-destruction in 3... 2... 1... Just kidding.',
            'turn on light': 'Turning on the void lights... Nothing happened.',
            'matrix': 'You take the red pill. Everything is about to change.',
            'philosophy': '“The universe is under no obligation to make sense to you.” — Neil deGrasse Tyson',
            'meaning_of_life': '42. But you already knew that.',
            'existence': 'I think, therefore I am. But do you exist beyond thought?',
            'contemplate': 'The more you know, the more you realize how little you understand.',
            'meditate': 'Close your eyes. Breathe. Even the void has something to say.',
            'reflect': 'You are in a terminal... searching for answers. But maybe the questions are the real path.',


        }
    };
    
    const banner = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣶⣶⣶⣶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀ 
⠀⠀⠀⠀⠀⠀⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀ 
⠀⠀⣠⣴⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⣵⣄⠀⠀⠀ 
⠀⢾⣻⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⡀⠀ 
⠀⠸⣽⣻⠃⣿⡿⠋⣉⠛⣿⣿⣿⣿⣿⣿⣿⣿⣏⡟⠉⡉⢻⣿⡌⣿⣳⡥⠀ 
⠀⢜⣳⡟⢸⣿⣷⣄⣠⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣤⣠⣼⣿⣇⢸⢧⢣⠀ 
⠀⠨⢳⠇⣸⣿⣿⢿⣿⣿⣿⣿⡿⠿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⠀⡟⢆⠀ 
⠀⠀⠈⠀⣾⣿⣿⣼⣿⣿⣿⣿⡀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣽⣿⣿⠐⠈⠀⠀ 
⠀⢀⣀⣼⣷⣭⣛⣯⡝⠿⢿⣛⣋⣤⣤⣀⣉⣛⣻⡿⢟⣵⣟⣯⣶⣿⣄⡀⠀ 
⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣶⣾⣶⣶⣴⣾⣿⣿⣿⣿⣿⣿⢿⣿⣿⣧ 
⣿⣿⣿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠿⣿⡿`;

    function initialize() {
        terminalOutput.innerHTML = '';
        appendOutput(banner, 'banner');
        appendOutput(`VOIDDOG_SYSTEM: ${currentLang === 'pt' ? 'O DESCONHECIDO ESTÁ OUVINDO. Digite \'help\' para iniciar sua jornada, ou pressione \'Tab\' para revelar todos os comandos que o vazio permite.' : 'THE UNKNOWN IS LISTENING. Type \'help\' to begin exploring, or press \'Tab\' to unveil every command this void can offer.'}`, 'info');
        terminalInput.focus();
    }

	terminalInput.addEventListener('keydown', function(e) {
		if (e.key === 'Enter') {
			const command = terminalInput.value.trim();
			appendOutput(terminalPrompt.textContent + ' ' + terminalInput.value, 'input-line');
			if (command !== '') {
				history.unshift(command);
				historyIndex = -1;
				processCommand(command);
			}
			terminalInput.value = '';
            inputMirror.textContent = '';
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (history.length > 0 && historyIndex < history.length - 1) {
				historyIndex++;
				terminalInput.value = history[historyIndex];
				inputMirror.textContent = terminalInput.value;
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				terminalInput.value = history[historyIndex];
				inputMirror.textContent = terminalInput.value;
			} else {
				historyIndex = -1;
				terminalInput.value = '';
				inputMirror.textContent = '';
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			const currentInput = terminalInput.value.toLowerCase();
			const availableCommands = Object.keys(commands[currentLang]);
			const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));
			if (matches.length === 1) {
				terminalInput.value = matches[0];
				inputMirror.textContent = terminalInput.value;
			} else if (matches.length > 1) {
				appendOutput(terminalPrompt.textContent + ' ' + currentInput);
				appendOutput(matches.join('    '), 'info');
			}
		}
	});

    terminalInput.addEventListener('input', () => { inputMirror.textContent = terminalInput.value; });
    backToTerminalBtn.addEventListener('click', showTerminal);
    terminalWrapper.addEventListener('click', () => terminalInput.focus());

    function showEmbeddedContent(mode) {
        terminalWrapper.classList.add('hidden');
        embeddedContentContainer.classList.remove('hidden');
        if (mode === 'game') {
            surrealBrowser.style.display = 'none';
            threeJsCanvas.style.display = 'block';
            gameUiOverlay.style.display = 'flex';
            Game.startGame(currentLang);
        } else if (mode === 'portal') {
            threeJsCanvas.style.display = 'none';
            gameUiOverlay.style.display = 'none';
            surrealBrowser.style.display = 'flex';
            Portal.openPortal(currentLang);
        }
    }

    function showTerminal() {
        Game.stopGame();
        Portal.hidePortal();
        embeddedContentContainer.classList.add('hidden');
        terminalWrapper.classList.remove('hidden');
        terminalInput.focus();
    }

    function processCommand(command) {
		const lowerCommand = command.toLowerCase();
		if (lowerCommand === 'iniciar jogo' || lowerCommand === 'start game') { showEmbeddedContent('game'); }
        else if (lowerCommand === 'abrir portal' || lowerCommand === 'open portal') { showEmbeddedContent('portal'); }
        else if (lowerCommand === 'clear') { initialize(); }
        else {
			let response = commands[currentLang][lowerCommand] || `Comando não reconhecido: '${command}'`;
            let responseType = commands[currentLang][lowerCommand] !== undefined ? 'output' : 'error';
			appendOutput(response, responseType);
		}
    }
    
    function appendOutput(text, type = 'output') {
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;

        if (type === 'input-line' || type === 'banner') {
            line.textContent = text;
            terminalOutput.appendChild(line);
        } else {
            terminalOutput.appendChild(line);
            let i = 0;
            const typingInterval = setInterval(() => {
                if (i < text.length) {
                    line.textContent += text.charAt(i);
                    i++;
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                } else {
                    clearInterval(typingInterval);
                }
            }, 25);
        }
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    initialize();
}