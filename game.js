import { ball } from './ball.js';
import { hole } from './hole.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isMoving = false;
let hasWon = false;

export function initGame() {
    ball.reset(canvas.width, canvas.height);
    hole.init(canvas);
    document.getElementById('score').textContent = 'Score: ' + score;

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
            // Get user-defined power from the slider (value between 1 and 10)
            const power = parseFloat(document.getElementById('powerSlider').value);
            ball.speed = power;
            isMoving = true;
        }
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        ball.reset(canvas.width, canvas.height);
        isMoving = false;
        hasWon = false;
        score = 0;
        document.getElementById('score').textContent = 'Score: ' + score;
    });
}

function update() {
    if (isMoving) {
        ball.update(canvas);
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (!hasWon && dist < ball.radius + hole.radius) {
            hasWon = true;
            ball.visible = false;
            isMoving = false;
            setTimeout(() => {
                alert('Congratulations! You got the ball in the hole!');
            }, 100);
        }
        if (ball.speed < 0.1) {
            isMoving = false;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ...optional: draw course details...
    hole.draw(ctx);
    ball.draw(ctx);
}

export function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}
