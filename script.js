const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;  // new score counter

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    radius: 10,
    color: '#ffffff',
    speed: 0,
    angle: 0,
    visible: true  // track if ball should be drawn
};

const hole = {
    x: canvas.width / 4,
    y: 50,
    radius: 15,
    color: '#000000'
};

let isMoving = false;
let hasWon = false;  // new flag for winning state

function drawCourse() {
    // Draw the green course (canvas background is set via CSS)
    // Optionally add more details here
}

function drawHole() {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
    ctx.fillStyle = hole.color;
    ctx.fill();
    ctx.closePath();
}

function drawBall() {
    if (!ball.visible) return;  // do not draw if ball is hidden
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function update() {
    if (isMoving) {
        ball.x += ball.speed * Math.cos(ball.angle);
        ball.y += ball.speed * Math.sin(ball.angle);
        ball.speed *= 0.99;  // simulate friction

        // Bounce off left wall
        if (ball.x < ball.radius) {
            ball.x = ball.radius;
            ball.angle = Math.PI - ball.angle;
            ball.speed *= 0.8;
        }
        // Bounce off right wall
        if (ball.x > canvas.width - ball.radius) {
            ball.x = canvas.width - ball.radius;
            ball.angle = Math.PI - ball.angle;
            ball.speed *= 0.8;
        }
        // Bounce off top wall
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.angle = -ball.angle;
            ball.speed *= 0.8;
        }
        // Bounce off bottom wall
        if (ball.y > canvas.height - ball.radius) {
            ball.y = canvas.height - ball.radius;
            ball.angle = -ball.angle;
            ball.speed *= 0.8;
        }
        
        // Check win condition only once
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        if (!hasWon && dist < ball.radius + hole.radius) {
            hasWon = true;
            ball.visible = false;  // hide ball to simulate it going in
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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCourse();
    drawHole();
    drawBall();
    update();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (event) => {
    if (!isMoving && ball.visible) {
        // Increment score for each shot
        score++;
        document.getElementById('score').textContent = 'Score: ' + score;
        
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const dx = mouseX - ball.x;
        const dy = mouseY - ball.y;
        ball.angle = Math.atan2(dy, dx);
        ball.speed = Math.min(Math.hypot(dx, dy) / 10, 10);
        isMoving = true;
    }
});

document.getElementById('resetButton').addEventListener('click', () => {
    ball.x = canvas.width / 2;
    ball.y = canvas.height - 50;
    ball.speed = 0;
    isMoving = false;
    hasWon = false;  // reset winning flag
    ball.visible = true;  // show ball again
    score = 0;  // reset score
    document.getElementById('score').textContent = 'Score: ' + score;
});

gameLoop();