import { ball } from './ball.js';
import { hole } from './hole.js';
import { levels } from './levels.js';
import { saveScore, renderLeaderboard } from './leaderboard.js';
import { savePlayerStats, renderStatsPanel } from './statistics.js';
import { weatherEffects } from './weather.js';
import { achievements } from './achievements.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Audio elements
const hitSound = document.getElementById('hitSound');
const holeSound = document.getElementById('holeSound');
let isMuted = false;

// Game state variables
let score = 0;
let isMoving = false;
let hasWon = false;
let currentLevelIndex = 0;
let currentObstacles = [];
let currentWaterHazards = [];
let playerName = '';
let parScores = [];
let totalParScore = 0;
let aimLine = { visible: false, x: 0, y: 0 };
let waterHazardHits = 0;

// Camera system for larger levels
let camera = {
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    follow: function(target) {
        // Smoothly move camera to follow target
        const targetX = target.x - this.width / 2;
        const targetY = target.y - this.height / 2;
        
        // Add smooth damping
        this.x += (targetX - this.x) * 0.1;
        this.y += (targetY - this.y) * 0.1;
        
        // Limit camera to level boundaries
        this.x = Math.max(0, Math.min(this.x, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, canvas.height - this.height));
    }
};

// Function to play sounds
function playSound(soundElement) {
    if (soundElement && !isMuted) {
        soundElement.currentTime = 0;
        const playPromise = soundElement.play();
        if (playPromise) {
            playPromise.catch(e => console.error("Error playing sound:", e));
        }
    }
}

// Function to set mute status
export function setMute(mute) {
    isMuted = mute;
}

// Function to customize ball
export function customizeBall(options) {
    if (options.color) {
        ball.color = options.color;
        // Save preference to localStorage
        localStorage.setItem('ballColor', options.color);
    }
}

function promptPlayerName() {
    const name = prompt("Please enter your name:");
    playerName = name ? name.trim() : "Anonymous";
}

function loadLevel() {
    const config = levels[currentLevelIndex];
    // Set hole configuration
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
    document.getElementById('currentHole').textContent = 'Hole: ' + (currentLevelIndex + 1);
    document.getElementById('par').textContent = 'Par: ' + config.par;
    
    // Build obstacles - convert relative percentages to absolute values
    currentObstacles = config.obstacles.map(obs => ({
        x: obs.xPercent * canvas.width,
        y: obs.yPercent * canvas.height,
        width: obs.widthPercent * canvas.width,
        height: obs.heightPercent * canvas.height,
        color: obs.color
    }));
    
    // Load water hazards if they exist
    currentWaterHazards = config.waterHazards ? config.waterHazards.map(hazard => ({
        x: hazard.xPercent * canvas.width,
        y: hazard.yPercent * canvas.height,
        width: hazard.widthPercent * canvas.width,
        height: hazard.heightPercent * canvas.height,
        color: hazard.color
    })) : [];
    
    // Apply the theme to the course
    const courseElement = document.getElementById('golf-course');
    if (config.theme) {
        courseElement.style.backgroundColor = config.theme.background;
        courseElement.style.borderColor = config.theme.borderColor;
    }
    
    // Update leaderboard and stats
    renderLeaderboard('leaderboard');
    renderStatsPanel('stats');
    
    // 30% chance of weather change on level load
    if (Math.random() < 0.3) {
        setRandomWeather();
    }
}

function setRandomWeather() {
    const weatherTypes = ['clear', 'rain', 'snow', 'storm'];
    const randomType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
    const windForce = Math.random() * 3;
    const windDirection = Math.random() * 360;
    
    weatherEffects.setWeather(randomType, windForce, windDirection);
}

export function initGame() {
    // Initialize achievements
    achievements.init();
    
    // Initialize weather system
    weatherEffects.init(canvas);
    
    // Ensure the player's name is obtained as soon as the game starts
    promptPlayerName();
    
    // Load ball customization from localStorage if available
    const savedBallColor = localStorage.getItem('ballColor');
    if (savedBallColor) {
        ball.color = savedBallColor;
    }
    
    loadLevel();
    
    // Add mouse move event to show aim line
    canvas.addEventListener('mousemove', (event) => {
        if (!isMoving && ball.visible) {
            const rect = canvas.getBoundingClientRect();
            aimLine.x = event.clientX - rect.left;
            aimLine.y = event.clientY - rect.top;
            aimLine.visible = true;
        }
    });

    canvas.addEventListener('mouseout', () => {
        aimLine.visible = false;
    });

    // Add touch support
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        if (!isMoving && ball.visible) {
            const rect = canvas.getBoundingClientRect();
            const touch = event.touches[0];
            aimLine.x = touch.clientX - rect.left;
            aimLine.y = touch.clientY - rect.top;
            aimLine.visible = true;
        }
    }, { passive: false });
    
    canvas.addEventListener('touchend', (event) => {
        if (!isMoving && ball.visible) {
            event.preventDefault();
            // Play hit sound when ball is hit
            playSound(hitSound);
            
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
            const rect = canvas.getBoundingClientRect();
            const lastTouch = event.changedTouches[0];
            const touchX = lastTouch.clientX - rect.left;
            const touchY = lastTouch.clientY - rect.top;
            const dx = touchX - ball.x;
            const dy = touchY - ball.y;
            ball.angle = Math.atan2(dy, dx);
            const power = parseFloat(document.getElementById('powerSlider').value);
            ball.speed = power * 2;
            isMoving = true;
            aimLine.visible = false;
        }
    }, { passive: false });

    canvas.addEventListener('click', (event) => {
        if (!isMoving && ball.visible) {
            // Play hit sound when ball is hit
            playSound(hitSound);
            
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
            aimLine.visible = false;
        }
    });

    document.getElementById('resetButton').addEventListener('click', () => {
        // Restart and re-prompt player name on reset
        promptPlayerName();
        currentLevelIndex = 0; // restart at level 1
        score = 0; // reset overall score for a new player
        parScores = [];
        totalParScore = 0;
        waterHazardHits = 0;
        loadLevel();
        isMoving = false;
        renderLeaderboard('leaderboard');
        renderStatsPanel('stats');
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
            
            // Play hit sound when ball hits obstacles
            playSound(hitSound);
        }
    });
}

