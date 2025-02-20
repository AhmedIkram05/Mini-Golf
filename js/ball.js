export const ball = {
    x: 0,
    y: 0,
    radius: 10,
    color: '#ffffff',
    speed: 0,
    angle: 0,
    visible: true,
    reset: function(canvasWidth, canvasHeight) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 50;
        this.speed = 0;
        this.visible = true;
    },
    update: function(canvas) {
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.speed *= 0.99; // friction

        // Bounce off left wall
        if (this.x < this.radius) {
            this.x = this.radius;
            this.angle = Math.PI - this.angle;
            this.speed *= 0.8;
        }
        // Bounce off right wall
        if (this.x > canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
            this.angle = Math.PI - this.angle;
            this.speed *= 0.8;
        }
        // Bounce off top wall
        if (this.y < this.radius) {
            this.y = this.radius;
            this.angle = -this.angle;
            this.speed *= 0.8;
        }
        // Bounce off bottom wall
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.angle = -this.angle;
            this.speed *= 0.8;
        }
    },
    draw: function(ctx) {
        if (!this.visible) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};
