const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 420;
canvas.height = 580;

// Load images with transparent backgrounds
const birdImg = new Image();
birdImg.src = 'images/bird1.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'images/pipetop.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'images/pipebottom1.png';

const backgroundImg = new Image();
backgroundImg.src = 'images/background.png';

const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    gravity: 0.6,
    lift: -8,
    velocity: 0
};

let pipes = [];
const pipeWidth = 52;
const pipeGap = 100;
let frameCount = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameRunning = false;
let backgroundX = 0;

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    gameRunning = true;
    backgroundX = 0;
    gameLoop();
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipeWidth, pipe.top);
        ctx.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
    });
}

function drawBackground() {
    ctx.drawImage(backgroundImg, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    backgroundX -= 2;
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height > canvas.height) {
        gameRunning = false;
        updateHighScore();
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        const top = Math.random() * (canvas.height / 2);
        const bottom = canvas.height - top - pipeGap;
        pipes.push({ x: canvas.width, top, bottom });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }

        if (
            bird.x < pipe.x + pipeWidth &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
        ) {
            gameRunning = false;
            updateHighScore();
        }
    });
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function drawScore() {
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`High Score: ${highScore}`, 10, 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBird();
    drawPipes();
    drawScore();
}

function update() {
    updateBird();
    updatePipes();
}

function gameLoop() {
    if (gameRunning) {
        update();
        draw();
        frameCount++;
        requestAnimationFrame(gameLoop);
    } else {
        ctx.fillStyle = '#000';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 3.5 - 20, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Press Space to Restart', canvas.width / 3 - 40, canvas.height / 2 + 30);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (gameRunning) {
            bird.velocity = bird.lift;
        } else {
            resetGame();
        }
    }
});

// Start the game when the page loads
resetGame();
