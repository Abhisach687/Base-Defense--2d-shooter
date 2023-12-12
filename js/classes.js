class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.lives = 3;
    this.canTakeDamage = true;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    const friction = 0.99;

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

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    //for smooth resizing of big enemy upon hit
    this.element = document.createElement("div");
    this.element.style.width = `${2 * radius}px`;
    this.element.style.height = `${2 * radius}px`;
    document.body.appendChild(this.element);

    this.type = "Linear";
    this.radians = 0;
    this.center = {
      x,
      y,
    };

    if (Math.random() < 0.5) {
      this.type = "Homing";

      if (Math.random() < 0.5) {
        this.type = "Spinning";

        if (Math.random() < 0.5) {
          this.type = "Homing Spinning";
        }
      }
    }
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    // for smooth resizing of big enemy upon hit
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  update() {
    if (this.radius > 0) {
      this.draw();
    }

    if (this.type === "Spinning") {
      this.radians += 0.1;

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 30;
      this.y = this.center.y + Math.sin(this.radians) * 30;
    } else if (this.type === "Homing") {
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    } else if (this.type === "Homing Spinning") {
      this.radians += 0.1;

      const angle = Math.atan2(
        player.y - this.center.y,
        player.x - this.center.x
      );
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 30;
      this.y = this.center.y + Math.sin(this.radians) * 30;
    } else {
      // linear movement
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }
}

const friction = 0.99;

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

class BackgroundParticle {
  constructor({ position, radius = 3, color = "blue" }) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.alpha = 0.1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }
}

class PowerUp {
  constructor({ position = { x: 0, y: 0 }, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.image = new Image();
    this.image.src = "./img/lightningBolt.png";

    this.alpha = 1;
    this.direction = -1;

    this.radians = 0;
  }

  animateAlpha() {
    // Update alpha
    this.alpha += this.direction * 0.01; // 0.01 is the speed of the fade effect

    // Reverse direction at min/max alpha
    if (this.alpha <= 0 || this.alpha >= 1) {
      this.direction *= -1;
    }
  }

  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.translate(
      this.position.x + this.image.width / 2,
      this.position.y + this.image.height / 2
    );
    c.rotate(this.radians);
    c.translate(
      -this.position.x - this.image.width / 2,
      -this.position.y - this.image.height / 2
    );
    c.drawImage(this.image, this.position.x, this.position.y);
    c.restore();
  }

  update() {
    this.animateAlpha();
    this.draw();
    this.radians += 0.01;
    this.position.x += this.velocity.x;
  }
}

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
