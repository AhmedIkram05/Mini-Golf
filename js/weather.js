// Create a weather effects system

export const weatherEffects = {
    current: 'clear',
    wind: { x: 0, y: 0 },
    raindrops: [],
    snowflakes: [],
    rainCount: 100,
    snowCount: 70,
    canvas: null,
    ctx: null,
    
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.initRaindrops();
        this.initSnowflakes();
    },
    
    initRaindrops() {
        this.raindrops = [];
        for (let i = 0; i < this.rainCount; i++) {
            this.raindrops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 15 + 15
            });
        }
    },
    
    initSnowflakes() {
        this.snowflakes = [];
        for (let i = 0; i < this.snowCount; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 2 + 1,
                drift: Math.random() * 2 - 1
            });
        }
    },
    
    setWeather(type, windForce = 0, windDirection = 0) {
        this.current = type;
        
        // Set wind force based on parameters
        if (windForce > 0) {
            const windAngle = windDirection * (Math.PI / 180);
            this.wind.x = Math.cos(windAngle) * windForce;
            this.wind.y = Math.sin(windAngle) * windForce;
        } else {
            this.wind.x = 0;
            this.wind.y = 0;
        }
    },
    
    applyBallPhysics(ball) {
        // Only apply if the ball is moving
        if (ball.speed > 0) {
            // Wind affects moving ball
            ball.x += this.wind.x * 0.05;
            ball.y += this.wind.y * 0.05;
            
            // On very wet ground, more friction
            if (this.current === 'rain' || this.current === 'storm') {
                ball.speed *= 0.98; // More friction on wet ground
            }
            
            // On snowy ground, less friction
            if (this.current === 'snow') {
                ball.speed *= 0.995; // Less friction on snowy ground
            }
        }
    },
    
    update() {
        if (this.current === 'rain' || this.current === 'storm') {
            const intensity = this.current === 'storm' ? 2 : 1;
            
            for (let i = 0; i < this.raindrops.length; i++) {
                this.raindrops[i].y += this.raindrops[i].speed * intensity;
                this.raindrops[i].x += this.wind.x;
                
                if (this.raindrops[i].y > this.canvas.height) {
                    this.raindrops[i].y = 0;
                    this.raindrops[i].x = Math.random() * this.canvas.width;
                }
                
                if (this.raindrops[i].x > this.canvas.width) {
                    this.raindrops[i].x = 0;
                } else if (this.raindrops[i].x < 0) {
                    this.raindrops[i].x = this.canvas.width;
                }
            }
        }
        
        if (this.current === 'snow') {
            for (let i = 0; i < this.snowflakes.length; i++) {
                this.snowflakes[i].y += this.snowflakes[i].speed;
                this.snowflakes[i].x += this.snowflakes[i].drift + this.wind.x * 0.5;
                
                if (this.snowflakes[i].y > this.canvas.height) {
                    this.snowflakes[i].y = 0;
                    this.snowflakes[i].x = Math.random() * this.canvas.width;
                }
                
                if (this.snowflakes[i].x > this.canvas.width) {
                    this.snowflakes[i].x = 0;
                } else if (this.snowflakes[i].x < 0) {
                    this.snowflakes[i].x = this.canvas.width;
                }
            }
        }
    },
    
    draw() {
        if (this.current === 'clear') return;
        
        if (this.current === 'rain' || this.current === 'storm') {
            this.ctx.strokeStyle = this.current === 'storm' ? 'rgba(200, 200, 255, 0.8)' : 'rgba(200, 200, 255, 0.5)';
            this.ctx.lineWidth = this.current === 'storm' ? 1.5 : 1;
            
            for (let i = 0; i < this.raindrops.length; i++) {
                const raindrop = this.raindrops[i];
                this.ctx.beginPath();
                this.ctx.moveTo(raindrop.x, raindrop.y);
                this.ctx.lineTo(
                    raindrop.x + this.wind.x, 
                    raindrop.y + raindrop.length
                );
                this.ctx.stroke();
            }
        }
        
        if (this.current === 'snow') {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            
            for (let i = 0; i < this.snowflakes.length; i++) {
                const snowflake = this.snowflakes[i];
                this.ctx.beginPath();
                this.ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }
};
