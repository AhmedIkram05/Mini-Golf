export const powerups = {
    types: {
        SPEED_BOOST: {
            name: 'Speed Boost',
            color: '#ff5722',
            icon: '🚀',
            duration: 3, // in shots
            effect: (ball) => {
                ball.speedMultiplier = 1.5;
            },
            reset: (ball) => {
                ball.speedMultiplier = 1;
            }
        },
        PERFECT_AIM: {
            name: 'Perfect Aim',
            color: '#2196f3',
            icon: '🎯',
            duration: 1,
            effect: (ball) => {
                ball.perfectAim = true;
            },
            reset: (ball) => {
                ball.perfectAim = false;
            }
        },
        GHOST_BALL: {
            name: 'Ghost Ball',
            color: '#9e9e9e',
            icon: '👻',
            duration: 2,
            effect: (ball) => {
                ball.ghostMode = true;
                // Also add trail effect for ghost mode
                ball.showTrail = true;
            },
            reset: (ball) => {
                ball.ghostMode = false;
                ball.showTrail = false;
            }
        },
        GRAVITY_PULL: {
            name: 'Gravity Pull',
            color: '#673ab7',
            icon: '🌌',
            duration: 1,
            effect: (ball, gameState) => {
                if (gameState) {
                    window.game = {
                        gravitationalPull: true,
                        hole: gameState.hole
                    };
                }
            },
            reset: (ball, gameState) => {
                if (window.game) {
                    window.game.gravitationalPull = false;
                }
            }
        },
        SUPER_BOUNCE: {
            name: 'Super Bounce',
            color: '#4caf50',
            icon: '🏀',
            duration: 2,
            effect: (ball) => {
                ball.restitution = 1.5; // Increased bounciness
                ball.friction = 0.995; // Less friction
            },
            reset: (ball) => {
                ball.restitution = 0.8; // Reset to default
                ball.friction = 0.99; // Reset to default
            }
        }
    },
    
    // Active powerups
    activePowerups: [],
    
    // Function to add powerups to level
    addPowerupsToLevel(level, count = 1) {
        if (!level.powerups) level.powerups = [];
        
        const powerupKeys = Object.keys(this.types);
        
        for (let i = 0; i < count; i++) {
            // Find a spot that's not close to obstacles or other powerups
            let x, y, isValid;
            let attempts = 0;
            
            do {
                isValid = true;
                x = 0.1 + Math.random() * 0.8; // Keep away from edges
                y = 0.1 + Math.random() * 0.8;
                
                // Check if too close to hole or start
                const distToHole = Math.hypot(x - level.holeXPercent, y - level.holeYPercent);
                const distToStart = Math.hypot(x - level.startXPercent, y - level.startYPercent);
                
                if (distToHole < 0.1 || distToStart < 0.1) {
                    isValid = false;
                    continue;
                }
                
                // Check if too close to obstacles
                if (level.obstacles) {
                    for (const obs of level.obstacles) {
                        if (x > obs.xPercent - 0.05 && x < obs.xPercent + obs.widthPercent + 0.05 &&
                            y > obs.yPercent - 0.05 && y < obs.yPercent + obs.heightPercent + 0.05) {
                            isValid = false;
                            break;
                        }
                    }
                }
                
                // Check if too close to water hazards
                if (isValid && level.waterHazards) {
                    for (const hazard of level.waterHazards) {
                        if (x > hazard.xPercent - 0.05 && x < hazard.xPercent + hazard.widthPercent + 0.05 &&
                            y > hazard.yPercent - 0.05 && y < hazard.yPercent + hazard.heightPercent + 0.05) {
                            isValid = false;
                            break;
                        }
                    }
                }
                
                // Check if too close to other powerups
                if (isValid && level.powerups.length > 0) {
                    for (const powerup of level.powerups) {
                        const dist = Math.hypot(x - powerup.xPercent, y - powerup.yPercent);
                        if (dist < 0.1) {
                            isValid = false;
                            break;
                        }
                    }
                }
                
                attempts++;
            } while (!isValid && attempts < 50);
            
            if (isValid) {
                const randomPowerupType = powerupKeys[Math.floor(Math.random() * powerupKeys.length)];
                level.powerups.push({
                    type: randomPowerupType,
                    xPercent: x,
                    yPercent: y,
                    color: this.types[randomPowerupType].color,
                    icon: this.types[randomPowerupType].icon,
                    active: true
                });
            }
        }
        
        return level;
    }
};
