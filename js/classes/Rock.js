/**
 * Represents a rock in the game.
 * @class
 */
class Rock {
  /**
   * Creates a rock object.
   * @constructor
   * @param {number} x - The x-coordinate of the rock's center.
   * @param {number} y - The y-coordinate of the rock's center.
   * @param {number} radius - The radius of the rock.
   * @param {string} color - The color of the rock.
   */
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.hits = 0;
    this.points = this.generatePoints();
  }

  /**
   * Generates random points around the rock's center.
   * @returns {Array} - An array of points.
   */
  generatePoints() {
    const points = [];
    for (let i = 0; i < 360; i += Math.random() * 30) {
      const r = this.radius + Math.random() * this.radius;
      const rad = (i * Math.PI) / 180; // Convert angle to radians
      const x = this.x + r * Math.cos(rad);
      const y = this.y + r * Math.sin(rad);
      points.push({ x, y });
    }
    return points;
  }

  /**
   * Draws the rock on the canvas.
   */
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

  /**
   * Updates the rock's position and appearance.
   */
  update() {
    this.draw();
  }

  /**
   * Handles a hit on the rock.
   */
  hit() {
    this.hits++;
    if (this.hits >= 3) {
      this.radius -= 10;
    }
  }
}
