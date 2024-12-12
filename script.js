class AlpacaGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.highScore = localStorage.getItem('highScore') || '-';
        this.gameActive = false;
        this.isMuted = localStorage.getItem('isMuted') === 'true';

        // DOM Elements
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.startButton = document.getElementById('start-button');
        this.guessInput = document.getElementById('guess-input');
        this.submitButton = document.getElementById('submit-guess');
        this.newGameButton = document.getElementById('new-game');
        this.messageElement = document.getElementById('message');
        this.attemptCount = document.getElementById('attempt-count');
        this.highScoreElement = document.getElementById('high-score');
        this.alpacaElement = document.getElementById('alpaca');
        this.soundButton = document.getElementById('toggle-sound');

        // Sound Effects
        this.bgm = new Audio('https://raw.githubusercontent.com/alparkha/alparkha-number-game/main/sounds/bgm.mp3');
        this.bgm.loop = true;
        this.correctSound = new Audio('https://raw.githubusercontent.com/alparkha/alparkha-number-game/main/sounds/correct.mp3');
        this.wrongSound = new Audio('https://raw.githubusercontent.com/alparkha/alparkha-number-game/main/sounds/wrong.mp3');

        // Event Listeners
        this.startButton.addEventListener('click', () => {
            this.startGame();
            if (!this.isMuted) this.playBGM();
        });
        this.submitButton.addEventListener('click', () => this.checkGuess());
        this.newGameButton.addEventListener('click', () => this.startGame());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });
        this.soundButton.addEventListener('click', () => this.toggleSound());

        // Initialize
        this.updateHighScore();
        this.updateSoundButton();
    }

    startGame() {
        this.targetNumber = Math.floor(Math.random() * 100) + 1;
        this.attempts = 0;
        this.gameActive = true;
        
        this.startScreen.classList.add('hidden');
        this.gameScreen.classList.remove('hidden');
        this.newGameButton.classList.add('hidden');
        
        this.guessInput.value = '';
        this.guessInput.focus();
        this.updateAttempts();
        this.setMessage('1부터 100 사이의 숫자를 입력하세요');
        this.alpacaElement.textContent = '🦙';
    }

    checkGuess() {
        if (!this.gameActive) return;

        const guess = parseInt(this.guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.setMessage('1부터 100 사이의 숫자를 입력하세요!');
            this.shakeAlpaca();
            this.playSound(this.wrongSound);
            return;
        }

        this.attempts++;
        this.updateAttempts();

        if (guess === this.targetNumber) {
            this.gameWon();
            this.playSound(this.correctSound);
        } else {
            const message = guess < this.targetNumber ? 
                '더 큰 숫자예요! ⬆️' : '더 작은 숫자예요! ⬇️';
            this.setMessage(message);
            this.shakeAlpaca();
            this.playSound(this.wrongSound);
        }

        this.guessInput.value = '';
        this.guessInput.focus();
    }

    gameWon() {
        this.gameActive = false;
        this.setMessage('🎉 정답입니다! 🎉');
        this.alpacaElement.textContent = '🦙✨';
        this.newGameButton.classList.remove('hidden');
        
        if (this.highScore === '-' || this.attempts < this.highScore) {
            this.highScore = this.attempts;
            localStorage.setItem('highScore', this.attempts);
            this.updateHighScore();
        }
    }

    toggleSound() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('isMuted', this.isMuted);
        
        if (this.isMuted) {
            this.stopBGM();
            this.soundButton.textContent = '🔈';
            this.soundButton.classList.add('muted');
        } else {
            if (this.gameActive) this.playBGM();
            this.soundButton.textContent = '🔊';
            this.soundButton.classList.remove('muted');
        }
    }

    updateSoundButton() {
        if (this.isMuted) {
            this.soundButton.textContent = '🔈';
            this.soundButton.classList.add('muted');
        } else {
            this.soundButton.textContent = '🔊';
            this.soundButton.classList.remove('muted');
        }
    }

    playBGM() {
        if (!this.isMuted) {
            this.bgm.play().catch(e => console.log('BGM autoplay prevented'));
        }
    }

    stopBGM() {
        this.bgm.pause();
        this.bgm.currentTime = 0;
    }

    playSound(sound) {
        if (!this.isMuted) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log('Sound play prevented'));
        }
    }

    setMessage(message) {
        this.messageElement.textContent = message;
    }

    updateAttempts() {
        this.attemptCount.textContent = this.attempts;
    }

    updateHighScore() {
        this.highScoreElement.textContent = this.highScore;
    }

    shakeAlpaca() {
        this.alpacaElement.classList.add('shake');
        setTimeout(() => {
            this.alpacaElement.classList.remove('shake');
        }, 500);
    }
}

// Start the game when the page loads
window.onload = () => {
    new AlpacaGame();
};
