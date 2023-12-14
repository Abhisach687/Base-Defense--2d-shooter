class Rock {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.hits = 0;
    this.points = this.generatePoints();
  }

  generatePoints() {
    const points = [];
    for (let i = 0; i < 360; i += Math.random() * 30) {
      const r = this.radius + Math.random() * this.radius;
      const x = this.x + r * Math.cos(i);
      const y = this.y + r * Math.sin(i);
      points.push({ x, y });
    }
    return points;
  }

  draw() {
    c.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const { x, y } = this.points[i];
      if (i === 0) {
        c.moveTo(x, y);
      } else {
        c.lineTo(x, y);
      }
    }
    c.closePath();
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
  }

  hit() {
    this.hits++;
    if (this.hits >= 3) {
      this.radius -= 10;
    }
  }
}
