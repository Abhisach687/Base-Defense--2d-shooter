/**
 * Represents a projectile in the game.
 * @class
 */
class Projectile {
  /**
   * Creates a new Projectile object.
   * @constructor
   * @param {number} x - The x-coordinate of the projectile.
   * @param {number} y - The y-coordinate of the projectile.
   * @param {number} radius - The radius of the projectile.
   * @param {string} color - The color of the projectile.
   * @param {object} velocity - The velocity of the projectile.
   * @param {number} velocity.x - The x-component of the velocity.
   * @param {number} velocity.y - The y-component of the velocity.
   */
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  /**
   * Draws the projectile on the canvas.
   */
  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  /**
   * Updates the position of the projectile.
   */
  update() {
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}
