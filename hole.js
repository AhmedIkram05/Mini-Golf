export const hole = {
    x: 0,
    y: 0,
    radius: 15,
    color: '#000000',
    init: function(canvas) {
        this.x = canvas.width / 4;
        this.y = 50;
    },
    draw: function(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
};
