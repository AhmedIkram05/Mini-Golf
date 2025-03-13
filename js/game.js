import { ball } from './ball.js';
import { hole } from './hole.js';
import { levels } from './levels.js';
import { saveScore, renderLeaderboard } from './leaderboard.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Remove the global hitSound/holeSound retrieval.

let score = 0;
let isMoving = false;
let hasWon = false;
let currentLevelIndex = 0;
let currentObstacles = [];
let playerName = '';

// Replace previous playSound implementation with:
function playSound(src) {
    const sound = new Audio(src);
    sound.play().catch(e => console.error(`Error playing ${src}:`, e));
}

function promptPlayerName() {
    const name = prompt("Please enter your name:");
    playerName = name ? name.trim() : "Anonymous";
}

function loadLevel() {
    const config = levels[currentLevelIndex];
    // Set hole configuration (hole size remains constant)
    hole.setConfig(canvas, {
        holeXPercent: config.holeXPercent,
        holeYPercent: config.holeYPercent,
        holeRadius: config.holeRadius,
        holeColor: config.holeColor
    });
    // Set ball's starting position
    ball.x = config.startXPercent * canvas.width;
    ball.y = config.startYPercent * canvas.height;
    ball.speed = 0;
    ball.visible = true;
    hasWon = false;
    document.getElementById('score').textContent = 'Score: ' + score;
    // Updated current hole display
    document.getElementById('currentHole').textContent = 'Hole: ' + (currentLevelIndex + 1);
    // NEW: Update Par display
    document.getElementById('par').textContent = 'Par: ' + config.par;
    
    // Build obstacles - convert relative percentages to absolute values.
    currentObstacles = config.obstacles.map(obs => ({
        x: obs.xPercent * canvas.width,
        y: obs.yPercent * canvas.height,
        width: obs.widthPercent * canvas.width,
        height: obs.heightPercent * canvas.height,
        color: obs.color
    }));
    // Always update leaderboard display on level load
    renderLeaderboard('leaderboard');
}

export function initGame() {
    // Ensure the player's name is obtained as soon as the game starts.
    promptPlayerName();
    loadLevel();
    // Ensure leaderboard is always rendered
    renderLeaderboard('leaderboard');

    canvas.addEventListener('click', (event) => {
        if (!isMoving && ball.visible) {
            // Play hit sound immediately when the ball is struck.
            playSound("sounds/hit.wav");
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            ball.angle = Math.atan2(dy, dx);
            const power = parseFloat(document.getElementById('powerSlider').value);
            ball.speed = power * 2;
            isMoving = true;
        }
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        // Restart and re-prompt player name on reset
        promptPlayerName();
        currentLevelIndex = 0; // restart at level 1
        score = 0; // reset overall score for a new player
        // Removed resetting the hole picker value since it no longer exists
        loadLevel();
        isMoving = false;
        // Instead of clearing, update the leaderboard
        renderLeaderboard('leaderboard');
    });

    const powerSlider = document.getElementById('powerSlider');
    powerSlider.addEventListener('input', function() {
        const val = parseInt(this.value, 10);
        const ratio = (val - 1) / 9; // Normalize value from 0 to 1 for slider values 1-10
        const red = Math.round(255 * (1 - ratio));    // Highest red at low power
        const green = Math.round(255 * ratio);          // Highest green at high power
        const fillColor = `rgb(${red}, ${green}, 0)`;
        // Compute fill percentage for gradient (e.g., value 1 => 10%, value 10 => 100%)
        const fillPercent = (val / 10) * 100;
        // Because the slider is rotated, use "to right" so that the gradient appears vertical.
        this.style.background = `linear-gradient(to right, ${fillColor} ${fillPercent}%, #ccc ${fillPercent}%, #ccc 100%)`;
    });
}

function checkObstacleCollisions() {
    currentObstacles.forEach(obstacle => {
        // Find the closest point on the obstacle to the ball
        const nearestX = Math.max(obstacle.x, Math.min(ball.x, obstacle.x + obstacle.width));
        const nearestY = Math.max(obstacle.y, Math.min(ball.y, obstacle.y + obstacle.height));
        const deltaX = ball.x - nearestX;
        const deltaY = ball.y - nearestY;
        const distance = Math.hypot(deltaX, deltaY);
        if (distance < ball.radius) {
            // Simple bounce: decide to reflect horizontally or vertically
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                ball.angle = Math.PI - ball.angle; // bounce horizontally
            } else {
                ball.angle = -ball.angle; // bounce vertically
            }
            ball.speed *= 0.8;
            // Adjust ball position slightly to prevent sticking
            ball.x += Math.cos(ball.angle) * ball.radius;
            ball.y += Math.sin(ball.angle) * ball.radius;
            // Removed collision sound:
            // playSound("sounds/hit.wav");
        }
    });
}

function update() {
    if (isMoving) {
        ball.update(canvas);
        checkObstacleCollisions();
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (!hasWon && dist < ball.radius + hole.radius) {
            hasWon = true;
            ball.visible = false;
            isMoving = false;
            // Play holed sound immediately
            playSound("sounds/hole.mp3");
            setTimeout(() => {
                if (currentLevelIndex < levels.length - 1) {
                    currentLevelIndex++;
                    loadLevel();
                } else {
                    saveScore(score, playerName);
                    renderLeaderboard('leaderboard');
                }
            }, 100);
        }
        if (ball.speed < 0.1) {
            isMoving = false;
        }
    }
    renderLeaderboard('leaderboard');
}

function drawObstacles() {
    currentObstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ...optional: draw course details...
    drawObstacles();
    hole.draw(ctx);
    ball.draw(ctx);
}

export function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}
