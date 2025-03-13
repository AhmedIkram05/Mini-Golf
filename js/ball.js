export const ball = {
    x: 0,
    y: 0,
    radius: 10,
    color: '#ffffff',
    speed: 0,
    angle: 0,
    visible: true,
    
    // Advanced physics properties
    mass: 1,
    friction: 0.99,
    bounceFriction: 0.8,
    spinFactor: 0,
    wind: { x: 0, y: 0 },
    gravity: 0,
    speedMultiplier: 1,
    perfectAim: false,
    ghostMode: false,
    restitution: 0.8, // Bounce elasticity
    
    // Trail effect
    trail: [],
    maxTrailLength: 10,
    showTrail: false,
    
    reset: function(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 50;
        this.speed = 0;
        this.visible = true;
        this.spinFactor = 0;
        this.trail = [];
    },
    
    update: function(canvas) {
        // Add current position to trail if moving
        if (this.speed > 0.5 && this.showTrail) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
        
        // Apply spin if present (only when moving)
        if (this.speed > 0.1) {
            this.angle += this.spinFactor * this.speed;
        }
        
        // Apply wind
        this.x += this.wind.x;
        this.y += this.wind.y;
        
        // Apply gravity toward hole if gravitational pull is active
        if (window.game && window.game.gravitationalPull) {
            const holeX = window.game.hole.x;
            const holeY = window.game.hole.y;
            const dx = holeX - this.x;
            const dy = holeY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                const gravityStrength = 0.3;
                this.x += (dx / dist) * gravityStrength;
                this.y += (dy / dist) * gravityStrength;
            }
        }
        
        // Calculate next position based on current angle and speed
        const dx = this.speed * Math.cos(this.angle) * this.speedMultiplier;
        const dy = this.speed * Math.sin(this.angle) * this.speedMultiplier;
        
        // Apply movement
        this.x += dx;
        this.y += dy;
        
        // Boundaries collision for non-ghost mode
        if (!this.ghostMode) {
            // Bounce off left wall
            if (this.x < this.radius) {
                this.x = this.radius + 1; // Prevent sticking
                this.angle = Math.PI - this.angle;
                this.speed *= this.bounceFriction;
            }
            // Bounce off right wall
            else if (this.x > canvas.width - this.radius) {
                this.x = canvas.width - this.radius - 1; // Prevent sticking
                this.angle = Math.PI - this.angle;
                this.speed *= this.bounceFriction;
            }
            
            // Bounce off top wall
            if (this.y < this.radius) {
                this.y = this.radius + 1; // Prevent sticking
                this.angle = -this.angle;
                this.speed *= this.bounceFriction;
            }
            // Bounce off bottom wall
            else if (this.y > canvas.height - this.radius) {
                this.y = canvas.height - this.radius - 1; // Prevent sticking
                this.angle = -this.angle;
                this.speed *= this.bounceFriction;
            }
        }
        
        // Apply natural decay based on speed (faster balls slow more rapidly)
        const speedDecay = Math.max(0.98, this.friction - (this.speed * 0.0005));
        this.speed *= speedDecay;
        
        // If speed is very low, stop the ball completely
        if (this.speed < 0.05) {
            this.speed = 0;
            this.spinFactor = 0; // Also reset spin at this point
        }
        
        // Gradually decrease spin
        if (this.spinFactor !== 0) {
            // Reduce spin faster when speed is low
            const spinDecay = this.speed > 0.5 ? 0.99 : 0.95;
            this.spinFactor *= spinDecay;
            
            if (Math.abs(this.spinFactor) < 0.001) {
                this.spinFactor = 0; // Reset to exactly zero
            }
        }
    },
    
    addSpin(amount) {
        // Add spin to the ball (for more realistic physics)
        this.spinFactor += amount;
        // Limit maximum spin
        this.spinFactor = Math.max(-0.05, Math.min(0.05, this.spinFactor));
    },
    
    draw: function(ctx) {
        if (!this.visible) return;
        
        // Draw trail if enabled and moving
        if (this.showTrail && this.trail.length > 0) {
            ctx.save();
            for (let i = 0; i < this.trail.length; i++) {
                const p = this.trail[i];
                const alpha = i / this.trail.length * 0.5;
                const radius = this.radius * (i / this.trail.length) * 0.8;
                
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            ctx.restore();
        }
        
        // Draw ghost effect for ghost mode
        if (this.ghostMode) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
            ctx.shadowBlur = 15;
        }
        
        // Draw the ball
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Draw a marker inside to show spin - only when actually spinning
        if (Math.abs(this.spinFactor) > 0.001 && this.speed > 0.1) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Date.now() / 200 * Math.sign(this.spinFactor));
            ctx.beginPath();
            ctx.arc(this.radius / 2, 0, this.radius / 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Change to white with transparency
            ctx.fill();
            ctx.restore();
        }
        
        // Show perfect aim indicator
        if (this.perfectAim) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(33, 150, 243, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        if (this.ghostMode) {
            ctx.restore();
        }
    },
    
    predictTrajectory(startX, startY, angle, power, steps = 50, canvas) {
        const trajectory = [];
        let simX = startX;
        let simY = startY;
        let simSpeed = power * 2 * this.speedMultiplier;
        let simAngle = angle;
        
        for (let i = 0; i < steps && simSpeed > 0.1; i++) {
            // Calculate next position
            const nextSimX = simX + simSpeed * Math.cos(simAngle);
            const nextSimY = simY + simSpeed * Math.sin(simAngle);
            
            let collided = false;
            
            // Handle wall collisions
            if (nextSimX < this.radius) {
                simX = this.radius;
                simAngle = Math.PI - simAngle;
                simSpeed *= this.bounceFriction;
                collided = true;
            } else if (nextSimX > canvas.width - this.radius) {
                simX = canvas.width - this.radius;
                simAngle = Math.PI - simAngle;
                simSpeed *= this.bounceFriction;
                collided = true;
            }
            
            if (nextSimY < this.radius) {
                simY = this.radius;
                simAngle = -simAngle;
                simSpeed *= this.bounceFriction;
                collided = true;
            } else if (nextSimY > canvas.height - this.radius) {
                simY = canvas.height - this.radius;
                simAngle = -simAngle;
                simSpeed *= this.bounceFriction;
                collided = true;
            }
            
            // Only update position if no collision occurred
            if (!collided) {
                simX = nextSimX;
                simY = nextSimY;
            }
            
            // Apply friction
            simSpeed *= this.friction;
            
            trajectory.push({ x: simX, y: simY });
        }
        
        return trajectory;
    },
    
    drawTrajectoryPreview(ctx, startX, startY, angle, power, canvas) {
        if (!this.perfectAim) return;
        
        const trajectory = this.predictTrajectory(startX, startY, angle, power, 50, canvas);
        
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        if (trajectory.length > 0) {
            ctx.moveTo(startX, startY);
            for (const point of trajectory) {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        
        // Draw end point marker
        if (trajectory.length > 0) {
            const lastPoint = trajectory[trajectory.length - 1];
            ctx.beginPath();
            ctx.arc(lastPoint.x, lastPoint.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
        }
        
        ctx.restore();
    }
};
