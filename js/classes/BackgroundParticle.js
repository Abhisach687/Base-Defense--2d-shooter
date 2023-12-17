/**
 * Represents a background particle.
 * @class
 */
class BackgroundParticle {
  /**
   * Creates a new BackgroundParticle instance.
   * @constructor
   * @param {Object} options - The options for the background particle.
   * @param {Object} options.position - The position of the background particle.
   * @param {number} [options.radius=3] - The radius of the background particle.
   * @param {string} [options.color="blue"] - The color of the background particle.
   */
  constructor({ position, radius = 3, color = "blue" }) {
    this.position = position;
    this.radius = radius;
    this.color = color;
    this.alpha = 0.1;
  }

  /**
   * Draws the background particle on the canvas.
   */
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
