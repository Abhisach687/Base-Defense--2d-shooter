/**
 * The friction coefficient for particles.
 * @type {number}
 */
const friction = 0.99;

/**
 * Represents a particle in the game.
 */
class Particle {
  /**
   * Creates a new Particle object.
   * @param {number} x - The x-coordinate of the particle.
   * @param {number} y - The y-coordinate of the particle.
   * @param {number} radius - The radius of the particle.
   * @param {string} color - The color of the particle.
   * @param {Object} velocity - The velocity of the particle.
   * @param {number} velocity.x - The x-component of the velocity.
   * @param {number} velocity.y - The y-component of the velocity.
   */
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  /**
   * Draws the particle on the canvas.
   */
  draw() {
    c.save();
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  /**
   * Updates the particle's position and properties.
   */
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}