function checkWaterHazards() {
    if (currentWaterHazards.length === 0) return;
    
    for (const hazard of currentWaterHazards) {
        if (ball.x > hazard.x && ball.x < hazard.x + hazard.width && 
            ball.y > hazard.y && ball.y < hazard.y + hazard.height) {
            
            // Ball fell in water - penalty stroke
            score++;
            waterHazardHits++;
            document.getElementById('score').textContent = 'Score: ' + score;
            
            // Reset ball position to starting position of current level
            const config = levels[currentLevelIndex];
            ball.x = config.startXPercent * canvas.width;
            ball.y = config.startYPercent * canvas.height;
            ball.speed = 0;
            isMoving = false;
            
            // Check for water hazard achievement
            if (waterHazardHits === 1) {
                achievements.unlock('water_hazard');
            }
            
            // Show water hazard message with better visibility and animation
            const message = document.createElement('div');
            message.className = 'fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-blue-800 text-white py-2 px-6 rounded-lg shadow-lg text-lg font-medium animate-bounce';
            message.innerText = 'Water hazard! +1 stroke penalty';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => document.body.removeChild(message), 500);
            }, 2000);
            
            break;
        }
    }
}

function update() {
    if (isMoving) {
        ball.update(canvas);
        checkObstacleCollisions();
        checkWaterHazards();
        
        // Follow ball with camera if it's moving
        camera.follow(ball);
        
        // Update and apply weather effects
        weatherEffects.update();
        weatherEffects.applyBallPhysics(ball);
        
        const dist = Math.hypot(ball.x - hole.x, ball.y - hole.y);
        
        // Check if ball fell in the hole
        if (!hasWon && dist < ball.radius + hole.radius + 15) {
            hasWon = true;
            ball.visible = false;
            isMoving = false;
            
            // Play hole sound when ball falls into hole
            playSound(holeSound);
            
            // Calculate par score
            const levelPar = levels[currentLevelIndex].par;
            const strokesUsed = score - totalParScore;
            const parScore = strokesUsed - levelPar;
            parScores[currentLevelIndex] = parScore;
            totalParScore = score;
            
            // Check for hole in one achievement
            if (strokesUsed === 1) {
                achievements.unlock('hole_in_one');
            }
            
            let scoreText = '';
            if (parScore < 0) scoreText = `${Math.abs(parScore)} under par!`;
            else if (parScore === 0) scoreText = 'Par';
            else scoreText = `${parScore} over par`;
            
            // Show par score message
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10';
            overlay.innerHTML = `
                <div class="bg-white p-8 rounded-lg text-center">
                    <h2 class="text-2xl font-bold mb-4">Hole ${currentLevelIndex + 1} Complete!</h2>
                    <p class="text-xl mb-4">${scoreText}</p>
                    <button id="continueBtn" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Continue</button>
                </div>
            `;
            document.body.appendChild(overlay);
            
            document.getElementById('continueBtn').addEventListener('click', () => {
                document.body.removeChild(overlay);
                if (currentLevelIndex < levels.length - 1) {
                    currentLevelIndex++;
                    loadLevel();
                } else {
                    const totalScore = score;
                    const totalPar = levels.reduce((sum, level) => sum + level.par, 0);
                    const parDiff = totalScore - totalPar;
                    
                    // Check for achievements
                    const gameStats = {
                        totalScore: totalScore,
                        coursePar: totalPar,
                        holeInOnes: parScores.filter(score => score === -levelPar + 1).length,
                        perfectScore: parScores.every(score => score <= 0),
                        waterHazards: waterHazardHits
                    };
                    
                    achievements.checkForAchievements(gameStats);
                    
                    saveScore(score, playerName);
                    savePlayerStats(playerName, totalScore, parDiff, parScores);
                    renderLeaderboard('leaderboard');
                    renderStatsPanel('stats');
                    showGameSummary();
                }
            });
            
            return;
        }
        
        if (ball.speed < 0.1) {
            isMoving = false;
        }
    }
}

