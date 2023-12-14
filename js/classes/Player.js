class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.canTakeDamage = true;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.image = new Image();
    this.image.src = "img/player.png";
  }

  draw() {
    c.drawImage(
      this.image,
      this.x - this.radius,
      this.y - this.radius,
      this.radius * 4,
      this.radius * 4
    );
  }

  update() {
    this.draw();

    const friction = 0.98;

    this.velocity.x *= friction;
    this.velocity.y *= friction;

    // collision detection for x axis
    if (
      this.x + this.radius + this.velocity.x <= canvas.width &&
      this.x - this.radius + this.velocity.x >= 0
    ) {
      this.x += this.velocity.x;
    } else {
      this.velocity.x = 0;
    }

    // collision detection for y axis
    if (
      this.y + this.radius + this.velocity.y <= canvas.height &&
      this.y - this.radius + this.velocity.y >= 0
    ) {
      this.y += this.velocity.y;
    } else {
      this.velocity.y = 0;
    }
  }
}
