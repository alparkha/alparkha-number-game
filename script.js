class AlpacaGame {
    constructor() {
        this.targetNumber = 0;
        this.attempts = 0;
        this.highScore = localStorage.getItem('highScore') || '-';
        this.gameActive = false;

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

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.submitButton.addEventListener('click', () => this.checkGuess());
        this.newGameButton.addEventListener('click', () => this.startGame());
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkGuess();
        });

        // Initialize
        this.updateHighScore();
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
            return;
        }

        this.attempts++;
        this.updateAttempts();

        if (guess === this.targetNumber) {
            this.gameWon();
        } else {
            const message = guess < this.targetNumber ? 
                '더 큰 숫자예요! ⬆️' : '더 작은 숫자예요! ⬇️';
            this.setMessage(message);
            this.shakeAlpaca();
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
