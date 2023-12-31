/**
 * Represents an enemy in the game.
 * @class
 */
class Enemy {
  /**
   * Creates an instance of Enemy.
   * @constructor
   * @param {number} x - The x-coordinate of the enemy.
   * @param {number} y - The y-coordinate of the enemy.
   * @param {number} radius - The radius of the enemy.
   * @param {string} color - The color of the enemy.
   * @param {Object} velocity - The velocity of the enemy.
   * @param {number} velocity.x - The x-component of the velocity.
   * @param {number} velocity.y - The y-component of the velocity.
   */
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

  /**
   * Draws the enemy on the canvas.
   */
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    // for smooth resizing of big enemy upon hit
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  /**
   * Updates the enemy's position and behavior.
   */
  update() {
    this.draw();

    if (this.type === "Spinning") {
      this.radians += 0.1;

      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 30;
      this.y = this.center.y + Math.sin(this.radians) * 30;
    } else if (this.type === "Homing") {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);
      this.velocity.x = Math.cos(angle);
      this.velocity.y = Math.sin(angle);

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