function showGameSummary() {
    let totalScore = score;
    let totalPar = levels.reduce((sum, level) => sum + level.par, 0);
    let scoreDiff = totalScore - totalPar;
    
    const summary = document.createElement('div');
    summary.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20';
    summary.innerHTML = `
        <div class="bg-white p-8 rounded-lg text-center max-w-md">
            <h2 class="text-3xl font-bold mb-6">Game Complete!</h2>
            <p class="text-xl mb-4">Total Score: ${totalScore}</p>
            <p class="text-xl mb-4">Course Par: ${totalPar}</p>
            <p class="text-2xl font-semibold mb-6">${scoreDiff === 0 ? 'Even Par' : (scoreDiff > 0 ? `${scoreDiff} Over Par` : `${Math.abs(scoreDiff)} Under Par`)}</p>
            <div class="flex justify-center space-x-4">
                <button id="playAgainBtn" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Play Again</button>
                <button id="closeBtn" class="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(summary);
    
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
        currentLevelIndex = 0;
        score = 0;
        parScores = [];
        totalParScore = 0;
        waterHazardHits = 0;
        loadLevel();
    });
    
    document.getElementById('closeBtn').addEventListener('click', () => {
        document.body.removeChild(summary);
    });
}

function drawMinimap() {
    const minimapWidth = 150;
    const minimapHeight = 100;
    const minimapX = canvas.width - minimapWidth - 10;
    const minimapY = 10;
    const scaleX = minimapWidth / canvas.width;
    const scaleY = minimapHeight / canvas.height;
    
    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(minimapX, minimapY, minimapWidth, minimapHeight);
    
    // Draw borders
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(minimapX, minimapY, minimapWidth, minimapHeight);
    
    // Draw obstacles on minimap
    currentObstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(
            minimapX + obstacle.x * scaleX, 
            minimapY + obstacle.y * scaleY, 
            obstacle.width * scaleX, 
            obstacle.height * scaleY
        );
    });
    
    // Draw water hazards on minimap
    currentWaterHazards.forEach(hazard => {
        ctx.fillStyle = hazard.color;
        ctx.fillRect(
            minimapX + hazard.x * scaleX, 
            minimapY + hazard.y * scaleY, 
            hazard.width * scaleX, 
            hazard.height * scaleY
        );
    });
    
    // Draw hole on minimap
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(
        minimapX + hole.x * scaleX,
        minimapY + hole.y * scaleY,
        hole.radius * scaleX * 1.5, // Slightly larger for visibility
        0, 
        Math.PI * 2
    );
    ctx.fill();
    
    // Draw ball on minimap if visible
    if (ball.visible) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            minimapX + ball.x * scaleX,
            minimapY + ball.y * scaleY,
            ball.radius * scaleX * 1.5, // Slightly larger for visibility
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Draw viewport indicator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(
        minimapX + camera.x * scaleX,
        minimapY + camera.y * scaleY,
        camera.width * scaleX,
        camera.height * scaleY
    );
}

function drawObstacles() {
    currentObstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawWaterHazards() {
    currentWaterHazards.forEach(hazard => {
        ctx.fillStyle = hazard.color;
        ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
        
        // Add enhanced water wave effect
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const yOffset = Math.sin(Date.now() / 500 + i * 0.7) * 2;
            ctx.beginPath();
            ctx.moveTo(hazard.x, hazard.y + i * 5 + yOffset);
            ctx.lineTo(hazard.x + hazard.width, hazard.y + i * 5 + yOffset);
            ctx.stroke();
        }
        
        // Add subtle ripple effect
        const rippleTime = Date.now() / 1000;
        const rippleX = hazard.x + hazard.width * 0.3 + Math.sin(rippleTime) * 10;
        const rippleY = hazard.y + hazard.height * 0.3 + Math.cos(rippleTime * 1.3) * 5;
        
        ctx.beginPath();
        ctx.arc(rippleX, rippleY, 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(rippleX, rippleY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply camera transform
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // Draw aim line with camera offset
    if (aimLine.visible && ball.visible && !isMoving) {
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(aimLine.x, aimLine.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw power indicator
        const power = parseFloat(document.getElementById('powerSlider').value);
        const indicatorLength = power * 5;
        const dx = aimLine.x - ball.x;
        const dy = aimLine.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normX = dx / distance;
        const normY = dy / distance;
        
        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + normX * indicatorLength, ball.y + normY * indicatorLength);
        ctx.strokeStyle = `rgba(${255-power*25}, ${power*25}, 0, 0.9)`;
        ctx.lineWidth = 4;
        ctx.stroke();
    }
    
    drawWaterHazards();
    drawObstacles();
    hole.draw(ctx);
    ball.draw(ctx);
    
    ctx.restore();
    
    // Draw UI elements that shouldn't be affected by camera
    drawMinimap();
    
    // Draw weather effects on top
    weatherEffects.draw();
}

export function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}
