/**
 * Represents a power-up in the game.
 * @class
 */
class PowerUp {
  /**
   * Creates a new PowerUp object.
   * @constructor
   * @param {object} options - The options for the power-up.
   * @param {object} options.position - The position of the power-up.
   * @param {number} options.position.x - The x-coordinate of the power-up's position.
   * @param {number} options.position.y - The y-coordinate of the power-up's position.
   * @param {object} options.velocity - The velocity of the power-up.
   */
  constructor({ position = { x: 0, y: 0 }, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.image = new Image();
    this.image.src = "./img/lightningBolt.png";

    this.alpha = 1;
    this.direction = -1;

    this.radians = 0;
  }

  /**
   * Animates the alpha value of the power-up.
   */
  animateAlpha() {
    // Update alpha
    this.alpha += this.direction * 0.01; // 0.01 is the speed of the fade effect

    // Reverse direction at min/max alpha
    if (this.alpha <= 0 || this.alpha >= 1) {
      this.direction *= -1;
    }
  }

  /**
   * Draws the power-up on the canvas.
   */
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

  /**
   * Updates the power-up's properties and draws it on the canvas.
   */
  update() {
    this.animateAlpha();
    this.draw();
    this.radians += 0.01;
    this.position.x += this.velocity.x;
  }
}
