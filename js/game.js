import { ball } from './ball.js';
import { hole } from './hole.js';
import { levels } from './levels.js';
import { saveScore, renderLeaderboard } from './leaderboard.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isMoving = false;
let hasWon = false;
let currentLevelIndex = 0;
let currentObstacles = [];

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
    
    // Build obstacles - convert relative percentages to absolute values.
    currentObstacles = config.obstacles.map(obs => ({
        x: obs.xPercent * canvas.width,
        y: obs.yPercent * canvas.height,
        width: obs.widthPercent * canvas.width,
        height: obs.heightPercent * canvas.height,
        color: obs.color
    }));
}

export function initGame() {
    loadLevel();

    // Removed hole picker event listener
    // document.getElementById('holePicker').addEventListener('change', (event) => {
    //     currentLevelIndex = parseInt(event.target.value);
    //     loadLevel();
    // });

    canvas.addEventListener('click', (event) => {
        if (!isMoving && ball.visible) {
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
        currentLevelIndex = 0; // restart at level 1
        score = 0; // reset overall score for a new player
        // Removed resetting the hole picker value since it no longer exists
        loadLevel();
        isMoving = false;
        document.getElementById('leaderboard').innerHTML = "";
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
        }
    });
}

function update() {
    if (isMoving) {
        ball.update(canvas);
        checkObstacleCollisions();
        // Check win condition
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (!hasWon && dist < ball.radius + hole.radius) {
            hasWon = true;
            ball.visible = false;
            isMoving = false;
            setTimeout(() => {
                if (currentLevelIndex < levels.length - 1) {
                    alert('Hole complete! Your strokes: ' + score + '. Moving to next hole.');
                    currentLevelIndex++;
                    loadLevel();
                } else {
                    // Save final score and show leaderboard
                    saveScore(score);
                    alert('Congratulations! You completed all holes with a score of: ' + score);
                    renderLeaderboard('leaderboard');
                }
            }, 100);
        }
        if (ball.speed < 0.1) {
            isMoving = false;
        }
    }
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
