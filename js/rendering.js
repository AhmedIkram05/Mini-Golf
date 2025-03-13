export function renderGame(ctx, camera, aimLine, isMoving, ball, currentObstacles, 
                          currentWaterHazards, currentSandBunkers, hole, weatherEffects,
                          powerups) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
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
        
        // Draw trajectory preview if ball has perfectAim
        if (ball.perfectAim) {
            ball.drawTrajectoryPreview(ctx, ball.x, ball.y, ball.angle, power, ctx.canvas);
        }
    }
    
    // Draw course elements
    drawWaterHazards(ctx, currentWaterHazards);
    drawSandBunkers(ctx, currentSandBunkers);
    drawObstacles(ctx, currentObstacles);
    
    // Draw powerups if they exist
    if (powerups && powerups.activePowerups) {
        drawPowerups(ctx, powerups.activePowerups);
    }
    
    hole.draw(ctx);
    ball.draw(ctx);
    
    // Draw particles if they exist
    if (window.particles) {
        window.particles.forEach(p => drawParticle(ctx, p));
    }
    
    ctx.restore();
    
    // Draw weather effects on top
    weatherEffects.draw();
}

function drawObstacles(ctx, obstacles) {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawSandBunkers(ctx, bunkers) {
    if (!bunkers) return;
    
    bunkers.forEach(bunker => {
        ctx.fillStyle = bunker.color;
        ctx.fillRect(bunker.x, bunker.y, bunker.width, bunker.height);
        
        // Add enhanced sand texture with pattern
        const sandPattern = createSandPattern(ctx, bunker.color);
        ctx.fillStyle = sandPattern || 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(bunker.x, bunker.y, bunker.width, bunker.height);
        
        // Add sand texture dots
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 50; i++) {
            const dotX = bunker.x + Math.random() * bunker.width;
            const dotY = bunker.y + Math.random() * bunker.height;
            ctx.beginPath();
            ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add subtle shadow/edge effect
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(bunker.x, bunker.y, bunker.width, bunker.height);
    });
}

function createSandPattern(ctx, baseColor) {
    try {
        const patternCanvas = document.createElement('canvas');
        const patternCtx = patternCanvas.getContext('2d');
        
        patternCanvas.width = 10;
        patternCanvas.height = 10;
        
        // Fill with base color
        patternCtx.fillStyle = baseColor;
        patternCtx.fillRect(0, 0, 10, 10);
        
        // Add grain texture
        patternCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 10;
            const y = Math.random() * 10;
            patternCtx.fillRect(x, y, 1, 1);
        }
        
        return ctx.createPattern(patternCanvas, 'repeat');
    } catch (e) {
        console.error('Failed to create sand pattern:', e);
        return null;
    }
}

function drawWaterHazards(ctx, hazards) {
    hazards.forEach(hazard => {
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

function drawPowerups(ctx, powerups) {
    powerups.forEach(powerup => {
        // Draw powerup base
        ctx.fillStyle = powerup.color;
        ctx.beginPath();
        ctx.arc(powerup.x, powerup.y, 15, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw powerup glow
        ctx.save();
        ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 300) * 0.2;
        ctx.beginPath();
        ctx.arc(powerup.x, powerup.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = powerup.color;
        ctx.fill();
        ctx.restore();
        
        // Draw powerup icon
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(powerup.icon, powerup.x, powerup.y);
    });
}

function drawParticle(ctx, particle) {
    ctx.globalAlpha = particle.alpha;
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}
