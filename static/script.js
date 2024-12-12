document.addEventListener('DOMContentLoaded', function() {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const newGameButton = document.getElementById('new-game-button');
    const menuButton = document.getElementById('menu-button');
    const resultMessage = document.getElementById('result-message');
    const attemptsDisplay = document.getElementById('attempts');
    const highScoreDisplay = document.getElementById('high-score');
    const gameAlpaca = document.getElementById('game-alpaca');

    // 시작 버튼 클릭
    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        newGame();
    });

    // 메뉴 버튼 클릭
    menuButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
        resetGame();
    });

    // 새 게임 버튼 클릭
    newGameButton.addEventListener('click', newGame);

    // 추측 제출 (버튼 클릭)
    guessButton.addEventListener('click', submitGuess);

    // 추측 제출 (엔터 키)
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });

    function submitGuess() {
        const guess = guessInput.value;
        if (!guess) return;

        fetch('/check_guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ guess: parseInt(guess) })
        })
        .then(response => response.json())
        .then(data => {
            resultMessage.textContent = data.message;
            
            if (data.attempts) {
                attemptsDisplay.textContent = data.attempts;
            }
            
            if (data.high_score) {
                highScoreDisplay.textContent = data.high_score;
            }

            // 알파카 애니메이션
            gameAlpaca.className = 'alpaca';
            if (data.status === 'correct') {
                gameAlpaca.textContent = '🦙✨';
                gameAlpaca.classList.add('happy');
                setTimeout(() => {
                    gameAlpaca.textContent = '🦙';
                    gameAlpaca.classList.remove('happy');
                }, 3000);
            } else if (data.status === 'wrong') {
                gameAlpaca.textContent = '🤔🦙';
                gameAlpaca.classList.add('thinking');
                setTimeout(() => {
                    gameAlpaca.textContent = '🦙';
                    gameAlpaca.classList.remove('thinking');
                }, 3000);
            }

            guessInput.value = '';
            guessInput.focus();
        })
        .catch(error => {
            console.error('Error:', error);
            resultMessage.textContent = '오류가 발생했습니다. 다시 시도해주세요.';
        });
    }

    function newGame() {
        fetch('/new_game', {
            method: 'POST'
        })
        .then(() => {
            resetGame();
        })
        .catch(error => {
            console.error('Error:', error);
            resultMessage.textContent = '새 게임을 시작하는 데 문제가 발생했습니다.';
        });
    }

    function resetGame() {
        guessInput.value = '';
        resultMessage.textContent = '';
        attemptsDisplay.textContent = '0';
        gameAlpaca.className = 'alpaca';
        gameAlpaca.textContent = '🦙';
        guessInput.focus();
    }
});
