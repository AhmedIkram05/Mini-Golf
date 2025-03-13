// This module contains all game state variables and basic state operations

const canvas = document.getElementById('gameCanvas');

// Game state variables
export const gameState = {
    score: 0,
    isMoving: false,
    hasWon: false,
    currentLevelIndex: 0,
    currentObstacles: [],
    currentWaterHazards: [],
    currentSandBunkers: [],
    playerName: '',
    parScores: [],
    totalParScore: 0,
    aimLine: { visible: false, x: 0, y: 0 },
    waterHazardHits: 0,
    isMultiplayerMode: false,
    isMuted: false,
    
    // Camera system for larger levels
    camera: {
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
    },
    
    // Reset state for a new game
    resetGame: function() {
        this.score = 0;
        this.isMoving = false;
        this.hasWon = false;
        this.currentLevelIndex = 0;
        this.currentObstacles = [];
        this.currentWaterHazards = [];
        this.currentSandBunkers = [];
        this.parScores = [];
        this.totalParScore = 0;
        this.waterHazardHits = 0;
    },
    
    // Get player name via prompt
    promptPlayerName: function() {
        const name = prompt("Please enter your name:");
        this.playerName = name ? name.trim() : "Anonymous";
        return this.playerName;
    }
};

// Sound elements
export const sounds = {
    hitSound: document.getElementById('hitSound'),
    holeSound: document.getElementById('holeSound'),
    
    playSound: function(soundElement) {
        if (soundElement && !gameState.isMuted) {
            soundElement.currentTime = 0;
            const playPromise = soundElement.play();
            if (playPromise) {
                playPromise.catch(e => console.error("Error playing sound:", e));
            }
        }
    },
    
    setMuted: function(mute) {
        gameState.isMuted = mute;
    }
};

// Global particle system
window.particles = [];

export function createSandParticle(x, y, color) {
    const particle = {
        x,
        y,
        radius: Math.random() * 2 + 1,
        color: color || '#e6c986',
        alpha: 0.7,
        speed: Math.random() * 2,
        angle: Math.random() * Math.PI * 2,
        lifetime: 30 + Math.random() * 20
    };
    window.particles.push(particle);
    return particle;
}

export function updateParticles() {
    if (!window.particles) return;
    
    for (let i = window.particles.length - 1; i >= 0; i--) {
        const p = window.particles[i];
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.lifetime--;
        p.alpha = p.lifetime / 50;
        
        if (p.lifetime <= 0) {
            window.particles.splice(i, 1);
        }
    }
}
