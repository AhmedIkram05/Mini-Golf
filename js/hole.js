export const hole = {
    x: 0,
    y: 0,
    radius: 15,
    color: '#000000',
    setConfig: function(canvas, config) {
        this.x = config.holeXPercent * canvas.width;
        this.y = config.holeYPercent * canvas.height;
        this.radius = config.holeRadius;  // update the radius based on config
        this.color = config.holeColor;
    },
    draw: function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};
