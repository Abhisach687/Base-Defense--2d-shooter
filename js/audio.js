/**
 * Object representing various audio files used in the game.
 * @type {Object}
 * @property {Audio} shoot - Audio file for shooting sound.
 * @property {Audio} damageTaken - Audio file for damage taken sound.
 * @property {Audio} explode - Audio file for explosion sound.
 * @property {Audio} death - Audio file for death sound.
 * @property {Audio} powerUpNoise - Audio file for power-up sound.
 * @property {Audio} select - Audio file for selection sound.
 * @property {Audio} background - Audio file for background music.
 */
const audio = {
  shoot: new Audio("./audio/Basic_shoot_noise.wav"),
  damageTaken: new Audio("./audio/Damage_taken.wav"),
  explode: new Audio("./audio/Explode.wav"),
  death: new Audio("./audio/Death.wav"),
  powerUpNoise: new Audio("./audio/Powerup_noise.wav"),
  select: new Audio("./audio/Select.wav"),
  background: new Audio("./audio/Hyper.wav"),
};

// Set volume
audio.shoot.volume = 0.04;
audio.damageTaken.volume = 0.1;
audio.explode.volume = 0.1;
audio.death.volume = 0.1;
audio.powerUpNoise.volume = 0.1;
audio.select.volume = 0.1;
audio.background.volume = 0.1;

// Set loop
audio.background.loop = true;
